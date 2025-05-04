import { GoogleGenAI, HarmBlockThreshold, HarmCategory } from '@google/genai';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
if (!GEMINI_API_KEY) {
  throw new Error('GEMINI_API_KEY environment variable is not set');
}
const ai = new GoogleGenAI({
  apiKey: GEMINI_API_KEY,
});

const config = {
    maxOutputTokens: 300,
    safetySettings: [
      {
        category: HarmCategory.HARM_CATEGORY_HARASSMENT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,  // Block few
      },
      {
        category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,  // Block few
      },
      {
        category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,  // Block few
      },
      {
        category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
        threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,  // Block some
      },
      {
        category: HarmCategory.HARM_CATEGORY_CIVIC_INTEGRITY,
        threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,  // Block few
      },
    ],
    responseMimeType: 'text/plain',
  };
  const model = 'gemini-2.0-flash';

  export async function geminiModel() {
    const response = await ai.models.generateContent({
        model,
        config,
      contents: 'Why is the sky blue?',
    });
    console.log(response.text);
  }
  
  geminiModel();
