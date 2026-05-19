"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, RotateCcw, ArrowRight } from "lucide-react";
import { sections } from "@/lib/sections";
import { loadManualData, clearAllData, isSectionComplete, getCompletedSectionCount } from "@/lib/storage";
import type { HouseManualData } from "@/lib/schema";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { Button } from "@/components/ui/Button";

export default function BuilderDashboard() {
  const [data, setData] = useState<HouseManualData | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setData(loadManualData());
  }, []);

  if (!data) return null;

  const completedCount = getCompletedSectionCount(data);
  const address = data.propertyBasics?.address;
  const hasRequiredFields = !!address && !!data.propertyBasics?.cityStateZip;
  const isFirstVisit = completedCount === 0;

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
      <div className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-text-primary">
            House Manual Builder
          </h1>
          {address && (
            <p className="text-sm text-text-secondary">{address}</p>
          )}
        </div>

        {isFirstVisit ? (
          <div className="bg-accent/5 border border-accent/15 rounded-2xl p-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-text-primary">
                Welcome! Let&apos;s build your house manual.
              </h2>
              <p className="text-sm text-text-secondary max-w-xl">
                Start with your property address, then work through each section
                at your own pace. Everything saves automatically. Skip any
                section that doesn&apos;t apply.
              </p>
            </div>
            <Link href="/builder/property-basics">
              <Button variant="primary" size="lg">
                Start with Property Basics
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-2xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-secondary">
                {completedCount} of {sections.length} sections complete
              </span>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium text-accent">
                  {Math.round((completedCount / sections.length) * 100)}%
                </span>
                <div className="w-48 h-2 bg-background rounded-full overflow-hidden">
                  <div
                    className="h-full bg-accent rounded-full transition-all duration-500"
                    style={{
                      width: `${(completedCount / sections.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sections.map((section) => (
            <SectionCard
              key={section.id}
              number={section.number}
              title={section.title}
              description={section.description}
              slug={section.slug}
              state={isSectionComplete(data, section.id)}
            />
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-border">
          {completedCount > 0 ? (
            <button
              type="button"
              onClick={() => setShowClearConfirm(true)}
              className="inline-flex items-center gap-1.5 text-sm text-text-secondary hover:text-danger transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Start Over
            </button>
          ) : (
            <div />
          )}

          <Link href="/review">
            <Button
              variant="primary"
              size="lg"
              disabled={!hasRequiredFields}
            >
              <FileText className="w-4 h-4 mr-2" />
              Review and Generate PDF
            </Button>
          </Link>
        </div>
      </div>

      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-surface rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold text-text-primary">
              Start over?
            </h2>
            <p className="text-sm text-text-secondary">
              This will permanently delete all data you have entered. This
              action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <Button
                variant="secondary"
                onClick={() => setShowClearConfirm(false)}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => {
                  clearAllData();
                  setData(loadManualData());
                  setShowClearConfirm(false);
                }}
              >
                Delete Everything
              </Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
