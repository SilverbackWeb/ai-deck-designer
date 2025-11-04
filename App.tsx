
import { useState, useCallback, useMemo } from 'react';
import { AppState, ChatMessage, GeneratedStyle } from './types';
import { DECK_STYLES, VISUAL_KEYWORDS } from './constants';
import { generateInitialDecks, refineDeckImage, getChatResponse } from './services/geminiService';
import { fileToBase64 } from './utils/imageUtils';

import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import Loader from './components/Loader';
import StyleCarousel from './components/StyleCarousel';
import CompareSlider from './components/CompareSlider';
import ChatInterface from './components/ChatInterface';
import { LightbulbIcon } from './components/icons';

export default function App() {
  const [appState, setAppState] = useState<AppState>(AppState.UPLOADING);
  const [originalImage, setOriginalImage] = useState<{ file: File; base64: string } | null>(null);
  const [generatedStyles, setGeneratedStyles] = useState<GeneratedStyle[]>([]);
  const [selectedStyleIndex, setSelectedStyleIndex] = useState<number | null>(null);
  const [currentDeckImage, setCurrentDeckImage] = useState<string | null>(null);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);
  const [isLightingLoading, setIsLightingLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleStartOver = useCallback(() => {
    setAppState(AppState.UPLOADING);
    setOriginalImage(null);
    setGeneratedStyles([]);
    setSelectedStyleIndex(null);
    setCurrentDeckImage(null);
    setChatHistory([]);
    setIsChatLoading(false);
    setIsLightingLoading(false);
    setError(null);
  }, []);

  const handleImageUpload = useCallback(async (file: File) => {
    try {
      setError(null);
      setAppState(AppState.GENERATING);
      const { base64, mimeType } = await fileToBase64(file);
      setOriginalImage({ file, base64 });

      const initialDecks = await generateInitialDecks(base64, mimeType, DECK_STYLES);
      setGeneratedStyles(initialDecks);
      setSelectedStyleIndex(0);
      setCurrentDeckImage(initialDecks[0]?.imageUrl || null);
      setAppState(AppState.DESIGNING);
    } catch (e) {
      console.error("Error during image processing:", e);
      setError("Failed to generate deck designs. Please try another image.");
      handleStartOver();
    }
  }, [handleStartOver]);

  const handleStyleSelect = useCallback((index: number) => {
    setSelectedStyleIndex(index);
    setCurrentDeckImage(generatedStyles[index]?.imageUrl || null);
  }, [generatedStyles]);

  const handleRefineWithLighting = useCallback(async () => {
    if (!currentDeckImage || !originalImage) return;

    setIsLightingLoading(true);
    setError(null);
    try {
      const { base64: currentDeckBase64, mimeType } = await fileToBase64(currentDeckImage);
      const newImage = await refineDeckImage(currentDeckBase64, mimeType, "Add subtle, warm, ambient lighting to the deck, like post cap lights or under-railing illumination.");
      setCurrentDeckImage(newImage);
    } catch (e) {
      console.error("Error refining image with lighting:", e);
      setError("Could not add lighting. Please try again.");
    } finally {
      setIsLightingLoading(false);
    }
  }, [currentDeckImage, originalImage]);

  const handleChatMessage = useCallback(async (prompt: string) => {
    if (!originalImage) return;

    setChatHistory(prev => [...prev, { role: 'user', parts: prompt }]);
    setIsChatLoading(true);
    setError(null);

    const isVisualPrompt = VISUAL_KEYWORDS.some(keyword => prompt.toLowerCase().includes(keyword));

    try {
      if (isVisualPrompt) {
        if (!currentDeckImage) {
            throw new Error("No deck image to refine.");
        }
        const { base64: currentDeckBase64, mimeType } = await fileToBase64(currentDeckImage);
        const newImage = await refineDeckImage(currentDeckBase64, mimeType, prompt);
        setCurrentDeckImage(newImage);
        setChatHistory(prev => [...prev, { role: 'model', parts: 'I\'ve updated the design for you. What do you think?' }]);
      } else {
        const textResponse = await getChatResponse(prompt);
        setChatHistory(prev => [...prev, { role: 'model', parts: textResponse }]);
      }
    } catch (e) {
      console.error("Error handling chat message:", e);
      const errorMessage = "Sorry, I couldn't process that request. Please try again.";
      setError(errorMessage);
      setChatHistory(prev => [...prev, { role: 'model', parts: errorMessage }]);
    } finally {
      setIsChatLoading(false);
    }
  }, [originalImage, currentDeckImage]);
  
  const selectedStyleName = useMemo(() => {
    if (selectedStyleIndex === null) return '';
    return generatedStyles[selectedStyleIndex]?.style || '';
  }, [selectedStyleIndex, generatedStyles]);

  const renderContent = () => {
    switch (appState) {
      case AppState.UPLOADING:
        return <ImageUploader onImageUpload={handleImageUpload} />;
      case AppState.GENERATING:
        return <Loader message="Our AI is designing your dream deck..." />;
      case AppState.DESIGNING:
        if (!originalImage || !currentDeckImage) {
          handleStartOver();
          return null;
        }
        return (
          <>
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <StyleCarousel
                styles={generatedStyles}
                selectedIndex={selectedStyleIndex}
                onSelect={handleStyleSelect}
              />
            </div>
            <div className="flex-grow w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="flex flex-col gap-4">
                 <h2 className="text-xl sm:text-2xl font-bold text-center text-slate-200">
                    Visualizer: <span className="text-cyan-400">{selectedStyleName}</span>
                </h2>
                <CompareSlider
                  original={`data:${originalImage.file.type};base64,${originalImage.base64}`}
                  modified={currentDeckImage}
                />
                <button
                  onClick={handleRefineWithLighting}
                  disabled={isLightingLoading}
                  className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-slate-900 font-bold py-3 px-4 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLightingLoading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-slate-900 border-t-transparent rounded-full animate-spin"></div>
                      Adding Light...
                    </>
                  ) : (
                    <>
                      <LightbulbIcon className="w-6 h-6" />
                      One-Click Refinement: Add Subtle Lighting
                    </>
                  )}
                </button>
              </div>
              <ChatInterface
                history={chatHistory}
                isLoading={isChatLoading}
                onSendMessage={handleChatMessage}
              />
            </div>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 font-sans flex flex-col items-center">
      <Header showStartOver={appState !== AppState.UPLOADING} onStartOver={handleStartOver} />
      <main className="w-full flex-grow flex flex-col items-center justify-center p-4">
        {error && (
          <div className="w-full max-w-4xl bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-md mb-4 text-center">
            {error}
          </div>
        )}
        {renderContent()}
      </main>
    </div>
  );
}
