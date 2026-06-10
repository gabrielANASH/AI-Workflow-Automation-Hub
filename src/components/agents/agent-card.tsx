"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Play, Square, RotateCcw, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { AgentResponse as Agent } from "@/lib/agents/service";

interface AgentCardProps {
  agent: Agent;
  index?: number;
  onStatusChange?: () => void;
}

const actionConfig: Record<string, { icon: typeof Play; label: string; variant: "default" | "outline" | "destructive" } | null> = {
  inactive: { icon: Play, label: "Deploy", variant: "default" },
  active: { icon: Square, label: "Undeploy", variant: "outline" },
  error: { icon: RotateCcw, label: "Retry", variant: "destructive" },
  training: null,
};

export function AgentCard({ agent, index = 0, onStatusChange }: AgentCardProps) {
  const [pending, setPending] = useState(false);

  useEffect(() => {
    setPending(false);
  }, [agent.status]);

  const action = actionConfig[agent.status] ?? null;

  async function handleAction() {
    const isActive = agent.status === "active";
    setPending(true);
    try {
      const method = isActive ? "DELETE" : "POST";
      const res = await fetch(`/api/agents/${agent.id}/deploy`, { method });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Action failed");
      }
      toast.success(isActive ? "Agent undeployed" : "Agent deployed");
      onStatusChange?.();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Action failed");
      setPending(false);
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
    >
      <Card className="transition-colors hover:border-primary/50 h-full">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <CardTitle className="text-base">{agent.name}</CardTitle>
              <CardDescription>{agent.description}</CardDescription>
            </div>
            <div
              className={cn(
                "h-2.5 w-2.5 rounded-full shrink-0 mt-1.5",
                agent.status === "active" && "bg-emerald-500",
                agent.status === "training" && "bg-amber-500 animate-pulse",
                agent.status === "inactive" && "bg-muted-foreground",
                agent.status === "error" && "bg-destructive"
              )}
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-1.5">
            {agent.capabilities.map((cap) => (
              <Badge key={cap} variant="secondary" className="text-xs">
                {cap}
              </Badge>
            ))}
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Accuracy</span>
              <span className="font-medium">{agent.accuracy}%</span>
            </div>
            <Progress value={agent.accuracy} className="h-1.5" />

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Model: {agent.model}</span>
              <span>{agent.tasks.toLocaleString()} tasks</span>
            </div>
          </div>

          {action && (
            <Button
              size="sm"
              className="w-full"
              variant={action.variant}
              onClick={handleAction}
              disabled={pending}
            >
              {pending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <action.icon className="mr-2 h-4 w-4" />
              )}
              {pending ? `${action.label}ing...` : action.label}
            </Button>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
