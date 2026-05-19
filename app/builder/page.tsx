"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileText, RotateCcw, ArrowRight, Home, BedDouble } from "lucide-react";
import { getSectionsForMode } from "@/lib/sections";
import { loadManualData, clearAllData, isSectionComplete, getCompletedSectionCount, loadMode, saveMode } from "@/lib/storage";
import type { HouseManualData } from "@/lib/schema";
import type { ManualMode } from "@/types";
import { SectionCard } from "@/components/dashboard/SectionCard";
import { Button } from "@/components/ui/Button";

export default function BuilderDashboard() {
  const [data, setData] = useState<HouseManualData | null>(null);
  const [mode, setMode] = useState<ManualMode | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    setData(loadManualData());
    setMode(loadMode());
  }, []);

  // Mode selection screen
  if (mode === null) {
    return (
      <main className="flex-1 flex items-center justify-center px-6 py-20">
        <div className="max-w-lg w-full space-y-8 text-center">
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-text-primary">
              What are you creating?
            </h1>
            <p className="text-sm text-text-secondary">
              We&apos;ll tailor the sections and language to fit your needs.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={() => { saveMode("seller"); setMode("seller"); }}
              className="bg-surface border-2 border-border rounded-2xl p-6 space-y-3 text-left hover:border-accent/40 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <Home className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-text-primary">Selling My Home</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Create a handoff document for the new owners with everything they need to know about the house.
              </p>
            </button>
            <button
              onClick={() => { saveMode("host"); setMode("host"); }}
              className="bg-surface border-2 border-border rounded-2xl p-6 space-y-3 text-left hover:border-accent/40 hover:shadow-md transition-all duration-200 cursor-pointer group"
            >
              <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
                <BedDouble className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-text-primary">Short-Term Rental</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Create a guest manual for your Airbnb, VRBO, or vacation rental with check-in, house rules, and local tips.
              </p>
            </button>
          </div>
        </div>
      </main>
    );
  }

  if (!data) return null;

  const sections = getSectionsForMode(mode);
  const completedCount = getCompletedSectionCount(data, mode);
  const address = data.propertyBasics?.address;
  const hasRequiredFields = !!address && !!data.propertyBasics?.cityStateZip;
  const isFirstVisit = completedCount === 0;
  const modeLabel = mode === "host" ? "Guest Manual" : "House Manual";
  const firstSlug = sections[0]?.slug || "property-basics";

  return (
    <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
      <div className="space-y-8">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-text-primary">
                {modeLabel} Builder
              </h1>
              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-accent/10 text-accent">
                {mode === "host" ? "Rental" : "Seller"}
              </span>
            </div>
            {address && (
              <p className="text-sm text-text-secondary">{address}</p>
            )}
          </div>
          <button
            onClick={() => { setMode(null); }}
            className="text-xs text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
          >
            Switch mode
          </button>
        </div>

        {isFirstVisit ? (
          <div className="bg-accent/5 border border-accent/15 rounded-2xl p-6 space-y-4">
            <div className="space-y-2">
              <h2 className="text-lg font-semibold text-text-primary">
                {mode === "host"
                  ? "Welcome! Let\u2019s build your guest manual."
                  : "Welcome! Let\u2019s build your house manual."}
              </h2>
              <p className="text-sm text-text-secondary max-w-xl">
                {mode === "host"
                  ? "Start with your property details, then add check-in instructions, house rules, and local tips. Everything saves automatically."
                  : "Start with your property address, then work through each section at your own pace. Everything saves automatically. Skip any section that doesn\u2019t apply."}
              </p>
            </div>
            <Link href={`/builder/${firstSlug}`}>
              <Button variant="primary" size="lg">
                Get Started
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
