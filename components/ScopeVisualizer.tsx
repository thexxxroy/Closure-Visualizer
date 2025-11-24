import React from 'react';
import { ScopeState } from '../types';
import VariableBox from './VariableBox';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Package, Database, Zap, ArrowRight } from 'lucide-react';

interface ScopeVisualizerProps {
  scopeState: ScopeState;
}

const ScopeVisualizer: React.FC<ScopeVisualizerProps> = ({ scopeState }) => {
  // Determine if we should show the connection line
  // Condition: We have a running function (not just Global) AND a closure exists
  const activeStackFrame = scopeState.stack.find(s => s.isActive && s.id !== 'main');
  const hasClosure = scopeState.closureBag.length > 0;
  const showConnection = activeStackFrame && hasClosure;

  return (
    <div className="flex gap-8 h-full text-white perspective-1000 w-full justify-center items-center">
      
      {/* LEFT: Call Stack (The Execution Area) */}
      <div className="w-1/3 flex flex-col relative z-10" style={{ transform: 'rotateY(5deg)' }}>
        <div className="mb-2 flex items-center gap-2 text-neon-blue uppercase tracking-widest font-bold text-xs pl-2">
          <Layers size={14} />
          <span>Execution Stack (执行栈)</span>
        </div>
        
        <div className="flex-1 flex flex-col-reverse gap-4 p-4 relative">
           {/* Visual Platform for Stack */}
           <div className="absolute inset-0 bg-gray-900/40 border border-gray-700/50 transform -skew-y-2 rounded-xl -z-10"></div>
           
           <AnimatePresence>
            {scopeState.stack.map((frame) => (
              <motion.div
                key={frame.id}
                initial={{ opacity: 0, y: -50, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, x: -50, scale: 0.8, transition: { duration: 0.3 } }}
                className={`
                  p-4 rounded-lg shadow-2xl relative backdrop-blur-sm
                  transition-all duration-300
                  ${frame.isActive 
                    ? 'bg-gray-800 border-l-4 border-neon-blue ring-1 ring-neon-blue/30' 
                    : 'bg-gray-900/60 border-l-4 border-gray-600 grayscale opacity-60'}
                `}
              >
                <div className="flex justify-between items-center mb-3 pb-2 border-b border-gray-700/50">
                   <span className="font-mono font-bold text-sm text-gray-200">{frame.name}</span>
                   {frame.isActive && (
                     <span className="flex items-center gap-1 text-[10px] text-black bg-neon-blue px-2 py-0.5 rounded font-bold animate-pulse">
                       RUNNING
                     </span>
                   )}
                </div>
                
                {frame.variables.length > 0 ? (
                  <div className="space-y-2">
                    {frame.variables.map(v => <VariableBox key={v.id} variable={v} />)}
                  </div>
                ) : (
                  <div className="text-gray-500 text-xs italic py-2 text-center">Empty Frame</div>
                )}
                
                {/* Connector Point for Cable */}
                {frame.isActive && frame.id !== 'main' && showConnection && (
                  <div className="absolute top-1/2 -right-1 w-2 h-2 bg-neon-pink rounded-full shadow-[0_0_10px_#ff00aa] z-20"></div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* CENTER: The Void / Cables */}
      <div className="w-24 relative h-full pointer-events-none hidden md:block">
         {showConnection && (
           <svg className="absolute inset-0 w-full h-full overflow-visible z-0">
              <defs>
                 <linearGradient id="cableGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00f0ff" />
                    <stop offset="100%" stopColor="#0aff68" />
                 </linearGradient>
                 <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                    <polygon points="0 0, 10 3.5, 0 7" fill="#0aff68" />
                 </marker>
              </defs>
              <path 
                d="M 0,50% C 50,50% 50,50% 100,50%" 
                stroke="url(#cableGradient)" 
                strokeWidth="3" 
                fill="none" 
                className="animate-pulse"
                markerEnd="url(#arrowhead)"
              />
              {/* Animated particle on the wire */}
              <circle r="4" fill="#fff">
                <animateMotion dur="1s" repeatCount="indefinite" path="M 0,50% C 50,50% 50,50% 100,50%" />
              </circle>
           </svg>
         )}
         {showConnection && (
           <div className="absolute top-[40%] left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded border border-gray-600 text-[10px] text-neon-green whitespace-nowrap z-20">
              Scope Chain Link
           </div>
         )}
      </div>

      {/* RIGHT: Heap / Closure (The Backpack) */}
      <div className="w-1/3 flex flex-col relative z-10" style={{ transform: 'rotateY(-5deg)' }}>
        <div className="mb-2 flex items-center gap-2 text-neon-green uppercase tracking-widest font-bold text-xs pl-2">
           <Database size={14} />
           <span>Heap Memory (堆内存)</span>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-4 relative">
           {/* Visual Platform for Heap */}
           <div className="absolute inset-0 bg-gray-900/40 border border-gray-700/50 transform skew-y-2 rounded-xl -z-10"></div>

           <AnimatePresence mode="popLayout">
             {scopeState.closureBag.length > 0 ? (
                <motion.div
                   layout
                   initial={{ opacity: 0, scale: 0, rotate: -10 }}
                   animate={{ opacity: 1, scale: 1, rotate: 0 }}
                   className={`
                     w-full bg-gray-800/80 backdrop-blur-md border-2 border-dashed border-neon-green/50 
                     rounded-xl p-5 relative shadow-[0_0_30px_-5px_rgba(10,255,104,0.15)]
                   `}
                >
                  {/* The Backpack Handle Visual */}
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-neon-green px-3 py-1 rounded-full border border-neon-green/30 flex items-center gap-2 shadow-lg z-20">
                    <Package size={16} />
                    <span className="font-bold text-xs">Closure (背包)</span>
                  </div>
                  
                  {/* Connection Point */}
                  {showConnection && (
                     <div className="absolute top-1/2 -left-1 w-2 h-2 bg-neon-green rounded-full shadow-[0_0_10px_#0aff68] z-20"></div>
                  )}

                  <div className="mt-2 space-y-3">
                    <p className="text-gray-400 text-[10px] text-center leading-tight">
                       这个数据包“依附”在 myCounter 函数上。即使 createCounter 销毁了，它还在。
                    </p>
                    {scopeState.closureBag.map(v => (
                      <VariableBox key={v.id} variable={v} />
                    ))}
                  </div>
                </motion.div>
             ) : (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }}
                  className="text-gray-600 flex flex-col items-center gap-2 text-center"
                >
                   <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center">
                     <Package size={24} className="opacity-20" />
                   </div>
                   <p className="text-xs">No Closures yet.<br/>等待函数返回...</p>
                </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Global Scope at the bottom */}
        <div className="mt-4 bg-gray-950/80 rounded border-t border-gray-800 p-3">
            <h4 className="text-gray-500 text-[10px] mb-2 uppercase tracking-wider font-bold">Global Variables</h4>
             <div className="flex flex-wrap gap-2">
                {scopeState.global.map(g => (
                    <motion.div 
                      key={g.id} 
                      layout
                      className={`text-[10px] px-2 py-1 rounded border flex items-center gap-2 transition-colors ${g.highlight ? 'border-neon-pink text-neon-pink bg-neon-pink/10' : 'border-gray-800 text-gray-500'}`}
                    >
                        <span className="font-bold">{g.name}</span>
                        <span className="font-mono text-gray-400">{g.value.toString().includes('function') ? 'fn()' : g.value}</span>
                        {g.value.toString().includes('Backpack') || g.isClosure ? <Package size={10} /> : null}
                    </motion.div>
                ))}
             </div>
        </div>
      </div>

    </div>
  );
};

export default ScopeVisualizer;