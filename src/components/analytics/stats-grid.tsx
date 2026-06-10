"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Activity, CheckCircle2, Workflow, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export function StatsGrid() {
  const [data, setData] = useState<{
    totalWorkflows: number;
    activeWorkflows: number;
    totalRuns: number;
    successRate: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/runs/stats").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/workflows").then((r) => (r.ok ? r.json() : { workflows: [] })),
    ])
      .then(([runStats, workflowsData]) => {
        const workflows = workflowsData?.workflows ?? [];
        const activeWf = workflows.filter((w: { status: string }) => w.status === "active").length;
        setData({
          totalWorkflows: workflows.length,
          activeWorkflows: activeWf,
          totalRuns: runStats?.total ?? 0,
          successRate: runStats?.successRate ?? 0,
        });
      })
      .catch(() => setData({ totalWorkflows: 0, activeWorkflows: 0, totalRuns: 0, successRate: 0 }))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const stats = [
    { label: "Total Workflows", value: data!.totalWorkflows, icon: Workflow, color: "text-blue-500" },
    { label: "Active Workflows", value: data!.activeWorkflows, icon: Activity, color: "text-emerald-500" },
    { label: "Total Runs", value: data!.totalRuns.toLocaleString(), icon: Zap, color: "text-amber-500" },
    { label: "Success Rate", value: `${data!.successRate}%`, icon: CheckCircle2, color: "text-primary" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, i) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
        >
          <Card>
            <CardHeader className="flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
              <stat.icon className={cn("h-4 w-4", stat.color)} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
