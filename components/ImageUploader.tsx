
import React, { useState, useCallback } from 'react';
import { UploadIcon } from './icons';

interface ImageUploaderProps {
  onImageUpload: (file: File) => void;
  isGenerating: boolean;
  error: string | null;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageUpload, isGenerating, error }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && !isGenerating) {
      onImageUpload(e.target.files[0]);
    }
  };

  const handleDragEnter = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isGenerating) setIsDragging(true);
  }, [isGenerating]);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0] && !isGenerating) {
      onImageUpload(e.dataTransfer.files[0]);
    }
  }, [onImageUpload, isGenerating]);

  const isDisabled = isGenerating;

  return (
    <div className="w-full max-w-2xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-slate-100 mb-2">Design Your Dream Deck</h2>
        <p className="text-slate-400 mb-6">Upload a photo of your backyard to get started.</p>
        
        {error && (
            <div className="w-full bg-red-500/20 border border-red-500 text-red-300 px-4 py-3 rounded-md mb-4 text-center">
                {error}
            </div>
        )}

      <div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={`relative block w-full h-80 rounded-lg border-2 border-dashed transition-colors duration-300 ${isDragging ? 'border-cyan-400 bg-slate-800/50' : 'border-slate-600'} ${isDisabled ? 'cursor-not-allowed' : 'hover:border-slate-500'}`}
      >
        <label htmlFor="file-upload" className={`absolute inset-0 flex flex-col items-center justify-center p-6 ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
            {isGenerating ? (
                <>
                    <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                    <p className="mt-4 text-xl text-slate-200">Our AI is designing your dream deck...</p>
                </>
            ) : (
                <>
                    <UploadIcon className={`w-16 h-16 transition-colors ${isDragging ? 'text-cyan-400' : 'text-slate-500'}`} />
                    <span className={`mt-4 text-lg font-medium ${isDragging ? 'text-slate-200' : 'text-slate-400'}`}>
                        Drag & drop a photo, or click to select
                    </span>
                    <p className="mt-1 text-sm text-slate-500">PNG, JPG, WEBP accepted</p>
                </>
            )}
        </label>
        <input 
            id="file-upload" 
            name="file-upload" 
            type="file" 
            className="sr-only" 
            accept="image/png, image/jpeg, image/webp"
            onChange={handleFileChange} 
            disabled={isDisabled}
        />
      </div>
    </div>
  );
};

export default ImageUploader;
