"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MapPin, Search, ShieldCheck, Stethoscope, UserPlus } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/types";

export default function CaregiverDirectoryPage() {
  const router = useRouter();
  const { user, hydrated } = useAuth();
  const [caregivers, setCaregivers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [invitedIds, setInvitedIds] = useState<string[]>([]);

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login?role=family");
      return;
    }
    if (hydrated && user && user.role === "caregiver") {
      router.replace("/caregiver");
    }
  }, [hydrated, user, router]);

  useEffect(() => {
    let active = true;
    async function loadCaregivers() {
      setLoading(true);
      try {
        if (supabase) {
          const { data } = await supabase
            .from("profiles")
            .select("*")
            .eq("role", "caregiver")
            .order("created_at", { ascending: false });
          if (active && data) {
            setCaregivers(
              data.map((row) => ({
                id: row.id,
                name: row.full_name,
                email: row.email,
                role: "caregiver",
                phone: row.phone || "",
                city: row.location || "Indonesia",
                verified: Boolean(row.is_verified ?? true),
                skills: Array.isArray(row.skills) ? row.skills : [],
                experience_years: Number(row.experience_years || 0),
                bio: row.bio || "",
              }))
            );
          }
        }
      } finally {
        if (active) setLoading(false);
      }
    }
    loadCaregivers();
    return () => {
      active = false;
    };
  }, []);

  if (!hydrated || !user || user.role !== "family") {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm font-medium text-ink-muted">
            Memeriksa akses halaman...
          </p>
        </div>
      </AppShell>
    );
  }

  const filtered = caregivers.filter((cg) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      cg.name.toLowerCase().includes(q) ||
      (cg.city || "").toLowerCase().includes(q) ||
      (cg.skills || []).some((s) => s.toLowerCase().includes(q))
    );
  });

  function handleInvite(id: string) {
    setInvitedIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  }

  return (
    <AppShell>
      <div className="flex flex-col justify-between gap-4 border-b border-border pb-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-xs font-semibold text-secondary sm:text-sm">
            Direktori Perawat Lansia
          </p>
          <h1 className="mt-1 font-display text-xl font-bold text-ink sm:text-3xl">
            Temukan Caregiver untuk Orang Tua
          </h1>
          <p className="mt-1 text-xs text-ink-muted sm:text-sm">
            Telusuri daftar perawat lansia terdaftar atau pasang lowongan khusus
            sesuai kebutuhan medis keluarga Anda.
          </p>
        </div>

        <Link
          href="/loker"
          className="btn-diagonal-secondary inline-flex shrink-0 items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-xs font-semibold text-white sm:text-sm"
        >
          <UserPlus className="h-4 w-4" />
          <span>Pasang Lowongan</span>
        </Link>
      </div>

      {/* Search Bar */}
      <div className="mt-5">
        <div className="relative max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Cari nama, kota, atau keahlian..."
            className="w-full rounded-xl border border-border bg-surface py-2.5 pr-4 pl-10 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      {/* Caregiver Grid */}
      <div className="mt-6">
        {loading ? (
          <p className="py-12 text-center text-sm text-ink-muted">
            Memuat daftar caregiver...
          </p>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-12 text-center">
            <Stethoscope className="mx-auto h-8 w-8 text-ink-muted" />
            <p className="mt-3 text-sm font-semibold text-ink">
              Belum ada caregiver yang sesuai
            </p>
            <p className="mt-1 text-xs text-ink-muted">
              Caregiver yang mendaftar akan otomatis tampil di sini. Anda juga
              bisa langsung memasang lowongan di halaman Loker.
            </p>
            <Link
              href="/loker"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white"
            >
              Buka Halaman Loker
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((cg) => {
              const invited = invitedIds.includes(cg.id);
              return (
                <div
                  key={cg.id}
                  className="flex flex-col justify-between rounded-2xl border border-border bg-surface p-5 transition-shadow hover:shadow-sm"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h2 className="font-display text-base font-bold text-ink">
                          {cg.name}
                        </h2>
                        <p className="mt-0.5 inline-flex items-center gap-1 text-xs text-ink-muted">
                          <MapPin className="h-3.5 w-3.5" />
                          <span>{cg.city || "Indonesia"}</span>
                        </p>
                      </div>
                      {cg.verified && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-secondary-soft px-2.5 py-0.5 text-[11px] font-semibold text-secondary">
                          <ShieldCheck className="h-3 w-3" />
                          <span>Terverifikasi</span>
                        </span>
                      )}
                    </div>

                    {cg.bio && (
                      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-ink-muted">
                        {cg.bio}
                      </p>
                    )}

                    {cg.skills && cg.skills.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {cg.skills.slice(0, 3).map((skill) => (
                          <span
                            key={skill}
                            className="rounded-md bg-border-subtle px-2 py-0.5 text-[11px] font-medium text-ink"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={invited}
                    onClick={() => handleInvite(cg.id)}
                    className={`mt-5 w-full rounded-xl py-2 text-xs font-semibold transition-colors cursor-pointer ${
                      invited
                        ? "bg-secondary-soft text-secondary"
                        : "bg-primary text-white hover:bg-primary-hover"
                    }`}
                  >
                    {invited ? "Undangan Terkirim" : "Undang untuk Wawancara"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </AppShell>
  );
}
