"use client";

import { useEffect, useRef, useState } from "react";
import {
  MOCK_AI_DIGEST,
  MOCK_CARE_LOGS,
  MOCK_ELDERLY,
  MOCK_NOTIFICATIONS,
} from "@/content/mockData";
import { apiService } from "@/services/api";
import { notifyUserDevice } from "@/lib/notifications";
import {
  AiDigest,
  AppNotification,
  CareLog,
  ElderlyProfile,
  LenteraStatus,
  SosAlert,
} from "@/types";

export function useDashboardData() {
  const [elderly, setElderly] = useState<ElderlyProfile>(MOCK_ELDERLY);
  const [logs, setLogs] = useState<CareLog[]>(MOCK_CARE_LOGS);
  const [digest, setDigest] = useState<AiDigest>(MOCK_AI_DIGEST);
  const [notifications, setNotifications] =
    useState<AppNotification[]>(MOCK_NOTIFICATIONS);
  const [sosAlerts, setSosAlerts] = useState<SosAlert[]>([]);
  const [digestLoading, setDigestLoading] = useState(false);
  const elderlyIdRef = useRef<string>("");

  useEffect(() => {
    let active = true;

    async function syncLiveData(includeDigest: boolean) {
      try {
        const eld = await apiService.getElderlyProfile();
        if (!active) return;

        elderlyIdRef.current = eld.id;
        setElderly(eld);

        const [careLogs, notifs, alerts] = await Promise.all([
          apiService.getCareLogs(eld.id),
          apiService.getNotifications(),
          apiService.getSosAlerts(eld.id),
        ]);

        if (!active) return;
        setLogs(careLogs);
        setNotifications(notifs);
        setSosAlerts(alerts);

        if (includeDigest) {
          const initialDigest = await apiService.generateAiDailyDigest({
            elderly_id: eld.id,
            logs: careLogs,
          });
          if (active) setDigest(initialDigest);
        }
      } catch {
        // Keep clean defaults when profile is not initialized yet
      }
    }

    void syncLiveData(true);

    const handleFocus = () => {
      void syncLiveData(false);
    };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        void syncLiveData(false);
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibility);
    const pollId = window.setInterval(() => {
      void syncLiveData(false);
    }, 6000);

    const unsubscribe = apiService.subscribeToStream((ev) => {
      const currentElderlyId = elderlyIdRef.current;

      if (ev.type === "care_log" && ev.data && typeof ev.data === "object") {
        const incoming = ev.data as CareLog;
        if (currentElderlyId && incoming.elderly_id !== currentElderlyId) return;
        setLogs((prev) =>
          prev.some((l) => l.id === incoming.id) ? prev : [...prev, incoming]
        );
        void notifyUserDevice({
          title: "Laporan Harian Baru Masuk",
          body: `TD ${incoming.systolic}/${incoming.diastolic} mmHg · Nadi ${incoming.heart_rate} bpm`,
          url: "/notifikasi",
        });
      } else if (
        ev.type === "sos_alert" &&
        ev.data &&
        typeof ev.data === "object"
      ) {
        const incoming = ev.data as SosAlert;
        if (currentElderlyId && incoming.elderly_id !== currentElderlyId) return;
        setSosAlerts((prev) =>
          prev.some((a) => a.id === incoming.id) ? prev : [incoming, ...prev]
        );
        void notifyUserDevice({
          title: "DARURAT SOS AKTIF",
          body: incoming.reason,
          url: "/notifikasi",
          urgent: true,
        });
      } else if (
        ev.type === "sos_resolved" &&
        ev.data &&
        typeof ev.data === "object"
      ) {
        const resolved = ev.data as SosAlert;
        setSosAlerts((prev) =>
          prev.map((a) =>
            a.id === resolved.id ? { ...a, status: "resolved" } : a
          )
        );
      } else if (
        ev.type === "ai_digest" &&
        ev.data &&
        typeof ev.data === "object"
      ) {
        setDigest(ev.data as AiDigest);
      } else if (
        (ev.type === "notification" || ev.type === "announcement") &&
        ev.data &&
        typeof ev.data === "object"
      ) {
        const incoming = ev.data as AppNotification;
        setNotifications((prev) =>
          prev.some((n) => n.id === incoming.id) ? prev : [incoming, ...prev]
        );
      }
    });

    return () => {
      active = false;
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.clearInterval(pollId);
      unsubscribe();
    };
  }, []);

  const activeSos = sosAlerts.find((a) => a.status === "active") || null;
  const currentStatus: LenteraStatus = activeSos
    ? "darurat"
    : digest.status === "waspada"
    ? "waspada"
    : elderly.status;
  const latestLog = logs[logs.length - 1];

  async function refreshDigest() {
    setDigestLoading(true);
    try {
      const updated = await apiService.generateAiDailyDigest({
        elderly_id: elderly.id,
        logs,
      });
      setDigest(updated);
    } finally {
      setDigestLoading(false);
    }
  }

  async function resolveSos(sosId: string) {
    const resolved = await apiService.resolveSosAlert(sosId);
    setSosAlerts((prev) =>
      prev.map((item) => (item.id === sosId ? resolved : item))
    );
  }

  return {
    elderly,
    logs,
    digest,
    notifications,
    activeSos,
    currentStatus,
    latestLog,
    digestLoading,
    refreshDigest,
    resolveSos,
  };
}
