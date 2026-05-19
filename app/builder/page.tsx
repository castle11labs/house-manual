"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Home, BedDouble } from "lucide-react";
import { getSectionsForMode } from "@/lib/sections";
import { loadMode, saveMode } from "@/lib/storage";
import type { ManualMode } from "@/types";

export default function BuilderDashboard() {
  const router = useRouter();
  const [mode, setMode] = useState<ManualMode | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setChecked(true);
  }, []);

  const handleSelect = (m: ManualMode) => {
    saveMode(m);
    setMode(m);
    const sections = getSectionsForMode(m);
    router.push(`/builder/${sections[0].slug}`);
  };

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
            onClick={() => handleSelect("seller")}
            className="bg-surface border-2 border-border rounded-2xl p-6 space-y-3 text-left hover:border-accent/40 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Home className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold text-text-primary">Selling My Home</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Create a handoff document for the new owners with everything they
              need to know about the house.
            </p>
          </button>
          <button
            onClick={() => handleSelect("host")}
            className="bg-surface border-2 border-border rounded-2xl p-6 space-y-3 text-left hover:border-accent/40 hover:shadow-md transition-all duration-200 cursor-pointer"
          >
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <BedDouble className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold text-text-primary">Short-Term Rental</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Create a guest manual for your Airbnb, VRBO, or vacation rental
              with check-in, house rules, and local tips.
            </p>
          </button>
        </div>
      </div>
    </main>
  );
}
