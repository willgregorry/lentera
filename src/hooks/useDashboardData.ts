"use client";

import { useEffect, useState } from "react";
import {
  MOCK_AI_DIGEST,
  MOCK_CARE_LOGS,
  MOCK_ELDERLY,
  MOCK_NOTIFICATIONS,
} from "@/content/mockData";
import { apiService } from "@/services/api";
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

  useEffect(() => {
    async function loadInitial() {
      const [eld, careLogs, notifs, alerts] = await Promise.all([
        apiService.getElderlyProfile("demo"),
        apiService.getCareLogs("demo"),
        apiService.getNotifications(),
        apiService.getSosAlerts(),
      ]);
      setElderly(eld);
      setLogs(careLogs);
      setNotifications(notifs);
      setSosAlerts(alerts);

      const initialDigest = await apiService.generateAiDailyDigest({
        elderly_id: eld.id,
        logs: careLogs,
      });
      setDigest(initialDigest);
    }

    loadInitial();

    const unsubscribe = apiService.subscribeToStream((ev) => {
      if (ev.type === "care_log" && ev.data && typeof ev.data === "object") {
        setLogs((prev) => [...prev, ev.data as CareLog]);
      } else if (
        ev.type === "sos_alert" &&
        ev.data &&
        typeof ev.data === "object"
      ) {
        setSosAlerts((prev) => [ev.data as SosAlert, ...prev]);
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
        setNotifications((prev) => [ev.data as AppNotification, ...prev]);
      }
    });

    return () => unsubscribe();
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
