import { GoogleGenAI } from '@google/genai';

export interface GeminiAdviceResponse {
  customArchitectureReview: string;
  recommendedShields: string[];
  firmwareStackRecommendation: string;
  safetyCautions: string[];
}

export async function askGeminiArchitect(
  projectIdea: string,
  recommendedBoard: string,
  apiKey?: string
): Promise<GeminiAdviceResponse | null> {
  const key = apiKey || (typeof process !== 'undefined' && process.env?.GEMINI_API_KEY) || '';

  if (!key || key === 'MY_GEMINI_API_KEY') {
    return null;
  }

  try {
    const ai = new GoogleGenAI({ apiKey: key });
    const prompt = `You are an expert embedded systems and robotics hardware architect.
The user wants to build the following project:
"${projectIdea}"

Our recommendation engine suggested: ${recommendedBoard}.

Provide an advanced technical evaluation in valid JSON format with these exact keys:
{
  "customArchitectureReview": "Concise 3-4 sentence professional assessment on the hardware sizing, CPU/GPU load, and whether this controller is ideal or needs a companion chip.",
  "recommendedShields": ["3-4 specific driver modules, shields, or breakout boards e.g. TB6612FNG motor driver, MPU6050 IMU, INA219 current sensor"],
  "firmwareStackRecommendation": "Recommended software stack (e.g. FreeRTOS + ESP-IDF, ROS 2 Humble + micro-ROS, JetPack 5 + TensorRT Python, Arduino C++ with SimpleFOC)",
  "safetyCautions": ["2-3 specific electrical or thermal warnings such as logic level shifting, brownout protection, heatsink requirements"]
}
Only output the raw JSON object, without backticks or markdown formatting.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt
    });

    const text = response.text ? response.text.trim() : '';
    // Strip markdown code fences if present
    const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleaned);
    return parsed as GeminiAdviceResponse;
  } catch (err) {
    console.warn('Gemini hardware architect query skipped or failed:', err);
    return null;
  }
}
