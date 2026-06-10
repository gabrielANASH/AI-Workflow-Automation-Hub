"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/shared/page-header";
import { WorkflowList } from "@/components/workflows/workflow-list";

export default function WorkflowsPage() {
  const [filter, setFilter] = useState("all");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Workflows"
        description="Manage your AI-powered workflows"
        action={
          <Button asChild>
            <Link href="/workflows/create">
              <Plus className="mr-2 h-4 w-4" /> Create workflow
            </Link>
          </Button>
        }
      />

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger>
          <TabsTrigger value="paused">Paused</TabsTrigger>
          <TabsTrigger value="draft">Draft</TabsTrigger>
          <TabsTrigger value="error">Error</TabsTrigger>
        </TabsList>
      </Tabs>

      <WorkflowList filter={filter} />
    </div>
  );
}
