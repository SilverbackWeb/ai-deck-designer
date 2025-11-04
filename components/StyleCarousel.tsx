
import React from 'react';
import { GeneratedStyle } from '../types';

interface StyleCarouselProps {
  styles: GeneratedStyle[];
  selectedIndex: number | null;
  onSelect: (index: number) => void;
}

const StyleCarousel: React.FC<StyleCarouselProps> = ({ styles, selectedIndex, onSelect }) => {
  return (
    <div className="w-full pb-4">
        <h2 className="text-2xl font-bold text-slate-200 mb-4 text-center">Choose a Starting Style</h2>
      <div className="flex space-x-4 overflow-x-auto p-2 -mx-2">
        {styles.map((item, index) => (
          <button
            key={index}
            onClick={() => onSelect(index)}
            className={`flex-shrink-0 w-48 rounded-lg overflow-hidden focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-amber-500 transition-all duration-300 ${
              selectedIndex === index ? 'ring-4 ring-cyan-400' : 'ring-2 ring-transparent hover:ring-cyan-500/50'
            }`}
          >
            <img src={item.imageUrl} alt={item.style} className="w-full h-32 object-cover" />
            <div className={`p-2 text-center ${selectedIndex === index ? 'bg-cyan-500' : 'bg-slate-700'}`}>
              <span className={`block text-xs font-semibold ${selectedIndex === index ? 'text-slate-900' : 'text-slate-200'}`}>{item.style}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default StyleCarousel;
