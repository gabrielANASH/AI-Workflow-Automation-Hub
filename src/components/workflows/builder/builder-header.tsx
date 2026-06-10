"use client";

import { useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Save, Play, Loader2, Check, Menu, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface BuilderHeaderProps {
  workflowName: string;
  onNameChange: (name: string) => void;
  onSave: () => void;
  saving: boolean;
  lastSaved: Date | null;
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  onRun?: () => void;
  running?: boolean;
  workflowHasSteps?: boolean;
}

export function BuilderHeader({
  workflowName,
  onNameChange,
  onSave,
  saving,
  lastSaved,
  onToggleSidebar,
  sidebarOpen,
  onRun,
  running,
  workflowHasSteps,
}: BuilderHeaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <header className="flex items-center gap-3 border-b px-4 py-2.5 lg:px-6">
      <Button variant="ghost" size="icon" asChild className="shrink-0">
        <Link href="/workflows">
          <ArrowLeft className="h-4 w-4" />
        </Link>
      </Button>

      <Input
        ref={inputRef}
        value={workflowName}
        onChange={(e) => onNameChange(e.target.value)}
        className="h-8 max-w-[280px] border-transparent bg-transparent px-2 text-base font-semibold hover:border-border focus:border-border"
      />

      <div className="flex flex-1 items-center justify-end gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleSidebar}
          className="gap-1.5 text-xs lg:hidden"
        >
          <Menu className="h-3.5 w-3.5" />
          Blocks
        </Button>

        {lastSaved && (
          <span className="hidden text-xs text-muted-foreground sm:inline">
            Saved {lastSaved.toLocaleTimeString()}
          </span>
        )}

        {onRun && (
          <Button
            variant="default"
            size="sm"
            onClick={onRun}
            disabled={running || !workflowHasSteps}
            className="gap-1.5"
          >
            {running ? (
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Play className="h-3.5 w-3.5" />
            )}
            {running ? "Running..." : "Run"}
          </Button>
        )}

        <Button
          size="sm"
          onClick={onSave}
          disabled={saving}
          className="gap-1.5"
        >
          {saving ? (
            <>
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-3.5 w-3.5" />
              Save
            </>
          )}
        </Button>
      </div>
    </header>
  );
}
