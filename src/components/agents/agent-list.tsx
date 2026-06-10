"use client";

import { useEffect, useState, useCallback } from "react";
import { AgentCard } from "@/components/agents/agent-card";
import { EmptyState } from "@/components/shared/empty-state";
import { LoadingState } from "@/components/shared/loading-state";
import { Bot, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AgentResponse } from "@/lib/agents/service";

interface AgentListProps {
  loading?: boolean;
  filter?: string;
  refreshKey?: number;
}

export function AgentList({ loading: loadingProp, filter = "all", refreshKey = 0 }: AgentListProps) {
  const [agents, setAgents] = useState<AgentResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAgents = useCallback(() => {
    setLoading(true);
    setError(null);
    fetch("/api/agents")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to fetch agents");
        return r.json();
      })
      .then((data) => setAgents(data.agents))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchAgents();
  }, [fetchAgents, refreshKey]);

  if (loading || loadingProp) return <LoadingState count={4} />;
  if (error) return <p className="text-destructive text-sm">{error}</p>;

  let filtered = agents;
  if (filter !== "all") {
    filtered = agents.filter((a) => a.status === filter);
  }

  if (filtered.length === 0) {
    return (
      <EmptyState
        icon={Bot}
        title="No AI agents"
        description="Deploy your first AI agent to start automating tasks."
        action={
          <Button onClick={() => {}}>
            <Plus className="mr-2 h-4 w-4" /> Deploy agent
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {filtered.map((agent, i) => (
        <AgentCard key={agent.id} agent={agent} index={i} onStatusChange={fetchAgents} />
      ))}
    </div>
  );
}
