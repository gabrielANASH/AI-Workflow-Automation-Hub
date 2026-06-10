"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Play, Sparkles, Check, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const stagger = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, delay: i * 0.12, ease: [0.25, 0.4, 0.25, 1] as [number, number, number, number] },
  }),
};

export function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen overflow-hidden pt-16"
    >
      {/* Background layers */}
      <div className="absolute inset-0 -z-10 bg-glow-hero" />
      <div className="absolute inset-0 -z-10 bg-grid opacity-[0.03]" />

      <motion.div style={{ y, opacity }} className="relative z-10">
        <div className="mx-auto max-w-7xl px-6 pt-20 lg:pt-32">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="mb-8 flex justify-center"
          >
            <Link
              href="#"
              className="group inline-flex items-center gap-2 rounded-full border bg-muted/50 px-4 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-accent"
            >
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span>Introducing FlowMind AI 2.0</span>
              <ChevronRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5" />
            </Link>
          </motion.div>

          {/* Headline */}
          <motion.div
            custom={1}
            variants={stagger}
            initial="initial"
            animate="animate"
            className="mx-auto max-w-4xl text-center"
          >
            <h1 className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              Build{" "}
              <span className="text-gradient-primary">AI workflows</span>
              <br />
              <span className="text-gradient">that think for you</span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            custom={2}
            variants={stagger}
            initial="initial"
            animate="animate"
            className="mx-auto mt-6 max-w-2xl text-center text-base text-muted-foreground sm:text-lg"
          >
            Design, deploy, and scale intelligent automation pipelines with AI agents.
            No code required. From simple tasks to complex orchestrations.
          </motion.p>

          {/* CTAs */}
          <motion.div
            custom={3}
            variants={stagger}
            initial="initial"
            animate="animate"
            className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
          >
            <Button asChild size="lg" className="h-12 gap-2 px-8 text-base shadow-lg shadow-primary/25">
              <Link href="/register">
                Get started free <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 gap-2 px-8 text-base"
            >
              <Link href="#">
                <Play className="h-4 w-4" /> Watch demo
              </Link>
            </Button>
          </motion.div>

          {/* Social proof */}
          <motion.div
            custom={4}
            variants={stagger}
            initial="initial"
            animate="animate"
            className="mt-12 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <div className="flex -space-x-2">
              {["A", "B", "C", "D", "E"].map((letter, i) => (
                <div
                  key={letter}
                  className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-[10px] font-medium text-muted-foreground"
                >
                  {letter}
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">12,000+</span> teams already building
            </p>
          </motion.div>
        </div>

        {/* Product mockup */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.25, 0.4, 0.25, 1] }}
          className="mx-auto mt-16 max-w-6xl px-6"
        >
          <div className="relative overflow-hidden rounded-2xl border bg-card shadow-2xl shadow-primary/5">
            {/* Browser chrome */}
            <div className="flex items-center gap-1.5 border-b px-4 py-3">
              <div className="h-3 w-3 rounded-full bg-red-500/80" />
              <div className="h-3 w-3 rounded-full bg-amber-500/80" />
              <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <div className="ml-4 flex-1 rounded-md bg-muted px-3 py-1 text-xs text-muted-foreground">
                app.flowmind.ai/dashboard
              </div>
            </div>
            {/* Mockup content */}
            <div className="aspect-video bg-gradient-to-br from-primary/5 via-background to-primary/5 p-6">
              <div className="grid h-full grid-cols-4 gap-4">
                <div className="col-span-1 space-y-3">
                  {[70, 45, 60, 35].map((w, i) => (
                    <div
                      key={i}
                      className="h-8 rounded-lg bg-muted/50"
                      style={{ width: `${w}%` }}
                    />
                  ))}
                </div>
                <div className="col-span-3 space-y-3">
                  <div className="flex gap-3">
                    {[40, 25, 35].map((w, i) => (
                      <div
                        key={i}
                        className="h-10 flex-1 rounded-lg bg-primary/10"
                        style={{ maxWidth: `${w}%` }}
                      />
                    ))}
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="space-y-2 rounded-xl border bg-card p-4"
                      >
                        <div className="h-3 w-12 rounded bg-muted" />
                        <div className="h-6 w-20 rounded bg-muted" />
                        <div className="flex gap-1">
                          {[60, 80, 40].map((w, j) => (
                            <div
                              key={j}
                              className="h-2 rounded-full bg-primary/20"
                              style={{ width: `${w}%` }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
