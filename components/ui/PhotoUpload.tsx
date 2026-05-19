"use client";

import { useCallback, useRef, useState } from "react";
import { Upload, X, Image as ImageIcon } from "lucide-react";

interface PhotoUploadProps {
  label?: string;
  value?: string;
  onChange: (base64: string | undefined) => void;
}

export function PhotoUpload({ label, value, onChange }: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.type.startsWith("image/")) return;

      const reader = new FileReader();
      reader.onload = () => {
        onChange(reader.result as string);
      };
      reader.readAsDataURL(file);
    },
    [onChange]
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files[0];
      if (file) handleFile(file);
    },
    [handleFile]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragging(false);
  }, []);

  return (
    <div className="space-y-1.5">
      {label && (
        <span className="block text-sm font-medium text-text-primary">
          {label}
        </span>
      )}

      {value ? (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Uploaded photo"
            className="w-32 h-32 object-cover rounded-lg border border-border"
          />
          <button
            type="button"
            onClick={() => onChange(undefined)}
            className="absolute -top-2 -right-2 w-7 h-7 bg-danger text-white rounded-full flex items-center justify-center hover:bg-danger/90 transition-colors cursor-pointer shadow-sm"
            aria-label="Remove photo"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => inputRef.current?.click()}
          className={`flex flex-col items-center justify-center gap-2 p-6 border-2 border-dashed rounded-2xl cursor-pointer transition-all duration-200 ${
            isDragging
              ? "border-accent bg-accent/5"
              : "border-border hover:border-accent/30"
          }`}
        >
          {isDragging ? (
            <ImageIcon className="w-6 h-6 text-accent" />
          ) : (
            <Upload className="w-6 h-6 text-text-secondary" />
          )}
          <span className="text-sm text-text-secondary">
            Drop an image or click to upload
          </span>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />
    </div>
  );
}
