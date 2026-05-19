"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Check, Minus } from "lucide-react";
import type { SectionMeta } from "@/lib/sections";
import type { HouseManualData } from "@/lib/schema";
import type { CompletionState } from "@/types";
import { isSectionComplete } from "@/lib/storage";

interface MobileSectionNavProps {
  sections: SectionMeta[];
  currentSection: SectionMeta;
  data: HouseManualData;
  completedCount: number;
}

export function MobileSectionNav({
  sections,
  currentSection,
  data,
  completedCount,
}: MobileSectionNavProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden border-b border-border bg-surface sticky top-14 z-30">
      {/* Progress bar */}
      <div className="h-1 bg-border">
        <div
          className="h-full bg-accent transition-all duration-500"
          style={{ width: `${(completedCount / sections.length) * 100}%` }}
        />
      </div>

      {/* Current section button */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-6 py-3 cursor-pointer"
      >
        <div className="flex items-center gap-2">
          <span className="text-xs text-text-secondary">
            {currentSection.number}/{sections.length}
          </span>
          <span className="text-sm font-medium text-text-primary">
            {currentSection.title}
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-text-secondary transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 bg-surface border-b border-border shadow-lg max-h-80 overflow-y-auto z-40">
          {sections.map((section) => {
            const state = isSectionComplete(data, section.id);
            const isActive = section.slug === currentSection.slug;
            return (
              <Link
                key={section.id}
                href={`/builder/${section.slug}`}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-3 px-6 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-accent/8 text-accent font-medium"
                    : "text-text-secondary hover:bg-surface-muted"
                }`}
              >
                <MobileStateIcon state={state} />
                <span>{section.title}</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

function MobileStateIcon({ state }: { state: CompletionState }) {
  if (state === "complete") {
    return (
      <div className="w-4 h-4 rounded-full bg-accent flex items-center justify-center flex-shrink-0">
        <Check className="w-2.5 h-2.5 text-white" />
      </div>
    );
  }
  if (state === "in-progress") {
    return (
      <div className="w-4 h-4 rounded-full bg-warning flex items-center justify-center flex-shrink-0">
        <Minus className="w-2.5 h-2.5 text-white" />
      </div>
    );
  }
  return <div className="w-4 h-4 rounded-full border-2 border-border flex-shrink-0" />;
}
