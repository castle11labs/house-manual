import Link from "next/link";
import {
  ArrowRight,
  Shield,
  Clock,
  FileText,
  Zap,
  Home,
  Flame,
  Droplets,
  Thermometer,
  Wrench,
  TreePine,
  Lock,
  Wifi,
  Trash2,
  Users,
  Building,
  Award,
  MapPin,
  Heart,
  Lightbulb,
  FolderOpen,
  PenLine,
  ChevronDown,
  Download,
  Monitor,
} from "lucide-react";
import { sections } from "@/lib/sections";
import { FAQAccordion } from "@/components/landing/FAQAccordion";

const sectionIcons: Record<string, React.ReactNode> = {
  propertyBasics: <Home className="w-4 h-4" />,
  emergencyInfo: <Flame className="w-4 h-4" />,
  utilities: <Zap className="w-4 h-4" />,
  shutoffsPanels: <Droplets className="w-4 h-4" />,
  hvac: <Thermometer className="w-4 h-4" />,
  waterHeater: <Droplets className="w-4 h-4" />,
  majorAppliances: <Monitor className="w-4 h-4" />,
  exteriorSystems: <TreePine className="w-4 h-4" />,
  securityAccess: <Lock className="w-4 h-4" />,
  smartHome: <Wifi className="w-4 h-4" />,
  trashRecycling: <Trash2 className="w-4 h-4" />,
  maintenanceContacts: <Wrench className="w-4 h-4" />,
  hoaCommunity: <Building className="w-4 h-4" />,
  warranties: <Award className="w-4 h-4" />,
  localKnowledge: <MapPin className="w-4 h-4" />,
  quirksTips: <Lightbulb className="w-4 h-4" />,
  documentVault: <FolderOpen className="w-4 h-4" />,
  welcomeLetter: <PenLine className="w-4 h-4" />,
};

