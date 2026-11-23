"use client";

import React, { useEffect, useRef, useState } from "react";
import { Calendar, ChevronLeft, ChevronRight, X } from "lucide-react";

const MONTHS_ID = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
];

const WEEKDAYS_ID = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

function toIsoDate(year: number, month: number, day: number): string {
  const m = String(month + 1).padStart(2, "0");
  const d = String(day).padStart(2, "0");
  return `${year}-${m}-${d}`;
}

export function formatIndonesianDate(iso?: string): string {
  if (!iso) return "";
  const [y, m, d] = iso.split("-").map(Number);
  if (!y || !m || !d) return "";
  return `${d} ${MONTHS_ID[m - 1].slice(0, 3)} ${y}`;
}

interface CustomDateRangePickerProps {
  label: string;
  startDate: string;
  endDate: string;
  onChange: (range: { startDate: string; endDate: string }) => void;
  required?: boolean;
}

export function CustomDateRangePicker({
  label,
  startDate,
  endDate,
  onChange,
  required = false,
}: CustomDateRangePickerProps) {
  const now = new Date();
  const todayIso = toIsoDate(now.getFullYear(), now.getMonth(), now.getDate());

  const [open, setOpen] = useState(false);
  const [viewYear, setViewYear] = useState(now.getFullYear());
  const [viewMonth, setViewMonth] = useState(now.getMonth());
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleOutside);
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("mousedown", handleOutside);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay();
  // Convert Sunday=0..Saturday=6 to Monday=0..Sunday=6
  const leadingEmptyDays = (firstDayOfMonth + 6) % 7;
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();

  function prevMonth() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function nextMonth() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function handleDayClick(iso: string) {
    if (iso < todayIso) return;

    if (!startDate || (startDate && endDate)) {
      onChange({ startDate: iso, endDate: "" });
      return;
    }

    if (iso < startDate) {
      onChange({ startDate: iso, endDate: startDate });
    } else if (iso === startDate) {
      onChange({ startDate: iso, endDate: "" });
    } else {
      onChange({ startDate, endDate: iso });
      setOpen(false);
    }
  }

  const displayText = startDate
    ? endDate
      ? `${formatIndonesianDate(startDate)} – ${formatIndonesianDate(endDate)}`
      : `Mulai ${formatIndonesianDate(startDate)} (Berkelanjutan)`
    : "";

  return (
    <div ref={rootRef} className="relative w-full min-w-0">
      <label className="block text-xs font-semibold text-ink">
        {label}
        {required && <span className="ml-0.5 text-primary">*</span>}
      </label>

      <div className="relative mt-1.5">
        <button
          type="button"
          onClick={() => setOpen((prev) => !prev)}
          aria-expanded={open}
          className={`flex min-h-[44px] w-full min-w-0 items-center justify-between gap-2 rounded-xl border bg-surface px-3.5 py-2.5 text-left text-sm transition-colors cursor-pointer ${
            open
              ? "border-primary ring-2 ring-primary/15"
              : "border-border hover:border-ink-muted/40"
          }`}
        >
          <span className="inline-flex min-w-0 items-center gap-2">
            <Calendar className="h-4 w-4 shrink-0 text-primary" />
            <span
              className={`truncate ${
                displayText ? "font-medium text-ink" : "text-ink-muted"
              }`}
            >
              {displayText || "Pilih tanggal mulai & selesai perawatan"}
            </span>
          </span>

          {startDate && (
            <span
              role="button"
              tabIndex={0}
              aria-label="Hapus pilihan tanggal"
              onClick={(e) => {
                e.stopPropagation();
                onChange({ startDate: "", endDate: "" });
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  onChange({ startDate: "", endDate: "" });
                }
              }}
              className="rounded-md p-0.5 text-ink-muted hover:bg-canvas-subtle hover:text-ink"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          )}
        </button>
      </div>

      {open && (
        <div className="animate-dropdown-in absolute left-0 z-50 mt-2 w-full max-w-sm rounded-2xl border border-border bg-surface p-3.5 shadow-[0_16px_40px_rgba(19,35,58,0.14)] sm:min-w-[290px] sm:p-4">
          <div className="flex items-center justify-between pb-3">
            <button
              type="button"
              onClick={prevMonth}
              aria-label="Bulan sebelumnya"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink-muted hover:bg-canvas-subtle hover:text-ink cursor-pointer"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <p className="font-display text-sm font-bold text-ink">
              {MONTHS_ID[viewMonth]} {viewYear}
            </p>
            <button
              type="button"
              onClick={nextMonth}
              aria-label="Bulan berikutnya"
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-border text-ink-muted hover:bg-canvas-subtle hover:text-ink cursor-pointer"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <p className="mb-2.5 text-[11px] text-ink-muted">
            {!startDate
              ? "Langkah 1: Pilih tanggal mulai perawatan."
              : !endDate
              ? "Langkah 2: Pilih tanggal selesai, atau biarkan berkelanjutan."
              : "Rentang tanggal terpilih. Klik tanggal lain untuk mengganti."}
          </p>

          <div className="grid grid-cols-7 gap-1 text-center">
            {WEEKDAYS_ID.map((day) => (
              <span
                key={day}
                className="py-1 text-[11px] font-semibold text-ink-muted"
              >
                {day}
              </span>
            ))}

            {Array.from({ length: leadingEmptyDays }).map((_, i) => (
              <span key={`empty-${i}`} />
            ))}

            {Array.from({ length: daysInMonth }).map((_, idx) => {
              const dayNum = idx + 1;
              const iso = toIsoDate(viewYear, viewMonth, dayNum);
              const isPast = iso < todayIso;
              const isStart = iso === startDate;
              const isEnd = iso === endDate;
              const inRange =
                Boolean(startDate && endDate) &&
                iso > startDate &&
                iso < endDate;

              return (
                <button
                  key={iso}
                  type="button"
                  disabled={isPast}
                  onClick={() => handleDayClick(iso)}
                  className={`flex h-9 w-full items-center justify-center rounded-lg text-xs font-semibold tabular-nums transition-colors ${
                    isPast
                      ? "text-ink-muted/35 cursor-not-allowed"
                      : isStart || isEnd
                      ? "bg-primary text-white cursor-pointer"
                      : inRange
                      ? "bg-card-cream text-ink cursor-pointer"
                      : "text-ink hover:bg-card-blue cursor-pointer"
                  }`}
                >
                  {dayNum}
                </button>
              );
            })}
          </div>

          <div className="mt-3 flex items-center justify-between gap-2 border-t border-border-subtle pt-3">
            <button
              type="button"
              onClick={() => {
                if (startDate) {
                  onChange({ startDate, endDate: "" });
                  setOpen(false);
                } else {
                  onChange({ startDate: todayIso, endDate: "" });
                  setOpen(false);
                }
              }}
              className="text-xs font-semibold text-sidebar hover:text-primary cursor-pointer"
            >
              Mulai tanpa tanggal selesai
            </button>

            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded-lg bg-canvas-subtle px-3 py-1.5 text-xs font-semibold text-ink hover:bg-border-subtle cursor-pointer"
            >
              Selesai
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
