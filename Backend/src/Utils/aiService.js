import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

/**
 * @param {string} textContent - Transcript or descriptive content of the video
 * @returns {Promise<{overview: string, keyTakeaways: string[]}>}
 */
export const generateAISummary = async (textContent) => {
  try {
    const prompt = `
      You are an expert video content summarizer. 
      Analyze the following content and generate a concise summary formatted strictly in JSON with two keys:
      1. "overview": A concise paragraph (2-3 sentences max) summarizing the video core concept.
      2. "keyTakeaways": An array of 3 to 5 clear, bulleted points highlighting main insights.

      Content:
      "${textContent}"
    `;

    const response = await ai.models.generateContent({
        model: "gemini-3.1-flash-lite",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const parsedData = JSON.parse(response.text);
    return parsedData;
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw new Error("Failed to generate AI summary");
  }
};