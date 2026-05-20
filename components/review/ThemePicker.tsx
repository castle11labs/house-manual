"use client";

import { Check } from "lucide-react";
import type { PDFTheme, PDFStyleName, PDFColorName } from "@/lib/pdf/themes";
import { styleConfigs, colorConfigs, styleNames, colorNames } from "@/lib/pdf/themes";

interface ThemePickerProps {
  theme: PDFTheme;
  onChange: (theme: PDFTheme) => void;
}

export function ThemePicker({ theme, onChange }: ThemePickerProps) {
  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h2 className="text-base font-semibold text-text-primary">PDF Theme</h2>
        <p className="text-xs text-text-secondary mt-0.5">
          Choose a style and accent color for your document.
        </p>
      </div>

      <div className="p-5 space-y-6">
        {/* Style picker */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">Style</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {styleNames.map((name) => {
              const config = styleConfigs[name];
              const isActive = theme.style === name;
              return (
                <button
                  key={name}
                  onClick={() => onChange({ ...theme, style: name })}
                  className={`relative p-3 rounded-xl border-2 text-left transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/30"
                  }`}
                >
                  {isActive && (
                    <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-accent flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 text-white" />
                    </div>
                  )}
                  <StylePreview style={name} color={theme.color} />
                  <p className="text-xs font-medium text-text-primary mt-2">{config.name}</p>
                  <p className="text-[10px] text-text-secondary leading-tight mt-0.5">{config.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Color picker */}
        <div>
          <label className="block text-sm font-medium text-text-primary mb-3">Accent Color</label>
          <div className="flex flex-wrap gap-2">
            {colorNames.map((name) => {
              const config = colorConfigs[name];
              const isActive = theme.color === name;
              return (
                <button
                  key={name}
                  onClick={() => onChange({ ...theme, color: name })}
                  className={`group flex items-center gap-2 px-3 py-2 rounded-full border-2 transition-all duration-200 cursor-pointer ${
                    isActive
                      ? "border-accent bg-accent/5"
                      : "border-border hover:border-accent/30"
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full flex-shrink-0 shadow-sm"
                    style={{ backgroundColor: config.hex }}
                  />
                  <span className="text-xs font-medium text-text-primary">{config.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function StylePreview({ style, color }: { style: PDFStyleName; color: PDFColorName }) {
  const styleConfig = styleConfigs[style];
  const colorConfig = colorConfigs[color];
  const centered = styleConfig.coverCentered;

  return (
    <div className="w-full aspect-[8.5/11] rounded-md overflow-hidden border border-border/50 bg-white relative">
      {/* Accent bar */}
      {styleConfig.coverAccentBar && (
        <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: colorConfig.hex }} />
      )}
      {/* Mini cover preview */}
      <div className={`flex flex-col justify-center h-full px-2 py-1.5 ${centered ? "items-center" : ""}`}>
        <div className="w-6 h-[2px] mb-1" style={{ backgroundColor: colorConfig.hex }} />
        <div className={`${centered ? "w-3/4" : "w-full"} h-[3px] rounded-full mb-0.5 bg-gray-800 opacity-80`} />
        <div className={`${centered ? "w-1/2" : "w-3/4"} h-[3px] rounded-full mb-1.5 bg-gray-400 opacity-50`} />
        <div className={`w-4 h-[1.5px] ${centered ? "" : ""}`} style={{ backgroundColor: colorConfig.hex }} />
      </div>
    </div>
  );
}
