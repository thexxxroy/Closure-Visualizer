import { GoogleGenAI } from "@google/genai";
import { DEMO_STEPS } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function explainClosureStep(stepIndex: number, currentCode: string) {
  const step = DEMO_STEPS[stepIndex];
  
  const prompt = `
    Context: A user who finds closures confusing is watching a visualization.
    Language: CHINESE (Simplified).
    
    Current Code:
    ${currentCode}

    Current Step (${stepIndex + 1}):
    "${step.description}"
    
    Task: Explain this step simply.
    Use the "Backpack" analogy: When a function returns, it leaves, but it can pack a "backpack" (Closure) of variables to give to the inner function.
    
    - If this step creates the closure, explain that the backpack is being packed.
    - If this step accesses the closure, explain that the function is reaching into the backpack.
    - Keep it very short (2 sentences max). 
    - Tone: Friendly, encouraging, visual.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "AI 助教正在休息 (无法连接)。请继续观察动画。";
  }
}