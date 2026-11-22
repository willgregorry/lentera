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
    <header className="sticky top-4 z-40 px-4 sm:px-6">
      <div className="mx-auto flex max-w-5xl items-center justify-between rounded-full border border-[#E5E5E5] bg-[#FFFFFF]/85 px-5 py-2.5 shadow-[0_8px_28px_-12px_rgba(31,41,55,0.10)] backdrop-blur-md">
        <Link href="/" className="flex items-center gap-2.5">
          <LenteraMascot status="aman" size="sm" />
          <span className="font-display text-base font-bold tracking-tight text-[#1F2937] sm:text-lg">
            Lentera
          </span>
        </Link>

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

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex items-center justify-center p-1.5 text-[#1F2937] md:hidden cursor-pointer"
          aria-label="Buka menu navigasi"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="mx-auto mt-2 max-w-5xl rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] p-4 shadow-lg md:hidden">
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
