"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut, Menu, UserCircle, X } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LenteraMascot } from "@/components/shared/LenteraMascot";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";

const PUBLIC_NAV_LINKS = [
  { href: "/#cara-kerja", label: "Cara Kerja" },
  { href: "/#faq", label: "FAQ" },
];

export function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
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
      <div className="mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-white/70 bg-white/70 px-4 py-2.5 shadow-[0_12px_36px_-14px_rgba(15,23,42,0.12)] ring-1 ring-black/[0.05] backdrop-blur-xl transition-all duration-300 sm:rounded-full sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <LenteraMascot status="aman" size="sm" />
          <span className="font-display text-base font-bold tracking-tight text-ink sm:text-lg">
            Lentera
          </span>
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                data-active={active ? "true" : "false"}
                className={`nav-link-underline py-1 text-sm font-medium transition-colors duration-200 ${
                  active ? "text-ink" : "text-ink-muted hover:text-ink"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 rounded-full bg-black/[0.03] px-3.5 py-1.5 text-sm">
                <UserCircle className="h-4 w-4 text-secondary" />
                <span className="font-semibold text-ink">
                  {user.name.split(",")[0]}
                </span>
                <span className="text-xs text-ink-muted">
                  ({user.role === "family" ? "Keluarga" : "Caregiver"})
                </span>
              </div>
              <button
                onClick={() => setConfirmLogoutOpen(true)}
                title="Keluar"
                className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-ink-muted transition-colors hover:bg-red-50 hover:text-danger cursor-pointer"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Keluar</span>
              </button>
            </div>
          ) : (
            <>
              <Link
                href="/login"
                className="nav-link-underline py-1 text-sm font-medium text-ink transition-colors"
              >
                Masuk
              </Link>
              <Link
                href="/register"
                className="btn-diagonal-secondary rounded-full bg-primary px-5 py-2 text-sm font-semibold text-white shadow-sm"
              >
                Daftar
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-black/[0.06] bg-white/80 text-ink transition-colors hover:bg-white md:hidden cursor-pointer"
          aria-label="Buka menu navigasi"
          aria-expanded={menuOpen}
        >
          {menuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {/* Mobile Glassmorphic Drawer */}
      <div
        className={`mx-auto max-w-7xl overflow-hidden transition-all duration-300 ease-out md:hidden ${
          menuOpen
            ? "mt-2.5 max-h-96 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="rounded-2xl border border-white/70 bg-white/85 p-4 shadow-[0_18px_40px_-14px_rgba(15,23,42,0.16)] ring-1 ring-black/[0.05] backdrop-blur-xl">
          <div className="flex flex-col gap-1">
            {navLinks.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={`rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors ${
                    active
                      ? "bg-primary/[0.06] text-ink"
                      : "text-ink-muted hover:bg-black/[0.03] hover:text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
          <div className="mt-3 border-t border-black/[0.06] pt-3">
            {user ? (
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2 text-sm">
                  <UserCircle className="h-4 w-4 text-secondary" />
                  <span className="font-semibold text-ink">
                    {user.name.split(",")[0]}
                  </span>
                </div>
                <button
                  onClick={() => {
                    setMenuOpen(false);
                    setConfirmLogoutOpen(true);
                  }}
                  className="rounded-xl bg-red-50 px-3 py-1.5 text-xs font-semibold text-danger cursor-pointer"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                <Link
                  href="/login"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full border border-black/[0.08] bg-white/80 py-2.5 text-center text-sm font-semibold text-ink transition-colors hover:bg-white"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMenuOpen(false)}
                  className="rounded-full bg-primary py-2.5 text-center text-sm font-semibold text-white transition-colors hover:bg-primary"
                >
                  Daftar
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmLogoutOpen}
        title="Keluar dari Lentera?"
        description="Anda akan keluar dari sesi saat ini dan perlu masuk kembali untuk mengakses data perawatan."
        confirmLabel="Ya, Keluar"
        tone="danger"
        onConfirm={() => {
          setConfirmLogoutOpen(false);
          logout();
        }}
        onCancel={() => setConfirmLogoutOpen(false)}
      />
    </header>
  );
}
