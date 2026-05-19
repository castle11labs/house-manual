"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getSectionsForMode, getSectionBySlug, getNextSection, getPreviousSection } from "@/lib/sections";
import { loadMode } from "@/lib/storage";
import type { ManualMode } from "@/types";
import { SectionFormRenderer } from "@/components/builder/SectionFormRenderer";
import { Button } from "@/components/ui/Button";

export default function SectionPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.section as string;
  const [mode, setMode] = useState<ManualMode>("seller");

  useEffect(() => {
    const m = loadMode();
    if (m) setMode(m);
  }, []);

  const allSections = getSectionsForMode(mode);
  const section = getSectionBySlug(slug, mode);
  const previousSection = getPreviousSection(slug, mode);
  const nextSection = getNextSection(slug, mode);

  if (!section) {
    return (
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
        <p className="text-text-secondary">Section not found.</p>
        <Link href="/builder" className="text-cta hover:underline text-sm mt-4 inline-block">
          Back to dashboard
        </Link>
      </main>
    );
  }

  const handleSave = () => {
    if (nextSection) {
      router.push(`/builder/${nextSection.slug}`);
    } else {
      router.push("/builder");
    }
  };

  return (
    <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
      <div className="space-y-6">
        <div>
          <Link
            href="/builder"
            className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to dashboard
          </Link>

          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs font-medium text-accent">
              Section {section.number} of {allSections.length}
            </span>
            <div className="flex-1 h-1 bg-border rounded-full overflow-hidden max-w-48">
              <div
                className="h-full bg-accent rounded-full transition-all duration-500"
                style={{
                  width: `${(section.number / allSections.length) * 100}%`,
                }}
              />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-text-primary">
            {section.number}. {section.title}
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {section.description}
          </p>
        </div>

        <SectionFormRenderer sectionId={section.id} onSave={handleSave} mode={mode} />

        <div className="flex items-center justify-between pt-4 border-t border-border">
          <div>
            {previousSection && (
              <Link href={`/builder/${previousSection.slug}`}>
                <Button variant="ghost" size="sm">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  {previousSection.title}
                </Button>
              </Link>
            )}
          </div>
          <div className="flex gap-3">
            <Link href="/builder">
              <Button variant="secondary" size="sm">
                Save & Back to Dashboard
              </Button>
            </Link>
            {nextSection && (
              <Link href={`/builder/${nextSection.slug}`}>
                <Button variant="ghost" size="sm">
                  {nextSection.title}
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
