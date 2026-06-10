import {
  type AIProvider,
  type Message,
  type GenerateOptions,
  type AIResponse,
  type AIStreamChunk,
  type RetryConfig,
} from "./types";
import { AIError, AIProviderNotFoundError } from "./errors";
import { OpenAIProvider } from "./providers/openai";
import { GeminiProvider } from "./providers/gemini";

const DEFAULT_RETRY: RetryConfig = {
  maxAttempts: 3,
  baseDelayMs: 1000,
  maxDelayMs: 10000,
};

type ProviderConstructor = new (model?: string) => AIProvider;

const providerRegistry: Map<string, ProviderConstructor> = new Map<
  string,
  ProviderConstructor
>([
  ["openai", OpenAIProvider],
  ["gemini", GeminiProvider],
]);

export function registerProvider(name: string, ctor: ProviderConstructor): void {
  providerRegistry.set(name, ctor);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function calculateBackoff(attempt: number, config: RetryConfig): number {
  const delay = Math.min(
    config.baseDelayMs * Math.pow(2, attempt),
    config.maxDelayMs,
  );
  const jitter = Math.random() * delay * 0.3;
  return Math.floor(delay + jitter);
}

function isRetryable(error: unknown): boolean {
  if (error instanceof AIError) {
    return [429, 502, 503].includes(error.statusCode);
  }
  return false;
}

export class AIService {
  private providers: Map<string, AIProvider> = new Map();
  private retryConfig: RetryConfig;

  constructor(retryConfig?: Partial<RetryConfig>) {
    this.retryConfig = { ...DEFAULT_RETRY, ...retryConfig };
  }

  private getProvider(providerName: string, model?: string): AIProvider {
    const cacheKey = model ? `${providerName}:${model}` : providerName;

    let provider = this.providers.get(cacheKey);
    if (!provider) {
      const Ctor = providerRegistry.get(providerName);
      if (!Ctor) {
        throw new AIProviderNotFoundError(providerName);
      }
      provider = new Ctor(model);
      this.providers.set(cacheKey, provider);
    }
    return provider;
  }

  async generateText(
    providerName: string,
    messages: Message[],
    options?: GenerateOptions & { model?: string },
  ): Promise<AIResponse> {
    const provider = this.getProvider(providerName, options?.model);
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < this.retryConfig.maxAttempts; attempt++) {
      if (attempt > 0) {
        const delay = calculateBackoff(attempt - 1, this.retryConfig);
        await sleep(delay);
      }

      try {
        return await provider.generateText(messages, options);
      } catch (error) {
        lastError = error as Error;
        if (!isRetryable(error)) throw error;
      }
    }

    throw lastError ?? new AIError("All retry attempts failed");
  }

  async *generateStream(
    providerName: string,
    messages: Message[],
    options?: GenerateOptions & { model?: string },
  ): AsyncGenerator<AIStreamChunk> {
    const provider = this.getProvider(providerName, options?.model);

    if (!provider.generateStream) {
      throw new AIError(
        `Provider "${providerName}" does not support streaming`,
        "STREAM_NOT_SUPPORTED",
        400,
      );
    }

    yield* provider.generateStream(messages, options);
  }

  getAvailableProviders(): string[] {
    return Array.from(providerRegistry.keys());
  }
}

export const aiService = new AIService();
