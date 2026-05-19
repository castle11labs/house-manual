"use client";

import Link from "next/link";
import { ArrowRight, Home, BedDouble } from "lucide-react";

export function AudienceTabs() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <div className="bg-surface-muted rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
          <Home className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary">
          Selling your home?
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          Document utilities, shutoffs, appliances, warranties, maintenance
          contacts, and every quirk the new owners need to know. Hand them a
          professional PDF at closing.
        </p>
        <Link
          href="/builder"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
        >
          Build a house manual
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="bg-surface-muted rounded-2xl p-6 sm:p-8 space-y-4">
        <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
          <BedDouble className="w-5 h-5 text-accent" />
        </div>
        <h3 className="text-lg font-semibold text-text-primary">
          Hosting on Airbnb or VRBO?
        </h3>
        <p className="text-sm text-text-secondary leading-relaxed">
          Create a guest manual with check-in instructions, house rules, WiFi
          info, amenity guides, and local recommendations. Replace your messy
          Google Doc with a polished PDF.
        </p>
        <Link
          href="/builder"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-accent hover:text-accent-hover transition-colors"
        >
          Build a guest manual
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
