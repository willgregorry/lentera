"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { apiService } from "@/services/api";

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
    if (!hydrated || !user) return;

    let mounted = true;

    async function checkStatus() {
      try {
        if (user!.role === "family") {
          let found: ActiveCaregiverInfo | null = null;

          if (supabase) {
            const { data: filledJob } = await supabase
              .from("care_jobs")
              .select("*")
              .eq("family_id", user!.id)
              .eq("status", "filled")
              .not("assigned_caregiver_id", "is", null)
              .limit(1)
              .maybeSingle();

            if (filledJob?.assigned_caregiver_id) {
              const { data: cgProfile } = await supabase
                .from("profiles")
                .select("*")
                .eq("id", filledJob.assigned_caregiver_id)
                .maybeSingle();

              if (cgProfile) {
                found = {
                  id: cgProfile.id,
                  name: cgProfile.full_name,
                  city: cgProfile.location || filledJob.location || "Indonesia",
                  phone: cgProfile.phone || "",
                  skills: Array.isArray(cgProfile.skills)
                    ? cgProfile.skills
                    : [],
                  experience_years: Number(cgProfile.experience_years || 0),
                  schedule: filledJob.schedule || "Shift Harian",
                  job_title: filledJob.title || "Pendampingan Lansia",
                  elderly_name: "Orang Tua",
                };
              }
            }
          }

          if (!found) {
            const jobs = await apiService.getJobs();
            for (const job of jobs) {
              const accepted = (job.applications || []).find(
                (a) => a.status === "accepted"
              );
              if (accepted) {
                found = {
                  id: accepted.caregiver_id,
                  name: accepted.caregiver_name,
                  city: accepted.caregiver_city || job.location,
                  phone: "",
                  skills: accepted.skills || [],
                  experience_years: accepted.experience_years || 0,
                  schedule: job.schedule,
                  job_title: job.title,
                  elderly_name: job.elderly_name,
                };
                break;
              }
            }
          }

          if (mounted) setActiveCaregiver(found);
        } else {
          let assigned = false;

          if (supabase) {
            const [jobsRes, appsRes] = await Promise.all([
              supabase
                .from("care_jobs")
                .select("id")
                .eq("assigned_caregiver_id", user!.id)
                .eq("status", "filled")
                .limit(1),
              supabase
                .from("job_applications")
                .select("id")
                .eq("caregiver_id", user!.id)
                .eq("status", "accepted")
                .limit(1),
            ]);
            if (
              (jobsRes.data && jobsRes.data.length > 0) ||
              (appsRes.data && appsRes.data.length > 0)
            ) {
              assigned = true;
            }
          }

          if (!assigned) {
            const jobs = await apiService.getJobs();
            assigned = jobs.some((job) =>
              (job.applications || []).some(
                (app) =>
                  (app.caregiver_id === user!.id ||
                    app.caregiver_name === user!.name) &&
                  app.status === "accepted"
              )
            );
          }

          if (mounted) setCaregiverHasJob(assigned);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    checkStatus();
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
