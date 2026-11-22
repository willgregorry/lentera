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
    src: string;
    textColor: string;
  }
> = {
  aman: {
    label: "Aman & Stabil",
    subtitle: "Cahaya hangat terjaga",
    src: "/images/mascot/aman.png",
    textColor: "#355E42",
  },
  waspada: {
    label: "Perlu Perhatian",
    subtitle: "AI mendeteksi pola perlu dipantau",
    src: "/images/mascot/waspada.png",
    textColor: "#9A5B13",
  },
  darurat: {
    label: "Darurat SOS",
    subtitle: "Butuh tindakan segera",
    src: "/images/mascot/darurat.png",
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
      <img
        src={meta.src}
        alt={`Maskot Lentera: ${meta.label}`}
        width={dim}
        height={dim}
        className="shrink-0 object-contain"
        style={{ width: dim, height: dim }}
      />

      {showLabel && (
        <div className="flex flex-col">
          <span
            className="text-sm font-bold tracking-tight"
            style={{ color: meta.textColor }}
          >
            {meta.label}
          </span>
          <span className="text-xs text-ink-muted">{meta.subtitle}</span>
        </div>
      )}
    </div>
  );
}
