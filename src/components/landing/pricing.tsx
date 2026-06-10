"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const plans = [
  {
    name: "Starter",
    price: { monthly: 0, annually: 0 },
    description: "Perfect for exploring and small projects",
    features: [
      "Up to 3 workflows",
      "1 AI agent",
      "500 runs per month",
      "Basic analytics",
      "Community support",
    ],
    cta: "Get started free",
    popular: false,
  },
  {
    name: "Pro",
    price: { monthly: 49, annually: 39 },
    description: "For professionals scaling their automation",
    features: [
      "Unlimited workflows",
      "5 AI agents",
      "10,000 runs per month",
      "Advanced analytics & logs",
      "Priority email support",
      "Custom integrations",
      "Team collaboration",
    ],
    cta: "Start 14-day trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: { monthly: 199, annually: 159 },
    description: "For organizations with advanced requirements",
    features: [
      "Unlimited everything",
      "Custom AI agent training",
      "Unlimited runs",
      "Real-time analytics",
      "Dedicated account manager",
      "SSO & audit logs",
      "99.99% SLA guarantee",
      "Custom contracts",
    ],
    cta: "Contact sales",
    popular: false,
  },
];

export function Pricing() {
  const [annual, setAnnual] = useState(false);

  return (
    <section id="pricing" className="border-t py-20 lg:py-32">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mx-auto max-w-2xl text-center"
        >
          <p className="mb-4 text-xs font-medium uppercase tracking-widest text-primary">
            Pricing
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
            Simple, transparent pricing
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Choose the plan that fits your needs. No hidden fees, no surprises.
          </p>
        </motion.div>

        {/* Toggle */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="mt-10 flex items-center justify-center gap-3"
        >
          <span className={cn("text-sm", !annual ? "text-foreground font-medium" : "text-muted-foreground")}>
            Monthly
          </span>
          <button
            onClick={() => setAnnual(!annual)}
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors",
              annual ? "bg-primary" : "bg-muted-foreground/30"
            )}
            aria-label="Toggle billing period"
          >
            <span
              className={cn(
                "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                annual && "translate-x-5"
              )}
            />
          </button>
          <span className={cn("text-sm", annual ? "text-foreground font-medium" : "text-muted-foreground")}>
            Annual
          </span>
          {annual && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
              Save 20%
            </span>
          )}
        </motion.div>

        {/* Cards */}
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={cn(
                "relative flex flex-col rounded-2xl border p-8 transition-shadow",
                plan.popular
                  ? "border-primary shadow-xl shadow-primary/10"
                  : "shadow-sm"
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-4 py-1 text-xs font-semibold text-primary-foreground">
                  Most popular
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{plan.name}</h3>
                <div className="mt-4 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">
                    ${annual ? plan.price.annually : plan.price.monthly}
                  </span>
                  {plan.price.monthly > 0 && (
                    <span className="text-sm text-muted-foreground">/month</span>
                  )}
                </div>
                {plan.price.monthly > 0 && annual && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    ${plan.price.monthly * 12}/year
                  </p>
                )}
                <p className="mt-3 text-sm text-muted-foreground">{plan.description}</p>
              </div>
              <ul className="mt-8 flex-1 space-y-3">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
              <Button
                variant={plan.popular ? "default" : "outline"}
                className="mt-8 w-full h-11"
              >
                {plan.cta}
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
