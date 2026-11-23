"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { LenteraMascot } from "@/components/shared/LenteraMascot";
import { apiService } from "@/services/api";
import { UserRole } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("family");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiService.registerUser({
        name,
        email,
        password,
        role,
        phone,
        city,
        skills: [],
      });
      router.push(res.user.role === "caregiver" ? "/loker" : "/caregivers");
    } catch (err) {
      setErrorMsg(
        err instanceof Error
          ? err.message
          : "Gagal mendaftarkan akun. Coba lagi."
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleRegister() {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await apiService.loginUser({
        email: role === "family" ? "budi@lentera.id" : "rini@lentera.id",
        password: "google-oauth-session",
        role,
      });
      router.push(res.user.role === "caregiver" ? "/loker" : "/caregivers");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal masuk dengan Google."
      );
    } finally {
      setLoading(false);
    }
  }

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
              Mulai pendampingan orang tua dengan lebih tenang.
            </p>
            <p className="mt-2 text-sm text-white/80">
              Bergabung sebagai keluarga atau caregiver terverifikasi dalam
              hitungan menit.
            </p>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <main className="flex items-center justify-center px-6 py-12 sm:px-10">
        <div className="mx-auto flex w-full max-w-sm flex-col justify-center">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 lg:hidden">
            <LenteraMascot status="aman" size="sm" />
            <span className="font-display text-lg font-bold text-ink">
              Lentera
            </span>
          </Link>

          <div>
            <h1 className="font-display text-2xl font-bold tracking-tight text-ink sm:text-3xl">
              Buat akun Lentera
            </h1>
            <p className="mt-1.5 text-sm text-ink-muted">
              Pilih peran Anda untuk memulai.
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
              className="mt-4 rounded-xl border border-danger/25 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-danger"
            >
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
            <div>
              <label className="block text-sm font-medium text-ink">
                Nama Lengkap
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama lengkap Anda"
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-ink">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@email.com"
                className="mt-1 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-ink">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="0812xxxx"
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-ink">
                  Kota
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Jakarta"
                  className="mt-1 w-full rounded-lg border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-ink">
                Kata Sandi
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="w-full rounded-lg border border-border bg-surface py-2.5 pr-10 pl-3.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={
                    showPassword
                      ? "Sembunyikan kata sandi"
                      : "Tampilkan kata sandi"
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
              {loading ? "Mendaftarkan..." : "Daftar"}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs text-ink-muted">atau</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={loading}
            className="flex w-full items-center justify-center gap-2.5 rounded-lg border border-border bg-surface py-2.5 text-sm font-medium text-ink transition-colors hover:bg-canvas-subtle disabled:opacity-60 cursor-pointer"
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
            <span>Daftar dengan Google</span>
          </button>

          <p className="mt-6 text-center text-sm text-ink-muted">
            Sudah punya akun?{" "}
            <Link
              href="/login"
              className="font-semibold text-ink underline underline-offset-4 hover:text-primary"
            >
              Masuk
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}
