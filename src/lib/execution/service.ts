import { ExecutionError } from "./errors";
import * as repo from "./repository";
import { executeWorkflow } from "./engine";
import { db } from "@/lib/db";
import type { WorkflowBlock } from "@/components/workflows/workflow-builder";
import type { ExecutionLog } from "./types";

export type RunResponse = {
  id: string;
  status: string;
  trigger: string | null;
  input: unknown;
  output: unknown;
  errorMessage: string | null;
  startedAt: string;
  completedAt: string | null;
  durationMs: number | null;
  workflowId: string;
  workflowName?: string;
};

export type RunDetailResponse = RunResponse & {
  steps: ExecutionLog[];
  metrics: {
    totalTokens: number;
    totalCost: number;
    stepCount: number;
    avgStepDurationMs: number;
    totalDurationMs: number;
  };
};

function toResponse(run: {
  id: string;
  status: string;
  trigger: string | null;
  input: unknown;
  output: unknown;
  errorMessage: string | null;
  startedAt: Date;
  completedAt: Date | null;
  workflowId: string;
  workflow?: { name: string } | null;
}): RunResponse {
  const completedAt = run.completedAt?.getTime();
  const startedAt = run.startedAt.getTime();
  return {
    id: run.id,
    status: run.status,
    trigger: run.trigger,
    input: run.input,
    output: run.output,
    errorMessage: run.errorMessage,
    startedAt: run.startedAt.toISOString(),
    completedAt: run.completedAt?.toISOString() ?? null,
    durationMs: completedAt ? completedAt - startedAt : null,
    workflowId: run.workflowId,
    workflowName: run.workflow?.name,
  };
}

export async function executeWorkflowById(
  workflowId: string,
  userId: string,
  input: Record<string, unknown> = {},
): Promise<RunResponse> {
  const workflow = await db.workflow.findFirst({
    where: { id: workflowId, userId },
  });

  if (!workflow) {
    throw new ExecutionError("Workflow not found", "NOT_FOUND");
  }

  const steps = workflow.steps as WorkflowBlock[] | null;
  if (!steps || steps.length === 0) {
    throw new ExecutionError("Workflow has no steps", "NO_STEPS");
  }

  const run = await repo.createRun({
    workflowId,
    userId,
    trigger: "manual",
    input,
  });

  const updatedRun = await repo.updateRunStatus(run.id, "running");

  try {
    const result = await executeWorkflow(workflowId, run.id, userId, steps, input);

    if (result.success) {
      await repo.updateRunStatus(run.id, "success", null, {
        logs: result.logs,
        output: result.output,
      });
    } else {
      await repo.updateRunStatus(run.id, "failed", result.error, {
        logs: result.logs,
        output: result.output,
      });
    }

    await repo.incrementWorkflowRuns(workflowId);

    const finalRun = await repo.findRunById(run.id);
    if (!finalRun) throw new ExecutionError("Run not found after execution");

    return toResponse(finalRun);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Execution failed";
    await repo.updateRunStatus(run.id, "failed", message);
    await repo.incrementWorkflowRuns(workflowId);

    const finalRun = await repo.findRunById(run.id);
    if (!finalRun) throw new ExecutionError("Run not found after execution");
    return toResponse(finalRun);
  }
}

export async function listRunsByWorkflow(
  workflowId: string,
  userId: string,
): Promise<RunResponse[]> {
  const workflow = await db.workflow.findFirst({
    where: { id: workflowId, userId },
  });
  if (!workflow) throw new ExecutionError("Workflow not found", "NOT_FOUND");

  const runs = await repo.findRunsByWorkflowId(workflowId);
  return runs.map(toResponse);
}

export async function listAllRuns(userId: string): Promise<RunResponse[]> {
  const runs = await repo.findRunsByUserId(userId);
  return runs.map((r) =>
    toResponse({
      ...r,
      workflow: r.workflow ? { name: r.workflow.name } : null,
    }),
  );
}

export async function getRun(runId: string, userId: string): Promise<RunResponse> {
  const run = await repo.findRunById(runId);
  if (!run || run.userId !== userId) throw new ExecutionError("Run not found", "NOT_FOUND");
  return toResponse({
    ...run,
    workflow: run.workflow ? { name: run.workflow.name } : null,
  });
}

export async function getRunDetail(runId: string, userId: string): Promise<RunDetailResponse> {
  const run = await repo.findRunById(runId);
  if (!run || run.userId !== userId) throw new ExecutionError("Run not found", "NOT_FOUND");

  const base = toResponse({
    ...run,
    workflow: run.workflow ? { name: run.workflow.name } : null,
  });

  const outputData = run.output as { logs?: ExecutionLog[]; output?: unknown } | null;
  const steps = outputData?.logs ?? [];

  const usageLogs = await repo.getUsageLogsByRunId(runId);
  const totalTokens = usageLogs.reduce((s, l) => s + l.quantity, 0);
  const totalCost = parseFloat(usageLogs.reduce((s, l) => s + Number(l.cost), 0).toFixed(6));

  const completedSteps = steps.filter((s) => s.completedAt);
  const totalStepDuration = completedSteps.reduce((sum, s) => {
    if (!s.completedAt) return sum;
    return sum + (new Date(s.completedAt).getTime() - new Date(s.startedAt).getTime());
  }, 0);
  const avgStepDurationMs = completedSteps.length > 0 ? totalStepDuration / completedSteps.length : 0;

  return {
    ...base,
    steps,
    metrics: {
      totalTokens,
      totalCost,
      stepCount: steps.length,
      avgStepDurationMs: Math.round(avgStepDurationMs),
      totalDurationMs: base.durationMs ?? totalStepDuration,
    },
  };
}

export async function getRunStats(userId: string) {
  return repo.getRunStats(userId);
}
