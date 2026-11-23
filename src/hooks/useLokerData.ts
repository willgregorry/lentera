"use client";

import { useEffect, useState } from "react";
import { MOCK_JOBS } from "@/content/mockData";
import { apiService } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { CareJob, JobApplication } from "@/types";

export function useLokerData() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState<CareJob[]>(MOCK_JOBS);
  const [matchingId, setMatchingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    apiService
      .getJobs()
      .then((list) => {
        if (active) setJobs(list);
      })
      .catch((err) => {
        if (active) {
          setErrorMsg(
            err instanceof Error ? err.message : "Gagal memuat daftar lowongan."
          );
        }
      });
    return () => {
      active = false;
    };
  }, [user?.id, user?.role]);

  async function createJob(payload: {
    title: string;
    elderly_name: string;
    elderly_age: number;
    location: string;
    schedule: string;
    salary_display: string;
    medical_notes: string;
    required_skills: string[];
  }) {
    setErrorMsg(null);
    setFeedback(null);
    try {
      const created = await apiService.createJob(payload);
      setJobs((prev) => [created, ...prev]);
      setFeedback("Lowongan perawatan baru berhasil diterbitkan.");
      return created;
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menerbitkan lowongan."
      );
      throw err;
    }
  }

  async function applyToJob(jobId: string, coverNote: string) {
    setErrorMsg(null);
    setFeedback(null);
    try {
      const app = await apiService.applyToJob(jobId, {
        caregiver_name: user?.name || "Perawat Terdaftar",
        caregiver_city: user?.city || "Indonesia",
        experience_years: user?.experience_years || 0,
        skills: user?.skills || [],
        cover_note: coverNote,
      });
      setJobs((prev) =>
        prev.map((job) =>
          job.id === jobId
            ? { ...job, applications: [app, ...(job.applications || [])] }
            : job
        )
      );
      setFeedback("Lamaran berhasil dikirim kepada keluarga.");
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal mengirim lamaran."
      );
    }
  }

  async function runAiMatch(job: CareJob, app: JobApplication) {
    setMatchingId(app.id);
    setErrorMsg(null);
    try {
      const result = await apiService.matchCaregiverWithAi({
        job,
        caregiver: {
          id: app.caregiver_id,
          name: app.caregiver_name,
          experience_years: app.experience_years,
          skills: app.skills,
        },
      });
      setJobs((prev) =>
        prev.map((j) =>
          j.id === job.id
            ? {
                ...j,
                applications: j.applications?.map((a) =>
                  a.id === app.id
                    ? {
                        ...a,
                        ai_match_score: result.match_score,
                        ai_match_reason: result.reason,
                      }
                    : a
                ),
              }
            : j
        )
      );
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal menghitung kecocokan AI."
      );
    } finally {
      setMatchingId(null);
    }
  }

  async function decideApplication(
    jobId: string,
    appId: string,
    status: "accepted" | "rejected"
  ) {
    setErrorMsg(null);
    setFeedback(null);
    try {
      await apiService.updateApplicationStatus(appId, status);
      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId
            ? {
                ...j,
                status: status === "accepted" ? "filled" : j.status,
                applications: j.applications?.map((a) =>
                  a.id === appId ? { ...a, status } : a
                ),
              }
            : j
        )
      );
      setFeedback(
        status === "accepted"
          ? "Caregiver berhasil direkrut! Pantau laporan harian di Kondisi Orang Tua."
          : "Status pelamar diperbarui."
      );
    } catch (err) {
      setErrorMsg(
        err instanceof Error ? err.message : "Gagal memperbarui status pelamar."
      );
    }
  }

  return {
    jobs,
    user,
    matchingId,
    feedback,
    errorMsg,
    createJob,
    applyToJob,
    runAiMatch,
    decideApplication,
  };
}
