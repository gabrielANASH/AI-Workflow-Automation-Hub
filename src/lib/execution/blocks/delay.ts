import type { BlockExecutor, BlockResult, ExecutionContext } from "../types";

export const delayExecutor: BlockExecutor = {
  type: "delay",
  async execute(block, context) {
    const config = block.config;
    const duration = (config.duration as number) ?? 1;
    const unit = (config.unit as string) ?? "seconds";

    const ms = unit === "minutes" ? duration * 60000
      : unit === "hours" ? duration * 3600000
      : duration * 1000;

    if (ms > 0) {
      await new Promise((resolve) => setTimeout(resolve, ms));
    }

    return {
      success: true,
      output: { duration, unit, delayedMs: ms },
      error: null,
    };
  },
};
