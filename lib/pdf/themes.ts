export type PDFStyleName = "modern" | "classic" | "minimal" | "warm";
export type PDFColorName = "blue" | "teal" | "navy" | "charcoal" | "forest" | "burgundy" | "slate" | "sunset";

export interface PDFTheme {
  style: PDFStyleName;
  color: PDFColorName;
}

export const defaultTheme: PDFTheme = { style: "modern", color: "blue" };

// ─── Style definitions ───────────────────────────────────────────────

export interface StyleConfig {
  name: string;
  description: string;
  coverFont: string;
  coverFontBold: string;
  bodyFont: string;
  bodyFontBold: string;
  coverTitleSize: number;
  sectionTitleSize: number;
  borderRadius: number;
  coverAccentBar: boolean;   // thin color bar at top of cover
  coverCentered: boolean;    // center-align cover text
}

export const styleConfigs: Record<PDFStyleName, StyleConfig> = {
  modern: {
    name: "Modern",
    description: "Bold color bar, clean lines, card layout",
    coverFont: "Helvetica",
    coverFontBold: "Helvetica-Bold",
    bodyFont: "Helvetica",
    bodyFontBold: "Helvetica-Bold",
    coverTitleSize: 36,
    sectionTitleSize: 20,
    borderRadius: 6,
    coverAccentBar: true,
    coverCentered: false,
  },
  classic: {
    name: "Classic",
    description: "Serif headings, traditional, formal feel",
    coverFont: "Times-Roman",
    coverFontBold: "Times-Bold",
    bodyFont: "Helvetica",
    bodyFontBold: "Helvetica-Bold",
    coverTitleSize: 32,
    sectionTitleSize: 18,
    borderRadius: 0,
    coverAccentBar: false,
    coverCentered: true,
  },
  minimal: {
    name: "Minimal",
    description: "Lots of whitespace, understated, quiet",
    coverFont: "Helvetica",
    coverFontBold: "Helvetica-Bold",
    bodyFont: "Helvetica",
    bodyFontBold: "Helvetica-Bold",
    coverTitleSize: 28,
    sectionTitleSize: 16,
    borderRadius: 4,
    coverAccentBar: false,
    coverCentered: false,
  },
  warm: {
    name: "Warm",
    description: "Friendly, rounded, color accents throughout",
    coverFont: "Helvetica",
    coverFontBold: "Helvetica-Bold",
    bodyFont: "Helvetica",
    bodyFontBold: "Helvetica-Bold",
    coverTitleSize: 34,
    sectionTitleSize: 19,
    borderRadius: 8,
    coverAccentBar: true,
    coverCentered: true,
  },
};

// ─── Color definitions ───────────────────────────────────────────────
// All print-friendly: white backgrounds, color used only for
// text accents, thin lines, and light tints.

export interface ColorConfig {
  name: string;
  hex: string;
  accent: string;
  accentLight: string; // very light tint for striped rows
}

export const colorConfigs: Record<PDFColorName, ColorConfig> = {
  blue: {
    name: "Blue",
    hex: "#007AFC",
    accent: "#007AFC",
    accentLight: "#F0F7FF",
  },
  teal: {
    name: "Teal",
    hex: "#0F766E",
    accent: "#0F766E",
    accentLight: "#F0FDFA",
  },
  navy: {
    name: "Navy",
    hex: "#1E3A5F",
    accent: "#1E3A5F",
    accentLight: "#EEF2F7",
  },
  charcoal: {
    name: "Charcoal",
    hex: "#374151",
    accent: "#374151",
    accentLight: "#F3F4F6",
  },
  forest: {
    name: "Forest",
    hex: "#166534",
    accent: "#166534",
    accentLight: "#F0FDF4",
  },
  burgundy: {
    name: "Burgundy",
    hex: "#7F1D1D",
    accent: "#7F1D1D",
    accentLight: "#FEF2F2",
  },
  slate: {
    name: "Slate",
    hex: "#475569",
    accent: "#475569",
    accentLight: "#F1F5F9",
  },
  sunset: {
    name: "Sunset",
    hex: "#C2410C",
    accent: "#C2410C",
    accentLight: "#FFF7ED",
  },
};

export const styleNames: PDFStyleName[] = ["modern", "classic", "minimal", "warm"];
export const colorNames: PDFColorName[] = ["blue", "teal", "navy", "charcoal", "forest", "burgundy", "slate", "sunset"];
