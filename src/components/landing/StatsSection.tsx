"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { EditorialStat, LANDING_STATS } from "@/content/landing";
import { useSectionReveal } from "@/hooks/useGsapReveal";
import { SplitText } from "@/components/shared/SplitText";

function AnimatedNumber({ stat, active }: { stat: EditorialStat; active: boolean }) {
  const [display, setDisplay] = useState("0" + stat.suffix);

  useEffect(() => {
    if (!active) return;
    let frameId = 0;
    const duration = 1200;
    const start = performance.now();

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = stat.target * eased;
      const formatted =
        stat.decimals > 0
          ? current.toFixed(stat.decimals).replace(".", ",")
          : Math.round(current).toString();
      setDisplay(`${formatted}${stat.suffix}`);
      if (progress < 1) {
        frameId = requestAnimationFrame(tick);
      }
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [active, stat.decimals, stat.suffix, stat.target]);

  return <>{display}</>;
}

export function StatsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(false);
  useSectionReveal(sectionRef);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="flex min-h-[85svh] items-center border-b border-[#E5E5E5] bg-[#FFFFFF]"
    >
      <div className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6">
        <div className="gsap-reveal max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#B8640B]">
            Realitas Indonesia
          </p>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight text-[#1F2937] sm:text-5xl">
            <SplitText text="Jutaan keluarga bekerja menanggung beban rawat lansia sendirian." />
          </h2>
        </div>

        <div className="mt-14 grid gap-10 border-t border-[#E5E5E5] pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {LANDING_STATS.map((stat) => (
            <div
              key={stat.label}
              className="gsap-reveal group transition-transform duration-300 hover:-translate-y-1"
            >
              <p
                className="font-mono-vital text-4xl font-bold sm:text-5xl"
                style={{ color: stat.accent }}
              >
                <AnimatedNumber stat={stat} active={inView} />
              </p>
              <p className="mt-4 text-base font-semibold leading-snug text-[#1F2937]">
                {stat.label}
              </p>
              <a
                href={stat.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-[#6B7280] transition-colors hover:text-[#B8640B]"
              >
                <span>{stat.source}</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
