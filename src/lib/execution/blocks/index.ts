import type { BlockExecutor } from "../types";
import { triggerExecutor } from "./trigger";
import { aiActionExecutor } from "./ai-action";
import { conditionExecutor } from "./condition";
import { emailExecutor } from "./email";
import { notificationExecutor } from "./notification";
import { delayExecutor } from "./delay";

const executorMap: Record<string, BlockExecutor> = {
  trigger: triggerExecutor,
  ai_action: aiActionExecutor,
  condition: conditionExecutor,
  email: emailExecutor,
  notification: notificationExecutor,
  delay: delayExecutor,
};

export function getExecutor(type: string): BlockExecutor | undefined {
  return executorMap[type];
}

export function getAvailableTypes(): string[] {
  return Object.keys(executorMap);
}
