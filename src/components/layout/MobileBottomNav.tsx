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
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

export function MobileBottomNav() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const isCaregiver = user.role === "caregiver";

  return (
    <nav
      aria-label="Navigasi Mobile"
      className="fixed right-0 bottom-0 left-0 z-50 border-t border-black/[0.06] bg-white/90 px-2 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden"
    >
      <div className="mx-auto flex max-w-md items-center justify-around">
        {isCaregiver ? (
          <>
            <Link
              href="/caregiver"
              className={`flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-3 text-[11px] font-semibold transition-colors ${
                pathname === "/caregiver"
                  ? "text-[#111827]"
                  : "text-[#6B7280]"
              }`}
            >
              <ClipboardPlus className="h-5 w-5" />
              <span>Catat</span>
            </Link>
            <Link
              href="/loker"
              className={`flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-3 text-[11px] font-semibold transition-colors ${
                pathname === "/loker" ? "text-[#111827]" : "text-[#6B7280]"
              }`}
            >
              <Briefcase className="h-5 w-5" />
              <span>Loker</span>
            </Link>
            <Link
              href="/caregiver#sos-panel"
              className="flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-3 text-[11px] font-semibold text-[#DC4A3D]"
            >
              <AlertTriangle className="h-5 w-5" />
              <span>SOS</span>
            </Link>
          </>
        ) : (
          <>
            <Link
              href="/dashboard"
              className={`flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-4 text-[11px] font-semibold transition-colors ${
                pathname === "/dashboard"
                  ? "text-[#111827]"
                  : "text-[#6B7280]"
              }`}
            >
              <Activity className="h-5 w-5" />
              <span>Pantau</span>
            </Link>
            <Link
              href="/loker"
              className={`flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-4 text-[11px] font-semibold transition-colors ${
                pathname === "/loker" ? "text-[#111827]" : "text-[#6B7280]"
              }`}
            >
              <Briefcase className="h-5 w-5" />
              <span>Loker</span>
            </Link>
          </>
        )}

        <button
          type="button"
          onClick={logout}
          className="flex min-h-[48px] flex-col items-center justify-center gap-1 rounded-xl px-3 text-[11px] font-semibold text-[#6B7280] hover:text-[#DC4A3D] cursor-pointer"
        >
          <LogOut className="h-5 w-5" />
          <span>Keluar</span>
        </button>
      </div>
    </nav>
  );
}
