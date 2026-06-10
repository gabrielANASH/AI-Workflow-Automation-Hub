import { aiService } from "@/lib/ai";
import { resolveModel, resolveProvider, getModelPricing } from "@/lib/ai/models";
import * as repo from "../repository";
import { ExecutionError } from "../errors";
import type { BlockExecutor, BlockResult, ExecutionContext } from "../types";

function calculateCost(model: string, promptTokens: number, completionTokens: number): number {
  const pricing = getModelPricing(model);
  if (!pricing) return 0;
  return parseFloat((pricing.input * promptTokens + pricing.output * completionTokens).toFixed(6));
}

export const aiActionExecutor: BlockExecutor = {
  type: "ai_action",
  async execute(block, context) {
    const config = block.config;
    const rawModel = config.model as string | undefined;
    if (!rawModel) {
      throw new ExecutionError("No AI model configured. Select a model in the block properties.", "NO_MODEL");
    }
    const model = resolveModel(rawModel);
    const provider = resolveProvider(model);
    const prompt = (config.prompt as string) ?? "";
    const temperature = (config.temperature as number) ?? 0.7;
    const maxTokens = (config.maxTokens as number) ?? 1024;

    if (provider === "gemini") {
      const keyExists = !!process.env.GEMINI_API_KEY;
      console.log("[Gemini] API key loaded:", keyExists);
      if (!keyExists) {
        return { success: false, output: null, error: "Gemini API key not configured" };
      }
    }

    const resolvedPrompt = resolveTemplate(prompt, context.vars);
    const startedAt = Date.now();

    try {
      const response = await aiService.generateText(provider, [
        { role: "user", content: resolvedPrompt },
      ], { model, temperature, maxTokens });

      const durationMs = Date.now() - startedAt;
      console.log("[AI Action] completed:", { provider, model, executionTime: `${durationMs}ms` });
      const usage = response.usage;
      const cost = calculateCost(model, usage.promptTokens, usage.completionTokens);

      if (usage.totalTokens > 0) {
        repo.createUsageLog({
          usageType: "ai_token",
          quantity: usage.totalTokens,
          cost,
          metadata: {
            model: response.model,
            provider: response.provider,
            prompt: resolvedPrompt,
            response: response.content,
            durationMs,
            inputTokens: usage.promptTokens,
            outputTokens: usage.completionTokens,
          },
          userId: context.userId,
          runId: context.runId,
        }).catch(() => {});
      }

      return {
        success: true,
        output: {
          content: response.content,
          model: response.model,
          provider: response.provider,
          usage,
          durationMs,
          cost,
        },
        error: null,
      };
    } catch (err) {
      const durationMs = Date.now() - startedAt;
      console.log("[AI Action] failed:", { provider, model, executionTime: `${durationMs}ms` });
      return {
        success: false,
        output: null,
        error: err instanceof Error ? err.message : "AI action failed",
      };
    }
  },
};

function resolveTemplate(template: string, vars: Record<string, unknown>): string {
  return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
    const val = path.split(".").reduce((acc: unknown, key: string) => {
      if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
      return undefined;
    }, vars as unknown);
    return val !== undefined ? String(val) : `{{${path}}}`;
  });
}
