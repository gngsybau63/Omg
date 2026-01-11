import { GoogleGenAI } from "@google/genai";

export const getSecurityAnalysis = async (context: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const prompt = `
      You are a high-level cybersecurity expert specializing in gaming account security and risk management.
      
      Analyze the following context regarding a user's attempt to modify account security settings (specifically removing an email or bypassing verification).
      
      Context: ${context}
      
      Provide a concise, technical risk assessment (max 150 words). 
      Focus on the implications of session token exposure and email removal. 
      Use technical jargon appropriate for a "Ghost Management Layer" dashboard.
      Format the output as a raw system log analysis.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        temperature: 0.7,
        systemInstruction: "You are a specialized security AI integrated into the 'vibe' dashboard.",
      }
    });

    return response.text || "Analysis complete: No significant anomalies detected in heuristics.";
  } catch (error) {
    console.error("Gemini Analysis Failed:", error);
    return "SYSTEM ERROR: AI ANALYSIS MODULE UNREACHABLE. PROCEED WITH CAUTION.";
  }
};
