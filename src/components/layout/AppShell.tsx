"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Activity,
  AlertTriangle,
  Briefcase,
  ClipboardPlus,
  LogOut,
  UserCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { LenteraMascot } from "@/components/shared/LenteraMascot";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const { user, logout } = useAuth();
  const isCaregiver = user?.role === "caregiver";

  const links = isCaregiver
    ? [
        { href: "/caregiver", label: "Portal Caregiver", icon: ClipboardPlus },
        { href: "/loker", label: "Loker Caregiver", icon: Briefcase },
        {
          href: "/caregiver#sos-panel",
          label: "Darurat SOS",
          icon: AlertTriangle,
          danger: true,
        },
      ]
    : [
        { href: "/dashboard", label: "Dashboard", icon: Activity },
        { href: "/loker", label: "Loker Caregiver", icon: Briefcase },
      ];

  return (
    <div className="flex min-h-screen bg-[#F7F8F9] text-[#1F2937]">
      {/* Desktop Sidebar */}
      <aside className="hidden w-60 shrink-0 flex-col justify-between border-r border-[#E5E5E5] bg-[#FFFFFF] px-4 py-6 md:flex">
        <div>
          <Link href="/" className="flex items-center gap-2.5 px-2">
            <LenteraMascot status="aman" size="sm" />
            <span className="font-display text-lg font-bold tracking-tight text-[#111827]">
              Lentera
            </span>
          </Link>

          <nav className="mt-8 space-y-1">
            {links.map((item) => {
              const Icon = item.icon;
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                    item.danger
                      ? "text-[#DC4A3D] hover:bg-red-50"
                      : active
                      ? "bg-[#111827] text-white"
                      : "text-[#4B5563] hover:bg-[#F3F4F6] hover:text-[#111827]"
                  }`}
                >
                  <Icon className="h-4 w-4 shrink-0" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {user && (
          <div className="border-t border-[#E5E5E5] pt-4">
            <div className="flex items-center gap-2.5 px-2">
              <UserCircle className="h-8 w-8 shrink-0 text-[#4A7C59]" />
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-[#111827]">
                  {user.name.split(",")[0]}
                </p>
                <p className="text-xs text-[#6B7280]">
                  {isCaregiver ? "Caregiver" : "Keluarga"}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={logout}
              className="mt-3 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-xs font-semibold text-[#6B7280] transition-colors hover:bg-red-50 hover:text-[#DC4A3D] cursor-pointer"
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar</span>
            </button>
          </div>
        )}
      </aside>

      {/* Main Column */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Compact Mobile Top Bar */}
        <header className="sticky top-0 z-30 flex items-center justify-between border-b border-[#E5E5E5] bg-[#FFFFFF]/90 px-4 py-3 backdrop-blur-md md:hidden">
          <Link href="/" className="flex items-center gap-2">
            <LenteraMascot status="aman" size="sm" />
            <span className="font-display text-base font-bold text-[#111827]">
              Lentera
            </span>
          </Link>
          {user && (
            <span className="rounded-full bg-[#F3F4F6] px-3 py-1 text-xs font-medium text-[#4B5563]">
              {isCaregiver ? "Caregiver" : "Keluarga"}
            </span>
          )}
        </header>

        <main className="mx-auto w-full max-w-5xl flex-1 px-4 pt-6 pb-24 sm:px-8 sm:py-8 md:pb-10">
          {children}
        </main>
      </div>

      <MobileBottomNav />
    </div>
  );
}
