"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface SuccessRateProps {
  successRate?: number;
}

export function SuccessRate({ successRate = 0 }: SuccessRateProps) {
  const circumference = 2 * Math.PI * 60;
  const offset = circumference - (successRate / 100) * circumference;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Success Rate</CardTitle>
        <CardDescription>Overall workflow execution success</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative flex items-center justify-center"
        >
          <svg width="160" height="160" viewBox="0 0 160 160">
            <circle
              cx="80"
              cy="80"
              r="60"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="10"
            />
            <motion.circle
              cx="80"
              cy="80"
              r="60"
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="10"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: offset }}
              transition={{ duration: 1.2, ease: "easeOut" }}
              transform="rotate(-90 80 80)"
            />
          </svg>
          <div className="absolute text-center">
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-3xl font-bold"
            >
              {successRate}%
            </motion.p>
            <p className="text-xs text-muted-foreground">success rate</p>
          </div>
        </motion.div>

        <div className="mt-6 grid w-full grid-cols-2 gap-4">
          <div className="rounded-lg border p-3 text-center">
            <p className="text-lg font-bold">{100 - successRate}%</p>
            <p className="text-xs text-muted-foreground">Failure rate</p>
          </div>
          <div className="rounded-lg border p-3 text-center">
            <p className="text-lg font-bold">-</p>
            <p className="text-xs text-muted-foreground">Avg run time</p>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 rounded-full bg-emerald-500/10 px-3 py-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
          <TrendingUp className="h-3.5 w-3.5" />
          Real-time from execution data
        </div>
      </CardContent>
    </Card>
  );
}
