"use client";

import Link from "next/link";
import { Check, Minus, FileText, RotateCcw } from "lucide-react";
import type { SectionMeta } from "@/lib/sections";
import type { HouseManualData } from "@/lib/schema";
import type { CompletionState } from "@/types";
import { isSectionComplete } from "@/lib/storage";

interface SectionSidebarProps {
  sections: SectionMeta[];
  currentSlug: string;
  data: HouseManualData;
  completedCount: number;
  onStartOver?: () => void;
}

export function SectionSidebar({
  sections,
  currentSlug,
  data,
  completedCount,
  onStartOver,
}: SectionSidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 hidden lg:flex flex-col border-r border-border bg-surface h-[calc(100vh-3.5rem)] sticky top-14 overflow-y-auto">
      {/* Progress */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-text-secondary">
            {completedCount} of {sections.length}
          </span>
          <span className="text-xs font-medium text-accent">
            {Math.round((completedCount / sections.length) * 100)}%
          </span>
        </div>
        <div className="h-1.5 bg-border rounded-full overflow-hidden">
          <div
            className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / sections.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Section list */}
      <nav className="flex-1 py-2 overflow-y-auto">
        {sections.map((section) => {
          const state = isSectionComplete(data, section.id);
          const isActive = section.slug === currentSlug;

          return (
            <Link
              key={section.id}
              href={`/builder/${section.slug}`}
              className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                isActive
                  ? "bg-accent/8 text-accent font-medium border-r-2 border-accent"
                  : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
              }`}
            >
              <StateIcon state={state} isActive={isActive} />
              <span className="truncate">{section.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom actions */}
      <div className="p-4 border-t border-border space-y-2">
        <Link
          href="/review"
          className="flex items-center justify-center gap-2 w-full px-4 py-2 text-sm font-medium rounded-full bg-cta text-white hover:bg-cta-hover transition-all cursor-pointer"
        >
          <FileText className="w-3.5 h-3.5" />
          Review & Generate
        </Link>
        {onStartOver && completedCount > 0 && (
          <button
            onClick={onStartOver}
            className="flex items-center justify-center gap-1.5 w-full px-4 py-2 text-xs text-text-secondary hover:text-danger transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Start Over
          </button>
        )}
      </div>
    </aside>
  );
}

function StateIcon({ state, isActive }: { state: CompletionState; isActive: boolean }) {
  if (state === "complete") {
    return (
      <div className="w-5 h-5 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
        <Check className="w-3 h-3 text-white" />
      </div>
    );
  }
  if (state === "in-progress") {
    return (
      <div className="w-5 h-5 rounded-full bg-warning flex items-center justify-center flex-shrink-0">
        <Minus className="w-3 h-3 text-white" />
      </div>
    );
  }
  return (
    <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 ${
      isActive ? "border-accent" : "border-border"
    }`} />
  );
}
