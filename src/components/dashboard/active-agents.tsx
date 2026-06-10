"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Bot, MoreHorizontal } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import type { AgentResponse } from "@/lib/agents/service";

const statusColor: Record<string, string> = {
  active: "bg-emerald-500",
  training: "bg-amber-500",
  inactive: "bg-muted-foreground",
  error: "bg-destructive",
};

export function ActiveAgents() {
  const [agents, setAgents] = useState<AgentResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/agents")
      .then((r) => (r.ok ? r.json() : []))
      .then((data) => setAgents(data.agents ?? []))
      .catch(() => setAgents([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>AI Agents</CardTitle>
          <CardDescription>Status of your deployed agents</CardDescription>
        </div>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {loading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
              <Skeleton className="h-9 w-9 rounded-lg" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-36" />
              </div>
              <Skeleton className="h-5 w-14 rounded-full" />
            </div>
          ))
        ) : agents.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-6">No agents deployed</p>
        ) : (
          agents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="group flex items-center gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Bot className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium truncate">{agent.name}</span>
                  <div className={cn("h-2 w-2 shrink-0 rounded-full", statusColor[agent.status])} />
                </div>
                <p className="text-xs text-muted-foreground">
                  {agent.tasks.toLocaleString()} tasks &middot; {agent.accuracy}% acc
                </p>
              </div>
              <Badge variant={agent.status === "active" ? "success" : agent.status === "training" ? "warning" : "secondary"} className="text-[10px]">
                {agent.status}
              </Badge>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
