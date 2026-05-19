"use client";

interface ToggleProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function Toggle({ label, description, checked, onChange }: ToggleProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="flex items-start gap-3 w-full text-left p-3 rounded-xl border border-border hover:bg-surface-muted/50 transition-all duration-200 cursor-pointer"
    >
      <div
        className={`relative mt-0.5 flex-shrink-0 w-9 h-5 rounded-full transition-colors ${
          checked ? "bg-accent" : "bg-border"
        }`}
      >
        <div
          className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
            checked ? "translate-x-4" : ""
          }`}
        />
      </div>
      <div className="flex-1 min-w-0">
        <span className="text-sm font-medium text-text-primary">{label}</span>
        {description && (
          <p className="text-xs text-text-secondary mt-0.5">{description}</p>
        )}
      </div>
    </button>
  );
}
