"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sparkles,
  Timer,
  Coins,
  Zap,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/shared/page-header";
import { LoadingState } from "@/components/shared/loading-state";
import { EmptyState } from "@/components/shared/empty-state";
import type { RunResponse } from "@/lib/execution";

const statusBadge: Record<string, "success" | "warning" | "secondary" | "destructive"> = {
  success: "success",
  running: "warning",
  pending: "secondary",
  failed: "destructive",
  cancelled: "secondary",
};

const statusIcon: Record<string, typeof CheckCircle2> = {
  success: CheckCircle2,
  running: Sparkles,
  pending: AlertTriangle,
  failed: XCircle,
  cancelled: XCircle,
};

export default function RunsPage() {
  const router = useRouter();
  const [runs, setRuns] = useState<RunResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/runs")
      .then((r) => (r.ok ? r.json() : { runs: [] }))
      .then((data) => setRuns(data.runs ?? []))
      .catch(() => setRuns([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <LoadingState count={4} />;

  if (runs.length === 0) {
    return (
      <div className="space-y-6">
        <PageHeader title="Runs" description="History of all workflow executions" />
        <EmptyState
          icon={Zap}
          title="No runs yet"
          description="Run a workflow to see execution history here."
          action={
            <Button onClick={() => router.push("/workflows")}>View workflows</Button>
          }
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Runs"
        description="History of all workflow executions"
      />

      <div className="space-y-3">
        {runs.map((run, i) => {
          const Icon = statusIcon[run.status] ?? AlertTriangle;
          const outputData = run.output as { logs?: unknown[] } | null;
          const stepCount = outputData?.logs?.length ?? 0;
          const duration = run.durationMs ? formatDuration(run.durationMs) : "--";
          const timeAgo = getTimeAgo(new Date(run.startedAt));

          return (
            <motion.div
              key={run.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card
                className="cursor-pointer transition-colors hover:border-primary/50"
                onClick={() => router.push(`/runs/${run.id}`)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${
                        run.status === "success"
                          ? "bg-emerald-500/10"
                          : run.status === "failed"
                          ? "bg-red-500/10"
                          : "bg-blue-500/10"
                      }`}
                    >
                      <Icon
                        className={`h-4 w-4 ${
                          run.status === "success"
                            ? "text-emerald-500"
                            : run.status === "failed"
                            ? "text-red-500"
                            : "text-blue-500"
                        }`}
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {run.workflowName ?? "Workflow"}
                        </span>
                        <Badge variant={statusBadge[run.status] ?? "secondary"}>
                          {run.status}
                        </Badge>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                        <span>{timeAgo}</span>
                        <span className="flex items-center gap-1">
                          <Timer className="h-3 w-3" />
                          {duration}
                        </span>
                        {stepCount > 0 && (
                          <span className="flex items-center gap-1">
                            <Zap className="h-3 w-3" />
                            {stepCount} steps
                          </span>
                        )}
                      </div>
                    </div>

                    <ArrowRight className="h-4 w-4 text-muted-foreground" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
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

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}
