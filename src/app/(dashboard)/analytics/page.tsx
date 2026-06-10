"use client";

import { useEffect, useState } from "react";
import { PageHeader } from "@/components/shared/page-header";
import { StatsGrid } from "@/components/analytics/stats-grid";
import { RunsChart, SuccessFailChart } from "@/components/analytics/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

type WorkflowRow = {
  id: string;
  name: string;
  status: string;
  runs: number;
  lastRun: string | null;
};

const statusVariant: Record<string, "success" | "destructive" | "secondary" | "warning"> = {
  active: "success",
  paused: "warning",
  draft: "secondary",
  error: "destructive",
};

export default function AnalyticsPage() {
  const [workflows, setWorkflows] = useState<WorkflowRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/workflows")
      .then((r) => (r.ok ? r.json() : { workflows: [] }))
      .then((data) => setWorkflows(data.workflows ?? []))
      .catch(() => setWorkflows([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Track and analyze your workflow performance"
      />

      <StatsGrid />

      <div className="grid gap-6 lg:grid-cols-2">
        <RunsChart />
        <SuccessFailChart />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Workflow Performance</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Runs</TableHead>
                  <TableHead className="text-right">Last run</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {workflows.map((wf) => (
                  <TableRow key={wf.id}>
                    <TableCell className="font-medium">{wf.name}</TableCell>
                    <TableCell>
                      <Badge variant={statusVariant[wf.status] ?? "secondary"}>
                        {wf.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{wf.runs.toLocaleString()}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {wf.lastRun ?? "Never"}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
