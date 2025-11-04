
import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { PaperPlaneIcon, BotIcon, UserIcon, LinkIcon } from './icons';

interface ChatInterfaceProps {
  history: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ history, isLoading, onSendMessage }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [history, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="bg-slate-800/50 border border-slate-700 rounded-lg flex flex-col h-[70vh] lg:h-full">
      <h2 className="text-xl sm:text-2xl font-bold text-slate-200 p-4 border-b border-slate-700 text-center">
        Design Chat
      </h2>
      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          {history.map((msg, index) => (
            <div key={index} className={`flex items-start gap-3 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'model' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center"><BotIcon className="w-5 h-5 text-slate-900" /></div>}
              <div className={`max-w-xs md:max-w-md p-3 rounded-lg ${msg.role === 'user' ? 'bg-amber-500 text-slate-900' : 'bg-slate-700 text-slate-200'}`}>
                <p className="text-sm whitespace-pre-wrap">{msg.parts}</p>
                {msg.sources && msg.sources.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-slate-600">
                    <h4 className="text-xs font-semibold text-slate-400 mb-2">Sources:</h4>
                    <ul className="space-y-1">
                      {msg.sources.map((source, i) => (
                        <li key={i}>
                          <a href={source.uri} target="_blank" rel="noopener noreferrer" className="flex items-start gap-2 text-cyan-400 hover:text-cyan-300 text-xs transition-colors">
                            <LinkIcon className="w-3 h-3 mt-0.5 flex-shrink-0" />
                            <span className="truncate">{source.title || new URL(source.uri).hostname}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
              {msg.role === 'user' && <div className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center"><UserIcon className="w-5 h-5 text-slate-900" /></div>}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-cyan-500 flex items-center justify-center"><BotIcon className="w-5 h-5 text-slate-900" /></div>
              <div className="max-w-xs md:max-w-md p-3 rounded-lg bg-slate-700 text-slate-200">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-0"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-150"></span>
                    <span className="w-2 h-2 bg-slate-400 rounded-full animate-pulse delay-300"></span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      <form onSubmit={handleSubmit} className="p-4 border-t border-slate-700">
        <div className="flex items-center bg-slate-700 rounded-lg">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="e.g., 'Make the wood darker' or 'What's the best wood for a deck?'"
            className="w-full bg-transparent p-3 text-slate-200 placeholder-slate-400 focus:outline-none"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="p-3 text-cyan-400 hover:text-cyan-300 disabled:text-slate-500 disabled:cursor-not-allowed transition-colors"
          >
            <PaperPlaneIcon className="w-6 h-6" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatInterface;
