"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "@/content/landing";

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      {FAQ_ITEMS.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div
            key={item.q}
            className={`rounded-2xl border bg-[#FFFFFF] transition-all duration-300 ${
              isOpen
                ? "border-[#D4D4D4] shadow-sm"
                : "border-[#E5E5E5] hover:border-[#D4D4D4]"
            }`}
          >
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="flex w-full items-center justify-between gap-6 px-6 py-5 text-left cursor-pointer"
              aria-expanded={isOpen}
            >
              <span className="font-display text-base font-semibold text-[#1F2937] sm:text-lg">
                {item.q}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-[#6B7280] transition-transform duration-300 ease-out ${
                  isOpen ? "rotate-180 text-[#E8912E]" : ""
                }`}
              />
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen
                  ? "grid-rows-[1fr] opacity-100"
                  : "grid-rows-[0fr] opacity-0"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-6 pb-5 text-sm leading-relaxed text-[#6B7280] sm:text-base">
                  {item.a}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
