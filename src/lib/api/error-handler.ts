import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { AuthError } from "@/lib/auth/errors";
import { WorkflowError } from "@/lib/workflows/errors";
import { AgentError } from "@/lib/agents/errors";
import { ExecutionError } from "@/lib/execution/errors";
import { AIError } from "@/lib/ai/errors";
import { TemplateError } from "@/lib/templates/errors";
import { logger } from "./logger";

export function handleApiError(
  error: unknown,
  context?: { requestId?: string; path?: string; method?: string },
): NextResponse {
  let status = 500;
  let message = "Internal server error";
  let details: unknown = undefined;

  if (error instanceof ZodError) {
    status = 400;
    message = "Validation failed";
    details = error.issues;
  } else if (error instanceof SyntaxError) {
    status = 400;
    message = "Invalid JSON body";
  } else if (error instanceof AuthError) {
    status = error.statusCode;
    message = error.message;
  } else if (error instanceof WorkflowError) {
    status = error.statusCode;
    message = error.message;
  } else if (error instanceof AgentError) {
    status = error.statusCode;
    message = error.message;
  } else if (error instanceof ExecutionError) {
    status = error.code === "NOT_FOUND" ? 404 : 400;
    message = error.message;
  } else if (error instanceof AIError) {
    status = error.statusCode;
    message = error.message;
  } else if (error instanceof TemplateError) {
    status = error.statusCode;
    message = error.message;
  } else if (error instanceof Error) {
    message = error.message;
  }

  const body: Record<string, unknown> = { error: message };
  if (details) body.details = details;
  if (context?.requestId) body.requestId = context.requestId;

  if (status >= 500) {
    logger.error({ err: error, ...context }, message);
  } else {
    logger.warn({ err: error, ...context }, message);
  }

  return NextResponse.json(body, { status });
}
