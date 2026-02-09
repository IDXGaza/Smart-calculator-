
import { GoogleGenAI } from "@google/genai";
import { ConversionResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const getCurrencyConversion = async (from: string, to: string, amount: number): Promise<ConversionResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `ما هو سعر صرف العملة الحالي من ${from} إلى ${to}؟ أريد النتيجة بصيغة JSON فقط تحتوي على الحقول التالية: rate (النسبة)، lastUpdate (تاريخ التحديث)، و explanation (شرح بسيط). الكمية هي ${amount}.`,
      config: {
        tools: [{ googleSearch: {} }],
        responseMimeType: "application/json",
      },
    });

    const jsonText = response.text.trim();
    const data = JSON.parse(jsonText);
    
    // Extracting URLs if available
    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => chunk.web?.uri).filter(Boolean);

    return {
      from,
      to,
      rate: data.rate,
      amount,
      result: amount * data.rate,
      lastUpdate: data.lastUpdate || new Date().toLocaleString('ar-SA'),
      sources: sources || []
    };
  } catch (error) {
    console.error("Error fetching conversion:", error);
    throw error;
  }
};
