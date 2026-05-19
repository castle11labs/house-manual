"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Menu, X } from "lucide-react";
import { useState } from "react";

export function Header() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isBuilder = pathname.startsWith("/builder");
  const isReview = pathname === "/review";
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header
      className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-200 ${
        isHome
          ? "bg-surface-dark/90 border-white/10"
          : "bg-surface/90 border-border"
      }`}
    >
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 group">
          <div
            className={`w-7 h-7 rounded-lg flex items-center justify-center transition-colors ${
              isHome ? "bg-accent" : "bg-accent"
            }`}
          >
            <Home className="w-3.5 h-3.5 text-white" />
          </div>
          <span
            className={`font-semibold text-sm tracking-tight transition-colors ${
              isHome ? "text-white" : "text-text-primary"
            }`}
          >
            House Manual
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden sm:flex items-center gap-1">
          <NavLink href="/" active={isHome} dark={isHome}>
            Home
          </NavLink>
          <NavLink href="/#how-it-works" active={false} dark={isHome}>
            How It Works
          </NavLink>
          <NavLink href="/#sections" active={false} dark={isHome}>
            Sections
          </NavLink>
          <NavLink href="/#faq" active={false} dark={isHome}>
            FAQ
          </NavLink>
          <div className="w-px h-5 bg-border/30 mx-2" />
          {isBuilder || isReview ? (
            <Link
              href="/builder"
              className="px-4 py-1.5 text-sm font-medium rounded-full bg-accent text-white hover:bg-accent-hover transition-all duration-200"
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/builder"
              className="px-4 py-1.5 text-sm font-medium rounded-full bg-cta text-white hover:bg-cta-hover transition-all duration-200"
            >
              Start Building
            </Link>
          )}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className={`sm:hidden p-2 rounded-lg transition-colors cursor-pointer ${
            isHome
              ? "text-white hover:bg-white/10"
              : "text-text-primary hover:bg-surface-muted"
          }`}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div
          className={`sm:hidden border-t px-6 py-4 space-y-1 ${
            isHome ? "bg-surface-dark border-white/10" : "bg-surface border-border"
          }`}
        >
          <MobileNavLink href="/" dark={isHome} onClick={() => setMobileOpen(false)}>
            Home
          </MobileNavLink>
          <MobileNavLink href="/#how-it-works" dark={isHome} onClick={() => setMobileOpen(false)}>
            How It Works
          </MobileNavLink>
          <MobileNavLink href="/#sections" dark={isHome} onClick={() => setMobileOpen(false)}>
            Sections
          </MobileNavLink>
          <MobileNavLink href="/#faq" dark={isHome} onClick={() => setMobileOpen(false)}>
            FAQ
          </MobileNavLink>
          <div className="pt-2">
            <Link
              href="/builder"
              onClick={() => setMobileOpen(false)}
              className="block w-full text-center px-4 py-2.5 text-sm font-medium rounded-full bg-cta text-white hover:bg-cta-hover transition-all"
            >
              Start Building
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

function NavLink({
  href,
  active,
  dark,
  children,
}: {
  href: string;
  active: boolean;
  dark: boolean;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
        active
          ? dark
            ? "text-white font-medium"
            : "text-text-primary font-medium"
          : dark
            ? "text-text-muted hover:text-white"
            : "text-text-secondary hover:text-text-primary"
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({
  href,
  dark,
  onClick,
  children,
}: {
  href: string;
  dark: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`block px-3 py-2.5 text-sm rounded-lg transition-colors ${
        dark
          ? "text-text-muted hover:text-white hover:bg-white/5"
          : "text-text-secondary hover:text-text-primary hover:bg-surface-muted"
      }`}
    >
      {children}
    </Link>
  );
}
