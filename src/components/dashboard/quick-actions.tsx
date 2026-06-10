"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Play, FileText, Bot, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const actions = [
  {
    icon: Plus,
    label: "New workflow",
    description: "Create from scratch or use a template",
    href: "/workflows/create",
    gradient: "from-violet-500/10 to-violet-500/5",
    iconColor: "text-violet-500",
  },
  {
    icon: Bot,
    label: "Deploy agent",
    description: "Add a new AI agent to your team",
    href: "/agents",
    gradient: "from-blue-500/10 to-blue-500/5",
    iconColor: "text-blue-500",
  },
  {
    icon: Play,
    label: "Run all workflows",
    description: "Trigger all active workflows",
    href: "#",
    gradient: "from-emerald-500/10 to-emerald-500/5",
    iconColor: "text-emerald-500",
  },
  {
    icon: FileText,
    label: "View reports",
    description: "Check analytics and performance",
    href: "/analytics",
    gradient: "from-amber-500/10 to-amber-500/5",
    iconColor: "text-amber-500",
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>Common tasks and shortcuts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2">
          {actions.map((action, i) => (
            <motion.div
              key={action.label}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={action.href}
                className="group relative flex flex-col gap-2 overflow-hidden rounded-lg border p-4 transition-all hover:border-primary/30 hover:shadow-sm"
              >
                <div className={`absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100 ${action.gradient}`} />
                <div className="relative z-10 flex items-center gap-3">
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg bg-background border ${action.iconColor}`}>
                    <action.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{action.label}</p>
                    <p className="text-xs text-muted-foreground">{action.description}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
