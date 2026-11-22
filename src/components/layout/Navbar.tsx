"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, UserCircle, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LenteraMascot } from "@/components/shared/LenteraMascot";

const PUBLIC_NAV_LINKS = [
  { href: "/#cara-kerja", label: "Cara Kerja" },
  { href: "/#faq", label: "FAQ" },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();

  const navLinks = user
    ? user.role === "caregiver"
      ? [
          { href: "/caregiver", label: "Portal Caregiver" },
          { href: "/loker", label: "Loker Caregiver" },
        ]
      : [
          { href: "/dashboard", label: "Dashboard Keluarga" },
          { href: "/loker", label: "Loker Caregiver" },
        ]
    : PUBLIC_NAV_LINKS;

  return (
    <header className="sticky top-0 z-40 border-b border-[#E5E5E5] bg-[#F5F5F5]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <LenteraMascot status="aman" size="sm" />
          <span className="font-display text-lg font-bold tracking-tight text-[#1F2937]">
            Lentera
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors ${
                  active
                    ? "text-[#E8912E]"
                    : "text-[#6B7280] hover:text-[#1F2937]"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Auth / User Actions */}
        <div className="hidden items-center gap-4 md:flex">
          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <UserCircle className="h-4 w-4 text-[#4A7C59]" />
                <span className="font-semibold text-[#1F2937]">
                  {user.name.split(",")[0]}
                </span>
                <span className="text-xs text-[#6B7280]">
                  ({user.role === "family" ? "Keluarga" : "Caregiver"})
                </span>
              </div>
              <button
                onClick={logout}
                title="Keluar"
                className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B7280] hover:text-[#DC4A3D] transition-colors cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm font-medium text-[#1F2937] hover:text-[#E8912E] transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="rounded-full bg-[#1F2937] px-5 py-2 text-sm font-semibold text-white hover:bg-[#E8912E] transition-colors"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex items-center justify-center p-1.5 text-[#1F2937] md:hidden cursor-pointer"
          aria-label="Buka menu navigasi"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="border-t border-[#E5E5E5] bg-[#FFFFFF] px-4 py-4 md:hidden">
          <div className="flex flex-col gap-2">
            {navLinks.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`py-2 text-sm font-medium ${
                    active ? "text-[#E8912E]" : "text-[#1F2937]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-[#E5E5E5] pt-3">
            {user ? (
              <>
                <span className="text-sm font-semibold text-[#1F2937]">
                  {user.name.split(",")[0]}
                </span>
                <button
                  onClick={logout}
                  className="text-xs font-semibold text-[#DC4A3D]"
                >
                  Keluar
                </button>
              </>
            ) : (
              <div className="flex w-full items-center gap-3">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-full border border-[#E5E5E5] py-2 text-center text-sm font-medium text-[#1F2937]"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="flex-1 rounded-full bg-[#1F2937] py-2 text-center text-sm font-semibold text-white"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
