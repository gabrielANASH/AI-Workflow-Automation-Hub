import { db } from "@/lib/db";
import type { CreateTemplateInput, UpdateTemplateInput } from "./validation";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toJson(value: unknown): any {
  return value ?? undefined;
}

export function findTemplates(userId?: string) {
  return db.workflowTemplate.findMany({
    where: {
      OR: [
        { isBuiltIn: true },
        ...(userId ? [{ createdBy: userId }] : []),
      ],
    },
    orderBy: [{ isBuiltIn: "desc" }, { usageCount: "desc" }],
  });
}

export function findTemplateById(id: string) {
  return db.workflowTemplate.findUnique({ where: { id } });
}

export function createTemplate(data: CreateTemplateInput & { createdBy?: string }) {
  return db.workflowTemplate.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      category: data.category ?? "general",
      icon: data.icon ?? "file-text",
      trigger: data.trigger ?? null,
      steps: toJson(data.steps),
      isBuiltIn: false,
      createdBy: data.createdBy ?? null,
    },
  });
}

export function updateTemplate(id: string, data: UpdateTemplateInput) {
  return db.workflowTemplate.update({
    where: { id },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description ?? null }),
      ...(data.category !== undefined && { category: data.category }),
      ...(data.icon !== undefined && { icon: data.icon }),
      ...(data.trigger !== undefined && { trigger: data.trigger ?? null }),
      ...(data.steps !== undefined && { steps: toJson(data.steps) }),
    },
  });
}

export function deleteTemplate(id: string) {
  return db.workflowTemplate.delete({ where: { id } });
}

export function incrementTemplateUsage(id: string) {
  return db.workflowTemplate.update({
    where: { id },
    data: { usageCount: { increment: 1 } },
  });
}
