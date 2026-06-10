"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Play,
  Brain,
  GitBranch,
  Mail,
  Bell,
  Clock,
  Search,
  X,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { BlockType } from "@/components/workflows/workflow-builder";

interface BlockDef {
  type: BlockType;
  label: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}

const blockDefs: BlockDef[] = [
  { type: "trigger", label: "Trigger", description: "Start your workflow on an event", icon: Play, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500/10" },
  { type: "ai_action", label: "AI Action", description: "Process data with an LLM", icon: Brain, color: "text-violet-600 dark:text-violet-400", bg: "bg-violet-500/10" },
  { type: "condition", label: "Condition", description: "Branch based on logic", icon: GitBranch, color: "text-amber-600 dark:text-amber-400", bg: "bg-amber-500/10" },
  { type: "email", label: "Email", description: "Send an email message", icon: Mail, color: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500/10" },
  { type: "notification", label: "Notification", description: "Send a push or Slack alert", icon: Bell, color: "text-rose-600 dark:text-rose-400", bg: "bg-rose-500/10" },
  { type: "delay", label: "Delay", description: "Wait before the next step", icon: Clock, color: "text-slate-600 dark:text-slate-400", bg: "bg-slate-500/10" },
];

interface BuilderSidebarProps {
  onAddBlock: (type: BlockType, label: string) => void;
  onClose: () => void;
}

export function BuilderSidebar({ onAddBlock, onClose }: BuilderSidebarProps) {
  const [search, setSearch] = useState("");

  const filtered = blockDefs.filter(
    (b) =>
      b.label.toLowerCase().includes(search.toLowerCase()) ||
      b.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex h-full w-full flex-col">
      <div className="flex items-center justify-between border-b px-4 py-3">
        <h3 className="text-sm font-semibold">Block Library</h3>
        <Button variant="ghost" size="icon" className="h-7 w-7 lg:hidden" onClick={onClose}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search blocks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-8 pl-8 text-xs"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-3">
        <div className="space-y-1.5">
          {filtered.map((def, i) => (
            <motion.button
              key={def.type}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.03 }}
              onClick={() => onAddBlock(def.type, `New ${def.label}`)}
              className="group flex w-full items-start gap-3 rounded-lg border border-transparent p-2.5 text-left transition-all hover:border-border hover:bg-accent"
            >
              <div className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-lg", def.bg)}>
                <def.icon className={cn("h-4 w-4", def.color)} />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{def.label}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">{def.description}</p>
              </div>
              <Plus className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
