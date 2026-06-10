export interface ModelInfo {
  provider: string;
  label: string;
  supported: boolean;
  deprecated?: boolean;
  replacedBy?: string;
  pricing: { input: number; output: number };
}

export const MODEL_REGISTRY: Record<string, ModelInfo> = {
  "gpt-4o": {
    provider: "openai",
    label: "GPT-4o",
    supported: true,
    pricing: { input: 2.5 / 1000, output: 10 / 1000 },
  },
  "gpt-4o-mini": {
    provider: "openai",
    label: "GPT-4o Mini",
    supported: true,
    pricing: { input: 0.15 / 1000, output: 0.6 / 1000 },
  },
  "claude-3.5": {
    provider: "anthropic",
    label: "Claude 3.5 Sonnet",
    supported: true,
    pricing: { input: 3 / 1000, output: 15 / 1000 },
  },
  "gemini-pro": {
    provider: "gemini",
    label: "Gemini Pro",
    supported: false,
    deprecated: true,
    replacedBy: "gemini-2.5-flash",
    pricing: { input: 0.125 / 1000, output: 0.375 / 1000 },
  },
  "gemini-pro-latest": {
    provider: "gemini",
    label: "Gemini Pro Latest",
    supported: false,
    deprecated: true,
    replacedBy: "gemini-2.5-flash",
    pricing: { input: 0.125 / 1000, output: 0.375 / 1000 },
  },
  "gemini-ultra": {
    provider: "gemini",
    label: "Gemini Ultra",
    supported: false,
    deprecated: true,
    replacedBy: "gemini-2.5-pro",
    pricing: { input: 0.125 / 1000, output: 0.375 / 1000 },
  },
  "gemini-2.5-flash": {
    provider: "gemini",
    label: "Gemini 2.5 Flash",
    supported: true,
    pricing: { input: 0.125 / 1000, output: 0.375 / 1000 },
  },
  "gemini-2.5-pro": {
    provider: "gemini",
    label: "Gemini 2.5 Pro",
    supported: true,
    pricing: { input: 0.125 / 1000, output: 0.375 / 1000 },
  },
};

export function getModelInfo(model: string): ModelInfo | undefined {
  return MODEL_REGISTRY[model];
}

export function resolveModel(model: string): string {
  const info = MODEL_REGISTRY[model];
  if (!info) return model;
  if (info.deprecated && info.replacedBy) return info.replacedBy;
  return model;
}

export function resolveProvider(model: string): string {
  const info = MODEL_REGISTRY[model];
  if (!info) {
    throw new Error(`Unsupported model "${model}". Choose from: ${Object.keys(MODEL_REGISTRY).join(", ")}`);
  }
  return info.provider;
}

export function getModelPricing(model: string): { input: number; output: number } | undefined {
  const info = MODEL_REGISTRY[model];
  return info?.pricing;
}

export function getSupportedModels(): string[] {
  return Object.entries(MODEL_REGISTRY)
    .filter(([, info]) => info.supported)
    .map(([key]) => key);
}
