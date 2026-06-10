export class AIError extends Error {
  constructor(
    message: string,
    public code: string = "AI_ERROR",
    public statusCode: number = 500,
    public provider?: string,
  ) {
    super(message);
    this.name = "AIError";
  }
}

export class AIProviderNotFoundError extends AIError {
  constructor(providerName: string) {
    super(`AI provider "${providerName}" not found`, "PROVIDER_NOT_FOUND", 400);
    this.name = "AIProviderNotFoundError";
  }
}

export class AIAuthenticationError extends AIError {
  constructor(provider: string) {
    super(
      `Authentication failed for provider "${provider}". Check your API key.`,
      "AUTHENTICATION_ERROR",
      401,
      provider,
    );
    this.name = "AIAuthenticationError";
  }
}

export class AIRateLimitError extends AIError {
  constructor(provider: string, public retryAfterMs?: number) {
    super(
      `Rate limited by provider "${provider}".`,
      "RATE_LIMIT_ERROR",
      429,
      provider,
    );
    this.name = "AIRateLimitError";
  }
}

export class AIModelError extends AIError {
  constructor(provider: string, model: string, detail: string) {
    super(
      `Model "${model}" error from "${provider}": ${detail}`,
      "MODEL_ERROR",
      502,
      provider,
    );
    this.name = "AIModelError";
  }
}
