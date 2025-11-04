
export const fileToBase64 = (file: File | string): Promise<{ base64: string; mimeType: string }> => {
    return new Promise(async (resolve, reject) => {
        try {
            let blob: Blob;
            if (typeof file === 'string') {
                const response = await fetch(file);
                blob = await response.blob();
            } else {
                blob = file;
            }

            const reader = new FileReader();
            reader.onload = () => {
                const result = reader.result as string;
                // remove data:image/*;base64, prefix
                const base64 = result.split(',')[1];
                resolve({ base64, mimeType: blob.type });
            };
            reader.onerror = (error) => {
                reject(error);
            };
            reader.readAsDataURL(blob);
        } catch (error) {
            reject(error);
        }
    });
};
