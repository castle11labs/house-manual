"use client";

import Link from "next/link";
import { Check, ChevronRight, Minus } from "lucide-react";
import type { CompletionState } from "@/types";

interface SectionCardProps {
  number: number;
  title: string;
  description: string;
  slug: string;
  state: CompletionState;
}

function StateIndicator({ state }: { state: CompletionState }) {
  if (state === "complete") {
    return (
      <div className="w-6 h-6 rounded-full bg-success flex items-center justify-center">
        <Check className="w-3.5 h-3.5 text-white" />
      </div>
    );
  }
  if (state === "in-progress") {
    return (
      <div className="w-6 h-6 rounded-full bg-warning flex items-center justify-center">
        <Minus className="w-3.5 h-3.5 text-white" />
      </div>
    );
  }
  return <div className="w-6 h-6 rounded-full border-2 border-border" />;
}

export function SectionCard({
  number,
  title,
  description,
  slug,
  state,
}: SectionCardProps) {
  return (
    <Link
      href={`/builder/${slug}`}
      className="group block bg-surface border border-border rounded-2xl p-5 shadow-sm hover:shadow-md hover:border-accent/30 transition-all duration-200 cursor-pointer"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <StateIndicator state={state} />
          <div className="min-w-0">
            <div className="flex items-baseline gap-2">
              <span className="text-xs font-medium text-text-secondary">
                {number}.
              </span>
              <h3 className="text-sm font-semibold text-text-primary truncate">
                {title}
              </h3>
            </div>
            <p className="text-xs text-text-secondary mt-1 line-clamp-2">
              {description}
            </p>
          </div>
        </div>
        <ChevronRight className="w-4 h-4 text-text-secondary/50 group-hover:text-text-primary flex-shrink-0 mt-1 transition-colors" />
      </div>
    </Link>
  );
}
