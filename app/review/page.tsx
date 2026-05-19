"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, Download, Loader2, Pencil, CheckCircle2 } from "lucide-react";
import { loadManualData, loadMode } from "@/lib/storage";
import { getSectionsForMode } from "@/lib/sections";
import { isSectionComplete } from "@/lib/storage";
import type { HouseManualData, SectionKey } from "@/lib/schema";
import type { ManualMode } from "@/types";
import { Button } from "@/components/ui/Button";

export default function ReviewPage() {
  const [data, setData] = useState<HouseManualData | null>(null);
  const [mode, setMode] = useState<ManualMode>("seller");
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setData(loadManualData());
    const m = loadMode();
    if (m) setMode(m);
  }, []);

  if (!data) return null;

  const sections = getSectionsForMode(mode);
  const filledSections = sections.filter((s) => isSectionComplete(data, s.id) !== "empty");

  const handleGenerate = async () => {
    setGenerating(true);
    setError(null);
    setSuccess(false);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data, mode }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate PDF");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const slug = (data.propertyBasics?.address || "house-manual")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const a = document.createElement("a");
      a.href = url;
      a.download = `House-Manual-${slug}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setGenerating(false);
    }
  };

  return (
    <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">
      <div className="space-y-8">
        <div>
          <Link
            href="/builder"
            className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary transition-colors mb-4"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to dashboard
          </Link>
          <h1 className="text-2xl font-bold text-text-primary">
            Review Your House Manual
          </h1>
          <p className="text-sm text-text-secondary mt-1">
            {filledSections.length} of {sections.length} sections have data.
            Review below, then generate your PDF.
          </p>
        </div>

        {filledSections.length === 0 ? (
          <div className="bg-surface border border-border rounded-2xl p-8 text-center space-y-3">
            <p className="text-text-secondary">No sections filled out yet.</p>
            <Link href="/builder">
              <Button variant="primary">Go to Builder</Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {filledSections.map((section) => {
              const state = isSectionComplete(data, section.id);
              return (
                <div
                  key={section.id}
                  className="bg-surface border border-border rounded-2xl overflow-hidden"
                >
                  <div className="flex items-center justify-between px-5 py-4 border-b border-border/50">
                    <div className="flex items-center gap-3">
                      {state === "complete" ? (
                        <CheckCircle2 className="w-4.5 h-4.5 text-accent flex-shrink-0" />
                      ) : (
                        <div className="w-4.5 h-4.5 rounded-full border-2 border-warning flex-shrink-0" />
                      )}
                      <h2 className="text-base font-semibold text-text-primary">
                        {section.number}. {section.title}
                      </h2>
                    </div>
                    <Link href={`/builder/${section.slug}`}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                    </Link>
                  </div>
                  <div className="px-5 py-4">
                    <SectionSummary sectionId={section.id} data={data} />
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {error && (
          <div className="bg-danger/5 border border-danger/20 rounded-lg p-4">
            <p className="text-sm text-danger">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-accent/5 border border-accent/20 rounded-lg p-4">
            <p className="text-sm text-accent">PDF downloaded successfully.</p>
          </div>
        )}

        <div className="flex justify-end pt-4 border-t border-border">
          <Button
            variant="primary"
            size="lg"
            onClick={handleGenerate}
            disabled={generating || !data.propertyBasics?.address}
          >
            {generating ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Download className="w-4 h-4 mr-2" />
                Generate PDF
              </>
            )}
          </Button>
        </div>
      </div>
    </main>
  );
}

function SectionSummary({ sectionId, data }: { sectionId: SectionKey; data: HouseManualData }) {
  const sectionData = data[sectionId];
  if (!sectionData) return null;

  const entries = flattenObject(sectionData as Record<string, unknown>);
  if (entries.length === 0) return null;

  return (
    <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
      {entries.map(({ key, value }) => (
        <div key={key} className="py-0.5">
          <dt className="text-xs font-medium text-text-secondary uppercase tracking-wide">
            {formatKey(key)}
          </dt>
          <dd className="text-sm text-text-primary mt-0.5">
            {typeof value === "boolean"
              ? value
                ? "Yes"
                : "No"
              : isBase64Image(String(value))
                ? "(photo attached)"
                : String(value)}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function flattenObject(
  obj: Record<string, unknown>,
  prefix = ""
): { key: string; value: unknown }[] {
  const entries: { key: string; value: unknown }[] = [];

  for (const [key, value] of Object.entries(obj)) {
    const fullKey = prefix ? `${prefix}.${key}` : key;

    if (value === undefined || value === null || value === "") continue;

    if (Array.isArray(value)) {
      value.forEach((item, i) => {
        if (typeof item === "object" && item !== null) {
          entries.push(
            ...flattenObject(item as Record<string, unknown>, `${fullKey}[${i}]`)
          );
        } else if (item !== undefined && item !== null && item !== "") {
          entries.push({ key: `${fullKey}[${i}]`, value: item });
        }
      });
    } else if (typeof value === "object") {
      entries.push(
        ...flattenObject(value as Record<string, unknown>, fullKey)
      );
    } else {
      entries.push({ key: fullKey, value });
    }
  }

  return entries;
}

function formatKey(key: string): string {
  return key
    .replace(/\[\d+\]/g, "")
    .split(".")
    .pop()!
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}

function isBase64Image(value: string): boolean {
  return value.startsWith("data:image/");
}
