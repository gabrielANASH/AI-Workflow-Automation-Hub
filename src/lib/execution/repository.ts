import { db } from "@/lib/db";
import type { WorkflowRunStatus } from "@prisma/client";
import { UsageType } from "@prisma/client";

export function findRunsByWorkflowId(workflowId: string, limit = 20) {
  return db.workflowRun.findMany({
    where: { workflowId },
    orderBy: { startedAt: "desc" },
    take: limit,
  });
}

export function findRunsByUserId(userId: string, limit = 20) {
  return db.workflowRun.findMany({
    where: { userId },
    orderBy: { startedAt: "desc" },
    take: limit,
    include: { workflow: { select: { name: true } } },
  });
}

export function findRunById(id: string) {
  return db.workflowRun.findUnique({
    where: { id },
    include: { workflow: { select: { name: true } } },
  });
}

export function createRun(data: {
  workflowId: string;
  userId: string;
  trigger: string;
  input: unknown;
}) {
  return db.workflowRun.create({
    data: {
      status: "pending",
      trigger: data.trigger,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      input: data.input as any,
      workflowId: data.workflowId,
      userId: data.userId,
    },
  });
}

export function updateRunStatus(
  id: string,
  status: WorkflowRunStatus,
  errorMessage?: string | null,
  output?: unknown,
) {
  return db.workflowRun.update({
    where: { id },
    data: {
      status,
      ...(errorMessage !== undefined && { errorMessage: errorMessage ?? null }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...(output !== undefined && { output: output as any }),
      ...(status === "success" || status === "failed" || status === "cancelled"
        ? { completedAt: new Date() }
        : {}),
    },
  });
}

export function incrementWorkflowRuns(workflowId: string) {
  return db.workflow.update({
    where: { id: workflowId },
    data: {
      runsCount: { increment: 1 },
      lastRunAt: new Date(),
    },
  });
}

export function getUsageLogsByRunId(runId: string) {
  return db.usageLog.findMany({
    where: { runId, usageType: UsageType.ai_token },
    orderBy: { recordedAt: "asc" },
  });
}

export function createUsageLog(data: {
  usageType: UsageType;
  quantity: number;
  cost: number;
  metadata?: Record<string, unknown>;
  userId: string;
  runId: string;
}) {
  return db.usageLog.create({
    data: {
      usageType: data.usageType,
      quantity: data.quantity,
      cost: data.cost,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metadata: (data.metadata ?? undefined) as any,
      userId: data.userId,
      runId: data.runId,
    },
  });
}

export async function getRunStats(userId: string) {
  const runs = await db.workflowRun.findMany({
    where: { userId },
    select: { status: true, startedAt: true },
  });

  const total = runs.length;
  const success = runs.filter((r) => r.status === "success").length;
  const failed = runs.filter((r) => r.status === "failed").length;
  const successRate = total > 0 ? Math.round((success / total) * 100) : 0;

  const last7 = runs.filter(
    (r) => r.startedAt >= new Date(Date.now() - 7 * 86400000),
  );
  const days: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = new Date(Date.now() - i * 86400000);
    const key = d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    days[key] = 0;
  }
  for (const r of last7) {
    const key = r.startedAt.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    if (days[key] !== undefined) days[key]++;
  }

  return {
    total,
    success,
    failed,
    successRate,
    runsOverTime: Object.entries(days).map(([date, runs]) => ({ date, runs })),
  };
}
