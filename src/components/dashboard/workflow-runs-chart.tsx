"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface WorkflowRunsChartProps {
  runsOverTime?: { date: string; runs: number }[];
}

export function WorkflowRunsChart({ runsOverTime }: WorkflowRunsChartProps) {
  const data = runsOverTime && runsOverTime.length > 0
    ? runsOverTime
    : [
        { date: "No data", runs: 0 },
        { date: "", runs: 0 },
        { date: "", runs: 0 },
        { date: "", runs: 0 },
        { date: "", runs: 0 },
        { date: "", runs: 0 },
        { date: "", runs: 0 },
      ];

  const max = Math.max(...data.map((d) => d.runs), 1);
  const chartHeight = 180;
  const chartWidth = 600;

  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * chartWidth;
    const y = chartHeight - (d.runs / max) * chartHeight;
    return `${x},${y}`;
  });

  const areaPoints = `0,${chartHeight} ${points.join(" ")} ${chartWidth},${chartHeight}`;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between">
        <div>
          <CardTitle>Workflow Runs</CardTitle>
          <CardDescription>Daily execution volume over the past week</CardDescription>
        </div>
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-primary" />
            Runs
          </span>
        </div>
      </CardHeader>
      <CardContent>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="relative"
        >
          <svg
            viewBox={`0 0 ${chartWidth} ${chartHeight + 20}`}
            className="w-full"
            preserveAspectRatio="none"
            style={{ height: chartHeight }}
          >
            <defs>
              <linearGradient id="areaGradient" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.02" />
              </linearGradient>
            </defs>
            <motion.path
              d={`M${areaPoints}`}
              fill="url(#areaGradient)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            />
            <motion.polyline
              points={points.join(" ")}
              fill="none"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: "easeInOut" }}
            />
            {data.map((d, i) => {
              const x = (i / (data.length - 1)) * chartWidth;
              const y = chartHeight - (d.runs / max) * chartHeight;
              return (
                <motion.circle
                  key={d.date || i}
                  cx={x}
                  cy={y}
                  r="4"
                  fill="hsl(var(--background))"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                  className="cursor-pointer hover:r-6"
                />
              );
            })}
          </svg>
          <div className="mt-2 flex justify-between px-1">
            {data.map((d) => (
              <span key={d.date} className="text-xs text-muted-foreground">
                {d.date}
              </span>
            ))}
          </div>
        </motion.div>
      </CardContent>
    </Card>
  );
}
