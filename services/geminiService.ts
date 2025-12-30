
import { GoogleGenAI, Type } from "@google/genai";
import { DashboardSummary, WinterAlert, HealthTip } from "../types";

const API_KEY = process.env.API_KEY || "";

export const getWinterDashboardData = async (lat: number, lng: number): Promise<DashboardSummary> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const prompt = `Current Location: Lat ${lat}, Lng ${lng}. Provide a winter safety assessment for this location. 
  Include: 
  1. Estimated current temperature (if possible via search).
  2. Risk level (LOW, MODERATE, HIGH, EXTREME).
  3. A 2-sentence summary of current winter hazards and immediate advice.
  Use Google Search for real-time accuracy.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  const sources = groundingChunks
    .filter(chunk => chunk.web)
    .map(chunk => ({
      uri: chunk.web?.uri || "",
      title: chunk.web?.title || "Reference Source"
    }));

  // Simple parsing of text response for mock dashboard structure
  const text = response.text || "Status unavailable.";
  const riskLevel = text.includes("EXTREME") ? "EXTREME" : 
                    text.includes("HIGH") ? "HIGH" : 
                    text.includes("MODERATE") ? "MODERATE" : "LOW";

  return {
    currentTemp: 0, // In a real app, we'd extract this more precisely
    riskLevel: riskLevel as any,
    summary: text,
    groundingSources: sources
  };
};

export const getSmartAlerts = async (location: string): Promise<WinterAlert[]> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 3 current or likely winter alerts for ${location}. 
    Return as a JSON array of objects with properties: id, type (CRITICAL, WARNING, INFO), title, description, action (clear specific step), timestamp.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.STRING },
            type: { type: Type.STRING },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            action: { type: Type.STRING },
            timestamp: { type: Type.STRING }
          },
          required: ["id", "type", "title", "description", "action", "timestamp"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return [];
  }
};

export const getHealthTips = async (): Promise<HealthTip[]> => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Provide 4 essential winter health tips for residents of cold regions. Categories: Flu, Hypothermia, Activity, Hydration.",
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            content: { type: Type.STRING },
            category: { type: Type.STRING }
          },
          required: ["title", "content", "category"]
        }
      }
    }
  });

  try {
    return JSON.parse(response.text);
  } catch (e) {
    return [];
  }
};

export const getChatResponse = async (history: {role: string, parts: {text: string}[]}[], message: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const chat = ai.chats.create({
    model: 'gemini-3-flash-preview',
    config: {
      systemInstruction: 'You are a professional Winter Safety Advisor. You provide actionable, life-saving advice for winter conditions. Keep responses concise and focused on immediate safety steps.',
    }
  });

  const response = await chat.sendMessage({ message });
  return response.text;
};
