"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export const ASSIGNMENT_CHANGE_EVENT = "lentera-assignment-change";

export function notifyAssignmentChange(): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event(ASSIGNMENT_CHANGE_EVENT));
  }
}

export interface ActiveCaregiverInfo {
  id: string;
  name: string;
  city: string;
  phone: string;
  skills: string[];
  experience_years: number;
  schedule: string;
  job_title: string;
  elderly_name: string;
}

export function useAssignmentStatus() {
  const { user, hydrated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [activeCaregiver, setActiveCaregiver] =
    useState<ActiveCaregiverInfo | null>(null);
  const [caregiverHasJob, setCaregiverHasJob] = useState(false);

  const userId = user?.id;
  const userRole = user?.role;
  const isUnlocked =
    userRole === "caregiver" ? caregiverHasJob : Boolean(activeCaregiver);

  useEffect(() => {
    if (!hydrated || !userId || !userRole || !supabase) return;

    let mounted = true;
    const db = supabase;
    const currentUser = { id: userId, role: userRole };

    async function checkStatus() {
      try {
        if (currentUser.role === "family") {
          let found: ActiveCaregiverInfo | null = null;

          const { data: filledJob } = await db
            .from("care_jobs")
            .select("*, elderly:elderly_profiles(name)")
            .eq("family_id", currentUser.id)
            .eq("status", "filled")
            .not("assigned_caregiver_id", "is", null)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (filledJob?.assigned_caregiver_id) {
            const { data: cgProfile } = await db
              .from("profiles")
              .select("*")
              .eq("id", filledJob.assigned_caregiver_id)
              .maybeSingle();

            const elderlyObj = filledJob.elderly as { name?: string } | null;

            if (cgProfile) {
              found = {
                id: cgProfile.id,
                name: cgProfile.full_name,
                city: cgProfile.location || filledJob.location || "Indonesia",
                phone: cgProfile.phone || "",
                skills: Array.isArray(cgProfile.skills) ? cgProfile.skills : [],
                experience_years: Number(cgProfile.experience_years || 0),
                schedule: filledJob.schedule || "Shift Harian",
                job_title: filledJob.title || "Pendampingan Lansia",
                elderly_name: elderlyObj?.name || "Orang Tua",
              };
            }
          }

          if (mounted) setActiveCaregiver(found);
        } else {
          const [jobsRes, appsRes] = await Promise.all([
            db
              .from("care_jobs")
              .select("id")
              .eq("assigned_caregiver_id", currentUser.id)
              .eq("status", "filled")
              .limit(1),
            db
              .from("job_applications")
              .select("id")
              .eq("caregiver_id", currentUser.id)
              .eq("status", "accepted")
              .limit(1),
          ]);

          const assigned = Boolean(
            (jobsRes.data && jobsRes.data.length > 0) ||
              (appsRes.data && appsRes.data.length > 0)
          );

          if (mounted) setCaregiverHasJob(assigned);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    void checkStatus();

    const handleRefresh = () => {
      void checkStatus();
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void checkStatus();
      }
    };

    window.addEventListener(ASSIGNMENT_CHANGE_EVENT, handleRefresh);
    window.addEventListener("focus", handleRefresh);
    document.addEventListener("visibilitychange", handleVisibility);

    const uniqueSuffix = Math.random().toString(36).slice(2, 8);
    let channel: ReturnType<typeof db.channel> | null = null;
    try {
      channel = db
        .channel(`assignment-status-${currentUser.id}-${uniqueSuffix}`)
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "care_jobs" },
          handleRefresh
        )
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "job_applications" },
          handleRefresh
        )
        .subscribe();
    } catch {
      channel = null;
    }

    // Lightweight fallback poll ONLY while menus are still locked
    const intervalId = !isUnlocked
      ? window.setInterval(handleRefresh, 5000)
      : undefined;

    return () => {
      mounted = false;
      window.removeEventListener(ASSIGNMENT_CHANGE_EVENT, handleRefresh);
      window.removeEventListener("focus", handleRefresh);
      document.removeEventListener("visibilitychange", handleVisibility);
      if (intervalId) window.clearInterval(intervalId);
      if (channel) {
        try {
          db.removeChannel(channel);
        } catch {}
      }
    };
  }, [hydrated, userId, userRole, isUnlocked]);

  return {
    loading: Boolean(hydrated && user && loading),
    hasCaregiver: Boolean(activeCaregiver),
    activeCaregiver,
    caregiverHasJob,
  };
}
