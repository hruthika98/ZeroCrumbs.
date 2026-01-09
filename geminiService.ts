import { GoogleGenAI, Type } from "@google/genai";
import { FoodCategory, FreshnessStatus } from "./types";

// Always use the recommended initialization with the API key from environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeFoodImage = async (base64Image: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: "image/jpeg" } },
          { text: "Analyze this food image. Extract: food name, estimated category (Cooked Meals, Bakery & Sweets, Fresh Produce, Packaged Goods, Dairy & Eggs), estimated servings, estimated nutrition (calories, protein, carbs, fats per serving), and potential allergens. Return JSON." }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            category: { type: Type.STRING },
            quantity: { type: Type.STRING },
            nutrition: {
              type: Type.OBJECT,
              properties: {
                calories: { type: Type.NUMBER },
                protein: { type: Type.NUMBER },
                carbs: { type: Type.NUMBER },
                fats: { type: Type.NUMBER },
                allergens: { type: Type.ARRAY, items: { type: Type.STRING } }
              },
              required: ["calories", "protein", "carbs", "fats", "allergens"]
            }
          },
          required: ["name", "category", "quantity", "nutrition"]
        }
      }
    });

    // Directly access the .text property of GenerateContentResponse as it returns the string output.
    return JSON.parse(response.text || "{}");
  } catch (error) {
    console.error("Gemini Image Analysis Error:", error);
    return null;
  }
};

export const getSustainabilityFact = async () => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Tell me one surprising, short fact about food waste and its environmental impact. Keep it under 20 words.",
    });
    // Directly access the .text property of GenerateContentResponse.
    return response.text;
  } catch (error) {
    return "Food waste is a major contributor to global greenhouse gas emissions.";
  }
};