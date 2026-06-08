import { GoogleGenAI } from '@google/genai';

let aiClient = null;

const getGeminiClient = () => {
  if (!aiClient) {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not configured in environment variables');
    }
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
};

/**
 * Maps varying chat history formats to the exact format required by Google GenAI SDK.
 */
const mapHistoryToGemini = (history, prompt) => {
  const contents = [];
  if (history && Array.isArray(history)) {
    history.forEach(item => {
      const role = item.role === 'assistant' || item.role === 'model' ? 'model' : 'user';
      let text = '';
      if (typeof item.content === 'string') {
        text = item.content;
      } else if (Array.isArray(item.parts) && item.parts[0]?.text) {
        text = item.parts[0].text;
      } else if (item.text) {
        text = item.text;
      }
      
      if (text.trim()) {
        contents.push({ role, parts: [{ text }] });
      }
    });
  }
  contents.push({ role: 'user', parts: [{ text: prompt }] });
  return contents;
};

const callWithRetry = async (fn, retries = 3, delay = 1000) => {
  for (let i = 0; i < retries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isTransient = 
        error.message.includes('503') || 
        error.message.includes('Service Unavailable') || 
        error.message.includes('high demand') || 
        error.message.includes('429') || 
        error.message.includes('Too Many Requests');
        
      if (isTransient && i < retries - 1) {
        console.warn(`[GeminiService] Transient error encountered (attempt ${i + 1}/${retries}): ${error.message}. Retrying in ${delay}ms...`);
        await new Promise(res => setTimeout(res, delay));
        delay *= 2;
        continue;
      }
      throw error;
    }
  }
};

/**
 * Generate a text response using Gemini
 * @param {object} params
 * @param {string} params.systemInstruction
 * @param {string} params.prompt
 * @param {Array} [params.history]
 * @returns {Promise<string>}
 */
export const generateText = async ({ systemInstruction, prompt, history = [] }) => {
  try {
    const client = getGeminiClient();
    const contents = mapHistoryToGemini(history, prompt);

    const response = await callWithRetry(() => client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.5,
        maxOutputTokens: 1000
      }
    }));

    return response.text;
  } catch (error) {
    console.error('[GeminiService] Text generation failed:', error.message);
    throw error;
  }
};

/**
 * Generate structured JSON response using Gemini
 * @param {object} params
 * @param {string} params.systemInstruction
 * @param {string} params.prompt
 * @returns {Promise<string>} raw JSON string from Gemini
 */
export const generateJson = async ({ systemInstruction, prompt }) => {
  try {
    const client = getGeminiClient();

    const response = await callWithRetry(() => client.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        temperature: 0.3
      }
    }));

    return response.text;
  } catch (error) {
    console.error('[GeminiService] JSON generation failed:', error.message);
    throw error;
  }
};
