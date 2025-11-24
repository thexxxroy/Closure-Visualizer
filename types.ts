export interface CodeStep {
  line: number;
  description: string;
  scopeState: ScopeState;
  actionType: 'define' | 'call' | 'return' | 'update' | 'init';
}

export interface Variable {
  name: string;
  value: string | number | 'function';
  isClosure: boolean;
  highlight: boolean;
  id: string;
}

export interface ScopeState {
  global: Variable[];
  stack: StackFrame[];
  closureBag: Variable[]; // The heap/closure memory
}

export interface StackFrame {
  name: string;
  variables: Variable[];
  id: string;
  isActive: boolean;
}

export enum SimulationState {
  IDLE = 'IDLE',
  PLAYING = 'PLAYING',
  PAUSED = 'PAUSED',
  FINISHED = 'FINISHED'
}