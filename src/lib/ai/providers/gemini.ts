import { GoogleGenerativeAI } from "@google/generative-ai";
import {
  type AIProvider,
  type Message,
  type GenerateOptions,
  type AIResponse,
} from "../types";
import {
  AIAuthenticationError,
  AIRateLimitError,
  AIModelError,
} from "../errors";

export class GeminiProvider implements AIProvider {
  readonly name = "gemini";
  readonly model: string;
  private client: GoogleGenerativeAI;

  constructor(model: string = "gemini-1.5-pro") {
    const apiKey = process.env.GEMINI_API_KEY;
    console.log("[Gemini] API key loaded:", !!apiKey);
    if (!apiKey) {
      const err = new AIAuthenticationError("gemini");
      err.message = "Gemini API key not configured";
      throw err;
    }
    this.model = model;
    this.client = new GoogleGenerativeAI(apiKey);
  }

  async generateText(
    messages: Message[],
    options?: GenerateOptions,
  ): Promise<AIResponse> {
    try {
      const model = this.client.getGenerativeModel({ model: this.model });

      const systemMessage = messages.find((m) => m.role === "system");
      const userMessages = messages.filter((m) => m.role !== "system");

      const prompt = userMessages.map((m) => m.content).join("\n");
      const fullPrompt = systemMessage
        ? `[System Instruction]\n${systemMessage.content}\n\n${prompt}`
        : prompt;

      const result = await model.generateContent({
        contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
        generationConfig: {
          temperature: options?.temperature,
          maxOutputTokens: options?.maxTokens,
          topP: options?.topP,
          stopSequences: options?.stop,
        },
      });

      const response = result.response;
      const usage = response.usageMetadata;

      return {
        content: response.text(),
        model: this.model,
        provider: this.name,
        usage: {
          promptTokens: usage?.promptTokenCount ?? 0,
          completionTokens: usage?.candidatesTokenCount ?? 0,
          totalTokens: usage?.totalTokenCount ?? 0,
        },
        finishReason: null,
      };
    } catch (error: unknown) {
      throw this.normalizeError(error);
    }
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      if (msg.includes("api key") || msg.includes("unauthorized")) {
        const err = new AIAuthenticationError(this.name);
        err.message = "Gemini authentication failed";
        return err;
      }
      if (msg.includes("not found")) {
        return new AIModelError(this.name, this.model, "Selected Gemini model unavailable");
      }
      if (msg.includes("rate") || msg.includes("quota") || msg.includes("429")) {
        return new AIRateLimitError(this.name);
      }
      return new AIModelError(this.name, this.model, error.message);
    }
    return error as Error;
  }
}
