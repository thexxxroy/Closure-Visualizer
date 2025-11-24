import { CodeStep } from './types';

export const DEMO_CODE = `function createCounter() {
  let count = 0;      // 📦 变量放入背包
  
  return function() { // 🏃‍♂️ 内部函数
    count++;          // 🔗 从背包里取变量
    return count;
  };
}

const myCounter = createCounter(); // 🎒 闭包产生 (Backpack created)
const val1 = myCounter();          // 1️⃣ 第一次调用
const val2 = myCounter();          // 2️⃣ 第二次调用`;

export const DEMO_STEPS: CodeStep[] = [
  {
    line: 1,
    description: "🎬 脚本开始。在全局(Global)中定义 `createCounter` 函数。",
    actionType: 'define',
    scopeState: {
      global: [{ name: 'createCounter', value: 'function', isClosure: false, highlight: true, id: 'g1' }],
      stack: [{ name: 'Global (全局)', variables: [], id: 'main', isActive: true }],
      closureBag: []
    }
  },
  {
    line: 9,
    description: "📞 调用 `createCounter`。一个新的「执行上下文」(Stack Frame) 被压入栈中。",
    actionType: 'call',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: 'undefined', isClosure: false, highlight: true, id: 'g2' }
      ],
      stack: [
        { name: 'Global (全局)', variables: [], id: 'main', isActive: false },
        { name: 'createCounter', variables: [], id: 's1', isActive: true }
      ],
      closureBag: []
    }
  },
  {
    line: 2,
    description: "💾 初始化变量 `count = 0`。它现在活在 createCounter 的栈帧里。",
    actionType: 'init',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: 'undefined', isClosure: false, highlight: false, id: 'g2' }
      ],
      stack: [
        { name: 'Global (全局)', variables: [], id: 'main', isActive: false },
        { 
          name: 'createCounter', 
          variables: [{ name: 'count', value: 0, isClosure: false, highlight: true, id: 'v1' }], 
          id: 's1', 
          isActive: true 
        }
      ],
      closureBag: []
    }
  },
  {
    line: 4,
    description: "👀 定义内部函数。注意：内部函数「看见」了外部的 `count`。",
    actionType: 'define',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: 'undefined', isClosure: false, highlight: false, id: 'g2' }
      ],
      stack: [
        { name: 'Global (全局)', variables: [], id: 'main', isActive: false },
        { 
          name: 'createCounter', 
          variables: [
            { name: 'count', value: 0, isClosure: false, highlight: false, id: 'v1' },
            { name: '<anonymous>', value: 'function', isClosure: false, highlight: true, id: 'v2' }
          ], 
          id: 's1', 
          isActive: true 
        }
      ],
      closureBag: []
    }
  },
  {
    line: 9,
    description: "✨ 魔法时刻！`createCounter` 执行完毕并返回。它的栈帧被销毁了，但是 `count` 被打包进了「闭包背包」🎒 里！",
    actionType: 'return',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: 'function 🎒', isClosure: false, highlight: true, id: 'g2' }
      ],
      stack: [
        { name: 'Global (全局)', variables: [], id: 'main', isActive: true }
      ],
      closureBag: [
         { name: 'count', value: 0, isClosure: true, highlight: true, id: 'v1_c' }
      ]
    }
  },
  {
    line: 10,
    description: "▶️ 第一次调用 `myCounter`。它带着那个「背包」🎒 运行。你可以看到它们连在一起。",
    actionType: 'call',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: 'function 🎒', isClosure: false, highlight: false, id: 'g2' },
        { name: 'val1', value: 'undefined', isClosure: false, highlight: true, id: 'g3' }
      ],
      stack: [
        { name: 'Global (全局)', variables: [], id: 'main', isActive: false },
        { name: 'myCounter (1)', variables: [], id: 's2', isActive: true }
      ],
      closureBag: [
         { name: 'count', value: 0, isClosure: true, highlight: false, id: 'v1_c' }
      ]
    }
  },
  {
    line: 5,
    description: "🔄 `count++`。函数在自己的栈里找不到 count，于是去背包里找，并更新了背包里的值为 1。",
    actionType: 'update',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: 'function 🎒', isClosure: false, highlight: false, id: 'g2' },
        { name: 'val1', value: 'undefined', isClosure: false, highlight: false, id: 'g3' }
      ],
      stack: [
        { name: 'Global (全局)', variables: [], id: 'main', isActive: false },
        { name: 'myCounter (1)', variables: [], id: 's2', isActive: true }
      ],
      closureBag: [
         { name: 'count', value: 1, isClosure: true, highlight: true, id: 'v1_c' }
      ]
    }
  },
  {
    line: 10,
    description: "🏁 第一次调用结束。返回 1。背包里的 `count` 依然是 1，等待下次使用。",
    actionType: 'return',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: 'function 🎒', isClosure: false, highlight: false, id: 'g2' },
        { name: 'val1', value: 1, isClosure: false, highlight: true, id: 'g3' }
      ],
      stack: [
        { name: 'Global (全局)', variables: [], id: 'main', isActive: true }
      ],
      closureBag: [
         { name: 'count', value: 1, isClosure: true, highlight: false, id: 'v1_c' }
      ]
    }
  },
  {
    line: 11,
    description: "▶️ 第二次调用 `myCounter`。它连上了同一个背包 🎒！",
    actionType: 'call',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: 'function 🎒', isClosure: false, highlight: false, id: 'g2' },
        { name: 'val1', value: 1, isClosure: false, highlight: false, id: 'g3' },
        { name: 'val2', value: 'undefined', isClosure: false, highlight: true, id: 'g4' }
      ],
      stack: [
        { name: 'Global (全局)', variables: [], id: 'main', isActive: false },
        { name: 'myCounter (2)', variables: [], id: 's3', isActive: true }
      ],
      closureBag: [
         { name: 'count', value: 1, isClosure: true, highlight: false, id: 'v1_c' }
      ]
    }
  },
  {
    line: 5,
    description: "🔄 `count++`。再次从背包里读取 1，变成 2。",
    actionType: 'update',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: 'function 🎒', isClosure: false, highlight: false, id: 'g2' },
        { name: 'val1', value: 1, isClosure: false, highlight: false, id: 'g3' },
        { name: 'val2', value: 'undefined', isClosure: false, highlight: false, id: 'g4' }
      ],
      stack: [
        { name: 'Global (全局)', variables: [], id: 'main', isActive: false },
        { name: 'myCounter (2)', variables: [], id: 's3', isActive: true }
      ],
      closureBag: [
         { name: 'count', value: 2, isClosure: true, highlight: true, id: 'v1_c' }
      ]
    }
  },
  {
    line: 11,
    description: "🏁 结束。val2 是 2。闭包(背包) 依然保留在内存中，没有被销毁。",
    actionType: 'return',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: 'function 🎒', isClosure: false, highlight: false, id: 'g2' },
        { name: 'val1', value: 1, isClosure: false, highlight: false, id: 'g3' },
        { name: 'val2', value: 2, isClosure: false, highlight: true, id: 'g4' }
      ],
      stack: [
        { name: 'Global (全局)', variables: [], id: 'main', isActive: true }
      ],
      closureBag: [
         { name: 'count', value: 2, isClosure: true, highlight: false, id: 'v1_c' }
      ]
    }
  }
];