"use client";

import { useEffect, useState } from "react";
import { MOCK_JOBS } from "@/content/mockData";
import { apiService } from "@/services/api";
import { getStoredUser } from "@/services/authStorage";
import { CareJob, JobApplication, UserProfile } from "@/types";

export function useLokerData() {
  const [jobs, setJobs] = useState<CareJob[]>(MOCK_JOBS);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [matchingId, setMatchingId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
    apiService.getJobs().then(setJobs);
  }, []);

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
    const created = await apiService.createJob(payload);
    setJobs((prev) => [created, ...prev]);
    setFeedback("Lowongan perawatan baru berhasil diterbitkan.");
    return created;
  }

  async function applyToJob(jobId: string, coverNote: string) {
    const app = await apiService.applyToJob(jobId, {
      caregiver_name: user?.name || "Rini Wulandari, A.Md.Kep",
      caregiver_city: user?.city || "Jakarta Selatan",
      experience_years: user?.experience_years || 5,
      skills: user?.skills || [
        "Hipertensi & Diabetes",
        "Pencegahan Jatuh",
        "Nutrisi Geriatri",
      ],
      cover_note: coverNote,
    });
    setJobs((prev) =>
      prev.map((job) =>
        job.id === jobId
          ? { ...job, applications: [app, ...(job.applications || [])] }
          : job
      )
    );
    setFeedback("Lamaran berhasil dikirim dan dinilai oleh AI Matcher.");
  }

  async function runAiMatch(job: CareJob, app: JobApplication) {
    setMatchingId(app.id);
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
    } finally {
      setMatchingId(null);
    }
  }

  async function decideApplication(
    jobId: string,
    appId: string,
    status: "accepted" | "rejected"
  ) {
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
        ? "Caregiver berhasil direkrut! Pantau laporan harian di Dashboard."
        : "Status pelamar diperbarui."
    );
  }

  return {
    jobs,
    user,
    matchingId,
    feedback,
    createJob,
    applyToJob,
    runAiMatch,
    decideApplication,
  };
}
