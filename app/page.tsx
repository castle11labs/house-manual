import Link from "next/link";
import { ArrowRight, Shield, Clock, FileText } from "lucide-react";

export default function LandingPage() {
  return (
    <main className="flex-1 flex flex-col">
      {/* Dark hero */}
      <div className="bg-surface-dark text-text-on-dark">
        <div className="max-w-5xl mx-auto px-6 py-24 sm:py-32">
          <div className="max-w-2xl space-y-6">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight leading-[1.1]">
              Create a house manual
              <br />
              <span className="text-accent">for the new owners.</span>
            </h1>
            <p className="text-lg text-text-muted max-w-xl leading-relaxed">
              A document generator for home sellers. List every detail about
              your house — utilities, shutoffs, appliances, contacts, and quirks.
              Generate a clean PDF in minutes.
            </p>
            <div className="flex items-center gap-4 pt-2">
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-7 py-3 bg-cta text-white font-medium rounded-full hover:bg-cta-hover transition-all duration-200 shadow-sm hover:shadow-md"
              >
                Start Building
                <ArrowRight className="w-4 h-4" />
              </Link>
              <span className="text-sm text-text-muted">
                Free. No signup required.
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Feature cards */}
      <div className="max-w-5xl mx-auto w-full px-6 py-16 sm:py-20">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-surface rounded-2xl border border-border p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <FileText className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold text-text-primary">18 Sections</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              From property basics and emergency contacts to smart home devices
              and local recommendations.
            </p>
          </div>

          <div className="bg-surface rounded-2xl border border-border p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold text-text-primary">Your Pace</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Fill in what you know, skip what you don&apos;t. Everything
              auto-saves as you type. Come back anytime.
            </p>
          </div>

          <div className="bg-surface rounded-2xl border border-border p-6 space-y-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Shield className="w-5 h-5 text-accent" />
            </div>
            <h3 className="font-semibold text-text-primary">100% Private</h3>
            <p className="text-sm text-text-secondary leading-relaxed">
              Everything stays in your browser. Nothing is uploaded, nothing is
              stored on a server.
            </p>
          </div>
        </div>
      </div>

      {/* Description section */}
      <div className="max-w-5xl mx-auto w-full px-6 pb-16">
        <div className="max-w-xl mx-auto text-center space-y-4">
          <p className="text-sm text-text-secondary leading-relaxed">
            Moving out is hectic enough without trying to remember which
            breaker controls the kitchen, who services the HVAC, or where the
            water main shutoff is. A house manual captures all of that
            institutional knowledge before it walks out the door with you.
          </p>
          <p className="text-sm text-text-secondary leading-relaxed">
            When you&apos;re done, generate a professionally formatted PDF
            that the new owners will actually want to read.
          </p>
        </div>
      </div>

      <footer className="py-6 text-center border-t border-border">
        <p className="text-xs text-text-secondary">
          House Manual &middot; All data stays in your browser.
        </p>
      </footer>
    </main>
  );
}
