"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { apiService } from "@/services/api";
import { UserRole } from "@/types";

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole: UserRole =
    searchParams.get("role") === "caregiver" ? "caregiver" : "family";

  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  function fillDemo(targetRole: UserRole) {
    setRole(targetRole);
    setEmail(targetRole === "family" ? "budi@lentera.id" : "rini@lentera.id");
    setPassword("lenteraku2026");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await apiService.loginUser({ email, password, role });
      router.push(res.user.role === "caregiver" ? "/caregiver" : "/dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
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
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col justify-center px-4 py-16">
      <div className="text-center">
        <h1 className="font-display text-2xl font-bold tracking-tight text-[#111827]">
          Masuk ke Lentera
        </h1>
        <p className="mt-1.5 text-sm text-[#6B7280]">
          Masuk sebagai keluarga atau caregiver.
        </p>
      </div>

      {/* Clean segmented role switch */}
      <div className="mt-6 grid grid-cols-2 rounded-lg bg-[#F3F4F6] p-1">
        <button
          type="button"
          onClick={() => setRole("family")}
          className={`rounded-md py-2 text-sm font-medium transition-all cursor-pointer ${
            role === "family"
              ? "bg-[#FFFFFF] text-[#111827] shadow-xs"
              : "text-[#6B7280] hover:text-[#111827]"
          }`}
        >
          Keluarga
        </button>
        <button
          type="button"
          onClick={() => setRole("caregiver")}
          className={`rounded-md py-2 text-sm font-medium transition-all cursor-pointer ${
            role === "caregiver"
              ? "bg-[#FFFFFF] text-[#111827] shadow-xs"
              : "text-[#6B7280] hover:text-[#111827]"
          }`}
        >
          Caregiver
        </button>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-medium text-[#374151]"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nama@email.com"
            className="mt-1.5 w-full rounded-lg border border-[#D1D5DB] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#111827] focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-[#374151]"
          >
            Kata Sandi
          </label>
          <input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            className="mt-1.5 w-full rounded-lg border border-[#D1D5DB] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#111827] placeholder:text-[#9CA3AF] focus:border-[#111827] focus:outline-none"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-[#111827] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#374151] disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#E5E7EB]" />
        <span className="text-xs text-[#9CA3AF]">atau</span>
        <div className="h-px flex-1 bg-[#E5E7EB]" />
      </div>

      <button
        type="button"
        onClick={handleGoogleLogin}
        disabled={loading}
        className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-[#D1D5DB] bg-[#FFFFFF] py-2.5 text-sm font-medium text-[#111827] transition-colors hover:bg-[#F9FAFB] disabled:opacity-60 cursor-pointer"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" aria-hidden="true">
          <path
            fill="#4285F4"
            d="M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.08 3.56-5.15 3.56-8.65z"
          />
          <path
            fill="#34A853"
            d="M12 24c3.24 0 5.95-1.07 7.93-2.91l-3.87-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.72-4.95H1.28v3.09A12 12 0 0 0 12 24z"
          />
          <path
            fill="#FBBC05"
            d="M5.28 14.29A7.2 7.2 0 0 1 4.9 12c0-.79.14-1.56.38-2.29V6.62H1.28A12 12 0 0 0 0 12c0 1.94.46 3.77 1.28 5.38l4-3.09z"
          />
          <path
            fill="#EA4335"
            d="M12 4.75c1.76 0 3.34.61 4.58 1.8l3.44-3.44C17.95 1.19 15.24 0 12 0A12 12 0 0 0 1.28 6.62l4 3.09c.95-2.84 3.6-4.96 6.72-4.96z"
          />
        </svg>
        <span>Lanjutkan dengan Google</span>
      </button>

      <div className="mt-6 flex items-center justify-center gap-3 text-xs text-[#6B7280]">
        <span>Isi cepat demo:</span>
        <button
          type="button"
          onClick={() => fillDemo("family")}
          className="font-medium text-[#111827] underline underline-offset-4 hover:text-[#E8912E] cursor-pointer"
        >
          Keluarga
        </button>
        <span>·</span>
        <button
          type="button"
          onClick={() => fillDemo("caregiver")}
          className="font-medium text-[#111827] underline underline-offset-4 hover:text-[#4A7C59] cursor-pointer"
        >
          Caregiver
        </button>
      </div>

      <p className="mt-6 text-center text-sm text-[#6B7280]">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="font-semibold text-[#111827] underline underline-offset-4 hover:text-[#E8912E]"
        >
          Daftar
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FFFFFF]">
      <Navbar />
      <main className="flex flex-1 items-center justify-center">
        <Suspense
          fallback={
            <div className="py-16 text-center text-sm text-[#6B7280]">
              Memuat...
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
