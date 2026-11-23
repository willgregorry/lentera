import {
  DEMO_USERS,
  MOCK_AI_DIGEST,
  MOCK_CARE_LOGS,
  MOCK_ELDERLY,
  MOCK_JOBS,
  MOCK_NOTIFICATIONS,
  MOCK_SOS_LIST,
} from "@/content/mockData";
import { supabase } from "@/lib/supabase";
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
import { getStoredUser, setAuthSession } from "./authStorage";

const SHARED_STATE_KEY = "lentera_shared_state_v1";

interface SharedStore {
  elderly: ElderlyProfile;
  logs: CareLog[];
  jobs: CareJob[];
  sosAlerts: SosAlert[];
  notifications: AppNotification[];
  registeredCaregivers: UserProfile[];
  registeredUsers: UserProfile[];
}

function readSharedStore(): SharedStore {
  const empty: SharedStore = {
    elderly: MOCK_ELDERLY,
    logs: MOCK_CARE_LOGS,
    jobs: MOCK_JOBS,
    sosAlerts: MOCK_SOS_LIST,
    notifications: MOCK_NOTIFICATIONS,
    registeredCaregivers: [],
    registeredUsers: [],
  };
  if (typeof window === "undefined") {
    return empty;
  }
  try {
    const raw = window.localStorage.getItem(SHARED_STATE_KEY);
    if (raw) {
      return { ...empty, ...(JSON.parse(raw) as Partial<SharedStore>) };
    }
  } catch {
    // ignore parse error
  }
  return empty;
}

function writeSharedStore(updater: (prev: SharedStore) => SharedStore): SharedStore {
  const next = updater(readSharedStore());
  if (typeof window !== "undefined") {
    try {
      window.localStorage.setItem(SHARED_STATE_KEY, JSON.stringify(next));
    } catch {
      // ignore quota error
    }
  }
  return next;
}

