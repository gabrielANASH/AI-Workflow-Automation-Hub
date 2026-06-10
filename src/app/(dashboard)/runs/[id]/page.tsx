"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Timer,
  Coins,
  Zap,
  ArrowLeft,
  Activity,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { PageHeader } from "@/components/shared/page-header";
import type { RunDetailResponse } from "@/lib/execution";

const statusConfig: Record<string, { color: string; bg: string; label: string }> = {
  success: { color: "text-emerald-500", bg: "bg-emerald-500/10", label: "Success" },
  running: { color: "text-blue-500", bg: "bg-blue-500/10", label: "Running" },
  pending: { color: "text-amber-500", bg: "bg-amber-500/10", label: "Pending" },
  failed: { color: "text-red-500", bg: "bg-red-500/10", label: "Failed" },
  cancelled: { color: "text-gray-500", bg: "bg-gray-500/10", label: "Cancelled" },
};

export default function RunDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [run, setRun] = useState<RunDetailResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!params.id) return;
    fetch(`/api/runs/${params.id}`)
      .then(async (r) => {
        if (!r.ok) throw new Error("Failed to load run");
        const data = await r.json();
        setRun(data.run);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28 rounded-xl" />
          ))}
        </div>
        <Skeleton className="h-64 rounded-xl" />
      </div>
    );
  }

  if (error || !run) {
    return (
      <div className="space-y-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Card>
          <CardContent className="flex flex-col items-center py-16">
            <XCircle className="h-10 w-10 text-red-500" />
            <p className="mt-4 text-sm text-muted-foreground">{error ?? "Run not found"}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const status = statusConfig[run.status] ?? statusConfig.pending;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <PageHeader
          title={run.workflowName ?? "Run Detail"}
          description={`Started ${new Date(run.startedAt).toLocaleString()}`}
          action={
            <Badge className={`${status.bg} ${status.color} border-0`}>
              {status.label}
            </Badge>
          }
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
        <MetricCard
          icon={Activity}
          label="Run Status"
          value={run.status.charAt(0).toUpperCase() + run.status.slice(1)}
          subtext={run.id.slice(0, 8)}
          color="text-blue-500"
        />

        <MetricCard
          icon={CheckCircle2}
          label="Completion"
          value={run.status === "success" ? "100%" : run.status === "failed" ? "0%" : "--"}
          subtext={run.errorMessage ? "With errors" : "Clean"}
          color={run.status === "success" ? "text-emerald-500" : run.status === "failed" ? "text-red-500" : "text-amber-500"}
        />

        <MetricCard
          icon={Zap}
          label="Token Usage"
          value={run.metrics.totalTokens.toLocaleString()}
          subtext={run.metrics.stepCount > 0 ? `Across ${run.metrics.stepCount} steps` : "No AI calls"}
          color="text-purple-500"
        />

        <MetricCard
          icon={Timer}
          label="Execution Time"
          value={formatDuration(run.metrics.totalDurationMs)}
          subtext={"Avg " + formatShortDuration(run.metrics.avgStepDurationMs) + " per step"}
          color="text-orange-500"
        />

        <MetricCard
          icon={DollarSign}
          label="Cost Estimate"
          value={`$${run.metrics.totalCost.toFixed(4)}`}
          subtext={run.metrics.totalTokens > 0 ? `${(run.metrics.totalCost / run.metrics.totalTokens * 1000).toFixed(6)}/1K tokens` : "No cost"}
          color="text-green-500"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Execution Steps</CardTitle>
          <CardDescription>{run.metrics.stepCount} step(s) in this run</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {run.steps.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted-foreground">No step logs available</p>
            ) : (
              run.steps.map((step, i) => {
                const stepDuration = step.completedAt
                  ? new Date(step.completedAt).getTime() - new Date(step.startedAt).getTime()
                  : null;
                return (
                  <div
                    key={step.stepId}
                    className="rounded-lg border p-4 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                          {i + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium capitalize">
                            {step.stepLabel}
                          </p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {step.stepType}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {stepDuration !== null && (
                          <span className="flex items-center gap-1">
                            <Timer className="h-3 w-3" />
                            {formatShortDuration(stepDuration)}
                          </span>
                        )}
                        <Badge
                          variant={step.status === "success" ? "success" : step.status === "failed" ? "destructive" : "secondary"}
                          className="text-[10px]"
                        >
                          {step.status}
                        </Badge>
                      </div>
                    </div>
                    {step.error && (
                      <p className="mt-2 text-xs text-red-500">{step.error}</p>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>

      {run.output ? (
        <Card>
          <CardHeader>
            <CardTitle>Raw Output</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="max-h-96 overflow-auto rounded-lg bg-muted p-4 text-xs">
              {JSON.stringify(run.output, null, 2)}
            </pre>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  subtext,
  color,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  subtext: string;
  color: string;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <p className="text-xs text-muted-foreground">{label}</p>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
        <p className="mt-2 text-xl font-bold">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground truncate">{subtext}</p>
      </CardContent>
    </Card>
  );
}

function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  const seconds = ms / 1000;
  if (seconds < 60) return `${seconds.toFixed(1)}s`;
  const minutes = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${minutes}m ${secs}s`;
}

function formatShortDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}
