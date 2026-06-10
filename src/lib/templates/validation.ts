import { z } from "zod/v4";

const workflowBlockSchema = z.object({
  id: z.string(),
  type: z.enum(["trigger", "ai_action", "condition", "email", "notification", "delay"]),
  label: z.string(),
  config: z.record(z.string(), z.unknown()),
});

export const createTemplateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional(),
  category: z.string().max(50).optional(),
  icon: z.string().max(50).optional(),
  trigger: z.string().optional(),
  steps: z.array(workflowBlockSchema).optional(),
});

export const updateTemplateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  category: z.string().max(50).optional(),
  icon: z.string().max(50).optional(),
  trigger: z.string().optional(),
  steps: z.array(workflowBlockSchema).optional(),
});

export type CreateTemplateInput = z.infer<typeof createTemplateSchema>;
export type UpdateTemplateInput = z.infer<typeof updateTemplateSchema>;
