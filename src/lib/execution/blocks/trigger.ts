import type { BlockExecutor, BlockResult, ExecutionContext } from "../types";

export const triggerExecutor: BlockExecutor = {
  type: "trigger",
  async execute(block, context) {
    return {
      success: true,
      output: {
        triggeredAt: new Date().toISOString(),
        source: block.config.source ?? "manual",
        eventType: block.config.eventType ?? "manual",
        ticket: "Customer cannot access production dashboard",
      },
      error: null,
    };
  },
};
