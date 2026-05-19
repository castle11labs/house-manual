"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Loader2, MapPin } from "lucide-react";

interface AddressSuggestion {
  id: string;
  full_address: string;
  address_line1: string;
  place: string;
  region: string;
  postcode: string;
}

interface AddressAutocompleteProps {
  label?: string;
  error?: string;
  value?: string;
  onSelect: (address: { street: string; cityStateZip: string }) => void;
  onChange: (value: string) => void;
}

export function AddressAutocomplete({
  label,
  error,
  value = "",
  onSelect,
  onChange,
}: AddressAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const containerRef = useRef<HTMLDivElement>(null);
  const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
  const sessionToken = useRef(Math.random().toString(36).slice(2));

  const fetchSuggestions = useCallback(
    async (query: string) => {
      if (!token || query.length < 3) {
        setSuggestions([]);
        setOpen(false);
        setLoading(false);
        return;
      }

      setLoading(true);

      try {
        const params = new URLSearchParams({
          q: query,
          access_token: token,
          session_token: sessionToken.current,
          country: "US",
          types: "address",
          limit: "5",
        });

        const res = await fetch(
          `https://api.mapbox.com/search/searchbox/v1/suggest?${params}`
        );
        const data = await res.json();

        if (data.suggestions?.length) {
          const detailed = await Promise.all(
            data.suggestions.map(async (s: { mapbox_id: string }) => {
              const retrieveParams = new URLSearchParams({
                access_token: token,
                session_token: sessionToken.current,
              });
              const r = await fetch(
                `https://api.mapbox.com/search/searchbox/v1/retrieve/${s.mapbox_id}?${retrieveParams}`
              );
              const d = await r.json();
              const props = d.features?.[0]?.properties;
              if (!props) return null;
              return {
                id: s.mapbox_id,
                full_address: props.full_address || "",
                address_line1: props.name || "",
                place: props.context?.place?.name || "",
                region: props.context?.region?.region_code || "",
                postcode: props.context?.postcode?.name || "",
              } as AddressSuggestion;
            })
          );
          setSuggestions(detailed.filter(Boolean) as AddressSuggestion[]);
          setOpen(true);
          setActiveIndex(-1);
        } else {
          setSuggestions([]);
          setOpen(false);
        }
      } catch {
        setSuggestions([]);
        setOpen(false);
      } finally {
        setLoading(false);
      }
    },
    [token]
  );

  const handleInput = (val: string) => {
    onChange(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (val.length >= 3) {
      setLoading(true);
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(val), 300);
  };

  const handleSelect = (suggestion: AddressSuggestion) => {
    const cityStateZip = [
      suggestion.place,
      suggestion.region,
      suggestion.postcode,
    ]
      .filter(Boolean)
      .join(", ");

    onSelect({
      street: suggestion.address_line1,
      cityStateZip,
    });
    setOpen(false);
    setSuggestions([]);
    sessionToken.current = Math.random().toString(36).slice(2);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open || suggestions.length === 0) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i < suggestions.length - 1 ? i + 1 : 0));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i > 0 ? i - 1 : suggestions.length - 1));
    } else if (e.key === "Enter" && activeIndex >= 0) {
      e.preventDefault();
      handleSelect(suggestions[activeIndex]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  const inputId = label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div ref={containerRef} className="relative space-y-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-sm font-medium text-text-primary"
        >
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={inputId}
          type="text"
          value={value}
          onChange={(e) => handleInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          className={`w-full px-4 py-2.5 pr-9 text-sm border border-border rounded-xl bg-surface text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:ring-2 focus:ring-accent/40 focus:border-accent transition-all duration-200 ${
            error ? "border-danger" : ""
          }`}
          placeholder="Start typing an address..."
        />
        <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
          {loading ? (
            <Loader2 className="w-4 h-4 text-text-secondary animate-spin" />
          ) : value.length > 0 ? (
            <MapPin className="w-4 h-4 text-text-secondary/40" />
          ) : null}
        </div>
      </div>
      {error && <p className="text-sm text-danger">{error}</p>}

      {open && suggestions.length > 0 && (
        <ul className="absolute z-50 top-full left-0 right-0 mt-1.5 bg-surface border border-border rounded-xl shadow-lg overflow-hidden">
          {suggestions.map((s, i) => (
            <li
              key={s.id}
              onMouseDown={() => handleSelect(s)}
              onMouseEnter={() => setActiveIndex(i)}
              className={`px-3 py-2.5 text-sm cursor-pointer transition-colors flex items-center gap-2 ${
                i === activeIndex
                  ? "bg-accent/10 text-text-primary"
                  : "text-text-secondary hover:bg-accent/5"
              }`}
            >
              <MapPin className="w-3.5 h-3.5 flex-shrink-0 text-accent/50" />
              {s.full_address}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
