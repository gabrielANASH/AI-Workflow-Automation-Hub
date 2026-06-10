import type { BlockExecutor, BlockResult, ExecutionContext } from "../types";

type Operator = "equals" | "not_equals" | "greater_than" | "less_than" | "contains";

function evaluateCondition(variable: unknown, operator: Operator, value: unknown): boolean {
  switch (operator) {
    case "equals":
      return variable === value;
    case "not_equals":
      return variable !== value;
    case "greater_than":
      return Number(variable) > Number(value);
    case "less_than":
      return Number(variable) < Number(value);
    case "contains": {
      if (typeof variable === "string" && typeof value === "string") {
        return variable.includes(value);
      }
      if (Array.isArray(variable)) {
        return variable.includes(value);
      }
      return false;
    }
    default:
      return false;
  }
}

export const conditionExecutor: BlockExecutor = {
  type: "condition",
  async execute(block, context) {
    const config = block.config;
    const variablePath = (config.variable as string) ?? "";
    const operator = (config.operator as Operator) ?? "equals";
    const value = config.value;

    const variable = variablePath.split(".").reduce((acc: unknown, key: string) => {
      if (acc && typeof acc === "object") return (acc as Record<string, unknown>)[key];
      return undefined;
    }, context.vars as unknown);

    const result = evaluateCondition(variable, operator, value);

    return {
      success: result,
      output: { condition: result, variable, operator, value },
      error: null,
    };
  },
};
