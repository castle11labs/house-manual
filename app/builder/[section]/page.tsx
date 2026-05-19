"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getSectionsForMode, getSectionBySlug, getNextSection, getPreviousSection } from "@/lib/sections";
import { loadMode, loadManualData, isSectionComplete, getCompletedSectionCount, clearAllData } from "@/lib/storage";
import type { ManualMode } from "@/types";
import type { HouseManualData } from "@/lib/schema";
import { SectionFormRenderer } from "@/components/builder/SectionFormRenderer";
import { SectionSidebar } from "@/components/builder/SectionSidebar";
import { MobileSectionNav } from "@/components/builder/MobileSectionNav";
import { Button } from "@/components/ui/Button";

export default function SectionPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.section as string;
  const [mode, setMode] = useState<ManualMode>("seller");
  const [data, setData] = useState<HouseManualData | null>(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const refreshData = useCallback(() => {
    setData(loadManualData());
  }, []);

  useEffect(() => {
    const m = loadMode();
    if (m) setMode(m);
    else router.push("/builder");
    refreshData();
  }, [refreshData, router]);

  // Refresh data when navigating between sections
  useEffect(() => {
    refreshData();
  }, [slug, refreshData]);

  const allSections = getSectionsForMode(mode);
  const section = getSectionBySlug(slug, mode);
  const previousSection = getPreviousSection(slug, mode);
  const nextSection = getNextSection(slug, mode);

  if (!section) {
    return (
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
        <p className="text-text-secondary">Section not found.</p>
        <Link href="/builder" className="text-cta hover:underline text-sm mt-4 inline-block">
          Back to builder
        </Link>
      </main>
    );
  }

  if (!data) return null;

  const completedCount = getCompletedSectionCount(data, mode);

  const handleSave = () => {
    if (nextSection) {
      router.push(`/builder/${nextSection.slug}`);
    } else {
      router.push("/review");
    }
  };

  return (
    <div className="flex-1 flex">
      {/* Desktop sidebar */}
      <SectionSidebar
        sections={allSections}
        currentSlug={slug}
        data={data}
        completedCount={completedCount}
        onStartOver={() => setShowClearConfirm(true)}
      />

      {/* Main content */}
      <div className="flex-1 min-w-0">
        {/* Mobile nav */}
        <MobileSectionNav
          sections={allSections}
          currentSection={section}
          data={data}
          completedCount={completedCount}
        />

        <main className="max-w-3xl mx-auto w-full px-6 py-8">
          <div className="space-y-6">
            <div>
              <h1 className="text-xl font-bold text-text-primary">
                {section.title}
              </h1>
              <p className="text-sm text-text-secondary mt-1">
                {section.description}
              </p>
            </div>

            <SectionFormRenderer sectionId={section.id} onSave={handleSave} mode={mode} />

            {/* Prev / Next */}
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <div>
                {previousSection ? (
                  <Link href={`/builder/${previousSection.slug}`}>
                    <Button variant="ghost" size="sm">
                      <ChevronLeft className="w-4 h-4 mr-1" />
                      {previousSection.title}
                    </Button>
                  </Link>
                ) : (
                  <div />
                )}
              </div>
              <div>
                {nextSection ? (
                  <Link href={`/builder/${nextSection.slug}`}>
                    <Button variant="ghost" size="sm">
                      {nextSection.title}
                      <ChevronRight className="w-4 h-4 ml-1" />
                    </Button>
                  </Link>
                ) : (
                  <Link href="/review">
                    <Button variant="primary" size="sm">
                      Review & Generate PDF
                    </Button>
                  </Link>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Clear confirm modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-6">
          <div className="bg-surface rounded-2xl p-6 max-w-sm w-full space-y-4 shadow-xl">
            <h2 className="text-lg font-semibold text-text-primary">Start over?</h2>
            <p className="text-sm text-text-secondary">
              This will permanently delete all data you have entered.
            </p>
            <div className="flex gap-3 justify-end">
              <Button variant="secondary" onClick={() => setShowClearConfirm(false)}>Cancel</Button>
              <Button
                variant="danger"
                onClick={() => {
                  clearAllData();
                  setShowClearConfirm(false);
                  router.push("/builder");
                }}
              >
                Delete Everything
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
