"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

type UsageData = {
  dailyTokens: { date: string; tokens: number }[];
  totalTokens: number;
  cost: number;
  modelBreakdown: { model: string; percentage: number; cost: number }[];
  avgLatency: number;
};

export function AIUsage() {
  const [data, setData] = useState<UsageData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/runs/usage")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setData(d))
      .catch(() => setData(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-4 w-40" />
        </CardHeader>
        <CardContent className="space-y-6">
          <Skeleton className="h-12 w-full" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || data.dailyTokens.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>AI Usage</CardTitle>
          <CardDescription>Token consumption and model costs</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-6">No usage data yet</p>
        </CardContent>
      </Card>
    );
  }

  const { dailyTokens, totalTokens, cost, modelBreakdown, avgLatency } = data;
  const maxDaily = Math.max(...dailyTokens.map((d) => d.tokens), 1);

  return (
    <Card>
      <CardHeader>
        <CardTitle>AI Usage</CardTitle>
        <CardDescription>Token consumption and model costs</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Daily tokens</span>
            <span className="font-medium">{(totalTokens / 1000000).toFixed(1)}M total</span>
          </div>
          <div className="flex items-end gap-1.5" style={{ height: 48 }}>
            {dailyTokens.map((d, i) => (
              <motion.div
                key={d.date}
                initial={{ height: 0 }}
                animate={{ height: `${(d.tokens / maxDaily) * 100}%` }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="flex-1 rounded-sm bg-primary/70"
                style={{ minHeight: 4 }}
              />
            ))}
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            {dailyTokens.map((d) => (
              <span key={d.date}>{d.date}</span>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Total cost</p>
            <p className="mt-1 text-lg font-bold">${cost.toFixed(2)}</p>
          </div>
          <div className="rounded-lg border p-3">
            <p className="text-xs text-muted-foreground">Avg latency</p>
            <p className="mt-1 text-lg font-bold">{avgLatency}s</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Model distribution
          </p>
          {modelBreakdown.map((model) => (
            <div key={model.model} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{model.model}</span>
                <span className="text-muted-foreground">
                  {model.percentage}% (${model.cost.toFixed(2)})
                </span>
              </div>
              <Progress value={model.percentage} className="h-1.5" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
