import OpenAI from "openai";
import {
  type AIProvider,
  type Message,
  type GenerateOptions,
  type AIResponse,
  type AIStreamChunk,
} from "../types";
import {
  AIAuthenticationError,
  AIRateLimitError,
  AIModelError,
} from "../errors";

export class OpenAIProvider implements AIProvider {
  readonly name = "openai";
  readonly model: string;
  private client: OpenAI;

  constructor(model: string = "gpt-4o") {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new AIAuthenticationError("openai");
    }
    this.model = model;
    this.client = new OpenAI({ apiKey });
  }

  async generateText(
    messages: Message[],
    options?: GenerateOptions,
  ): Promise<AIResponse> {
    try {
      const response = await this.client.chat.completions.create({
        model: this.model,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        temperature: options?.temperature,
        max_tokens: options?.maxTokens,
        top_p: options?.topP,
        stop: options?.stop,
      });

      const choice = response.choices[0];
      return {
        content: choice?.message?.content ?? "",
        model: response.model,
        provider: this.name,
        usage: {
          promptTokens: response.usage?.prompt_tokens ?? 0,
          completionTokens: response.usage?.completion_tokens ?? 0,
          totalTokens: response.usage?.total_tokens ?? 0,
        },
        finishReason: choice?.finish_reason ?? null,
      };
    } catch (error: unknown) {
      throw this.normalizeError(error);
    }
  }

  async *generateStream(
    messages: Message[],
    options?: GenerateOptions,
  ): AsyncGenerator<AIStreamChunk> {
    try {
      const stream = await this.client.chat.completions.create({
        model: this.model,
        messages: messages.map((m) => ({ role: m.role, content: m.content })),
        temperature: options?.temperature,
        max_tokens: options?.maxTokens,
        top_p: options?.topP,
        stop: options?.stop,
        stream: true,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices?.[0]?.delta;
        yield {
          content: delta?.content ?? "",
          finishReason: chunk.choices?.[0]?.finish_reason ?? null,
        };
      }
    } catch (error: unknown) {
      throw this.normalizeError(error);
    }
  }

  private normalizeError(error: unknown): Error {
    if (error instanceof OpenAI.APIError) {
      switch (error.status) {
        case 401:
          return new AIAuthenticationError(this.name);
        case 429:
          return new AIRateLimitError(this.name);
        default:
          return new AIModelError(this.name, this.model, error.message);
      }
    }
    return error as Error;
  }
}
