import { TemplateError } from "./errors";
import {
  createTemplateSchema,
  updateTemplateSchema,
  type CreateTemplateInput,
  type UpdateTemplateInput,
} from "./validation";
import * as repo from "./repository";

export type TemplateResponse = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  icon: string;
  trigger: string | null;
  steps: number;
  isBuiltIn: boolean;
  usageCount: number;
  createdAt: string;
};

function toResponse(t: {
  id: string;
  name: string;
  description: string | null;
  category: string;
  icon: string;
  trigger: string | null;
  steps: unknown;
  isBuiltIn: boolean;
  usageCount: number;
  createdAt: Date;
}): TemplateResponse {
  return {
    id: t.id,
    name: t.name,
    description: t.description,
    category: t.category,
    icon: t.icon,
    trigger: t.trigger,
    steps: Array.isArray(t.steps) ? t.steps.length : 0,
    isBuiltIn: t.isBuiltIn,
    usageCount: t.usageCount,
    createdAt: t.createdAt.toISOString(),
  };
}

export async function listTemplates(userId?: string): Promise<TemplateResponse[]> {
  const templates = await repo.findTemplates(userId);
  return templates.map(toResponse);
}

export async function getTemplate(id: string): Promise<{
  id: string;
  name: string;
  description: string | null;
  category: string;
  icon: string;
  trigger: string | null;
  steps: unknown;
  isBuiltIn: boolean;
  usageCount: number;
  createdAt: string;
}> {
  const template = await repo.findTemplateById(id);
  if (!template) throw new TemplateError("Template not found", 404);
  return {
    ...template,
    createdAt: template.createdAt.toISOString(),
  };
}

export async function createTemplate(
  input: CreateTemplateInput,
  userId?: string,
): Promise<TemplateResponse> {
  const parsed = createTemplateSchema.parse(input);
  const template = await repo.createTemplate({ ...parsed, createdBy: userId });
  return toResponse(template);
}

export async function updateTemplate(
  id: string,
  input: UpdateTemplateInput,
): Promise<TemplateResponse> {
  const parsed = updateTemplateSchema.parse(input);
  const existing = await repo.findTemplateById(id);
  if (!existing) throw new TemplateError("Template not found", 404);
  const template = await repo.updateTemplate(id, parsed);
  return toResponse(template);
}

export async function deleteTemplate(id: string): Promise<void> {
  const existing = await repo.findTemplateById(id);
  if (!existing) throw new TemplateError("Template not found", 404);
  await repo.deleteTemplate(id);
}

export async function duplicateTemplate(
  id: string,
  userId: string,
): Promise<{ workflowId: string }> {
  const template = await repo.findTemplateById(id);
  if (!template) throw new TemplateError("Template not found", 404);

  const { createWorkflow } = await import("@/lib/workflows/service");
  const workflow = await createWorkflow(
    {
      name: `${template.name} (copy)`,
      description: template.description ?? undefined,
      steps: template.steps as Record<string, unknown>[] | undefined,
      trigger: template.trigger ?? undefined,
    },
    userId,
  );

  await repo.incrementTemplateUsage(id);

  return { workflowId: workflow.id };
}
