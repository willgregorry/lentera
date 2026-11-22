import {
  DEMO_USERS,
  MOCK_AI_DIGEST,
  MOCK_CARE_LOGS,
  MOCK_ELDERLY,
  MOCK_JOBS,
  MOCK_NOTIFICATIONS,
  MOCK_SOS_LIST,
} from "@/content/mockData";
import {
  AiDigest,
  AiMatchResult,
  AiTriageBrief,
  AppNotification,
  CareJob,
  CareLog,
  ElderlyProfile,
  JobApplication,
  LenteraStatus,
  SosAlert,
  UserProfile,
  UserRole,
} from "@/types";
import { ILenteraApiService, StreamEvent } from "./api.interface";
import { getStoredToken, getStoredUser, setAuthSession } from "./authStorage";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000/api";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeUser(raw: any, fallbackRole: UserRole = "family"): UserProfile {
  return {
    id: String(raw?.id || `user-${Date.now()}`),
    name: String(raw?.name || raw?.full_name || raw?.email || "Pengguna"),
    email: String(raw?.email || ""),
    role: (raw?.role === "caregiver" ? "caregiver" : fallbackRole) as UserRole,
    phone: raw?.phone,
    city: raw?.city || raw?.location,
    verified: Boolean(raw?.verified ?? raw?.is_verified ?? false),
    skills: Array.isArray(raw?.skills) ? raw.skills : [],
    experience_years:
      typeof raw?.experience_years === "number"
        ? raw.experience_years
        : undefined,
    bio: raw?.bio,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeElderly(raw: any): ElderlyProfile {
  const medList = Array.isArray(raw?.routine_meds)
    ? raw.routine_meds
    : Array.isArray(raw?.routine_medications)
    ? raw.routine_medications.map((m: unknown) =>
        typeof m === "string"
          ? m
          : `${(m as { name?: string }).name || "Obat"}${
              (m as { schedule?: string }).schedule
                ? ` (${(m as { schedule?: string }).schedule})`
                : ""
            }`
      )
    : MOCK_ELDERLY.routine_meds;

  const emergencyContact = Array.isArray(raw?.emergency_contacts)
    ? raw.emergency_contacts[0]
    : undefined;

  const statusVal = String(raw?.status || "aman").toLowerCase();
  const status: LenteraStatus =
    statusVal === "darurat" || statusVal === "waspada" ? statusVal : "aman";

  return {
    id: String(raw?.id || MOCK_ELDERLY.id),
    name: String(raw?.name || MOCK_ELDERLY.name),
    age: Number(raw?.age || MOCK_ELDERLY.age),
    family_id: String(raw?.family_id || MOCK_ELDERLY.family_id),
    conditions: Array.isArray(raw?.conditions)
      ? raw.conditions
      : Array.isArray(raw?.medical_conditions)
      ? raw.medical_conditions
      : MOCK_ELDERLY.conditions,
    allergies: Array.isArray(raw?.allergies)
      ? raw.allergies
      : MOCK_ELDERLY.allergies,
    routine_meds: medList,
    address: String(raw?.address || MOCK_ELDERLY.address),
    nearest_hospital: String(
      raw?.nearest_hospital ||
        emergencyContact?.hospital ||
        emergencyContact?.name ||
        MOCK_ELDERLY.nearest_hospital
    ),
    nearest_hospital_phone: String(
      raw?.nearest_hospital_phone ||
        emergencyContact?.phone ||
        MOCK_ELDERLY.nearest_hospital_phone
    ),
    status,
  };
}

function normalizeMealPortion(val: unknown): CareLog["meal_portion"] {
  const s = String(val || "habis").toLowerCase();
  if (s === "setengah" || s === "half") return "setengah";
  if (s === "sedikit" || s === "little") return "sedikit";
  if (s === "tidak_makan" || s === "none") return "tidak_makan";
  return "habis";
}

function normalizeMood(val: unknown): CareLog["mood"] {
  const s = String(val || "tenang").toLowerCase();
  if (s === "cerah" || s === "baik" || s === "happy") return "cerah";
  if (s === "lelah" || s === "tired") return "lelah";
  if (s === "gelisah" || s === "anxious" || s === "sedih") return "gelisah";
  return "tenang";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeCareLog(raw: any): CareLog {
  return {
    id: String(raw?.id || `log-${Date.now()}`),
    elderly_id: String(raw?.elderly_id || "demo"),
    caregiver_id: String(raw?.caregiver_id || "user-rini-002"),
    caregiver_name:
      raw?.caregiver_name || raw?.caregiver?.full_name || "Rini Wulandari",
    heart_rate: Number(raw?.heart_rate || 78),
    systolic: Number(raw?.systolic ?? raw?.blood_pressure_systolic ?? 120),
    diastolic: Number(raw?.diastolic ?? raw?.blood_pressure_diastolic ?? 80),
    meal_portion: normalizeMealPortion(raw?.meal_portion),
    medication_taken: Boolean(raw?.medication_taken ?? true),
    mood: normalizeMood(raw?.mood),
    notes: String(raw?.notes || ""),
    photo_url: raw?.photo_url || undefined,
    logged_at: String(
      raw?.logged_at || raw?.created_at || new Date().toISOString()
    ),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeDigest(raw: any): AiDigest {
  const statusRaw = String(
    raw?.status || raw?.status_badge || "aman"
  ).toLowerCase();
  const status: LenteraStatus =
    statusRaw === "darurat" || statusRaw === "waspada" ? statusRaw : "aman";

  const hydrationAct =
    raw?.hydration_activity_tip ||
    [raw?.hydration_recommendation, raw?.activity_recommendation]
      .filter(Boolean)
      .join(" ");

  return {
    id: raw?.id,
    elderly_id: String(raw?.elderly_id || "demo"),
    status,
    summary: String(raw?.summary || MOCK_AI_DIGEST.summary),
    meal_suggestion: String(
      raw?.meal_suggestion ||
        raw?.food_recommendation ||
        MOCK_AI_DIGEST.meal_suggestion
    ),
    hydration_activity_tip: String(
      hydrationAct || MOCK_AI_DIGEST.hydration_activity_tip
    ),
    anomaly_alert: raw?.anomaly_alert ?? raw?.anomaly_notes ?? null,
    generated_at: String(
      raw?.generated_at || raw?.created_at || new Date().toISOString()
    ),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeApplication(raw: any): JobApplication {
  const cg = raw?.caregiver || {};
  return {
    id: String(raw?.id || `app-${Date.now()}`),
    job_id: String(raw?.job_id || ""),
    caregiver_id: String(raw?.caregiver_id || cg?.id || ""),
    caregiver_name: String(
      raw?.caregiver_name || cg?.full_name || "Caregiver Terdaftar"
    ),
    caregiver_city: String(
      raw?.caregiver_city || cg?.location || "Jakarta Selatan"
    ),
    experience_years: Number(
      raw?.experience_years ?? cg?.experience_years ?? 3
    ),
    skills: Array.isArray(raw?.skills)
      ? raw.skills
      : Array.isArray(cg?.skills)
      ? cg.skills
      : [],
    verified: Boolean(raw?.verified ?? cg?.is_verified ?? true),
    cover_note: String(raw?.cover_note || ""),
    status: (raw?.status || "pending") as JobApplication["status"],
    ai_match_score:
      typeof (raw?.ai_match_score ?? raw?.match_score) === "number"
        ? Number(raw?.ai_match_score ?? raw?.match_score)
        : undefined,
    ai_match_reason: raw?.ai_match_reason || raw?.match_reason || undefined,
    applied_at: String(
      raw?.applied_at || raw?.created_at || new Date().toISOString()
    ),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeJob(raw: any): CareJob {
  const formatRupiah = (n: number) => `Rp ${n.toLocaleString("id-ID")}`;

  let salaryDisplay = raw?.salary_display;
  if (!salaryDisplay && (raw?.salary_min || raw?.salary_max)) {
    const min = Number(raw.salary_min || 0);
    const max = Number(raw.salary_max || min);
    salaryDisplay =
      min === max
        ? `${formatRupiah(min)} / bulan`
        : `${formatRupiah(min)} – ${formatRupiah(max)} / bulan`;
  }

  return {
    id: String(raw?.id || `job-${Date.now()}`),
    family_id: String(raw?.family_id || ""),
    family_name: String(
      raw?.family_name || raw?.family?.full_name || "Keluarga Lentera"
    ),
    elderly_name: String(
      raw?.elderly_name || raw?.elderly?.name || "Orang Tua"
    ),
    elderly_age: Number(raw?.elderly_age || raw?.elderly?.age || 72),
    title: String(raw?.title || ""),
    location: String(raw?.location || "Jakarta Selatan"),
    schedule: String(raw?.schedule || "Senin – Sabtu"),
    salary_display: String(salaryDisplay || "Rp 4.000.000 / bulan"),
    medical_notes: String(raw?.medical_notes || raw?.description || ""),
    required_skills: Array.isArray(raw?.required_skills)
      ? raw.required_skills
      : [],
    status: raw?.status === "filled" ? "filled" : "open",
    created_at: String(raw?.created_at || new Date().toISOString()),
    applications: Array.isArray(raw?.applications)
      ? raw.applications.map(normalizeApplication)
      : [],
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeTriageBrief(raw: any): AiTriageBrief | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  return {
    patient_summary: String(
      raw.patient_summary ||
        raw.patient_name ||
        "Pak Joko (72 th), riwayat Hipertensi & Diabetes Terkontrol"
    ),
    allergies: Array.isArray(raw.allergies)
      ? raw.allergies
      : Array.isArray(raw.critical_allergies)
      ? raw.critical_allergies
      : MOCK_ELDERLY.allergies,
    routine_meds: Array.isArray(raw.routine_meds)
      ? raw.routine_meds
      : Array.isArray(raw.routine_medications)
      ? raw.routine_medications
      : MOCK_ELDERLY.routine_meds,
    last_24h_vitals: String(
      raw.last_24h_vitals ||
        raw.last_24h_vitals_summary ||
        "Vital terakhir terpantau dalam catatan harian."
    ),
    immediate_actions: Array.isArray(raw.immediate_actions)
      ? raw.immediate_actions
      : Array.isArray(raw.immediate_actions_for_responder)
      ? raw.immediate_actions_for_responder
      : ["Posisikan pasien nyaman dan hubungi layanan darurat 119."],
    emergency_note: String(raw.emergency_note || raw.severity_assessment || ""),
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeSosAlert(raw: any): SosAlert {
  return {
    id: String(raw?.id || `sos-${Date.now()}`),
    elderly_id: String(raw?.elderly_id || "demo"),
    elderly_name: raw?.elderly_name || raw?.elderly?.name || MOCK_ELDERLY.name,
    triggered_by: String(
      raw?.triggered_by_profile?.full_name ||
        raw?.triggered_by_name ||
        "Caregiver Bertugas"
    ),
    reason: String(
      raw?.reason || raw?.location_note || "Kondisi darurat medis di rumah"
    ),
    status: raw?.status === "resolved" ? "resolved" : "active",
    triage_brief: normalizeTriageBrief(raw?.triage_brief),
    nearest_hospital: raw?.nearest_hospital || MOCK_ELDERLY.nearest_hospital,
    created_at: String(raw?.created_at || new Date().toISOString()),
    resolved_at: raw?.resolved_at,
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalizeNotification(raw: any): AppNotification {
  const t = String(raw?.type || "info").toLowerCase();
  const mappedType: AppNotification["type"] =
    t === "sos" || t === "emergency"
      ? "emergency"
      : t === "announcement"
      ? "announcement"
      : t === "ai_digest" || t === "warning"
      ? "warning"
      : "info";

  return {
    id: String(raw?.id || `notif-${Date.now()}`),
    title: String(raw?.title || "Pembaruan Lentera"),
    message: String(raw?.message || raw?.body || ""),
    type: mappedType,
    created_at: String(raw?.created_at || new Date().toISOString()),
    read: Boolean(raw?.read ?? raw?.is_read ?? false),
  };
}

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getStoredToken();
  const isFormData =
    typeof FormData !== "undefined" && options.body instanceof FormData;

  const headers: Record<string, string> = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(options.headers as Record<string, string> | undefined),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }

  return (await res.json()) as T;
}

class LenteraApiService implements ILenteraApiService {
  async loginUser(payload: {
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<{ user: UserProfile; token: string; isDemoFallback?: boolean }> {
    try {
      const data = await apiFetch<{
        user: unknown;
        profile?: unknown;
        token: string;
      }>("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
        }),
      });
      const normalized = normalizeUser(
        data.profile || data.user,
        payload.role || "family"
      );
      setAuthSession(data.token, normalized);
      return { user: normalized, token: data.token };
    } catch {
      const role: UserRole =
        payload.role ||
        (payload.email.toLowerCase().includes("rini") ? "caregiver" : "family");
      const user = DEMO_USERS[role];
      const token = `demo-token-${role}`;
      setAuthSession(token, user);
      return { user, token, isDemoFallback: true };
    }
  }

  async registerUser(payload: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    city?: string;
    skills?: string[];
  }): Promise<{ user: UserProfile; token: string; isDemoFallback?: boolean }> {
    try {
      const data = await apiFetch<{
        user: unknown;
        profile?: unknown;
        token: string;
      }>("/auth/register", {
        method: "POST",
        body: JSON.stringify({
          email: payload.email,
          password: payload.password,
          full_name: payload.name,
          role: payload.role,
          phone: payload.phone,
          location: payload.city,
          skills: payload.skills,
        }),
      });
      const normalized = normalizeUser(data.profile || data.user, payload.role);
      setAuthSession(data.token, normalized);
      return { user: normalized, token: data.token };
    } catch {
      const user: UserProfile = {
        id: `user-${Date.now()}`,
        name: payload.name,
        email: payload.email,
        role: payload.role,
        phone: payload.phone || "0812-0000-0000",
        city: payload.city || "Jakarta Selatan",
        verified: payload.role === "caregiver",
        skills: payload.skills || [],
      };
      const token = `demo-token-${payload.role}`;
      setAuthSession(token, user);
      return { user, token, isDemoFallback: true };
    }
  }

  async getCurrentProfile(): Promise<UserProfile | null> {
    try {
      const res = await apiFetch<{ profile?: unknown; user?: unknown }>(
        "/profiles/me"
      );
      const raw = res.profile ?? res.user ?? res;
      return normalizeUser(raw);
    } catch {
      return getStoredUser();
    }
  }

  async getElderlyProfile(id = "demo"): Promise<ElderlyProfile> {
    try {
      const res = await apiFetch<{ elderly?: unknown }>(`/elderly/${id}`);
      return normalizeElderly(res.elderly ?? res);
    } catch {
      return MOCK_ELDERLY;
    }
  }

  async getCareLogs(elderlyId = "demo"): Promise<CareLog[]> {
    try {
      const query = elderlyId
        ? `?elderly_id=${encodeURIComponent(elderlyId)}`
        : "";
      const res = await apiFetch<{ logs?: unknown[] } | unknown[]>(
        `/care-logs${query}`
      );
      const list = Array.isArray(res) ? res : res.logs || [];
      return list.map(normalizeCareLog);
    } catch {
      return MOCK_CARE_LOGS;
    }
  }

  async createCareLog(
    payload:
      | FormData
      | {
          elderly_id: string;
          heart_rate: number;
          systolic: number;
          diastolic: number;
          meal_portion: CareLog["meal_portion"];
          medication_taken: boolean;
          mood: CareLog["mood"];
          notes: string;
          photo_url?: string;
        }
  ): Promise<CareLog> {
    try {
      let body: BodyInit;
      if (payload instanceof FormData) {
        if (
          !payload.has("blood_pressure_systolic") &&
          payload.has("systolic")
        ) {
          payload.append(
            "blood_pressure_systolic",
            String(payload.get("systolic"))
          );
        }
        if (
          !payload.has("blood_pressure_diastolic") &&
          payload.has("diastolic")
        ) {
          payload.append(
            "blood_pressure_diastolic",
            String(payload.get("diastolic"))
          );
        }
        body = payload;
      } else {
        body = JSON.stringify({
          elderly_id: payload.elderly_id,
          heart_rate: payload.heart_rate,
          blood_pressure_systolic: payload.systolic,
          blood_pressure_diastolic: payload.diastolic,
          meal_portion: payload.meal_portion,
          medication_taken: payload.medication_taken,
          mood: payload.mood,
          notes: payload.notes,
          photo_url: payload.photo_url,
        });
      }

      const res = await apiFetch<{ log?: unknown }>("/care-logs", {
        method: "POST",
        body,
      });
      return normalizeCareLog(res.log ?? res);
    } catch {
      const obj =
        payload instanceof FormData
          ? {
              elderly_id: String(payload.get("elderly_id") || "demo"),
              heart_rate: Number(payload.get("heart_rate") || 78),
              systolic: Number(payload.get("systolic") || 124),
              diastolic: Number(payload.get("diastolic") || 80),
              meal_portion: normalizeMealPortion(payload.get("meal_portion")),
              medication_taken: payload.get("medication_taken") !== "false",
              mood: normalizeMood(payload.get("mood")),
              notes: String(payload.get("notes") || ""),
            }
          : payload;

      return {
        id: `log-${Date.now()}`,
        caregiver_id: "user-rini-002",
        caregiver_name: "Rini Wulandari",
        logged_at: new Date().toISOString(),
        ...obj,
      };
    }
  }

  async getJobs(): Promise<CareJob[]> {
    try {
      const res = await apiFetch<{ jobs?: unknown[] } | unknown[]>("/jobs");
      const list = Array.isArray(res) ? res : res.jobs || [];
      return list.map(normalizeJob);
    } catch {
      return MOCK_JOBS;
    }
  }

  async createJob(payload: {
    title: string;
    elderly_name: string;
    elderly_age: number;
    location: string;
    schedule: string;
    salary_display: string;
    medical_notes: string;
    required_skills: string[];
  }): Promise<CareJob> {
    try {
      const numericDigits = payload.salary_display.replace(/[^\d]/g, "");
      const parsedSalary = Number(numericDigits) || 4000000;
      const description =
        payload.medical_notes.length >= 10
          ? payload.medical_notes
          : `${payload.medical_notes} — Pendampingan harian ${payload.elderly_name} (${payload.elderly_age} th).`;

      const res = await apiFetch<{ job?: unknown }>("/jobs", {
        method: "POST",
        body: JSON.stringify({
          elderly_id: "demo",
          title: payload.title,
          description,
          schedule: payload.schedule,
          location: payload.location,
          salary_min: parsedSalary,
          salary_max: parsedSalary,
          required_skills: payload.required_skills,
        }),
      });
      return normalizeJob(res.job ?? res);
    } catch {
      return {
        id: `job-${Date.now()}`,
        family_id: "user-budi-001",
        family_name: "Keluarga Budi Santoso",
        status: "open",
        created_at: new Date().toISOString(),
        applications: [],
        ...payload,
      };
    }
  }

  async applyToJob(
    jobId: string,
    payload: {
      caregiver_name: string;
      caregiver_city: string;
      experience_years: number;
      skills: string[];
      cover_note: string;
    }
  ): Promise<JobApplication> {
    try {
      const res = await apiFetch<{ application?: unknown }>(
        `/jobs/${jobId}/apply`,
        {
          method: "POST",
          body: JSON.stringify({
            cover_note: payload.cover_note,
          }),
        }
      );
      return normalizeApplication(res.application ?? res);
    } catch {
      return {
        id: `app-${Date.now()}`,
        job_id: jobId,
        caregiver_id: "user-rini-002",
        verified: true,
        status: "pending",
        ai_match_score: 92,
        ai_match_reason:
          "Keahlian perawatan lansia dan pengalaman lapangan selaras dengan kebutuhan medis keluarga.",
        applied_at: new Date().toISOString(),
        ...payload,
      };
    }
  }

  async updateApplicationStatus(
    applicationId: string,
    status: "accepted" | "rejected"
  ): Promise<{ id: string; status: "accepted" | "rejected" }> {
    try {
      const res = await apiFetch<{
        application?: { id: string; status: "accepted" | "rejected" };
        id?: string;
        status?: "accepted" | "rejected";
      }>(`/applications/${applicationId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      const app = res.application ?? res;
      return {
        id: String(app.id || applicationId),
        status: (app.status || status) as "accepted" | "rejected",
      };
    } catch {
      return { id: applicationId, status };
    }
  }

  async getSosAlerts(): Promise<SosAlert[]> {
    try {
      const res = await apiFetch<{ alerts?: unknown[] } | unknown[]>("/sos");
      const list = Array.isArray(res) ? res : res.alerts || [];
      return list.map(normalizeSosAlert);
    } catch {
      return MOCK_SOS_LIST;
    }
  }

  async triggerSosAlert(payload: {
    elderly_id: string;
    reason: string;
  }): Promise<SosAlert> {
    try {
      const res = await apiFetch<{ alert?: unknown }>("/sos", {
        method: "POST",
        body: JSON.stringify({
          elderly_id: payload.elderly_id,
          location_note: payload.reason,
          auto_triage: true,
        }),
      });
      return normalizeSosAlert(res.alert ?? res);
    } catch {
      return {
        id: `sos-${Date.now()}`,
        elderly_id: payload.elderly_id,
        elderly_name: MOCK_ELDERLY.name,
        triggered_by: "Rini Wulandari",
        reason: payload.reason,
        status: "active",
        nearest_hospital: MOCK_ELDERLY.nearest_hospital,
        created_at: new Date().toISOString(),
        triage_brief: {
          patient_summary:
            "Pak Joko (72 th), riwayat Hipertensi Ringan & Diabetes Tipe 2 Terkontrol.",
          allergies: MOCK_ELDERLY.allergies,
          routine_meds: MOCK_ELDERLY.routine_meds,
          last_24h_vitals:
            "TD terakhir 124/80 mmHg, nadi 78 bpm, obat pagi sudah diminum.",
          immediate_actions: [
            "Posisikan duduk atau berbaring miring yang nyaman dan longgarkan pakaian.",
            "Jangan berikan makanan/minuman jika pasien tampak pusing berat atau sesak.",
            "Siapkan daftar alergi (Udang/Kerang, Penisilin) untuk petugas IGD 119.",
          ],
          emergency_note: payload.reason,
        },
      };
    }
  }

  async resolveSosAlert(sosId: string): Promise<SosAlert> {
    try {
      const res = await apiFetch<{ alert?: unknown }>(`/sos/${sosId}/resolve`, {
        method: "PATCH",
      });
      return normalizeSosAlert(res.alert ?? res);
    } catch {
      return {
        id: sosId,
        elderly_id: "demo",
        triggered_by: "Rini Wulandari",
        reason: "Ditangani",
        status: "resolved",
        created_at: new Date().toISOString(),
        resolved_at: new Date().toISOString(),
      };
    }
  }

  async getNotifications(): Promise<AppNotification[]> {
    try {
      const res = await apiFetch<{ notifications?: unknown[] } | unknown[]>(
        "/notifications"
      );
      const list = Array.isArray(res) ? res : res.notifications || [];
      return list.map(normalizeNotification);
    } catch {
      return MOCK_NOTIFICATIONS;
    }
  }

  async postAnnouncement(payload: {
    title: string;
    message: string;
  }): Promise<AppNotification> {
    try {
      const res = await apiFetch<{ announcement?: unknown }>("/announcements", {
        method: "POST",
        body: JSON.stringify({
          title: payload.title,
          body: payload.message,
        }),
      });
      return normalizeNotification(res.announcement ?? res);
    } catch {
      return {
        id: `notif-${Date.now()}`,
        type: "announcement",
        created_at: new Date().toISOString(),
        ...payload,
      };
    }
  }

  async generateAiDailyDigest(payload: {
    elderly_id: string;
    logs?: CareLog[];
  }): Promise<AiDigest> {
    try {
      const res = await apiFetch<{ digest?: unknown }>("/ai/daily-digest", {
        method: "POST",
        body: JSON.stringify({ elderly_id: payload.elderly_id }),
      });
      return normalizeDigest(res.digest ?? res);
    } catch {
      const latest = payload.logs?.[payload.logs.length - 1];
      if (latest && (latest.systolic >= 145 || latest.heart_rate >= 100)) {
        return {
          elderly_id: payload.elderly_id,
          status: "waspada",
          summary: `Terpantau peningkatan tekanan darah (${latest.systolic}/${latest.diastolic} mmHg) dan detak jantung (${latest.heart_rate} bpm). Perlu pemantauan istirahat.`,
          meal_suggestion:
            "Berikan makanan lunak rendah natrium seperti sup bening labu siam dan hindari teh/kopi.",
          hydration_activity_tip:
            "Pastikan Pak Joko beristirahat duduk/berbaring tenang, ukur ulang tensi 30 menit lagi.",
          anomaly_alert: `Tekanan darah ${latest.systolic}/${latest.diastolic} mmHg melebihi rentang nyaman harian Pak Joko.`,
          generated_at: new Date().toISOString(),
        };
      }
      return { ...MOCK_AI_DIGEST, generated_at: new Date().toISOString() };
    }
  }

  async matchCaregiverWithAi(payload: {
    job: CareJob;
    caregiver: {
      id: string;
      name: string;
      experience_years: number;
      skills: string[];
    };
  }): Promise<AiMatchResult> {
    try {
      const isUuid =
        /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
          payload.caregiver.id
        );
      if (!isUuid) {
        throw new Error("Non-UUID mock caregiver_id");
      }
      return await apiFetch<AiMatchResult>("/ai/match-caregiver", {
        method: "POST",
        body: JSON.stringify({
          elderly_id: "demo",
          caregiver_id: payload.caregiver.id,
          job_id: payload.job.id,
        }),
      });
    } catch {
      const overlap = payload.caregiver.skills.filter((s) =>
        payload.job.required_skills.some((req) =>
          req.toLowerCase().includes(s.toLowerCase().split(" ")[0])
        )
      );
      const score = Math.min(
        98,
        76 + overlap.length * 7 + payload.caregiver.experience_years
      );
      return {
        caregiver_id: payload.caregiver.id,
        match_score: score,
        reason: `Memiliki ${payload.caregiver.experience_years} tahun pengalaman dan kecocokan pada ${
          overlap.length > 0 ? overlap.join(", ") : "pendampingan harian lansia"
        }.`,
      };
    }
  }

  async generateAiTriageBrief(payload: {
    elderly_id: string;
    reason: string;
  }): Promise<AiTriageBrief> {
    try {
      const res = await apiFetch<{ triage_brief?: unknown }>(
        "/ai/triage-brief",
        {
          method: "POST",
          body: JSON.stringify({ elderly_id: payload.elderly_id }),
        }
      );
      return (
        normalizeTriageBrief(res.triage_brief ?? res) || {
          patient_summary:
            "Pak Joko (72 th), riwayat Hipertensi Ringan & Diabetes Tipe 2 Terkontrol.",
          allergies: MOCK_ELDERLY.allergies,
          routine_meds: MOCK_ELDERLY.routine_meds,
          last_24h_vitals: "TD terakhir 124/80 mmHg, nadi 78 bpm.",
          immediate_actions: [
            "Jaga jalan napas tetap lapang dan posisikan tubuh nyaman.",
            "Hubungi 119 atau RSUD Pasar Minggu jika gejala memberat.",
          ],
          emergency_note: payload.reason,
        }
      );
    } catch {
      return {
        patient_summary:
          "Pak Joko (72 th), riwayat Hipertensi Ringan & Diabetes Tipe 2 Terkontrol.",
        allergies: MOCK_ELDERLY.allergies,
        routine_meds: MOCK_ELDERLY.routine_meds,
        last_24h_vitals:
          "TD terakhir 124/80 mmHg, nadi 78 bpm, obat pagi sudah diminum.",
        immediate_actions: [
          "Jaga jalan napas tetap lapang dan posisikan tubuh nyaman.",
          "Siapkan kartu identitas, daftar alergi (Udang/Kerang, Penisilin), dan obat rutin.",
          "Hubungi 119 atau RSUD Pasar Minggu jika gejala memberat.",
        ],
        emergency_note: payload.reason,
      };
    }
  }

  subscribeToStream(onEvent: (event: StreamEvent) => void): () => void {
    if (typeof window === "undefined" || typeof EventSource === "undefined") {
      return () => {};
    }
    const source = new EventSource(`${API_BASE_URL}/stream`);
    const handler = (type: string) => (ev: MessageEvent) => {
      try {
        const parsed = JSON.parse(ev.data);
        const raw = parsed?.data ?? parsed;

        if (type === "care_log") {
          onEvent({ type, data: normalizeCareLog(raw) });
        } else if (type === "sos_alert" || type === "sos_resolved") {
          onEvent({ type, data: normalizeSosAlert(raw) });
        } else if (type === "notification" || type === "announcement") {
          onEvent({ type, data: normalizeNotification(raw) });
        } else if (type === "ai_digest") {
          onEvent({ type, data: normalizeDigest(raw) });
        } else {
          onEvent({ type, data: raw });
        }
      } catch {
        onEvent({ type, data: ev.data });
      }
    };

    source.addEventListener("care_log", handler("care_log"));
    source.addEventListener("sos_alert", handler("sos_alert"));
    source.addEventListener("sos_resolved", handler("sos_resolved"));
    source.addEventListener("notification", handler("notification"));
    source.addEventListener("announcement", handler("announcement"));
    source.addEventListener("ai_digest", handler("ai_digest"));
    source.addEventListener("job_update", handler("job_update"));
    source.onmessage = handler("message");

    source.onerror = () => {
      // Silent fallback when backend SSE is not running
    };

    return () => {
      source.close();
    };
  }
}

export const apiService: ILenteraApiService = new LenteraApiService();
