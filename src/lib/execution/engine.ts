import { getExecutor } from "./blocks";
import { normalizeAiOutput } from "./normalize";
import type { ExecutionContext, ExecutionLog } from "./types";
import type { WorkflowBlock } from "@/components/workflows/workflow-builder";

export interface EngineResult {
  success: boolean;
  logs: ExecutionLog[];
  output: Record<string, unknown>;
  error: string | null;
}

export async function executeWorkflow(
  workflowId: string,
  runId: string,
  userId: string,
  steps: WorkflowBlock[],
  input: Record<string, unknown>,
): Promise<EngineResult> {
  const context: ExecutionContext = {
    workflowId,
    runId,
    userId,
    input,
    logs: [],
    vars: { ...input },
  };

  const logs: ExecutionLog[] = [];
  let overallSuccess = true;

  for (const block of steps) {
    const executor = getExecutor(block.type);
    if (!executor) {
      const log: ExecutionLog = {
        stepId: block.id,
        stepType: block.type,
        stepLabel: block.label,
        status: "failed",
        startedAt: new Date().toISOString(),
        completedAt: new Date().toISOString(),
        input: block.config,
        output: null,
        error: `No executor found for block type "${block.type}"`,
      };
      logs.push(log);
      overallSuccess = false;
      break;
    }

    const startedAt = new Date().toISOString();
    let log: ExecutionLog;

    try {
      const result = await executor.execute(block, context);

      if (result.success) {
        context.vars[block.id] = result.output;
        if (block.type === "trigger" && result.output && typeof result.output === "object") {
          context.vars.trigger = result.output;
        }
        if (block.type === "ai_action" && result.output && typeof result.output === "object") {
          const out = result.output as Record<string, unknown>;
          if (typeof out.content === "string") {
            context.vars.lastAiResponse = out.content;
            const parsed = normalizeAiOutput(out.content);
            if (parsed) {
              Object.assign(context.vars, parsed);
            }
          }
        }
      }

      log = {
        stepId: block.id,
        stepType: block.type,
        stepLabel: block.label,
        status: result.success ? "success" : "failed",
        startedAt,
        completedAt: new Date().toISOString(),
        input: block.config,
        output: result.output,
        error: result.error,
      };

      if (!result.success) {
        overallSuccess = false;
        logs.push(log);
        break;
      }
    } catch (err) {
      log = {
        stepId: block.id,
        stepType: block.type,
        stepLabel: block.label,
        status: "failed",
        startedAt,
        completedAt: new Date().toISOString(),
        input: block.config,
        output: null,
        error: err instanceof Error ? err.message : "Unknown execution error",
      };
      overallSuccess = false;
      logs.push(log);
      break;
    }

    logs.push(log);
  }

  return {
    success: overallSuccess,
    logs,
    output: context.vars,
    error: overallSuccess ? null : (logs.find((l) => l.status === "failed")?.error ?? "Execution failed"),
  };
}
