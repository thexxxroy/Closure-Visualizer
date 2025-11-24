import React from 'react';
import { DEMO_CODE } from '../constants';

interface CodeViewerProps {
  currentLine: number;
}

const CodeViewer: React.FC<CodeViewerProps> = ({ currentLine }) => {
  const lines = DEMO_CODE.split('\n');

  return (
    <div className="bg-gray-850 rounded-lg p-4 font-mono text-sm shadow-xl border border-gray-750 h-full overflow-auto">
      <h3 className="text-gray-400 mb-4 text-xs uppercase tracking-wider font-bold">Source Code</h3>
      {lines.map((line, idx) => {
        const lineNum = idx + 1;
        const isActive = lineNum === currentLine;
        
        return (
          <div 
            key={idx} 
            className={`flex items-start transition-colors duration-200 ${isActive ? 'bg-gray-750 -mx-2 px-2 rounded' : ''}`}
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