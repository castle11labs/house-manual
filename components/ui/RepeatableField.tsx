"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "./Button";

interface RepeatableFieldProps<T> {
  label: string;
  items: T[];
  onAdd: () => void;
  onRemove: (index: number) => void;
  renderItem: (item: T, index: number) => React.ReactNode;
  addLabel?: string;
}

export function RepeatableField<T>({
  label,
  items,
  onAdd,
  onRemove,
  renderItem,
  addLabel = "Add another",
}: RepeatableFieldProps<T>) {
  return (
    <div className="space-y-3">
      <span className="block text-sm font-medium text-text-primary">
        {label}
      </span>

      {items.map((item, index) => (
        <div
          key={index}
          className="relative bg-surface-muted rounded-2xl border border-border p-4"
        >
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute top-2 right-2 p-2 text-text-secondary hover:text-danger transition-colors cursor-pointer rounded-md hover:bg-danger/5"
            aria-label="Remove item"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          {renderItem(item, index)}
        </div>
      ))}

      <Button type="button" variant="secondary" size="sm" onClick={onAdd}>
        <Plus className="w-4 h-4 mr-1.5" />
        {addLabel}
      </Button>
    </div>
  );
}
