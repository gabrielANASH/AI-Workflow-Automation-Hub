import { db } from "@/lib/db";
import type { CreateWorkflowInput, UpdateWorkflowInput } from "./validation";

export function findWorkflowsByUserId(userId: string) {
  return db.workflow.findMany({
    where: { userId },
    orderBy: { updatedAt: "desc" },
  });
}

export function findWorkflowById(id: string) {
  return db.workflow.findUnique({
    where: { id },
    include: { runs: { take: 5, orderBy: { startedAt: "desc" } } },
  });
}

export function findWorkflowByIdAndUser(id: string, userId: string) {
  return db.workflow.findFirst({
    where: { id, userId },
  });
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toJson(value: unknown): any {
  return value ?? undefined;
}

export function createWorkflow(data: CreateWorkflowInput & { userId: string }) {
  return db.workflow.create({
    data: {
      name: data.name,
      description: data.description ?? null,
      steps: toJson(data.steps),
      trigger: data.trigger ?? null,
      userId: data.userId,
    },
  });
}

export function updateWorkflow(
  id: string,
  userId: string,
  data: UpdateWorkflowInput,
) {
  return db.workflow.update({
    where: { id, userId },
    data: {
      ...(data.name !== undefined && { name: data.name }),
      ...(data.description !== undefined && { description: data.description ?? null }),
      ...(data.steps !== undefined && { steps: toJson(data.steps) }),
      ...(data.status !== undefined && { status: data.status }),
      ...(data.trigger !== undefined && { trigger: data.trigger ?? null }),
    },
  });
}

export function deleteWorkflow(id: string, userId: string) {
  return db.workflow.delete({
    where: { id, userId },
  });
}
