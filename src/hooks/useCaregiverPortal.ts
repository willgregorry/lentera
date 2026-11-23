"use client";

import { useEffect, useState } from "react";
import { MOCK_ELDERLY } from "@/content/mockData";
import { apiService } from "@/services/api";
import { useAuth } from "@/hooks/useAuth";
import { CareLog, ElderlyProfile, SosAlert } from "@/types";

export function useCaregiverPortal() {
  const { user } = useAuth();
  const [elderly, setElderly] = useState<ElderlyProfile>(MOCK_ELDERLY);
  const [submittingLog, setSubmittingLog] = useState(false);
  const [logSuccess, setLogSuccess] = useState<string | null>(null);
  const [portalError, setPortalError] = useState<string | null>(null);
  const [triggeringSos, setTriggeringSos] = useState(false);
  const [activeSos, setActiveSos] = useState<SosAlert | null>(null);

  useEffect(() => {
    if (!user) return;
    let active = true;

    async function loadPortalContext() {
      try {
        const profile = await apiService.getElderlyProfile();
        if (!active) return;
        setElderly(profile);

        if (profile.id && profile.id !== "default-elderly") {
          const alerts = await apiService.getSosAlerts(profile.id);
          if (active) {
            const currentActive =
              alerts.find((a) => a.status === "active") || null;
            setActiveSos(currentActive);
          }
        }
      } catch {
        // Keep clean initial state
      }
    }

    void loadPortalContext();
    return () => {
      active = false;
    };
  }, [user]);

  async function submitCareLog(input: {
    heartRate: number;
    systolic: number;
    diastolic: number;
    mealPortion: CareLog["meal_portion"];
    medicationTaken: boolean;
    mood: CareLog["mood"];
    notes: string;
    photoFile: File | null;
  }): Promise<boolean> {
    setSubmittingLog(true);
    setLogSuccess(null);
    setPortalError(null);
    try {
      if (input.photoFile) {
        const fd = new FormData();
        fd.append("elderly_id", elderly.id);
        fd.append("heart_rate", String(input.heartRate));
        fd.append("blood_pressure_systolic", String(input.systolic));
        fd.append("blood_pressure_diastolic", String(input.diastolic));
        fd.append("systolic", String(input.systolic));
        fd.append("diastolic", String(input.diastolic));
        fd.append("meal_portion", input.mealPortion);
        fd.append("medication_taken", String(input.medicationTaken));
        fd.append("mood", input.mood);
        fd.append("notes", input.notes);
        fd.append("photo", input.photoFile);
        await apiService.createCareLog(fd);
      } else {
        await apiService.createCareLog({
          elderly_id: elderly.id,
          heart_rate: Number(input.heartRate),
          systolic: Number(input.systolic),
          diastolic: Number(input.diastolic),
          meal_portion: input.mealPortion,
          medication_taken: input.medicationTaken,
          mood: input.mood,
          notes: input.notes,
        });
      }
      setLogSuccess(
        "Laporan harian berhasil dikirim dan tampil di Dashboard Keluarga."
      );
      return true;
    } catch (err) {
      setPortalError(
        err instanceof Error
          ? err.message
          : "Gagal mengirim laporan harian. Coba lagi."
      );
      return false;
    } finally {
      setSubmittingLog(false);
    }
  }

  async function triggerSos(reason: string): Promise<boolean> {
    setTriggeringSos(true);
    setPortalError(null);
    try {
      const alert = await apiService.triggerSosAlert({
        elderly_id: elderly.id,
        reason,
      });
      setActiveSos(alert);
      return true;
    } catch (err) {
      setPortalError(
        err instanceof Error
          ? err.message
          : "Gagal mengirim sinyal darurat SOS."
      );
      return false;
    } finally {
      setTriggeringSos(false);
    }
  }

  return {
    user,
    elderly,
    submittingLog,
    logSuccess,
    portalError,
    triggeringSos,
    activeSos,
    submitCareLog,
    triggerSos,
  };
}
