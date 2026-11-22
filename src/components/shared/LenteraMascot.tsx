"use client";

import React from "react";
import { LenteraStatus } from "@/types";

interface LenteraMascotProps {
  status?: LenteraStatus;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

const STATUS_META: Record<
  LenteraStatus,
  {
    label: string;
    subtitle: string;
    frameColor: string;
    flameCore: string;
    flameOuter: string;
    textColor: string;
  }
> = {
  aman: {
    label: "Aman & Stabil",
    subtitle: "Cahaya hangat terjaga",
    frameColor: "#E8912E",
    flameCore: "#FFF4D9",
    flameOuter: "#E8912E",
    textColor: "#355E42",
  },
  waspada: {
    label: "Perlu Perhatian",
    subtitle: "AI mendeteksi pola perlu dipantau",
    frameColor: "#D97706",
    flameCore: "#FEF3C7",
    flameOuter: "#F59E0B",
    textColor: "#9A5B13",
  },
  darurat: {
    label: "Darurat SOS",
    subtitle: "Butuh tindakan segera",
    frameColor: "#DC4A3D",
    flameCore: "#FEE2E2",
    flameOuter: "#DC4A3D",
    textColor: "#A82E23",
  },
};

export function LenteraMascot({
  status = "aman",
  size = "md",
  showLabel = false,
}: LenteraMascotProps) {
  const meta = STATUS_META[status];
  const dim = size === "sm" ? 36 : size === "lg" ? 96 : 56;

  return (
    <div className="inline-flex items-center gap-3">
      <svg
        width={dim}
        height={dim}
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label={`Maskot Lentera: ${meta.label}`}
        className="shrink-0"
      >
        <circle cx="40" cy="43" r="30" fill={meta.flameCore} />
        <path
          d="M30 17C30 11.477 34.477 7 40 7C45.523 7 50 11.477 50 17"
          stroke="#5A4634"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        <path
          d="M23 24C23 20.686 25.686 18 29 18H51C54.314 18 57 20.686 57 24H23Z"
          fill="#5A4634"
        />
        <rect
          x="24"
          y="24"
          width="32"
          height="36"
          rx="8"
          fill="#FFFFFF"
          stroke={meta.frameColor}
          strokeWidth="3"
        />
        <path
          d="M40 28C40 28 49 36.5 49 43.5C49 48.747 44.97 53 40 53C35.03 53 31 48.747 31 43.5C31 36.5 40 28 40 28Z"
          fill={meta.flameOuter}
        />
        <path
          d="M40 35C40 35 44.5 39.5 44.5 43.5C44.5 46.261 42.485 48.5 40 48.5C37.515 48.5 35.5 46.261 35.5 43.5C35.5 39.5 40 35 40 35Z"
          fill={meta.flameCore}
        />

        {status === "aman" && (
          <>
            <circle cx="35.5" cy="42.5" r="1.4" fill="#1F2937" />
            <circle cx="44.5" cy="42.5" r="1.4" fill="#1F2937" />
            <path
              d="M36.5 46.5C37.6 47.8 42.4 47.8 43.5 46.5"
              stroke="#1F2937"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </>
        )}

        {status === "waspada" && (
          <>
            <circle cx="35.5" cy="42.5" r="1.4" fill="#1F2937" />
            <circle cx="44.5" cy="42.5" r="1.4" fill="#1F2937" />
            <line
              x1="36.5"
              y1="47"
              x2="43.5"
              y2="47"
              stroke="#1F2937"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </>
        )}

        {status === "darurat" && (
          <>
            <circle cx="35.5" cy="42" r="1.5" fill="#1F2937" />
            <circle cx="44.5" cy="42" r="1.5" fill="#1F2937" />
            <circle cx="40" cy="47.2" r="2.2" fill="#1F2937" />
          </>
        )}

        <rect x="21" y="60" width="38" height="7" rx="3.5" fill="#5A4634" />
      </svg>

      {showLabel && (
        <div className="flex flex-col">
          <span
            className="text-sm font-bold tracking-tight"
            style={{ color: meta.textColor }}
          >
            {meta.label}
          </span>
          <span className="text-xs text-[#6B7280]">{meta.subtitle}</span>
        </div>
      )}
    </div>
  );
}
