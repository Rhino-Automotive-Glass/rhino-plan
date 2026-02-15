"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { searchOriginSheets } from "@/app/actions";
import type { OriginSheet } from "@/types";

interface OriginSheetSearchProps {
  onSelect: (sheet: OriginSheet | null) => void;
  selected: OriginSheet | null;
}

export default function OriginSheetSearch({
  onSelect,
  selected,
}: OriginSheetSearchProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<OriginSheet[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(null);

  const search = useCallback(async (term: string) => {
    if (term.length < 2) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    const { data, error } = await searchOriginSheets(term);
    setIsLoading(false);

    if (error) {
      console.error("Origin sheet search failed:", error);
      return;
    }

    setResults(data ?? []);
    setIsOpen(true);
  }, []);

  function handleInputChange(value: string) {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  }

  function handleSelect(sheet: OriginSheet) {
    onSelect(sheet);
    setQuery("");
    setResults([]);
    setIsOpen(false);
  }

  function handleClear() {
    onSelect(null);
    setQuery("");
    setResults([]);
  }

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (selected) {
    return (
      <div className="flex flex-col gap-1">
        <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
          Hoja de origen
        </span>
        <div className="flex items-center gap-2 rounded-lg border border-teal-300 dark:border-teal-700 bg-teal-50 dark:bg-teal-900/30 px-3 py-1.5 text-sm">
          <span className="font-medium text-teal-800 dark:text-teal-200">
            {selected.rhino_code}
          </span>
          {selected.descripcion && (
            <span className="truncate text-teal-600 dark:text-teal-400 max-w-[160px]">
              — {selected.descripcion}
            </span>
          )}
          <button
            type="button"
            onClick={handleClear}
            className="ml-auto text-teal-500 hover:text-teal-700 dark:hover:text-teal-300 text-lg leading-none"
            aria-label="Remove origin sheet"
          >
            ×
          </button>
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1">
      <label
        htmlFor="origin-sheet-search"
        className="text-xs font-medium text-gray-600 dark:text-gray-400"
      >
        Hoja de origen
      </label>
      <div className="relative">
        <input
          id="origin-sheet-search"
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => results.length > 0 && setIsOpen(true)}
          placeholder="Buscar por código o descripción…"
          autoComplete="off"
          className="input-base w-56"
        />
        {isLoading && (
          <div className="absolute right-2 top-1/2 -translate-y-1/2">
            <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-teal-500" />
          </div>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <ul className="absolute top-full left-0 z-50 mt-1 max-h-64 w-80 overflow-y-auto
          rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
          {results.map((sheet) => (
            <li key={sheet.id}>
              <button
                type="button"
                onClick={() => handleSelect(sheet)}
                className="flex w-full flex-col gap-0.5 px-3 py-2 text-left hover:bg-teal-50 dark:hover:bg-teal-900/30
                  transition-colors border-b border-gray-100 dark:border-gray-700 last:border-b-0"
              >
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-sm text-gray-900 dark:text-white">
                    {sheet.rhino_code ?? "—"}
                  </span>
                  {sheet.clave_externa && (
                    <span className="rounded bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 text-xs text-gray-500 dark:text-gray-400">
                      {sheet.clave_externa}
                    </span>
                  )}
                </div>
                {sheet.descripcion && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                    {sheet.descripcion}
                  </span>
                )}
                {sheet.data?.metadata?.fechaFormateada && (
                  <span className="text-xs text-gray-400 dark:text-gray-500">
                    {sheet.data.metadata.fechaFormateada}
                  </span>
                )}
              </button>
            </li>
          ))}
        </ul>
      )}

      {isOpen && query.length >= 2 && results.length === 0 && !isLoading && (
        <div className="absolute top-full left-0 z-50 mt-1 w-80 rounded-lg border border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-800 px-3 py-3 text-sm text-gray-500 dark:text-gray-400 shadow-lg">
          No se encontraron hojas de origen
        </div>
      )}
    </div>
  );
}