export default function LandingPage() {
  return (
    <main className="flex-1 flex flex-col">
      {/* ─── Hero ─────────────────────────────────────── */}
      <section className="bg-surface-dark text-text-on-dark">
        <div className="max-w-5xl mx-auto px-6 py-20 sm:py-28">
          <div className="max-w-2xl space-y-6">
            <p className="text-sm font-medium text-accent tracking-wide uppercase">
              Free &middot; No signup &middot; 100% private
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.08]">
              Create a house manual
              <br />
              <span className="text-accent">for the new owners.</span>
            </h1>
            <p className="text-lg text-text-muted max-w-xl leading-relaxed">
              Document every detail about your home — utilities, shutoffs,
              appliances, contacts, and quirks — and generate a professional PDF
              the new owners will actually use.
            </p>
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 pt-2">
              <Link
                href="/builder"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-cta text-white font-medium rounded-full hover:bg-cta-hover transition-all duration-200 shadow-sm hover:shadow-md text-base"
              >
                Start Building
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="#how-it-works"
                className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-white transition-colors"
              >
                See how it works
                <ChevronDown className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Stats Bar ────────────────────────────────── */}
      <section className="border-b border-border bg-surface">
        <div className="max-w-5xl mx-auto px-6 py-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <p className="text-2xl font-bold text-text-primary">18</p>
              <p className="text-xs text-text-secondary mt-1">Sections covered</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">100%</p>
              <p className="text-xs text-text-secondary mt-1">Browser-based</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">$0</p>
              <p className="text-xs text-text-secondary mt-1">Always free</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-text-primary">PDF</p>
              <p className="text-xs text-text-secondary mt-1">Professional output</p>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Feature Cards ────────────────────────────── */}
      <section className="max-w-5xl mx-auto w-full px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
            Everything a new homeowner needs to know
          </h2>
          <p className="text-text-secondary mt-3 max-w-lg mx-auto">
            Capture the institutional knowledge that only the current owner has
            — before it walks out the door.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <FeatureCard
            icon={<FileText className="w-5 h-5 text-accent" />}
            title="18 Guided Sections"
            description="From property basics and emergency contacts to smart home devices, local recommendations, and a personal welcome letter."
          />
          <FeatureCard
            icon={<Clock className="w-5 h-5 text-accent" />}
            title="Work at Your Pace"
            description="Fill in what you know, skip what you don't. Everything auto-saves to your browser. Come back anytime and pick up where you left off."
          />
          <FeatureCard
            icon={<Shield className="w-5 h-5 text-accent" />}
            title="100% Private"
            description="No accounts, no servers, no tracking. Your data never leaves your browser. Generate the PDF locally and share it however you want."
          />
          <FeatureCard
            icon={<Download className="w-5 h-5 text-accent" />}
            title="Professional PDF"
            description="One click generates a polished, print-ready PDF with a dark cover page, table of contents, and organized section pages."
          />
          <FeatureCard
            icon={<MapPin className="w-5 h-5 text-accent" />}
            title="Address Autocomplete"
            description="Start typing your address and we'll fill in the rest. Powered by Mapbox — fast, accurate, and US-focused."
          />
          <FeatureCard
            icon={<Zap className="w-5 h-5 text-accent" />}
            title="Auto-Save"
            description="Every keystroke is saved automatically. No submit buttons, no lost work. A subtle indicator confirms your data is safe."
          />
        </div>
      </section>

      {/* ─── How It Works ─────────────────────────────── */}
      <section id="how-it-works" className="bg-surface-muted scroll-mt-16">
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
              How it works
            </h2>
            <p className="text-text-secondary mt-3">
              Three steps. No account required.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            <Step
              number="01"
              title="Fill in your details"
              description="Walk through 18 sections covering every aspect of your home. Skip any that don't apply. Everything auto-saves as you type."
            />
            <Step
              number="02"
              title="Review your manual"
              description="See a summary of everything you've entered. Edit any section with one click. Only sections with data appear in the final document."
            />
            <Step
              number="03"
              title="Generate your PDF"
              description="One click creates a professionally formatted, print-ready PDF. Download it and hand it to the new owners at closing."
            />
          </div>
          <div className="text-center mt-12">
            <Link
              href="/builder"
              className="inline-flex items-center gap-2 px-7 py-3 bg-cta text-white font-medium rounded-full hover:bg-cta-hover transition-all duration-200 shadow-sm hover:shadow-md"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── All 18 Sections ──────────────────────────── */}
      <section id="sections" className="scroll-mt-16">
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
              18 sections. Every detail covered.
            </h2>
            <p className="text-text-secondary mt-3 max-w-lg mx-auto">
              Each section is optional. Fill in what applies to your home and
              skip the rest.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section) => (
              <div
                key={section.id}
                className="flex items-start gap-3 bg-surface border border-border rounded-2xl p-4 shadow-sm"
              >
                <div className="w-9 h-9 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                  {sectionIcons[section.id] || (
                    <FileText className="w-4 h-4 text-accent" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-text-primary">
                    {section.number}. {section.title}
                  </p>
                  <p className="text-xs text-text-secondary mt-0.5 leading-relaxed">
                    {section.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ──────────────────────────────────────── */}
      <section id="faq" className="bg-surface-muted scroll-mt-16">
        <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20">
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-text-primary">
              Frequently asked questions
            </h2>
          </div>
          <FAQAccordion />
        </div>
      </section>

      {/* ─── Privacy Note ─────────────────────────────── */}
      <section id="privacy" className="scroll-mt-16">
        <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20 text-center">
          <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-6 h-6 text-accent" />
          </div>
          <h2 className="text-2xl font-bold text-text-primary mb-3">
            Your data, your browser
          </h2>
          <p className="text-text-secondary max-w-lg mx-auto leading-relaxed">
            House Manual stores everything in your browser&apos;s local storage.
            Nothing is sent to a server. Nothing is tracked. When you generate a
            PDF, it&apos;s rendered on the server and streamed directly to your
            browser — we don&apos;t store the content. Clear your browser data
            and it&apos;s gone.
          </p>
        </div>
      </section>

      {/* ─── Final CTA ────────────────────────────────── */}
      <section className="bg-surface-dark text-text-on-dark">
        <div className="max-w-3xl mx-auto px-6 py-16 sm:py-20 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-3">
            Ready to build your house manual?
          </h2>
          <p className="text-text-muted mb-8 max-w-md mx-auto">
            It takes about 30 minutes to fill in everything. The new owners will
            thank you.
          </p>
          <Link
            href="/builder"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-cta text-white font-medium rounded-full hover:bg-cta-hover transition-all duration-200 shadow-sm hover:shadow-md text-base"
          >
            Start Building
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="bg-surface rounded-2xl border border-border p-6 space-y-3 shadow-sm">
      <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
        {icon}
      </div>
      <h3 className="font-semibold text-text-primary">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">
        {description}
      </p>
    </div>
  );
}

function Step({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center sm:text-left space-y-3">
      <span className="inline-block text-3xl font-bold text-accent">
        {number}
      </span>
      <h3 className="text-lg font-semibold text-text-primary">{title}</h3>
      <p className="text-sm text-text-secondary leading-relaxed">
        {description}
      </p>
    </div>
  );
}
