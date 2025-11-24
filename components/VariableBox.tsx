import React from 'react';
import { Variable } from '../types';
import { motion } from 'framer-motion';
import { Box, Lock } from 'lucide-react';

interface VariableBoxProps {
  variable: Variable;
}

const VariableBox: React.FC<VariableBoxProps> = ({ variable }) => {
  const isTDZ = variable.value === '<TDZ>';

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ 
        opacity: isTDZ ? 0.5 : 1, 
        x: 0,
        scale: variable.highlight ? 1.05 : 1,
        borderColor: variable.highlight ? '#ff00aa' : (isTDZ ? '#4a5568' : (variable.isClosure ? '#0aff68' : '#4a5568')),
        boxShadow: variable.highlight ? '0 0 15px rgba(255, 0, 170, 0.3)' : 'none',
        backgroundColor: isTDZ ? '#1a202c' : '#0f172a' // darker for TDZ
      }}
      className={`
        relative border rounded-md p-2 flex justify-between items-center text-xs
        shadow-sm transition-all duration-300 overflow-hidden
      `}
    >
      {/* Background highlight effect */}
      {variable.highlight && (
        <div className="absolute inset-0 bg-neon-pink/10 animate-pulse"></div>
      )}

      <div className="flex items-center gap-2 z-10">
        {isTDZ ? (
          <Lock size={12} className="text-gray-500" />
        ) : (
          <Box size={12} className={variable.isClosure ? 'text-neon-green' : 'text-gray-500'} />
        )}
        <span className={`font-semibold ${isTDZ ? 'text-gray-500 line-through decoration-gray-600' : 'text-gray-200'}`}>
          {variable.name}
        </span>
      </div>
      
      <span className={`
        font-mono z-10 px-2 py-0.5 rounded
        ${isTDZ 
          ? 'bg-gray-800 text-gray-500 italic' 
          : (variable.isClosure ? 'bg-neon-green/20 text-neon-green' : 'bg-gray-800 text-neon-blue')}
      `}>
        {variable.value}
      </span>
    </motion.div>
  );
};

export default VariableBox;