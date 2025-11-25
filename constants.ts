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
const val2 = myCounter();          // 2️⃣ 第二次调用

function unusedFn() {}             // 👻 写在最后，但也会被提升`;

const UNUSED_FN_VAR = { name: 'unusedFn', value: 'function', isClosure: false, highlight: false, id: 'g_unused' };
const VAL1_TDZ = { name: 'val1', value: '<TDZ>', isClosure: false, highlight: false, id: 'g3_tdz' };
const VAL2_TDZ = { name: 'val2', value: '<TDZ>', isClosure: false, highlight: false, id: 'g4_tdz' };

export const DEMO_STEPS: CodeStep[] = [
  {
    line: 0,
    description: "⚡️ 【预编译阶段】(Step 0) 代码未执行。注意看底部全局变量：\n1. `createCounter` 和 `unusedFn` (第14行) 都是函数声明，无论写在哪里，都被完全提升(Hoist)且可用。\n2. 所有 `const` 变量 (`myCounter`, `val1`, `val2`) 都被扫描到了，但处于 <TDZ> (死区) 🔒 状态。",
    actionType: 'init',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: true, id: 'g1' },
        { name: 'myCounter', value: '<TDZ>', isClosure: false, highlight: true, id: 'g2_tdz' },
        { ...VAL1_TDZ, highlight: true },
        { ...VAL2_TDZ, highlight: true },
        { ...UNUSED_FN_VAR, highlight: true }
      ],
      stack: [{ name: 'Global (全局)', variables: [], id: 'main', isActive: true }],
      closureBag: []
    }
  },
  {
    line: 1,
    description: "👀 【执行第1行】引擎读到函数声明。因为 Step 0 已经提升过了，所以引擎直接**跳过**函数体。",
    actionType: 'define',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: '<TDZ>', isClosure: false, highlight: false, id: 'g2_tdz' },
        VAL1_TDZ,
        VAL2_TDZ,
        UNUSED_FN_VAR
      ],
      stack: [{ name: 'Global (全局)', variables: [], id: 'main', isActive: true }],
      closureBag: []
    }
  },
  {
    line: 10,
    description: "📞 【执行第10行】`createCounter()` 带有括号，意味着**执行**！\n区别在这里：\n1. **Step 0** 只是把代码（菜谱）存进了全局变量。\n2. **现在** 是要真正运行代码，必须在左边【执行栈】开辟一个新的临时空间（厨房）来存放 `count` 等局部变量。",
    actionType: 'call',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: '<TDZ>', isClosure: false, highlight: true, id: 'g2_tdz' },
        VAL1_TDZ,
        VAL2_TDZ,
        UNUSED_FN_VAR
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
    description: "💾 初始化 `count = 0`。它现在还在左边的临时栈里。\n👇 **请看底部全局变量**：此时 `myCounter` 依然是 **🔒 <TDZ>** 状态。为什么？\n因为 `createCounter` 函数还没跑完，还没把结果赋值给它！",
    actionType: 'init',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: '<TDZ>', isClosure: false, highlight: false, id: 'g2_tdz' },
        VAL1_TDZ,
        VAL2_TDZ,
        UNUSED_FN_VAR
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
    description: "🔍 【关键时刻】引擎解析 `return function`。它发现这个内部函数**引用了**外部的 `count`！\n为了防止 `count` 随后被销毁，引擎决定：把它标记为「需要打包带走」。",
    actionType: 'define',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: '<TDZ>', isClosure: false, highlight: false, id: 'g2_tdz' },
        VAL1_TDZ,
        VAL2_TDZ,
        UNUSED_FN_VAR
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
    line: 10,
    description: "🎒 【逃生成功】`createCounter` 执行结束，栈帧爆炸销毁💥！\n\n🤔 **你可能想问：myCounter 为什么不销毁？**\n答：因为 `myCounter` 是**全局变量**！全局变量就像房子的地基，只要网页不关，它就永远存在。它之前只是被锁住(TDZ)，现在拿到了返回的闭包，终于解锁可用了。",
    actionType: 'return',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: 'function 🎒', isClosure: false, highlight: true, id: 'g2' }, // Unlocked!
        VAL1_TDZ,
        VAL2_TDZ,
        UNUSED_FN_VAR
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
    line: 11,
    description: "▶️ 【执行第11行】调用 `myCounter`。新函数在左边运行，但它手里拿着一根线，连着右边的背包🎒。\n注意：`val1` 依然是 <TDZ>，因为函数还没算完，没法赋值。",
    actionType: 'call',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: 'function 🎒', isClosure: false, highlight: false, id: 'g2' },
        { ...VAL1_TDZ, highlight: true }, // Still TDZ
        VAL2_TDZ,
        UNUSED_FN_VAR
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
        VAL1_TDZ,
        VAL2_TDZ,
        UNUSED_FN_VAR
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
    line: 11,
    description: "🏁 【执行第11行结束】函数返回 1，`val1` 终于拿到了值，解除 <TDZ> 状态！\n右边背包里的 `count` 依然是 1，安然无恙。",
    actionType: 'return',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: 'function 🎒', isClosure: false, highlight: false, id: 'g2' },
        { name: 'val1', value: 1, isClosure: false, highlight: true, id: 'g3' }, // Unlocked
        VAL2_TDZ,
        UNUSED_FN_VAR
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
    line: 12,
    description: "▶️ 【执行第12行】第二次调用。`val2` 目前还是 <TDZ>。新栈帧再次连上了同一个背包 🎒。",
    actionType: 'call',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: 'function 🎒', isClosure: false, highlight: false, id: 'g2' },
        { name: 'val1', value: 1, isClosure: false, highlight: false, id: 'g3' },
        { ...VAL2_TDZ, highlight: true }, // Highlighted but TDZ
        UNUSED_FN_VAR
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
        VAL2_TDZ,
        UNUSED_FN_VAR
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
    line: 12,
    description: "🏁 【执行第12行结束】`val2` 赋值成功。重点：虽然函数调用结束了（左边空了），但因为 myCounter 变量还活着，右边的背包就永远不会消失。",
    actionType: 'return',
    scopeState: {
      global: [
        { name: 'createCounter', value: 'function', isClosure: false, highlight: false, id: 'g1' },
        { name: 'myCounter', value: 'function 🎒', isClosure: false, highlight: false, id: 'g2' },
        { name: 'val1', value: 1, isClosure: false, highlight: false, id: 'g3' },
        { name: 'val2', value: 2, isClosure: false, highlight: true, id: 'g4' }, // Unlocked
        UNUSED_FN_VAR
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