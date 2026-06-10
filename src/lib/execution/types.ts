import type { BlockType } from "@/components/workflows/workflow-builder";

export type ExecutionStatus = "pending" | "running" | "success" | "failed";

export interface ExecutionLog {
  stepId: string;
  stepType: BlockType;
  stepLabel: string;
  status: ExecutionStatus;
  startedAt: string;
  completedAt: string | null;
  input: Record<string, unknown> | null;
  output: unknown;
  error: string | null;
}

export interface ExecutionContext {
  workflowId: string;
  runId: string;
  userId: string;
  input: Record<string, unknown>;
  logs: ExecutionLog[];
  vars: Record<string, unknown>;
}

export interface BlockResult {
  success: boolean;
  output: unknown;
  error: string | null;
}

export interface BlockExecutor {
  type: BlockType;
  execute(
    block: { id: string; type: BlockType; label: string; config: Record<string, unknown> },
    context: ExecutionContext,
  ): Promise<BlockResult>;
}

export type BlockConfig = Record<string, unknown>;
