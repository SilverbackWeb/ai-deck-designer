
import React from 'react';
import { SparklesIcon } from './icons';

interface HeaderProps {
  showStartOver: boolean;
  onStartOver: () => void;
}

const Header: React.FC<HeaderProps> = ({ showStartOver, onStartOver }) => {
  return (
    <header className="w-full bg-slate-900/80 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <SparklesIcon className="h-8 w-8 text-cyan-400" />
            <h1 className="text-xl sm:text-2xl font-bold text-slate-100">
              AI Deck Design Consultant
            </h1>
          </div>
          {showStartOver && (
            <button
              onClick={onStartOver}
              className="px-4 py-2 bg-amber-500 text-slate-900 font-semibold rounded-md hover:bg-amber-600 transition-colors"
            >
              Start Over
            </button>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
