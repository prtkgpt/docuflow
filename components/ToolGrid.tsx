"use client";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToolCard } from "@/components/ToolCard";
import { CATEGORY_LABELS, toolsByCategory, type ToolCategory } from "@/lib/tools";

const TABS: ToolCategory[] = ["edit", "from-pdf", "to-pdf", "ai", "image"];

export function ToolGrid() {
  const [tab, setTab] = useState<ToolCategory>("edit");
  return (
    <Tabs value={tab} onValueChange={(v) => setTab(v as ToolCategory)}>
      <TabsList>
        {TABS.map((c) => (
          <TabsTrigger key={c} value={c}>{CATEGORY_LABELS[c]}</TabsTrigger>
        ))}
      </TabsList>
      {TABS.map((c) => (
        <TabsContent key={c} value={c}>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {toolsByCategory(c).map((t) => (
              <ToolCard key={t.slug} tool={t} />
            ))}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
