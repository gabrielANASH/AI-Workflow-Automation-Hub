"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  ClipboardList,
  FileText,
  Search,
  PenTool,
  Plus,
  Loader2,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingState } from "@/components/shared/loading-state";
import { EmptyState } from "@/components/shared/empty-state";

const iconMap: Record<string, typeof ClipboardList> = {
  "clipboard-list": ClipboardList,
  "file-text": FileText,
  search: Search,
  "pen-tool": PenTool,
};

const categoryColors: Record<string, string> = {
  productivity: "bg-blue-500/10 text-blue-600",
  sales: "bg-green-500/10 text-green-600",
  research: "bg-purple-500/10 text-purple-600",
  marketing: "bg-orange-500/10 text-orange-600",
};

type TemplateItem = {
  id: string;
  name: string;
  description: string | null;
  category: string;
  icon: string;
  trigger: string | null;
  steps: number;
  isBuiltIn: boolean;
  usageCount: number;
  createdAt: string;
};

interface TemplateGalleryProps {
  onSelect: (templateId: string) => void;
  onStartBlank: () => void;
}

export function TemplateGallery({ onSelect, onStartBlank }: TemplateGalleryProps) {
  const router = useRouter();
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTemplates() {
      try {
        const res = await fetch("/api/templates");
        if (!res.ok) throw new Error("Failed to load templates");
        const data = await res.json();
        setTemplates(data.templates);
      } catch {
        // silent
      } finally {
        setLoading(false);
      }
    }
    fetchTemplates();
  }, []);

  async function handleUseTemplate(templateId: string) {
    setCreating(templateId);
    try {
      const res = await fetch(`/api/templates/${templateId}`, { method: "POST" });
      if (!res.ok) throw new Error("Failed to duplicate template");
      const data = await res.json();
      router.push(`/workflows/${data.workflowId}`);
      router.refresh();
    } catch {
      setCreating(null);
    }
  }

  if (loading) return <LoadingState count={4} />;

  if (templates.length === 0) {
    return (
      <EmptyState
        icon={Sparkles}
        title="No templates available"
        description="Templates will appear here once you create them."
        action={
          <Button onClick={onStartBlank}>
            <Plus className="mr-2 h-4 w-4" /> Start from scratch
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Start from a template</h2>
          <p className="text-sm text-muted-foreground">
            Choose a pre-built workflow to get started quickly
          </p>
        </div>
        <Button variant="outline" onClick={onStartBlank}>
          <Plus className="mr-2 h-4 w-4" /> Blank workflow
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {templates.map((t, i) => {
          const Icon = iconMap[t.icon] ?? FileText;
          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="group transition-colors hover:border-primary/50">
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 space-y-1">
                      <CardTitle className="text-base">{t.name}</CardTitle>
                      <CardDescription>{t.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-3 text-sm">
                    <Badge
                      variant="secondary"
                      className={categoryColors[t.category] ?? ""}
                    >
                      {t.category}
                    </Badge>
                    <span className="text-muted-foreground">{t.steps} steps</span>
                    {t.trigger && (
                      <span className="text-muted-foreground capitalize">
                        {t.trigger}
                      </span>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={() => handleUseTemplate(t.id)}
                    disabled={creating === t.id}
                  >
                    {creating === t.id ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Plus className="mr-2 h-4 w-4" />
                    )}
                    {creating === t.id ? "Creating..." : "Use this template"}
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
