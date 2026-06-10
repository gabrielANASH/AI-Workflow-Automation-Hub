import { WorkflowError } from "./errors";
import {
  createWorkflowSchema,
  updateWorkflowSchema,
  type CreateWorkflowInput,
  type UpdateWorkflowInput,
} from "./validation";
import * as repo from "./repository";

export type WorkflowResponse = {
  id: string;
  name: string;
  description: string | null;
  status: string;
  runs: number;
  lastRun: string | null;
  createdAt: string;
  updatedAt: string;
  trigger: string | null;
  steps: number;
};

export type WorkflowDetailResponse = WorkflowResponse & {
  steps: unknown;
};

function toResponse(wf: {
  id: string;
  name: string;
  description: string | null;
  status: string;
  runsCount: number;
  lastRunAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  trigger: string | null;
  steps: unknown;
}): WorkflowResponse {
  const blockCount = Array.isArray(wf.steps) ? wf.steps.length : 0;
  const stepsField = typeof wf.steps === "number" ? (wf.steps as number) : blockCount;

  return {
    id: wf.id,
    name: wf.name,
    description: wf.description,
    status: wf.status,
    runs: wf.runsCount,
    lastRun: wf.lastRunAt?.toISOString() ?? null,
    createdAt: wf.createdAt.toISOString(),
    updatedAt: wf.updatedAt.toISOString(),
    trigger: wf.trigger,
    steps: stepsField,
  };
}

export async function listWorkflows(userId: string): Promise<WorkflowResponse[]> {
  const workflows = await repo.findWorkflowsByUserId(userId);
  return workflows.map(toResponse);
}

export async function getWorkflow(id: string, userId: string): Promise<WorkflowResponse> {
  const workflow = await repo.findWorkflowByIdAndUser(id, userId);

  if (!workflow) {
    throw new WorkflowError("Workflow not found", 404);
  }

  return toResponse(workflow);
}

export async function getWorkflowDetail(id: string, userId: string): Promise<WorkflowDetailResponse> {
  const workflow = await repo.findWorkflowByIdAndUser(id, userId);

  if (!workflow) {
    throw new WorkflowError("Workflow not found", 404);
  }

  const blockCount = Array.isArray(workflow.steps) ? workflow.steps.length : 0;
  const stepsField = typeof workflow.steps === "number" ? (workflow.steps as number) : blockCount;

  return {
    id: workflow.id,
    name: workflow.name,
    description: workflow.description,
    status: workflow.status,
    runs: workflow.runsCount,
    lastRun: workflow.lastRunAt?.toISOString() ?? null,
    createdAt: workflow.createdAt.toISOString(),
    updatedAt: workflow.updatedAt.toISOString(),
    trigger: workflow.trigger,
    steps: workflow.steps,
    stepsCount: stepsField,
  } as unknown as WorkflowDetailResponse;
}

export async function createWorkflow(
  input: CreateWorkflowInput,
  userId: string,
): Promise<WorkflowResponse> {
  const parsed = createWorkflowSchema.parse(input);

  const workflow = await repo.createWorkflow({
    ...parsed,
    userId,
  });

  return toResponse(workflow);
}

export async function updateWorkflow(
  id: string,
  input: UpdateWorkflowInput,
  userId: string,
): Promise<WorkflowResponse> {
  const parsed = updateWorkflowSchema.parse(input);

  const existing = await repo.findWorkflowByIdAndUser(id, userId);

  if (!existing) {
    throw new WorkflowError("Workflow not found", 404);
  }

  const workflow = await repo.updateWorkflow(id, userId, parsed);

  return toResponse(workflow);
}

export async function deleteWorkflow(id: string, userId: string): Promise<void> {
  const existing = await repo.findWorkflowByIdAndUser(id, userId);

  if (!existing) {
    throw new WorkflowError("Workflow not found", 404);
  }

  await repo.deleteWorkflow(id, userId);
}
