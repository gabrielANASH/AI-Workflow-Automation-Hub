import { NextResponse } from "next/server";
import { verifySession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { handleApiError } from "@/lib/api/error-handler";

export async function GET() {
  try {
    const payload = await verifySession();

    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);

    const logs = await db.usageLog.findMany({
      where: {
        userId: payload.userId,
        usageType: "ai_token",
        recordedAt: { gte: sevenDaysAgo },
      },
      orderBy: { recordedAt: "asc" },
    });

    const dayLabels: string[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now.getTime() - i * 86400000);
      dayLabels.push(d.toLocaleDateString("en-US", { weekday: "short" }));
    }

    const dailyTokens = dayLabels.map((label) => {
      const dayIndex = 6 - dayLabels.indexOf(label);
      const dayStart = new Date(now.getTime() - dayIndex * 86400000);
      const dayEnd = new Date(dayStart.getTime() + 86400000);
      const tokens = logs
        .filter((l) => l.recordedAt >= dayStart && l.recordedAt < dayEnd)
        .reduce((sum, l) => sum + l.quantity, 0);
      return { date: label, tokens };
    });

    const totalTokens = logs.reduce((sum, l) => sum + l.quantity, 0);
    const totalCost = logs.reduce((sum, l) => sum + Number(l.cost), 0);

    const modelMap = new Map<string, { tokens: number; cost: number; count: number; totalDuration: number }>();
    for (const log of logs) {
      const meta = log.metadata as {
        model?: string;
        durationMs?: number;
      } | null;
      const model = meta?.model ?? "unknown";
      const entry = modelMap.get(model) ?? { tokens: 0, cost: 0, count: 0, totalDuration: 0 };
      entry.tokens += log.quantity;
      entry.cost += Number(log.cost);
      entry.count += 1;
      entry.totalDuration += meta?.durationMs ?? 0;
      modelMap.set(model, entry);
    }

    const totalModelTokens = Array.from(modelMap.values()).reduce((s, e) => s + e.tokens, 0);
    const totalModelCount = Array.from(modelMap.values()).reduce((s, e) => s + e.count, 0);
    const avgLatency =
      totalModelCount > 0
        ? Math.round((Array.from(modelMap.values()).reduce((s, e) => s + e.totalDuration, 0) / totalModelCount) * 10) / 10000
        : 0;

    const modelBreakdown = Array.from(modelMap.entries()).map(([model, data]) => ({
      model,
      percentage: totalModelTokens > 0 ? Math.round((data.tokens / totalModelTokens) * 100) : 0,
      cost: parseFloat(data.cost.toFixed(4)),
    }));

    return NextResponse.json({
      dailyTokens,
      totalTokens,
      cost: parseFloat(totalCost.toFixed(4)),
      modelBreakdown,
      avgLatency,
    });
  } catch (error) {
    return handleApiError(error);
  }
}
