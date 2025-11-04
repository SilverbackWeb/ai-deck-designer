import { GoogleGenAI, Modality } from "@google/genai";
import { GeneratedStyle } from '../types';

// FIX: Adhere to Gemini API guidelines by using process.env.API_KEY directly for initialization.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const textModel = 'gemini-2.5-flash';
const visionModel = 'gemini-2.5-flash-image';

export const generateInitialDecks = async (
    imageBase64: string,
    mimeType: string,
    styles: string[]
): Promise<GeneratedStyle[]> => {
    
    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType,
        },
    };

    const promises = styles.map(async (style) => {
        try {
            const response = await ai.models.generateContent({
                model: visionModel,
                contents: {
                    parts: [
                        imagePart,
                        { text: `Based on this image of a backyard, generate a photorealistic image of the yard with the following deck style integrated seamlessly: ${style}. The deck should look like it belongs in the space. Do not add any text or watermarks.` },
                    ],
                },
                config: {
                    responseModalities: [Modality.IMAGE],
                },
            });
            
            for (const part of response.candidates?.[0]?.content?.parts || []) {
                if (part.inlineData) {
                    const base64ImageBytes = part.inlineData.data;
                    const imageUrl = `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
                    
                    return { style: style.replace('A photorealistic, ', '').split('made of')[0].trim(), imageUrl };
                }
            }
            throw new Error(`No image part in response for style: ${style}`);
        } catch (error) {
            console.error(`Error generating deck for style "${style}":`, error);
            // Return null or a placeholder to indicate failure for this specific style
            return null;
        }
    });

    const results = await Promise.all(promises);
    
    // Filter out any null results from failed API calls
    const successfulResults = results.filter((result): result is GeneratedStyle => result !== null);

    if (successfulResults.length === 0) {
        throw new Error("All deck generation requests failed.");
    }
    
    return successfulResults;
};

export const refineDeckImage = async (
    imageBase64: string,
    mimeType: string,
    prompt: string
): Promise<string> => {
    const imagePart = {
        inlineData: {
            data: imageBase64,
            mimeType,
        },
    };

    const response = await ai.models.generateContent({
        model: visionModel,
        contents: {
            parts: [
                imagePart,
                { text: `Refine this deck image based on the following instruction: "${prompt}". Maintain photorealism and the overall composition. Do not add text or watermarks.` },
            ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
            const base64ImageBytes = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }
    
    throw new Error("Could not refine the image. No image part in response.");
};


export const getChatResponse = async (prompt: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: textModel,
        contents: prompt,
        config: {
          systemInstruction: "You are an AI deck design consultant. Answer questions about deck materials, costs, maintenance, and building advice. Be helpful, concise, and friendly. Do not answer questions outside of this scope.",
        }
    });
    return response.text;
};