"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, Stethoscope, Users } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LenteraMascot } from "@/components/shared/LenteraMascot";
import { apiService } from "@/services/api";
import { UserRole } from "@/types";

export default function RegisterPage() {
  const router = useRouter();
  const [role, setRole] = useState<UserRole>("family");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("Jakarta Selatan");
  const [skillsText, setSkillsText] = useState(
    "Hipertensi & Diabetes, Pencegahan Jatuh"
  );
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const skills =
        role === "caregiver"
          ? skillsText
              .split(",")
              .map((s) => s.trim())
              .filter(Boolean)
          : [];
      const res = await apiService.registerUser({
        name,
        email,
        password,
        role,
        phone,
        city,
        skills,
      });
      router.push(res.user.role === "caregiver" ? "/loker" : "/dashboard");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#FDFDFD]">
      <Navbar />
      <main className="flex-1">
        <div className="mx-auto max-w-lg px-4 py-12 sm:px-6">
          <div className="rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] p-7">
            <div className="flex items-center justify-between border-b border-[#E5E5E5] pb-5">
              <div>
                <h1 className="font-display text-2xl font-bold text-[#1F2937]">
                  Buat Akun Lentera
                </h1>
                <p className="mt-1 text-sm text-[#6B7280]">
                  Mulai pendampingan orang tua dengan lebih tenang.
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
                  router.push(res.user.role === "caregiver" ? "/loker" : "/dashboard");
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
              <span>Daftar dengan Google</span>
            </button>

            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1F2937]">
                  Nama Lengkap
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={
                    role === "family"
                      ? "Contoh: Budi Santoso"
                      : "Contoh: Rini Wulandari, A.Md.Kep"
                  }
                  className="mt-1.5 w-full rounded-xl border border-[#E5E5E5] bg-[#FDFDFD] px-3.5 py-2.5 text-sm text-[#1F2937] focus:border-[#E8912E] focus:bg-[#FFFFFF] focus:outline-none"
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold text-[#1F2937]">
                    Email
                  </label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@email.com"
                    className="mt-1.5 w-full rounded-xl border border-[#E5E5E5] bg-[#FDFDFD] px-3.5 py-2.5 text-sm text-[#1F2937] focus:border-[#E8912E] focus:bg-[#FFFFFF] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#1F2937]">
                    No. WhatsApp / Telepon
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0812-xxxx-xxxx"
                    className="mt-1.5 w-full rounded-xl border border-[#E5E5E5] bg-[#FDFDFD] px-3.5 py-2.5 text-sm text-[#1F2937] focus:border-[#E8912E] focus:bg-[#FFFFFF] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1F2937]">
                  Kota / Wilayah Domisili
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-[#E5E5E5] bg-[#FDFDFD] px-3.5 py-2.5 text-sm text-[#1F2937] focus:border-[#E8912E] focus:bg-[#FFFFFF] focus:outline-none"
                />
              </div>

              {role === "caregiver" && (
                <div>
                  <label className="block text-xs font-semibold text-[#1F2937]">
                    Keahlian Utama (pisahkan koma)
                  </label>
                  <input
                    type="text"
                    value={skillsText}
                    onChange={(e) => setSkillsText(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-[#E5E5E5] bg-[#FDFDFD] px-3.5 py-2.5 text-sm text-[#1F2937] focus:border-[#4A7C59] focus:bg-[#FFFFFF] focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-[#1F2937]">
                  Kata Sandi
                </label>
                <input
                  type="password"
                  required
                  minLength={6}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimal 6 karakter"
                  className="mt-1.5 w-full rounded-xl border border-[#E5E5E5] bg-[#FDFDFD] px-3.5 py-2.5 text-sm text-[#1F2937] focus:border-[#E8912E] focus:bg-[#FFFFFF] focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#E8912E] px-5 py-3 text-sm font-semibold text-white hover:bg-[#D47E1F] disabled:opacity-60 transition-colors cursor-pointer"
              >
                <span>{loading ? "Mendaftarkan..." : "Daftar Sekarang"}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            <p className="mt-6 text-center text-xs text-[#6B7280]">
              Sudah punya akun?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#E8912E] hover:underline"
              >
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
