"use client";

import { motion } from "framer-motion";
import {
  Play,
  Brain,
  GitBranch,
  Mail,
  Bell,
  Clock,
  GripVertical,
  Trash2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { WorkflowBlock, BlockType } from "@/components/workflows/workflow-builder";

const blockMeta: Record<BlockType, { icon: React.ElementType; color: string; bg: string; border: string }> = {
  trigger: {
    icon: Play,
    color: "text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-l-emerald-500",
  },
  ai_action: {
    icon: Brain,
    color: "text-violet-600 dark:text-violet-400",
    bg: "bg-violet-500/10",
    border: "border-l-violet-500",
  },
  condition: {
    icon: GitBranch,
    color: "text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-l-amber-500",
  },
  email: {
    icon: Mail,
    color: "text-blue-600 dark:text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-l-blue-500",
  },
  notification: {
    icon: Bell,
    color: "text-rose-600 dark:text-rose-400",
    bg: "bg-rose-500/10",
    border: "border-l-rose-500",
  },
  delay: {
    icon: Clock,
    color: "text-slate-600 dark:text-slate-400",
    bg: "bg-slate-500/10",
    border: "border-l-slate-500",
  },
};

const blockLabels: Record<BlockType, string> = {
  trigger: "Trigger",
  ai_action: "AI Action",
  condition: "Condition",
  email: "Email",
  notification: "Notification",
  delay: "Delay",
};

interface BuilderBlockProps {
  block: WorkflowBlock;
  index: number;
  isSelected: boolean;
  onRemove: () => void;
}

export function BuilderBlock({ block, index, isSelected, onRemove }: BuilderBlockProps) {
  const meta = blockMeta[block.type];
  const Icon = meta.icon;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className={cn(
        "group relative rounded-xl border bg-card shadow-sm transition-all",
        "border-l-[3px]",
        meta.border,
        isSelected && "ring-2 ring-primary/30 shadow-md"
      )}
    >
      <div className="flex items-center gap-3 p-3.5">
        {/* Drag handle */}
        <GripVertical className="h-4 w-4 shrink-0 text-muted-foreground/30 transition-colors group-hover:text-muted-foreground/60" />

        {/* Icon */}
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-lg", meta.bg)}>
          <Icon className={cn("h-4.5 w-4.5", meta.color)} style={{ width: 18, height: 18 }} />
        </div>

        {/* Content */}
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground font-medium">
              {index + 1}. {blockLabels[block.type]}
            </span>
          </div>
          <p className="text-sm font-medium truncate">{block.label}</p>
        </div>

        {/* Config summary */}
        {block.type === "condition" && (
          <Badge variant="outline" className="hidden text-[10px] sm:inline-flex">
            if/else
          </Badge>
        )}

        {/* Delete */}
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 shrink-0 opacity-0 group-hover:opacity-100"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
        >
          <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
        </Button>
      </div>
    </motion.div>
  );
}
