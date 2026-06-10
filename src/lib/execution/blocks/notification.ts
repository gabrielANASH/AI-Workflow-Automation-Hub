import type { BlockExecutor, BlockResult, ExecutionContext } from "../types";

export const notificationExecutor: BlockExecutor = {
  type: "notification",
  async execute(block, context) {
    const config = block.config;
    const channel = (config.channel as string) ?? "slack";
    const message = (config.message as string) ?? "";

    const resolvedMessage = resolveTemplate(message, context.vars);

    return {
      success: true,
      output: {
        channel,
        message: resolvedMessage,
        sentAt: new Date().toISOString(),
      },
      error: null,
    };
  },
};

function resolveTemplate(template: string, vars: Record<string, unknown>): string {
  return template.replace(/\{\{(\w+(?:\.\w+)*)\}\}/g, (_, path) => {
    const val = path.split(".").reduce((acc: unknown, key: string) => {
      if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
      return undefined;
    }, vars as unknown);
    return val !== undefined ? String(val) : `{{${path}}}`;
  });
}
