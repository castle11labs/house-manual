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
  coverLayout: "dark" | "light" | "accent";
}

export const styleConfigs: Record<PDFStyleName, StyleConfig> = {
  modern: {
    name: "Modern",
    description: "Dark cover, clean lines, card-based layout",
    coverFont: "Helvetica",
    coverFontBold: "Helvetica-Bold",
    bodyFont: "Helvetica",
    bodyFontBold: "Helvetica-Bold",
    coverTitleSize: 40,
    sectionTitleSize: 20,
    borderRadius: 6,
    coverLayout: "dark",
  },
  classic: {
    name: "Classic",
    description: "White cover, serif headings, traditional feel",
    coverFont: "Times-Roman",
    coverFontBold: "Times-Bold",
    bodyFont: "Helvetica",
    bodyFontBold: "Helvetica-Bold",
    coverTitleSize: 36,
    sectionTitleSize: 18,
    borderRadius: 0,
    coverLayout: "light",
  },
  minimal: {
    name: "Minimal",
    description: "Light cover, lots of whitespace, understated",
    coverFont: "Helvetica",
    coverFontBold: "Helvetica-Bold",
    bodyFont: "Helvetica",
    bodyFontBold: "Helvetica-Bold",
    coverTitleSize: 32,
    sectionTitleSize: 16,
    borderRadius: 4,
    coverLayout: "light",
  },
  warm: {
    name: "Warm",
    description: "Accent cover, friendly tone, rounded elements",
    coverFont: "Helvetica",
    coverFontBold: "Helvetica-Bold",
    bodyFont: "Helvetica",
    bodyFontBold: "Helvetica-Bold",
    coverTitleSize: 38,
    sectionTitleSize: 19,
    borderRadius: 8,
    coverLayout: "accent",
  },
};

// ─── Color definitions ───────────────────────────────────────────────

export interface ColorConfig {
  name: string;
  hex: string;
  accent: string;
  accentLight: string; // for striped rows / bg tints
  coverBg: string;     // dark cover bg
  coverText: string;   // text on cover
  coverMuted: string;  // muted text on cover
}

export const colorConfigs: Record<PDFColorName, ColorConfig> = {
  blue: {
    name: "Blue",
    hex: "#007AFC",
    accent: "#007AFC",
    accentLight: "#EBF5FF",
    coverBg: "#0E1012",
    coverText: "#FFFFFF",
    coverMuted: "#8B9CAC",
  },
  teal: {
    name: "Teal",
    hex: "#0F766E",
    accent: "#0F766E",
    accentLight: "#F0FDFA",
    coverBg: "#0C1515",
    coverText: "#FFFFFF",
    coverMuted: "#7CA3A0",
  },
  navy: {
    name: "Navy",
    hex: "#1E3A5F",
    accent: "#1E3A5F",
    accentLight: "#EEF2F7",
    coverBg: "#0D1B2A",
    coverText: "#FFFFFF",
    coverMuted: "#8899AA",
  },
  charcoal: {
    name: "Charcoal",
    hex: "#374151",
    accent: "#374151",
    accentLight: "#F3F4F6",
    coverBg: "#111827",
    coverText: "#FFFFFF",
    coverMuted: "#9CA3AF",
  },
  forest: {
    name: "Forest",
    hex: "#166534",
    accent: "#166534",
    accentLight: "#F0FDF4",
    coverBg: "#0B1A0F",
    coverText: "#FFFFFF",
    coverMuted: "#7DA88A",
  },
  burgundy: {
    name: "Burgundy",
    hex: "#7F1D1D",
    accent: "#7F1D1D",
    accentLight: "#FEF2F2",
    coverBg: "#1A0A0A",
    coverText: "#FFFFFF",
    coverMuted: "#B08080",
  },
  slate: {
    name: "Slate",
    hex: "#475569",
    accent: "#475569",
    accentLight: "#F1F5F9",
    coverBg: "#0F172A",
    coverText: "#FFFFFF",
    coverMuted: "#94A3B8",
  },
  sunset: {
    name: "Sunset",
    hex: "#C2410C",
    accent: "#C2410C",
    accentLight: "#FFF7ED",
    coverBg: "#1C0E05",
    coverText: "#FFFFFF",
    coverMuted: "#B89070",
  },
};

export const styleNames: PDFStyleName[] = ["modern", "classic", "minimal", "warm"];
export const colorNames: PDFColorName[] = ["blue", "teal", "navy", "charcoal", "forest", "burgundy", "slate", "sunset"];
