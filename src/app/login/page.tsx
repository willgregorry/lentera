"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowRight, KeyRound, Stethoscope, Users } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LenteraMascot } from "@/components/shared/LenteraMascot";
import { apiService } from "@/services/api";
import { UserRole } from "@/types";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole =
    searchParams.get("role") === "caregiver" ? "caregiver" : "family";

  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [infoMsg, setInfoMsg] = useState<string | null>(null);

  useEffect(() => {
    const paramRole = searchParams.get("role");
    if (paramRole === "caregiver" || paramRole === "family") {
      setRole(paramRole);
    }
  }, [searchParams]);

  function fillDemo(targetRole: UserRole) {
    setRole(targetRole);
    if (targetRole === "family") {
      setEmail("budi@lentera.id");
      setPassword("lenteraku2026");
      setInfoMsg("Akun demo Keluarga (Budi Santoso) siap digunakan.");
    } else {
      setEmail("rini@lentera.id");
      setPassword("lenteraku2026");
      setInfoMsg("Akun demo Caregiver (Rini Wulandari) siap digunakan.");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setInfoMsg(null);
    try {
      const res = await apiService.loginUser({ email, password, role });
      router.push(res.user.role === "caregiver" ? "/caregiver" : "/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
      <div className="rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] p-7">
        <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-5">
          <div>
            <h1 className="font-display text-2xl font-bold text-[#1F2937]">
              Masuk ke Lentera
            </h1>
            <p className="mt-1 text-sm text-[#6B7280]">
              Pilih peran Anda untuk melanjutkan.
            </p>
          </div>
          <LenteraMascot status="aman" size="sm" />
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setRole("family")}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl border px-3 py-3 text-center transition-colors cursor-pointer ${
              role === "family"
                ? "border-[#E8912E] bg-[#FDFDFD] text-[#E8912E]"
                : "border-[#E5E5E5] bg-[#FFFFFF] text-[#6B7280] hover:bg-[#FDFDFD]"
            }`}
          >
            <div className="flex items-center gap-1.5 text-sm font-semibold">
              <Users className="h-4 w-4" />
              <span>Keluarga</span>
            </div>
            <span className="text-[11px] font-normal text-[#6B7280]">
              Butuh Caregiver
            </span>
          </button>

          <button
            type="button"
            onClick={() => setRole("caregiver")}
            className={`flex flex-col items-center justify-center gap-1 rounded-xl border px-3 py-3 text-center transition-colors cursor-pointer ${
              role === "caregiver"
                ? "border-[#4A7C59] bg-[#EDF4EF] text-[#355E42]"
                : "border-[#E5E5E5] bg-[#FFFFFF] text-[#6B7280] hover:bg-[#FDFDFD]"
            }`}
          >
            <div className="flex items-center gap-1.5 text-sm font-semibold">
              <Stethoscope className="h-4 w-4" />
              <span>Caregiver</span>
            </div>
            <span className="text-[11px] font-normal text-[#6B7280]">
              Perawat Lansia
            </span>
          </button>
        </div>

        <button
          type="button"
          onClick={async () => {
            setLoading(true);
            try {
              const res = await apiService.loginUser({
                email: role === "family" ? "budi@lentera.id" : "rini@lentera.id",
                password: "google-oauth-session",
                role,
              });
              router.push(res.user.role === "caregiver" ? "/caregiver" : "/dashboard");
            } finally {
              setLoading(false);
            }
          }}
          disabled={loading}
          className="mt-4 flex w-full items-center justify-center gap-2.5 rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] px-4 py-2.5 text-sm font-semibold text-[#1F2937] hover:bg-[#FDFDFD] transition-colors cursor-pointer disabled:opacity-60"
        >
          <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.08 3.56-5.15 3.56-8.65z"/>
            <path fill="#34A853" d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.95H1.28v3.09A12 12 0 0 0 12 24z"/>
            <path fill="#FBBC05" d="M5.28 14.29A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.38-2.29V6.62H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.38l4-3.09z"/>
            <path fill="#EA4335" d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.62l4 3.09c.95-2.84 3.6-4.96 6.72-4.96z"/>
          </svg>
          <span>Lanjutkan dengan Google</span>
        </button>

        <div className="mt-5 border-y border-[#E5E5E5] py-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[#1F2937]">
            <KeyRound className="h-3.5 w-3.5 text-[#E8912E]" />
            <span>Isi Cepat Akun Demo:</span>
          </div>
          <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => fillDemo("family")}
              className="rounded-xl border border-[#E5E5E5] bg-[#FDFDFD] px-3 py-2 text-left text-xs font-medium text-[#1F2937] hover:border-[#E8912E] transition-colors cursor-pointer"
            >
              <span className="block font-semibold text-[#E8912E]">
                Demo Keluarga: Budi
              </span>
              <span className="text-[#6B7280]">budi@lentera.id</span>
            </button>
            <button
              type="button"
              onClick={() => fillDemo("caregiver")}
              className="rounded-xl border border-[#E5E5E5] bg-[#FDFDFD] px-3 py-2 text-left text-xs font-medium text-[#1F2937] hover:border-[#4A7C59] transition-colors cursor-pointer"
            >
              <span className="block font-semibold text-[#4A7C59]">
                Demo Caregiver: Rini
              </span>
              <span className="text-[#6B7280]">rini@lentera.id</span>
            </button>
          </div>
        </div>

        {infoMsg && (
          <div className="mt-4 border-l-4 border-[#4A7C59] bg-[#EDF4EF] px-4 py-2.5 text-xs font-medium text-[#355E42]">
            {infoMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label
              htmlFor="login-email"
              className="block text-xs font-semibold text-[#1F2937]"
            >
              Email
            </label>
            <input
              id="login-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={
                role === "family" ? "budi@lentera.id" : "rini@lentera.id"
              }
              className="mt-1.5 w-full rounded-xl border border-[#E5E5E5] bg-[#FDFDFD] px-3.5 py-2.5 text-sm text-[#1F2937] focus:border-[#E8912E] focus:bg-[#FFFFFF] focus:outline-none"
            />
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="block text-xs font-semibold text-[#1F2937]"
            >
              Kata Sandi
            </label>
            <input
              id="login-password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi"
              className="mt-1.5 w-full rounded-xl border border-[#E5E5E5] bg-[#FDFDFD] px-3.5 py-2.5 text-sm text-[#1F2937] focus:border-[#E8912E] focus:bg-[#FFFFFF] focus:outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E8912E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#D47E1F] disabled:opacity-60 transition-colors cursor-pointer"
          >
            <span>
              {loading
                ? "Memproses..."
                : role === "family"
                ? "Masuk ke Dashboard Keluarga"
                : "Masuk ke Portal Caregiver"}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#6B7280]">
          Belum punya akun?{" "}
          <Link
            href="/register"
            className="font-semibold text-[#E8912E] hover:underline"
          >
            Daftar sekarang
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FDFDFD]">
      <Navbar />
      <main className="flex-1">
        <Suspense
          fallback={
            <div className="mx-auto max-w-lg px-4 py-12 text-center text-sm text-[#6B7280]">
              Memuat halaman masuk...
            </div>
          }
        >
          <LoginFormContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
