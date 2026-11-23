"use client";

import React, { useEffect, useState } from "react";
import { CalendarCheck, Check, Clock, MapPin, MessageCircle, X } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { UserProfile } from "@/types";

interface InterviewInvite {
  id: string;
  title: string;
  body: string;
  created_at: string;
  status: "pending" | "accepted" | "declined";
  family_id: string;
  family_name: string;
  family_phone: string;
  family_city: string;
  raw_metadata: Record<string, unknown>;
}

function formatWaNumber(rawPhone?: string): string {
  const digits = (rawPhone || "").replace(/[^\d]/g, "");
  if (!digits) return "";
  if (digits.startsWith("0")) return `62${digits.slice(1)}`;
  if (digits.startsWith("62")) return digits;
  return `62${digits}`;
}

interface CaregiverInvitesSectionProps {
  user: UserProfile;
}

export function CaregiverInvitesSection({
  user,
}: CaregiverInvitesSectionProps) {
  const [invites, setInvites] = useState<InterviewInvite[]>([]);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function fetchInvites() {
      if (!supabase) return;
      const { data } = await supabase
        .from("notifications")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", "job")
        .order("created_at", { ascending: false });

      if (!data || !active) return;

      const mapped: InterviewInvite[] = data
        .filter((row) => {
          const meta = (row.metadata || {}) as Record<string, unknown>;
          return meta.kind === "interview_invite";
        })
        .map((row) => {
          const meta = (row.metadata || {}) as Record<string, unknown>;
          const rawStatus = String(meta.status || "pending");
          const status: InterviewInvite["status"] =
            rawStatus === "accepted" || rawStatus === "declined"
              ? rawStatus
              : "pending";
          return {
            id: String(row.id),
            title: String(row.title || "Undangan Wawancara"),
            body: String(row.body || ""),
            created_at: String(row.created_at),
            status,
            family_id: String(meta.family_id || ""),
            family_name: String(meta.family_name || "Keluarga Lentera"),
            family_phone: String(meta.family_phone || ""),
            family_city: String(meta.family_city || ""),
            raw_metadata: meta,
          };
        });

      if (active) setInvites(mapped);
    }

    void fetchInvites();
    if (!supabase) return;

    const channel = supabase
      .channel(`caregiver-invites-${user.id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${user.id}`,
        },
        () => {
          void fetchInvites();
        }
      )
      .subscribe();

    return () => {
      active = false;
      supabase?.removeChannel(channel);
    };
  }, [user.id]);

  async function handleRespond(
    invite: InterviewInvite,
    nextStatus: "accepted" | "declined"
  ) {
    if (!supabase) return;
    setUpdatingId(invite.id);
    try {
      const nextMeta = {
        ...invite.raw_metadata,
        status: nextStatus,
        responded_at: new Date().toISOString(),
      };
      const { error } = await supabase
        .from("notifications")
        .update({ metadata: nextMeta, is_read: true })
        .eq("id", invite.id);

      if (!error) {
        setInvites((prev) =>
          prev.map((item) =>
            item.id === invite.id
              ? { ...item, status: nextStatus, raw_metadata: nextMeta }
              : item
          )
        );
      }
    } finally {
      setUpdatingId(null);
    }
  }

  if (invites.length === 0) return null;

  return (
    <section className="mt-6 rounded-2xl border border-card-cream-border bg-card-cream/50 p-5">
      <div className="flex items-center justify-between gap-2 border-b border-card-cream-border/80 pb-3.5">
        <div className="flex items-center gap-2">
          <CalendarCheck className="h-4 w-4 text-primary" />
          <h2 className="font-display text-base font-bold text-ink">
            Undangan Wawancara untuk Anda ({invites.length})
          </h2>
        </div>
        <span className="text-xs font-medium text-ink-muted">
          Dari keluarga yang tertarik
        </span>
      </div>

      <div className="mt-4 space-y-3">
        {invites.map((invite) => {
          const waNumber = formatWaNumber(invite.family_phone);
          const waHref = waNumber
            ? `https://wa.me/${waNumber}?text=${encodeURIComponent(
                `Halo ${invite.family_name}, saya ${user.name} dari Lentera. Saya menerima undangan wawancara pendampingan lansia.`
              )}`
            : "";

          return (
            <div
              key={invite.id}
              className="flex flex-col justify-between gap-4 rounded-xl border border-border bg-surface p-4 sm:flex-row sm:items-center"
            >
              <div>
                <div className="flex flex-wrap items-center gap-x-2.5 gap-y-1">
                  <p className="font-display text-sm font-bold text-ink sm:text-base">
                    {invite.family_name}
                  </p>
                  {invite.family_city && (
                    <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
                      <MapPin className="h-3 w-3 text-primary" />
                      {invite.family_city}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 text-xs text-ink-muted">
                    <Clock className="h-3 w-3" />
                    {new Date(invite.created_at).toLocaleDateString("id-ID", {
                      day: "2-digit",
                      month: "short",
                    })}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-ink-muted sm:text-sm">
                  {invite.body}
                </p>
              </div>

              <div className="flex shrink-0 flex-wrap items-center gap-2">
                {invite.status === "pending" ? (
                  <>
                    <button
                      type="button"
                      disabled={updatingId === invite.id}
                      onClick={() => handleRespond(invite, "accepted")}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover disabled:opacity-60 cursor-pointer"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Terima Wawancara</span>
                    </button>
                    <button
                      type="button"
                      disabled={updatingId === invite.id}
                      onClick={() => handleRespond(invite, "declined")}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-surface px-3.5 py-2 text-xs font-semibold text-ink-muted transition-colors hover:text-danger disabled:opacity-60 cursor-pointer"
                    >
                      <X className="h-3.5 w-3.5" />
                      <span>Tolak</span>
                    </button>
                  </>
                ) : invite.status === "accepted" ? (
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="text-xs font-semibold text-secondary">
                      Undangan Diterima
                    </span>
                    {waHref && (
                      <a
                        href={waHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-primary-hover"
                      >
                        <MessageCircle className="h-3.5 w-3.5" />
                        <span>Hubungi WA Keluarga</span>
                      </a>
                    )}
                  </div>
                ) : (
                  <span className="text-xs font-medium text-ink-muted">
                    Undangan Ditolak
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
