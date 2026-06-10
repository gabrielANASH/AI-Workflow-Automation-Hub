import type { BlockExecutor, BlockResult, ExecutionContext } from "../types";

export const emailExecutor: BlockExecutor = {
  type: "email",
  async execute(block, context) {
    const config = block.config;
    const to = (config.to as string) ?? "";
    const subject = (config.subject as string) ?? "";
    const body = (config.body as string) ?? "";

    const resolvedTo = resolveTemplate(to, context.vars);
    const resolvedSubject = resolveTemplate(subject, context.vars);
    const resolvedBody = resolveTemplate(body, context.vars);

    return {
      success: true,
      output: {
        to: resolvedTo,
        subject: resolvedSubject,
        body: resolvedBody,
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