class LenteraApiService implements ILenteraApiService {
  async loginUser(payload: {
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<{ user: UserProfile; token: string; isDemoFallback?: boolean }> {
    const targetRole: UserRole =
      payload.role ||
      (payload.email.toLowerCase().includes("caregiver") ||
      payload.email.toLowerCase().includes("rini")
        ? "caregiver"
        : "family");

    if (supabase && payload.password !== "google-oauth-session") {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: payload.email,
          password: payload.password,
        });
        if (!error && data.user && data.session) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("*")
            .eq("email", payload.email)
            .maybeSingle();

          const user: UserProfile = {
            id: profile?.id || data.user.id,
            name:
              profile?.full_name ||
              data.user.user_metadata?.full_name ||
              payload.email.split("@")[0],
            email: payload.email,
            role: (profile?.role as UserRole) || targetRole,
            phone: profile?.phone || "",
            city: profile?.location || "",
            verified: Boolean(profile?.is_verified ?? true),
            skills: Array.isArray(profile?.skills) ? profile.skills : [],
            experience_years: profile?.experience_years || 0,
            bio: profile?.bio || "",
          };
          setAuthSession(data.session.access_token, user);
          return { user, token: data.session.access_token };
        }
      } catch {
        // fallback below
      }
    }

    const storedMatch = readSharedStore().registeredUsers.find(
      (u) => u.email.toLowerCase() === (payload.email || "").toLowerCase()
    );

    const baseUser = DEMO_USERS[targetRole];
    const user: UserProfile = storedMatch
      ? { ...storedMatch, role: targetRole }
      : {
          ...baseUser,
          email: payload.email || baseUser.email,
          name:
            payload.email && !payload.email.includes("lentera.id")
              ? payload.email.split("@")[0]
              : baseUser.name,
          role: targetRole,
        };
    const token = `session-${targetRole}-${Date.now()}`;
    setAuthSession(token, user);
    return { user, token, isDemoFallback: true };
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
    const saveUserLocally = (u: UserProfile) => {
      writeSharedStore((prev) => {
        const userExists = prev.registeredUsers.some(
          (item) => item.email.toLowerCase() === u.email.toLowerCase()
        );
        const nextUsers = userExists
          ? prev.registeredUsers.map((item) =>
              item.email.toLowerCase() === u.email.toLowerCase() ? u : item
            )
          : [u, ...prev.registeredUsers];

        let nextCaregivers = prev.registeredCaregivers;
        if (u.role === "caregiver") {
          const cgExists = prev.registeredCaregivers.some(
            (c) => c.email.toLowerCase() === u.email.toLowerCase()
          );
          nextCaregivers = cgExists
            ? prev.registeredCaregivers.map((c) =>
                c.email.toLowerCase() === u.email.toLowerCase() ? u : c
              )
            : [u, ...prev.registeredCaregivers];
        }

        return {
          ...prev,
          registeredUsers: nextUsers,
          registeredCaregivers: nextCaregivers,
        };
      });
    };

    if (supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email: payload.email,
          password: payload.password,
          options: {
            data: {
              full_name: payload.name,
              role: payload.role,
              phone: payload.phone || "",
              location: payload.city || "",
              skills: payload.skills || [],
            },
          },
        });
        if (!error && data.user) {
          await supabase.from("profiles").upsert({
            id: data.user.id,
            email: payload.email,
            full_name: payload.name,
            role: payload.role,
            phone: payload.phone || null,
            location: payload.city || null,
            skills: payload.skills || [],
          });
          const user: UserProfile = {
            id: data.user.id,
            name: payload.name,
            email: payload.email,
            role: payload.role,
            phone: payload.phone || "",
            city: payload.city || "",
            verified: payload.role === "caregiver",
            skills: payload.skills || [],
          };
          saveUserLocally(user);
          const token = data.session?.access_token || `session-${data.user.id}`;
          setAuthSession(token, user);
          return { user, token };
        }
      } catch {
        // fallback below
      }
    }

    const user: UserProfile = {
      id: `user-${Date.now()}`,
      name: payload.name,
      email: payload.email,
      role: payload.role,
      phone: payload.phone || "",
      city: payload.city || "",
      verified: payload.role === "caregiver",
      skills: payload.skills || [],
    };
    saveUserLocally(user);
    const token = `session-${payload.role}-${Date.now()}`;
    setAuthSession(token, user);
    return { user, token, isDemoFallback: true };
  }

  async getCurrentProfile(): Promise<UserProfile | null> {
    return getStoredUser();
  }

  async getElderlyProfile(): Promise<ElderlyProfile> {
    if (supabase) {
      try {
        const { data } = await supabase
          .from("elderly_profiles")
          .select("*")
          .limit(1)
          .maybeSingle();
        if (data) {
          const statusVal = String(data.status || "aman").toLowerCase();
          const status: LenteraStatus =
            statusVal === "darurat" || statusVal === "waspada"
              ? statusVal
              : "aman";
          return {
            id: data.id,
            name: data.name,
            age: data.age,
            family_id: data.family_id,
            conditions: data.medical_conditions || [],
            allergies: data.allergies || [],
            routine_meds: Array.isArray(data.routine_medications)
              ? data.routine_medications.map((m: { name?: string }) =>
                  typeof m === "string" ? m : m?.name || "Obat"
                )
              : [],
            address: data.address || "",
            nearest_hospital: "RS Terdekat (119)",
            nearest_hospital_phone: "119",
            status,
          };
        }
      } catch {
        // fallback
      }
    }
    return readSharedStore().elderly;
  }

  async getCareLogs(): Promise<CareLog[]> {
    if (supabase) {
      try {
        const { data } = await supabase
          .from("care_logs")
          .select("*")
          .order("logged_at", { ascending: true });
        if (data && data.length > 0) {
          return data.map((row) => ({
            id: row.id,
            elderly_id: row.elderly_id,
            caregiver_id: row.caregiver_id,
            caregiver_name: "Caregiver Bertugas",
            heart_rate: row.heart_rate || 78,
            systolic: row.blood_pressure_systolic || 120,
            diastolic: row.blood_pressure_diastolic || 80,
            meal_portion: row.meal_portion || "habis",
            medication_taken: Boolean(row.medication_taken),
            mood: row.mood || "tenang",
            notes: row.notes || "",
            photo_url: row.photo_url || undefined,
            logged_at: row.logged_at || row.created_at,
          }));
        }
      } catch {
        // fallback
      }
    }
    return readSharedStore().logs;
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
    const currentUser = getStoredUser();
    const obj =
      payload instanceof FormData
        ? {
            elderly_id: String(payload.get("elderly_id") || "default-elderly"),
            heart_rate: Number(payload.get("heart_rate") || 78),
            systolic: Number(payload.get("systolic") || 120),
            diastolic: Number(payload.get("diastolic") || 80),
            meal_portion: (String(payload.get("meal_portion") || "habis") as CareLog["meal_portion"]),
            medication_taken: payload.get("medication_taken") !== "false",
            mood: (String(payload.get("mood") || "tenang") as CareLog["mood"]),
            notes: String(payload.get("notes") || ""),
          }
        : payload;

    const newLog: CareLog = {
      id: `log-${Date.now()}`,
      caregiver_id: currentUser?.id || "caregiver",
      caregiver_name: currentUser?.name || "Caregiver",
      logged_at: new Date().toISOString(),
      ...obj,
    };

    if (supabase) {
      try {
        await supabase.from("care_logs").insert({
          elderly_id: obj.elderly_id,
          caregiver_id: newLog.caregiver_id,
          heart_rate: obj.heart_rate,
          blood_pressure_systolic: obj.systolic,
          blood_pressure_diastolic: obj.diastolic,
          meal_portion: obj.meal_portion,
          medication_taken: obj.medication_taken,
          mood: obj.mood,
          notes: obj.notes,
        });
      } catch {
        // persisted locally below
      }
    }

    writeSharedStore((prev) => ({
      ...prev,
      logs: [...prev.logs, newLog],
    }));
    return newLog;
  }

  async getJobs(): Promise<CareJob[]> {
    if (supabase) {
      try {
        const { data } = await supabase
          .from("care_jobs")
          .select("*")
          .order("created_at", { ascending: false });
        if (data && data.length > 0) {
          return data.map((j) => ({
            id: j.id,
            family_id: j.family_id,
            family_name: "Keluarga",
            elderly_name: "Orang Tua",
            elderly_age: 70,
            title: j.title,
            location: j.location,
            schedule: j.schedule,
            salary_display: `Rp ${Number(j.salary_min || 0).toLocaleString("id-ID")} / bulan`,
            medical_notes: j.description,
            required_skills: j.required_skills || [],
            status: j.status === "filled" ? "filled" : "open",
            created_at: j.created_at,
            applications: [],
          }));
        }
      } catch {
        // fallback
      }
    }
    return readSharedStore().jobs;
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
    const currentUser = getStoredUser();
    const newJob: CareJob = {
      id: `job-${Date.now()}`,
      family_id: currentUser?.id || "family",
      family_name: currentUser?.name || "Keluarga",
      status: "open",
      created_at: new Date().toISOString(),
      applications: [],
      ...payload,
    };

    if (supabase) {
      try {
        const numeric = Number(payload.salary_display.replace(/[^\d]/g, "")) || 0;
        await supabase.from("care_jobs").insert({
          family_id: newJob.family_id,
          title: payload.title,
          description: payload.medical_notes,
          schedule: payload.schedule,
          location: payload.location,
          salary_min: numeric,
          salary_max: numeric,
          required_skills: payload.required_skills,
        });
      } catch {
        // persisted locally below
      }
    }

    writeSharedStore((prev) => ({
      ...prev,
      elderly: {
        ...prev.elderly,
        name: payload.elderly_name || prev.elderly.name,
        age: payload.elderly_age || prev.elderly.age,
        address: payload.location || prev.elderly.address,
      },
      jobs: [newJob, ...prev.jobs],
    }));
    return newJob;
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
    const currentUser = getStoredUser();
    const newApp: JobApplication = {
      id: `app-${Date.now()}`,
      job_id: jobId,
      caregiver_id: currentUser?.id || "caregiver",
      verified: true,
      status: "pending",
      applied_at: new Date().toISOString(),
      ...payload,
    };

    writeSharedStore((prev) => ({
      ...prev,
      jobs: prev.jobs.map((j) =>
        j.id === jobId
          ? { ...j, applications: [...(j.applications || []), newApp] }
          : j
      ),
    }));
    return newApp;
  }

  async updateApplicationStatus(
    applicationId: string,
    status: "accepted" | "rejected"
  ): Promise<{ id: string; status: "accepted" | "rejected" }> {
    writeSharedStore((prev) => ({
      ...prev,
      jobs: prev.jobs.map((j) => {
        const apps = j.applications || [];
        const hasApp = apps.some((a) => a.id === applicationId);
        if (!hasApp) return j;
        return {
          ...j,
          status: status === "accepted" ? "filled" : j.status,
          applications: apps.map((a) =>
            a.id === applicationId ? { ...a, status } : a
          ),
        };
      }),
    }));
    return { id: applicationId, status };
  }

  async getSosAlerts(): Promise<SosAlert[]> {
    return readSharedStore().sosAlerts;
  }

  async triggerSosAlert(payload: {
    elderly_id: string;
    reason: string;
  }): Promise<SosAlert> {
    const currentUser = getStoredUser();
    const store = readSharedStore();
    let triageBrief: AiTriageBrief | undefined;

    try {
      const res = await fetch("/api/ai/triage-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          elderly: store.elderly,
          logs: store.logs,
          reason: payload.reason,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        triageBrief = data.triage_brief;
      }
    } catch {
      // fallback below
    }

    const alert: SosAlert = {
      id: `sos-${Date.now()}`,
      elderly_id: payload.elderly_id,
      elderly_name: store.elderly.name,
      triggered_by: currentUser?.name || "Caregiver",
      reason: payload.reason,
      status: "active",
      nearest_hospital: store.elderly.nearest_hospital,
      created_at: new Date().toISOString(),
      triage_brief: triageBrief || {
        patient_summary: `${store.elderly.name} (${store.elderly.age} th)`,
        allergies: store.elderly.allergies,
        routine_meds: store.elderly.routine_meds,
        last_24h_vitals: "Vital terakhir terpantau dalam catatan harian.",
        immediate_actions: [
          "Posisikan pasien nyaman dan longgarkan pakaian.",
          "Segera hubungi layanan darurat 119.",
        ],
        emergency_note: payload.reason,
      },
    };

    writeSharedStore((prev) => ({
      ...prev,
      sosAlerts: [alert, ...prev.sosAlerts],
    }));
    return alert;
  }

  async resolveSosAlert(sosId: string): Promise<SosAlert> {
    let resolved: SosAlert | undefined;
    writeSharedStore((prev) => ({
      ...prev,
      sosAlerts: prev.sosAlerts.map((s) => {
        if (s.id === sosId) {
          resolved = {
            ...s,
            status: "resolved",
            resolved_at: new Date().toISOString(),
          };
          return resolved;
        }
        return s;
      }),
    }));
    return (
      resolved || {
        id: sosId,
        elderly_id: "default-elderly",
        triggered_by: "Caregiver",
        reason: "Ditangani",
        status: "resolved",
        created_at: new Date().toISOString(),
        resolved_at: new Date().toISOString(),
      }
    );
  }

  async getNotifications(): Promise<AppNotification[]> {
    return readSharedStore().notifications;
  }

  async postAnnouncement(payload: {
    title: string;
    message: string;
  }): Promise<AppNotification> {
    const notif: AppNotification = {
      id: `notif-${Date.now()}`,
      type: "announcement",
      created_at: new Date().toISOString(),
      ...payload,
    };
    writeSharedStore((prev) => ({
      ...prev,
      notifications: [notif, ...prev.notifications],
    }));
    return notif;
  }

  async generateAiDailyDigest(payload: {
    elderly_id: string;
    logs?: CareLog[];
  }): Promise<AiDigest> {
    const store = readSharedStore();
    try {
      const res = await fetch("/api/ai/daily-digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          elderly: store.elderly,
          logs: payload.logs || store.logs,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.digest) {
          return {
            elderly_id: payload.elderly_id,
            ...data.digest,
          };
        }
      }
    } catch {
      // fallback
    }
    return MOCK_AI_DIGEST;
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
      const res = await fetch("/api/ai/match-caregiver", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ job: payload.job, applicant: payload.caregiver }),
      });
      if (res.ok) {
        const data = await res.json();
        return {
          caregiver_id: payload.caregiver.id,
          match_score: Number(data.match_score || 92),
          reason: String(data.reason || ""),
        };
      }
    } catch {
      // fallback
    }
    return {
      caregiver_id: payload.caregiver.id,
      match_score: 92,
      reason:
        "Keahlian dan pengalaman pelamar sangat sesuai dengan kebutuhan perawatan keluarga.",
    };
  }

  async generateAiTriageBrief(payload: {
    elderly_id: string;
    reason: string;
  }): Promise<AiTriageBrief> {
    const store = readSharedStore();
    try {
      const res = await fetch("/api/ai/triage-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          elderly: store.elderly,
          logs: store.logs,
          reason: payload.reason,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.triage_brief) return data.triage_brief;
      }
    } catch {
      // fallback
    }
    return {
      patient_summary: `${store.elderly.name} (${store.elderly.age} th)`,
      allergies: store.elderly.allergies,
      routine_meds: store.elderly.routine_meds,
      last_24h_vitals: "Vital terakhir terpantau dalam catatan harian.",
      immediate_actions: [
        "Posisikan pasien nyaman dan longgarkan pakaian.",
        "Segera hubungi layanan darurat 119.",
      ],
      emergency_note: payload.reason,
    };
  }

  subscribeToStream(_onEvent: (event: StreamEvent) => void): () => void {
    return () => {};
  }
}

export function getLocalRegisteredCaregivers(): UserProfile[] {
  return readSharedStore().registeredCaregivers;
}

export const apiService: ILenteraApiService = new LenteraApiService();
