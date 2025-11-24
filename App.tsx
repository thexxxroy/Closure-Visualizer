import React, { useState, useEffect, useRef } from 'react';
import { DEMO_STEPS } from './constants';
import CodeViewer from './components/CodeViewer';
import ScopeVisualizer from './components/ScopeVisualizer';
import { explainClosureStep } from './services/geminiService';
import { Play, RotateCcw, ChevronRight, BrainCircuit, Pause } from 'lucide-react';

const App: React.FC = () => {
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [aiExplanation, setAiExplanation] = useState<string>("Ready to learn closures? Click 'Next' or 'Play'.");
  const [isAiLoading, setIsAiLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const currentStep = DEMO_STEPS[currentStepIndex];
  const isFinished = currentStepIndex === DEMO_STEPS.length - 1;

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    if (isPlaying && !isFinished) {
      interval = setInterval(() => {
        handleNext();
      }, 2000);
    } else if (isFinished) {
      setIsPlaying(false);
    }
    return () => clearInterval(interval);
  }, [isPlaying, isFinished, currentStepIndex]);

  const handleNext = () => {
    if (currentStepIndex < DEMO_STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
    setAiExplanation("Reset. Let's start from the top.");
  };

  const handleAskAI = async () => {
    if (isAiLoading) return;
    setIsAiLoading(true);
    setAiExplanation("Analyzing execution context...");
    const text = await explainClosureStep(currentStepIndex, DEMO_STEPS.map(s => s.description).join('\n'));
    setAiExplanation(text);
    setIsAiLoading(false);
  };
  
  // Auto-ask AI on significant steps (optional feature, here triggered manually or on specific steps for polish)
  useEffect(() => {
     // Simple static explanation updates
     if (!isAiLoading) {
        // We just keep the step description initially, user can request deep dive
     }
  }, [currentStepIndex]);

  return (
    <div className="flex flex-col h-screen bg-gray-950 text-white overflow-hidden font-sans selection:bg-neon-pink selection:text-white">
      
      {/* Header */}
      <header className="h-14 border-b border-gray-800 flex items-center px-6 bg-gray-900 z-10 shrink-0">
        <div className="flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-neon-pink animate-pulse-slow"></div>
            <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            JS Closure Visualizer
            </h1>
        </div>
        <div className="ml-auto flex items-center gap-4">
             <span className="text-xs text-gray-500 hidden sm:inline">Use Gemini to explain the magic</span>
             <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript/Closures" target="_blank" rel="noreferrer" className="text-xs text-neon-blue hover:underline">MDN Docs ↗</a>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
        
        {/* Left Panel: Code & Controls */}
        <div className="lg:w-1/3 flex flex-col border-r border-gray-800 bg-gray-900/30 shrink-0">
          <div className="flex-1 p-4 overflow-hidden">
            <CodeViewer currentLine={currentStep.line} />
          </div>
          
          {/* Controls Area */}
          <div className="p-6 bg-gray-900 border-t border-gray-800 shrink-0">
             <div className="flex items-center justify-between mb-4">
                 <div className="flex gap-2">
                    <button 
                        onClick={() => setIsPlaying(!isPlaying)}
                        disabled={isFinished && !isPlaying}
                        className={`
                            flex items-center gap-2 px-4 py-2 rounded font-bold transition-all
                            ${isPlaying 
                                ? 'bg-gray-800 text-neon-pink border border-neon-pink/50' 
                                : 'bg-neon-blue text-black hover:bg-white'}
                        `}
                    >
                        {isPlaying ? <Pause size={16} /> : <Play size={16} />}
                        {isPlaying ? 'Pause' : 'Play'}
                    </button>
                    <button 
                        onClick={handleNext}
                        disabled={isFinished || isPlaying}
                        className="p-2 rounded bg-gray-800 hover:bg-gray-700 text-white disabled:opacity-50 transition-colors"
                        title="Next Step"
                    >
                        <ChevronRight size={20} />
                    </button>
                 </div>
                 
                 <button 
                    onClick={handleReset}
                    className="p-2 text-gray-400 hover:text-white transition-colors"
                    title="Reset"
                 >
                    <RotateCcw size={18} />
                 </button>
             </div>
             
             {/* Progress Bar */}
             <div className="w-full bg-gray-800 h-1 rounded-full mb-2 overflow-hidden">
                <div 
                    className="bg-neon-blue h-full transition-all duration-300 ease-out"
                    style={{ width: `${((currentStepIndex + 1) / DEMO_STEPS.length) * 100}%` }}
                ></div>
             </div>
             <div className="flex justify-between text-[10px] text-gray-500 font-mono uppercase">
                <span>Init</span>
                <span>Closure Created</span>
                <span>Execution</span>
             </div>
          </div>
        </div>

        {/* Right Panel: Visualization & AI */}
        <div className="flex-1 flex flex-col relative bg-gray-950 min-w-0">
            
            {/* Visualization Canvas - SCROLLABLE CONTAINER */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden relative scroll-smooth custom-scrollbar">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none fixed"></div>
                {/* Padding wrapper inside scroll view */}
                <div className="p-6 min-h-full">
                    <ScopeVisualizer scopeState={currentStep.scopeState} />
                </div>
            </div>

            {/* AI Explanation Bar */}
            <div className="bg-gray-900 border-t border-gray-800 p-4 lg:p-6 flex gap-4 shrink-0 z-20 shadow-[0_-5px_20px_rgba(0,0,0,0.5)]">
                <div className="mt-1 shrink-0">
                    <div className={`p-2 rounded-full ${isAiLoading ? 'bg-neon-pink/20 text-neon-pink animate-spin' : 'bg-gray-800 text-neon-blue'}`}>
                        <BrainCircuit size={20} />
                    </div>
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-sm text-gray-300">AI Instructor</h3>
                        <button 
                           onClick={handleAskAI}
                           disabled={isAiLoading}
                           className="text-[10px] px-2 py-1 border border-gray-700 hover:border-neon-blue text-gray-400 hover:text-white rounded transition-colors shrink-0 ml-2"
                        >
                           {isAiLoading ? 'Thinking...' : 'Deep Explain This Step'}
                        </button>
                    </div>
                    <div className="text-sm text-gray-400 leading-relaxed font-light">
                        {currentStep.description}
                    </div>
                    {aiExplanation !== currentStep.description && (
                         <div className="mt-3 p-3 bg-gray-800/50 rounded border-l-2 border-neon-pink text-sm text-gray-300 animate-in fade-in slide-in-from-bottom-2">
                            {aiExplanation}
                         </div>
                    )}
                </div>
            </div>

        </div>
      </main>
    </div>
  );
};

export default App;