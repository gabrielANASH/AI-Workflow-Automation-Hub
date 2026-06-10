import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { logger } from "@/lib/api/logger";

export async function GET() {
  const start = performance.now();
  const checks: Record<string, "ok" | "error"> = {};
  let dbOk = false;

  try {
    await db.$queryRaw`SELECT 1`;
    checks.database = "ok";
    dbOk = true;
  } catch {
    checks.database = "error";
  }

  const elapsed = Math.round((performance.now() - start) * 100) / 100;

  const status = dbOk ? 200 : 503;
  const body = {
    status: dbOk ? "healthy" : "degraded",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    checks,
    responseTimeMs: elapsed,
    version: "1.0.0",
  };

  logger.info({ checks, responseTimeMs: elapsed }, "Health check");

  return NextResponse.json(body, { status });
}
