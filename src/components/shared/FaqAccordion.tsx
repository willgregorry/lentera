"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { FAQ_ITEMS } from "@/content/landing";

export function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-[#E5E5E5] border-y border-[#E5E5E5]">
      {FAQ_ITEMS.map((item, idx) => {
        const isOpen = openIndex === idx;
        return (
          <div key={item.q} className="py-5">
            <button
              type="button"
              onClick={() => setOpenIndex(isOpen ? null : idx)}
              className="group flex w-full items-center justify-between gap-6 text-left cursor-pointer"
              aria-expanded={isOpen}
            >
              <span className="font-display text-lg font-semibold text-[#1F2937] transition-colors group-hover:text-[#B8640B] sm:text-xl">
                {item.q}
              </span>
              <ChevronDown
                className={`h-5 w-5 shrink-0 text-[#6B7280] transition-transform duration-300 ease-out ${
                  isOpen ? "rotate-180 text-[#B8640B]" : "group-hover:text-[#1F2937]"
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
                <p className="pt-3 max-w-2xl text-sm leading-relaxed text-[#6B7280] sm:text-base">
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
