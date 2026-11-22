import React from "react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { HeroSection } from "@/components/landing/HeroSection";
import { StatsSection } from "@/components/landing/StatsSection";
import { CareLoopSection } from "@/components/landing/CareLoopSection";
import { AiShowcaseSection } from "@/components/landing/AiShowcaseSection";
import { PreviewSection } from "@/components/landing/PreviewSection";
import { DualCtaSection } from "@/components/landing/DualCtaSection";
import { FaqSection } from "@/components/landing/FaqSection";

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#F5F5F5] text-[#1F2937]">
      <Navbar />
      <main className="flex-1">
        <HeroSection />
        <StatsSection />
        <CareLoopSection />
        <AiShowcaseSection />
        <PreviewSection />
        <DualCtaSection />
        <FaqSection />
      </main>
      <Footer />
    </div>
  );
}
