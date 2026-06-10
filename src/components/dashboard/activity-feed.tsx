"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2, AlertTriangle, XCircle, Sparkles, FileText, Settings } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { RunResponse } from "@/lib/execution";

const statusConfig: Record<string, { icon: typeof CheckCircle2; color: string; bg: string }> = {
  success: { icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  running: { icon: Sparkles, color: "text-blue-500", bg: "bg-blue-500/10" },
  failed: { icon: XCircle, color: "text-red-500", bg: "bg-red-500/10" },
  pending: { icon: AlertTriangle, color: "text-amber-500", bg: "bg-amber-500/10" },
};

const typeIcon: Record<string, typeof CheckCircle2> = {
  success: Sparkles,
  running: Sparkles,
  failed: XCircle,
  pending: AlertTriangle,
};

export function ActivityFeed() {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Latest workflow executions</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
          </div>
        ) : runs.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No runs yet</p>
        ) : (
          <div className="space-y-1">
            {runs.slice(0, 5).map((run, i) => (
              <ActivityItem key={run.id} run={run} index={i} />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ActivityItem({ run, index }: { run: RunResponse; index: number }) {
  const router = useRouter();
  const config = statusConfig[run.status] ?? statusConfig.pending;
  const Icon = config.icon;

  const timeAgo = getTimeAgo(new Date(run.startedAt));
  const label = run.workflowName ?? "Workflow";

  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="group flex cursor-pointer items-start gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50"
      onClick={() => router.push(`/runs/${run.id}`)}
    >
      <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full", config.bg)}>
        <Icon className={cn("h-4 w-4", config.color)} />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-sm leading-snug capitalize">
          {label} — <span className="text-muted-foreground">{run.status}</span>
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{timeAgo}</p>
      </div>
    </motion.div>
  );
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
