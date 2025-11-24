import React from 'react';
import { DEMO_CODE } from '../constants';

interface CodeViewerProps {
  currentLine: number;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ currentLine }) => {
  const lines = DEMO_CODE.split('\n');

  return (
    <div className="bg-gray-850 rounded-lg p-4 font-mono text-sm shadow-xl border border-gray-750 h-full overflow-auto relative">
      <h3 className="text-gray-400 mb-4 text-xs uppercase tracking-wider font-bold">Source Code</h3>
      
      {currentLine === 0 && (
        <div className="absolute top-12 left-0 right-0 bg-yellow-500/20 border-y border-yellow-500 text-yellow-200 text-xs font-bold py-1 px-4 flex items-center animate-pulse z-20 backdrop-blur-sm">
          ⚡️ PRE-COMPILATION PHASE (预编译/变量提升) - Scanning...
        </div>
      )}

      {lines.map((line, idx) => {
        const lineNum = idx + 1;
        const isActive = lineNum === currentLine;
        
        return (
          <div 
            key={idx} 
            className={`flex items-start transition-colors duration-200 ${isActive ? 'bg-gray-750 -mx-2 px-2 rounded' : ''} ${currentLine === 0 ? 'opacity-50' : 'opacity-100'}`}
          >
            <span className="text-gray-600 w-8 text-right mr-4 select-none">{lineNum}</span>
            <span className={`${isActive ? 'text-neon-blue font-bold' : 'text-gray-300'}`}>
              {line}
            </span>
            {isActive && (
              <span className="ml-auto text-neon-pink animate-pulse">
                ← exec
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default CodeViewer;