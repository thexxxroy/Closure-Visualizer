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
    line: 0,
    description: "⚡️ 【预编译阶段】(Step 0) 代码未执行。注意看底部全局变量：\n1. `createCounter` 是函数声明，直接被提升(Hoist)且可用。\n2. `myCounter` 被扫描到了，但处于 <TDZ> (暂时性死区) 🔒，被锁住不可访问。",
    actionType: 'init',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: true, id: 'g1' },
        { name: 'myCounter', value: '<TDZ>', isClosure: false, highlight: true, id: 'g2_tdz' } // Added myCounter
      ],
      stack: [{ name: 'Global (全局)', variables: [], id: 'main', isActive: true }],
      closureBag: []
    }
  },
  {
    line: 1,
    description: "👀 【执行第1行】引擎读到函数声明。因为 Step 0 已经处理过了，所以引擎直接**跳过**函数体。此时 `myCounter` 依然是死区状态。",
    actionType: 'define',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: '<TDZ>', isClosure: false, highlight: false, id: 'g2_tdz' } // Persist TDZ
      ],
      stack: [{ name: 'Global (全局)', variables: [], id: 'main', isActive: true }],
      closureBag: []
    }
  },
  {
    line: 9,
    description: "📞 【执行第9行】准备赋值给 `myCounter`。引擎先执行右边的 `createCounter()`。此时全局中 `myCounter` 仍处于等待赋值的死区。",
    actionType: 'call',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: '<TDZ>', isClosure: false, highlight: true, id: 'g2_tdz' } // Still TDZ until return
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
    description: "💾 初始化 `count = 0`。注意：它目前还在左边的临时栈里。如果函数结束，它本该被销毁...",
    actionType: 'init',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: '<TDZ>', isClosure: false, highlight: false, id: 'g2_tdz' }
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
    description: "👀 定义内部函数。JS引擎发现内部函数引用了 `count`，于是准备把它搬到右边的「堆」里去。",
    actionType: 'define',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: '<TDZ>', isClosure: false, highlight: false, id: 'g2_tdz' }
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
    description: "✨ 关键时刻！`createCounter` 执行完毕返回。1. 栈帧销毁。2. 返回的函数赋值给 `myCounter`（解锁死区！）。3. 闭包背包🎒生成。",
    actionType: 'return',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: 'function 🎒', isClosure: false, highlight: true, id: 'g2' } // Unlocked!
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
    description: "▶️ 调用 `myCounter`。新函数在左边运行，但它手里拿着一根线，连着右边的背包🎒。",
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
    description: "🔄 `count++`。左边栈里没有 count，于是顺着线去右边背包里找，把 0 改成了 1。",
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
    description: "🏁 第一次调用结束。左边的栈帧又销毁了。但右边背包里的 `count` 依然是 1，安然无恙。",
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
    description: "▶️ 第二次调用。新的临时工位建立，再次连上了同一个背包 🎒。",
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
    description: "🔄 `count++`。再次操作右边的背包，把 1 变成了 2。",
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
    description: "🏁 结束。重点：虽然函数调用结束了（左边空了），但因为 myCounter 变量还活着，右边的背包就永远不会消失。",
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