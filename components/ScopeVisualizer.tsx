import React from 'react';
import { ScopeState } from '../types';
import VariableBox from './VariableBox';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Package, Database, Zap, Save } from 'lucide-react';

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
    <div className="flex gap-8 min-h-full text-white perspective-1000 w-full justify-center items-start pt-4 pb-32">
      
      {/* LEFT: Call Stack (The Execution Area) */}
      <div className="w-1/3 flex flex-col relative z-10" style={{ transform: 'rotateY(5deg)' }}>
        <div className="flex flex-col gap-1 mb-4 pl-2 sticky top-0 z-50 bg-gray-950/20 backdrop-blur-sm py-2">
          <div className="flex items-center gap-2 text-neon-blue uppercase tracking-widest font-bold text-xs">
            <Layers size={14} />
            <span>Execution Stack (执行栈)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 bg-gray-900/80 w-fit px-2 py-1 rounded border border-gray-800 backdrop-blur-sm">
            <Zap size={10} className="text-yellow-400" />
            <span>临时车间：函数跑完立刻销毁</span>
          </div>
        </div>
        
        <div className="flex-1 flex flex-col-reverse gap-4 p-4 relative min-h-[300px]">
           {/* Visual Platform for Stack */}
           <div className="absolute inset-0 bg-gray-900/40 border border-gray-700/50 transform -skew-y-2 rounded-xl -z-10 h-full"></div>
           
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
      <div className="w-24 relative h-[300px] mt-20 pointer-events-none hidden md:block shrink-0">
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
           <div className="absolute top-[40%] left-1/2 -translate-x-1/2 bg-black/80 px-2 py-1 rounded border border-gray-600 text-[10px] text-neon-green whitespace-nowrap z-20 shadow-[0_0_15px_rgba(10,255,104,0.3)]">
              Scope Chain (作用域链)
           </div>
         )}
      </div>

      {/* RIGHT: Heap / Closure (The Backpack) */}
      <div className="w-1/3 flex flex-col relative z-10" style={{ transform: 'rotateY(-5deg)' }}>
        <div className="flex flex-col gap-1 mb-4 pl-2 sticky top-0 z-50 bg-gray-950/20 backdrop-blur-sm py-2">
          <div className="flex items-center gap-2 text-neon-green uppercase tracking-widest font-bold text-xs">
             <Database size={14} />
             <span>Heap Memory (堆内存)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-gray-400 bg-gray-900/80 w-fit px-2 py-1 rounded border border-gray-800 backdrop-blur-sm">
            <Save size={10} className="text-neon-green" />
            <span>永久仓库：被引用就存在</span>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-start p-4 relative min-h-[300px]">
           {/* Visual Platform for Heap */}
           <div className="absolute inset-0 bg-gray-900/40 border border-gray-700/50 transform skew-y-2 rounded-xl -z-10 h-full"></div>

           <AnimatePresence mode="popLayout">
             {scopeState.closureBag.length > 0 ? (
                <motion.div
                   layout
                   initial={{ opacity: 0, scale: 0, rotate: -10 }}
                   animate={{ opacity: 1, scale: 1, rotate: 0 }}
                   className={`
                     w-full bg-gray-800/80 backdrop-blur-md border-2 border-dashed border-neon-green/50 
                     rounded-xl px-5 pb-5 pt-16 relative shadow-[0_0_30px_-5px_rgba(10,255,104,0.15)] mb-8 mt-10
                   `}
                >
                  {/* The Backpack Handle Visual */}
                  <div className="absolute -top-5 left-1/2 -translate-x-1/2 bg-gray-900 text-neon-green px-4 py-1.5 rounded-full border border-neon-green/30 flex items-center gap-2 shadow-lg z-20 whitespace-nowrap">
                    <Package size={16} />
                    <span className="font-bold text-xs">Closure (闭包背包)</span>
                  </div>
                  
                  {/* Connection Point */}
                  {showConnection && (
                     <div className="absolute top-1/2 -left-1 w-2 h-2 bg-neon-green rounded-full shadow-[0_0_10px_#0aff68] z-20"></div>
                  )}

                  <div className="mt-2 space-y-3">
                    <p className="text-gray-400 text-[10px] text-center leading-tight">
                       这里的变量(count)脱离了栈的生命周期限制。只要 myCounter 还在，它就活着。
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
                  className="text-gray-600 flex flex-col items-center gap-2 text-center mb-8 mt-10"
                >
                   <div className="w-16 h-16 rounded-full border-2 border-dashed border-gray-700 flex items-center justify-center">
                     <Package size={24} className="opacity-20" />
                   </div>
                   <p className="text-xs">Heap is waiting...<br/>(仓库等待进货)</p>
                </motion.div>
             )}
           </AnimatePresence>
        
           {/* Global Scope at the bottom */}
           <div className="w-full mt-auto bg-gray-950/80 rounded border-t border-gray-800 p-3 relative z-20 backdrop-blur-sm">
               <h4 className="text-gray-500 text-[10px] mb-2 uppercase tracking-wider font-bold flex items-center gap-2">
                   <span>Global Scope (全局变量)</span>
                   <span className="text-gray-600 font-normal normal-case">- Always alive</span>
               </h4>
                <div className="flex flex-wrap gap-2">
                   {scopeState.global.map(g => (
                       <motion.div 
                         key={g.id} 
                         layout
                         className={`text-[10px] px-2 py-1 rounded border flex items-center gap-2 transition-colors ${g.highlight ? 'border-neon-pink text-neon-pink bg-neon-pink/10' : 'border-gray-800 text-gray-500'}`}
                       >
                           <span className="font-bold">{g.name}</span>
                           <span className="font-mono text-gray-400">{g.value.toString().includes('function') ? 'fn()' : g.value}</span>
                           {g.value.toString().includes('🎒') || g.isClosure ? <Package size={10} /> : null}
                       </motion.div>
                   ))}
                </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default ScopeVisualizer;