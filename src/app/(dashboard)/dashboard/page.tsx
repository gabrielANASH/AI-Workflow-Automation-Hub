"use client";

import { useEffect, useState } from "react";
import { Workflow, Zap, Activity, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { WorkflowRunsChart } from "@/components/dashboard/workflow-runs-chart";
import { AIUsage } from "@/components/dashboard/ai-usage";
import { ActiveAgents } from "@/components/dashboard/active-agents";
import { SuccessRate } from "@/components/dashboard/success-rate";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardPage() {
  const [stats, setStats] = useState<{
    total: number;
    success: number;
    failed: number;
    successRate: number;
    runsOverTime: { date: string; runs: number }[];
  } | null>(null);
  const [workflowCount, setWorkflowCount] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/runs/stats").then((r) => (r.ok ? r.json() : null)),
      fetch("/api/workflows").then((r) => (r.ok ? r.json() : { workflows: [] })),
      fetch("/api/agents").then((r) => (r.ok ? r.json() : { agents: [] })),
    ])
      .then(([runStats, workflowsData]) => {
        if (runStats) setStats(runStats);
        if (workflowsData?.workflows) {
          setWorkflowCount(workflowsData.workflows.length);
          setActiveCount(workflowsData.workflows.filter((w: { status: string }) => w.status === "active").length);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const totalRuns = stats?.total ?? 0;
  const successRate = stats?.successRate ?? 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Dashboard" description="Overview of your workflows and activity" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-xl border p-6 space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your workflows and activity"
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard
          icon={Workflow}
          label="Total Workflows"
          value={workflowCount}
          change={`${activeCount} active`}
          changeType="positive"
          subtitle="Across all projects"
        />
        <StatCard
          icon={Activity}
          label="Active Workflows"
          value={activeCount}
          change={workflowCount > 0 ? `${Math.round((activeCount / workflowCount) * 100)}% active` : "0% active"}
          changeType="positive"
          subtitle="Running continuously"
        />
        <StatCard
          icon={Zap}
          label="Total Runs"
          value={totalRuns.toLocaleString()}
          change={`${stats?.success ?? 0} succeeded`}
          changeType="positive"
          subtitle="All-time executions"
        />
        <StatCard
          icon={CheckCircle2}
          label="Success Rate"
          value={`${successRate}%`}
          change={`${stats?.failed ?? 0} failed`}
          changeType={successRate >= 80 ? "positive" : "negative"}
          subtitle="All-time"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <WorkflowRunsChart runsOverTime={stats?.runsOverTime} />
        </div>
        <SuccessRate successRate={successRate} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <AIUsage />
        <ActiveAgents />
        <div className="space-y-6">
          <ActivityFeed />
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
