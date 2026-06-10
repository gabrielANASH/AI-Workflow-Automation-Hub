import { z } from "zod";

export const workflowStatusEnum = z.enum(["draft", "active", "paused", "error", "archived"]);

export const createWorkflowSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(200, "Name must be at most 200 characters"),
  description: z
    .string()
    .max(500, "Description must be at most 500 characters")
    .optional(),
  steps: z.array(z.record(z.string(), z.unknown())).optional(),
  trigger: z.string().max(100).optional(),
});

export const updateWorkflowSchema = z.object({
  name: z
    .string()
    .min(1)
    .max(200)
    .optional(),
  description: z
    .string()
    .max(500)
    .optional(),
  steps: z.array(z.record(z.string(), z.unknown())).optional(),
  status: workflowStatusEnum.optional(),
  trigger: z.string().max(100).optional(),
});

export type CreateWorkflowInput = z.infer<typeof createWorkflowSchema>;
export type UpdateWorkflowInput = z.infer<typeof updateWorkflowSchema>;
