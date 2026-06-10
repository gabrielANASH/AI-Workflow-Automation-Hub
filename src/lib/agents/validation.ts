import { z } from "zod";

const agentModelEnum = z.enum(["GPT4o", "GPT4oMini", "Claude35Sonnet", "GeminiPro", "Custom"]);
const agentStatusEnum = z.enum(["active", "inactive", "training", "error"]);

export const createAgentSchema = z.object({
  name: z.string().min(1, "Name is required").max(200),
  description: z.string().max(500).optional(),
  model: agentModelEnum,
  status: agentStatusEnum.optional(),
  capabilities: z.array(z.string().max(100)).max(20).optional(),
  config: z.record(z.string(), z.unknown()).optional(),
});

export const updateAgentSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  description: z.string().max(500).optional(),
  model: agentModelEnum.optional(),
  status: agentStatusEnum.optional(),
  capabilities: z.array(z.string().max(100)).max(20).optional(),
  config: z.record(z.string(), z.unknown()).optional(),
});

export type CreateAgentInput = z.infer<typeof createAgentSchema>;
export type UpdateAgentInput = z.infer<typeof updateAgentSchema>;
