"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function RunsChart() {
  const [data, setData] = useState<{ date: string; runs: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/runs/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((stats) => setData(stats?.runsOverTime ?? []))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-2" style={{ height: 200 }}>
            {Array.from({ length: 7 }).map((_, i) => (
              <Skeleton key={i} className="flex-1" style={{ height: `${40 + Math.random() * 60}%` }} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const max = Math.max(...data.map((d) => d.runs), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Runs Over Time</CardTitle>
        <CardDescription>Daily workflow execution count for the past week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2" style={{ height: 200 }}>
          {data.map((d) => {
            const height = (d.runs / max) * 100;
            return (
              <div key={d.date} className="flex flex-1 flex-col items-center gap-2">
                <span className="text-xs text-muted-foreground">{d.runs}</span>
                <div
                  className="w-full max-w-[40px] rounded-md bg-primary/80 transition-all hover:bg-primary"
                  style={{ height: `${height}%` }}
                />
                <span className="text-xs text-muted-foreground">{d.date}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

export function SuccessFailChart() {
  const [data, setData] = useState<{ success: number; fail: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/runs/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((stats) => {
        if (stats) {
          setData({ success: stats.successRate, fail: 100 - stats.successRate });
        }
      })
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-48" />
        </CardHeader>
        <CardContent className="flex flex-col items-center py-8">
          <Skeleton className="h-40 w-40 rounded-full" />
        </CardContent>
      </Card>
    );
  }

  const success = data?.success ?? 0;
  const fail = data?.fail ?? 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Success Rate</CardTitle>
        <CardDescription>Overall workflow success vs failure rate</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center py-8">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="hsl(var(--muted))" strokeWidth="3" />
            <circle
              cx="18"
              cy="18"
              r="15.9"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              strokeDasharray={`${success} ${fail}`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute text-center">
            <p className="text-2xl font-bold">{success}%</p>
            <p className="text-xs text-muted-foreground">success</p>
          </div>
        </div>
        <div className="mt-6 flex gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-primary" />
            <span>Success ({success}%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-3 w-3 rounded-full bg-muted-foreground/30" />
            <span>Failed ({fail}%)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
