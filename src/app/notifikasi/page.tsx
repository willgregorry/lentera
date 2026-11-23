"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Bell, Clock, Lock, Pill, Users, Utensils } from "lucide-react";
import { AppShell } from "@/components/layout/AppShell";
import { SosAlertBanner } from "@/components/dashboard/SosAlertBanner";
import { useAuth } from "@/hooks/useAuth";
import { useAssignmentStatus } from "@/hooks/useAssignmentStatus";
import { useDashboardData } from "@/hooks/useDashboardData";
import { CareLog } from "@/types";

const MEAL_LABEL: Record<CareLog["meal_portion"], string> = {
  habis: "Makan Habis",
  setengah: "Setengah Porsi",
  sedikit: "Makan Sedikit",
  tidak_makan: "Belum Makan",
};

export default function NotifikasiLaporanPage() {
  const router = useRouter();
  const { user, hydrated } = useAuth();
  const { loading: checkingStatus, hasCaregiver } = useAssignmentStatus();
  const { elderly, logs, notifications, activeSos, resolveSos } =
    useDashboardData();

  useEffect(() => {
    if (hydrated && !user) {
      router.replace("/login?role=family");
      return;
    }
    if (hydrated && user && user.role === "caregiver") {
      router.replace("/caregiver");
    }
  }, [hydrated, user, router]);

  if (!hydrated || !user || user.role !== "family") {
    return (
      <AppShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <p className="text-sm font-medium text-ink-muted">
            Memeriksa sesi masuk...
          </p>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <div className="border-b border-border pb-5">
        <p className="text-xs font-semibold text-secondary sm:text-sm">
          Notifikasi & Laporan Perawat
        </p>
        <h1 className="mt-1 font-display text-xl font-bold text-ink sm:text-3xl">
          Laporan Masuk dari Perawat
        </h1>
        <p className="mt-1 text-xs text-ink-muted sm:text-sm">
          Semua catatan harian, foto aktivitas, dan pemberitahuan darurat yang
          dikirimkan perawat untuk orang tua Anda.
        </p>
      </div>

      {checkingStatus ? (
        <p className="py-16 text-center text-sm text-ink-muted">
          Memuat laporan masuk...
        </p>
      ) : !hasCaregiver ? (
        <div className="mt-8 rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-border-subtle text-ink-muted">
            <Lock className="h-5 w-5" />
          </div>
          <h2 className="mt-4 font-display text-lg font-bold text-ink">
            Laporan Masuk Belum Tersedia
          </h2>
          <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-ink-muted sm:text-sm">
            Anda belum memiliki perawat yang bertugas. Pilih perawat terlebih
            dahulu agar laporan harian mulai masuk di sini.
          </p>
          <Link
            href="/caregivers"
            className="btn-diagonal-secondary mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white sm:text-sm"
          >
            <Users className="h-4 w-4" />
            <span>Cari Perawat Sekarang</span>
          </Link>
        </div>
      ) : (
        <div className="mt-6 space-y-6">
          {activeSos && (
            <SosAlertBanner
              alert={activeSos}
              elderly={elderly}
              onResolve={resolveSos}
            />
          )}

          {notifications.length > 0 && (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <div
                  key={notif.id}
                  className="rounded-xl border border-border bg-surface p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold text-ink">
                      {notif.title}
                    </span>
                    <span className="text-xs text-ink-muted">
                      {new Date(notif.created_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-ink-muted sm:text-sm">
                    {notif.message}
                  </p>
                </div>
              ))}
            </div>
          )}

          {logs.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-border bg-surface px-6 py-14 text-center">
              <Bell className="mx-auto h-8 w-8 text-ink-muted" />
              <p className="mt-3 text-sm font-semibold text-ink">
                Belum ada laporan harian masuk
              </p>
              <p className="mt-1 text-xs text-ink-muted">
                Setiap kali perawat mencatat kondisi, makanan, atau obat orang
                tua Anda, laporannya akan langsung muncul di sini.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {[...logs].reverse().map((log) => (
                <article
                  key={log.id}
                  className="rounded-2xl border border-border bg-surface p-5"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border-subtle pb-3">
                    <div>
                      <p className="text-sm font-bold text-ink">
                        {log.caregiver_name || "Perawat Bertugas"}
                      </p>
                      <p className="text-xs text-ink-muted">
                        Laporan Pemantauan Harian
                      </p>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-xs text-ink-muted">
                      <Clock className="h-3.5 w-3.5" />
                      {new Date(log.logged_at).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}{" "}
                      ·{" "}
                      {new Date(log.logged_at).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}{" "}
                      WIB
                    </span>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-xl bg-canvas-subtle p-3">
                      <p className="text-[11px] text-ink-muted">Tekanan Darah</p>
                      <p className="mt-0.5 text-base font-bold tabular-nums text-ink">
                        {log.systolic}/{log.diastolic} mmHg
                      </p>
                    </div>
                    <div className="rounded-xl bg-canvas-subtle p-3">
                      <p className="text-[11px] text-ink-muted">Detak Nadi</p>
                      <p className="mt-0.5 text-base font-bold tabular-nums text-ink">
                        {log.heart_rate} bpm
                      </p>
                    </div>
                    <div className="rounded-xl bg-canvas-subtle p-3">
                      <p className="inline-flex items-center gap-1 text-[11px] text-ink-muted">
                        <Utensils className="h-3 w-3" /> Porsi Makan
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-secondary">
                        {MEAL_LABEL[log.meal_portion]}
                      </p>
                    </div>
                    <div className="rounded-xl bg-canvas-subtle p-3">
                      <p className="inline-flex items-center gap-1 text-[11px] text-ink-muted">
                        <Pill className="h-3 w-3" /> Obat Rutin
                      </p>
                      <p className="mt-0.5 text-sm font-semibold text-ink">
                        {log.medication_taken ? "Sudah diminum" : "Belum diminum"}
                      </p>
                    </div>
                  </div>

                  {log.notes && (
                    <p className="mt-4 text-sm leading-relaxed text-ink">
                      {log.notes}
                    </p>
                  )}

                  {log.photo_url && (
                    <img
                      src={log.photo_url}
                      alt="Dokumentasi aktivitas harian orang tua"
                      className="mt-4 max-h-72 w-full rounded-xl border border-border object-cover"
                    />
                  )}
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </AppShell>
  );
}
