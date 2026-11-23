"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { LenteraMascot } from "@/components/shared/LenteraMascot";
import { apiService } from "@/services/api";
import { UserRole } from "@/types";

function formatAuthError(err: unknown): string {
  const msg = err instanceof Error ? err.message.toLowerCase() : "";
  if (msg.includes("invalid login credentials")) {
    return "Email atau kata sandi yang Anda masukkan salah.";
  }
  if (msg.includes("email not confirmed")) {
    return "Email Anda belum terverifikasi. Silakan cek kotak masuk email Anda.";
  }
  return err instanceof Error && err.message
    ? err.message
    : "Gagal masuk. Periksa kembali email dan kata sandi Anda.";
}

function LoginFormContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialRole: UserRole =
    searchParams.get("role") === "caregiver" ? "caregiver" : "family";

  const [role, setRole] = useState<UserRole>(initialRole);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiService.loginUser({ email, password, role });
      router.push(res.user.role === "caregiver" ? "/loker" : "/caregivers");
    } catch (err) {
      setErrorMsg(formatAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex w-full max-w-sm flex-col justify-center">
      <Link href="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
        <LenteraMascot status="aman" size="sm" />
        <span className="font-display text-lg font-bold text-ink">Lentera</span>
      </Link>

      <div>
        <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
          Selamat datang kembali
        </h1>
        <p className="mt-1.5 text-sm text-ink-muted">
          Masuk ke akun keluarga atau caregiver Anda.
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 rounded-lg bg-border-subtle p-1">
        <button
          type="button"
          onClick={() => setRole("family")}
          className={`rounded-md py-2 text-sm font-medium transition-all cursor-pointer ${
            role === "family"
              ? "bg-surface text-ink shadow-xs"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          Keluarga
        </button>
        <button
          type="button"
          onClick={() => setRole("caregiver")}
          className={`rounded-md py-2 text-sm font-medium transition-all cursor-pointer ${
            role === "caregiver"
              ? "bg-surface text-ink shadow-xs"
              : "text-ink-muted hover:text-ink"
          }`}
        >
          Caregiver
        </button>
      </div>

      {errorMsg && (
        <div
          role="alert"
          className="mt-5 rounded-xl border border-danger/25 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-danger"
        >
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div>
          <label
            htmlFor="login-email"
            className="block text-sm font-medium text-ink"
          >
            Email
          </label>
          <input
            id="login-email"
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (errorMsg) setErrorMsg(null);
            }}
            placeholder="nama@email.com"
            className="mt-1.5 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="login-password"
            className="block text-sm font-medium text-ink"
          >
            Kata Sandi
          </label>
          <div className="relative mt-1.5">
            <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errorMsg) setErrorMsg(null);
              }}
              placeholder="••••••••"
              className="w-full rounded-lg border border-border bg-surface py-2.5 pr-10 pl-3.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={
                showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"
              }
              className="absolute top-1/2 right-3 -translate-y-1/2 text-ink-muted transition-colors hover:text-ink cursor-pointer"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-diagonal-secondary w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-white disabled:opacity-60 cursor-pointer"
        >
          {loading ? "Memproses..." : "Masuk"}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-ink-muted">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="font-semibold text-ink underline underline-offset-4 hover:text-primary"
        >
          Daftar
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="grid min-h-screen bg-surface lg:grid-cols-2">
      {/* Left Visual Panel */}
      <div className="relative hidden p-4 lg:block">
        <div className="relative flex h-full w-full flex-col justify-between overflow-hidden rounded-3xl bg-canvas-subtle p-10">
          <img
            src="/images/auth_care.jpg"
            alt="Pendampingan lansia yang hangat bersama Lentera"
            className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/20"
          />

          <Link href="/" className="relative z-10 inline-flex items-center gap-2.5">
            <LenteraMascot status="aman" size="sm" />
            <span className="font-display text-lg font-bold text-white">
              Lentera
            </span>
          </Link>

          <div className="relative z-10 max-w-md">
            <p className="font-display text-2xl font-bold leading-snug text-white">
              Ketenangan keluarga dimulai dari perawatan yang terpercaya.
            </p>
            <p className="mt-2 text-sm text-white/80">
              Pantau kesehatan orang tua di rumah dan terhubung langsung dengan
              caregiver profesional.
            </p>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <main className="flex items-center justify-center px-6 py-12 sm:px-10">
        <Suspense
          fallback={
            <div className="py-16 text-center text-sm text-ink-muted">
              Memuat...
            </div>
          }
        >
          <LoginFormContent />
        </Suspense>
      </main>
    </div>
  );
}
