import Link from "next/link";
import { Home } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-surface-dark text-text-muted">
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-accent flex items-center justify-center">
                <Home className="w-3.5 h-3.5 text-white" />
              </div>
              <span className="font-semibold text-sm text-white tracking-tight">
                House Manual
              </span>
            </div>
            <p className="text-xs leading-relaxed max-w-xs">
              A free tool for home sellers to create comprehensive handoff
              documents for new owners. All data stays in your browser.
            </p>
          </div>

          {/* Product links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Product
            </h4>
            <nav className="flex flex-col gap-2">
              <FooterLink href="/#how-it-works">How It Works</FooterLink>
              <FooterLink href="/#sections">Sections</FooterLink>
              <FooterLink href="/#faq">FAQ</FooterLink>
              <FooterLink href="/builder">Start Building</FooterLink>
            </nav>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-white uppercase tracking-wider">
              Info
            </h4>
            <nav className="flex flex-col gap-2">
              <FooterLink href="/#privacy">Privacy</FooterLink>
              <FooterLink href="mailto:hello@castle11.com">
                Contact
              </FooterLink>
            </nav>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs">
            &copy; {new Date().getFullYear()} House Manual.
          </p>
          <p className="text-xs">
            No data leaves your browser.
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  const isExternal = href.startsWith("http");
  return (
    <Link
      href={href}
      className="text-sm text-text-muted hover:text-white transition-colors"
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </Link>
  );
}
