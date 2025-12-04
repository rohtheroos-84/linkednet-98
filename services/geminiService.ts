import { GoogleGenAI } from "@google/genai";
import { Message, ResearchResult } from "../types";

const apiKey = process.env.API_KEY || '';

// Debug: Log API key status
console.log('API Key loaded:', apiKey ? `${apiKey.substring(0, 10)}...` : 'MISSING');

if (!apiKey) {
  console.error('GEMINI_API_KEY is not set in environment variables!');
}

const ai = new GoogleGenAI({ apiKey });

// System instruction for the interviewer
const INTERVIEWER_SYSTEM_INSTRUCTION = `
You are an expert investigative journalist and ghostwriter for LinkedIn. 
Your goal is to extract a deep, authentic, and engaging story from the user based on a short prompt.
You must avoid "AI-isms" (hallucinations, generic fluff).
Ask ONE probing question at a time to get specific details: metrics, emotions, specific conflicts, "aha" moments, and contrarian views.
Keep the tone professional but conversational.
Do not draft the post yet. Just gather information.
`;

// System instruction for the drafter
const DRAFTER_SYSTEM_INSTRUCTION = `
You are a world-class LinkedIn ghostwriter. 
Your style is:
- Hook-driven but not clickbaity.
- Conversational and authentic (human-sounding).
- Short paragraphs, easy to scan.
- NO "AI-isms": Avoid words like "delve", "tapestry", "landscape", "game-changer".
- NO excessive emojis (max 1-2 relevant ones, or zero).
- NO excessive em-dashes.
- Use the provided research to ground the post in reality/trends if applicable.
`;

export class GeminiService {
  private chatSession: any = null;

  async startInterview(topic: string): Promise<string> {
    try {
      console.log('Attempting to start interview with model: gemini-2.5-flash');
      
      this.chatSession = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: {
          systemInstruction: INTERVIEWER_SYSTEM_INSTRUCTION,
        },
      });

      const response = await this.chatSession.sendMessage({
        message: `The user wants to write a post about: "${topic}". Start by asking the first most important clarifying question to understand the context and avoiding generic info.`,
      });

      return response.text || "Could not start interview.";
    } catch (error) {
      console.error("Error starting interview:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return `Error initializing the AI: ${error.message || error}`;
    }
  }

  async sendReply(userMessage: string): Promise<string> {
    if (!this.chatSession) {
      throw new Error("Chat session not initialized");
    }

    try {
      const response = await this.chatSession.sendMessage({
        message: userMessage,
      });
      return response.text || "I didn't catch that.";
    } catch (error) {
      console.error("Error sending reply:", error);
      return "Error communicating with the AI.";
    }
  }

  async performResearch(topic: string): Promise<ResearchResult> {
    try {
      // Use gemini-2.5-flash for research
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Find recent trends, news, or best practices related to: "${topic}" that would make a LinkedIn post timely and relevant. Summarize key insights.`,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      const text = response.text || "";
      const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
      const urls = chunks
        .map((c: any) => c.web?.uri)
        .filter((uri: string) => !!uri);

      return {
        query: topic,
        findings: text,
        urls: [...new Set(urls)] as string[], // Unique URLs
      };
    } catch (error) {
      console.error("Research failed:", error);
      return { query: topic, findings: "Could not perform detailed research.", urls: [] };
    }
  }

  async draftPost(
    topic: string, 
    chatHistory: Message[], 
    researchData: ResearchResult | null
  ): Promise<string> {
    try {
      const conversationContext = chatHistory
        .map(m => `${m.role.toUpperCase()}: ${m.content}`)
        .join('\n');
      
      const researchContext = researchData 
        ? `RESEARCH FINDINGS:\n${researchData.findings}` 
        : "NO EXTERNAL RESEARCH AVAILABLE.";

      const prompt = `
        Draft a high-impact LinkedIn post based on the following interview and research.
        
        TOPIC: ${topic}

        INTERVIEW TRANSCRIPT:
        ${conversationContext}

        ${researchContext}

        REQUIREMENTS:
        1. 90s internet aesthetic is for the UI only, NOT the text content. The text should be modern, professional, and viral-ready.
        2. Be specific. Use the numbers and details from the interview.
        3. Start with a strong hook.
        4. End with a question or call to action.
        5. STRICTLY NO generic AI phrases.
      `;

      // Use gemini-2.5-flash for drafting
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: DRAFTER_SYSTEM_INSTRUCTION,
        }
      });

      return response.text || "Failed to generate draft.";
    } catch (error) {
      console.error("Drafting failed:", error);
      return "Error generating the post draft.";
    }
  }
}

export const geminiService = new GeminiService();