"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

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

  useEffect(() => {
    if (!hydrated || !user || !supabase) return;

    let mounted = true;
    const db = supabase;
    const currentUser = user;

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
    return () => {
      mounted = false;
    };
  }, [hydrated, user]);

  return {
    loading: Boolean(hydrated && user && loading),
    hasCaregiver: Boolean(activeCaregiver),
    activeCaregiver,
    caregiverHasJob,
  };
}
