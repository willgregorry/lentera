import {
  MOCK_AI_DIGEST,
  MOCK_ELDERLY,
} from "@/content/mockData";
import { supabase } from "@/lib/supabase";
import { notifyUserDevice } from "@/lib/notifications";
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

function requireSupabase() {
  if (!supabase) {
    throw new Error(
      "Konfigurasi Supabase belum tersedia. Pastikan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY terisi."
    );
  }
  return supabase;
}

class LenteraSupabaseService implements ILenteraApiService {
  async loginUser(payload: {
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<{ user: UserProfile; token: string }> {
    const db = requireSupabase();

    if (payload.password === "google-oauth-session") {
      await db.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo:
            typeof window !== "undefined"
              ? `${window.location.origin}/${payload.role === "caregiver" ? "loker" : "caregivers"}`
              : undefined,
        },
      });
    }

    const { data, error } = await db.auth.signInWithPassword({
      email: payload.email,
      password: payload.password,
    });

    if (error || !data.user || !data.session) {
      throw new Error(error?.message || "Email atau kata sandi tidak sesuai.");
    }

    const { data: profile } = await db
      .from("profiles")
      .select("*")
      .eq("id", data.user.id)
      .maybeSingle();

    const meta = data.user.user_metadata || {};
    const displayName =
      profile?.full_name ||
      meta.display_name ||
      meta.full_name ||
      meta.name ||
      payload.email.split("@")[0];

    const resolvedRole: UserRole =
      (profile?.role as UserRole) ||
      (meta.role as UserRole) ||
      payload.role ||
      "family";

    if (!profile) {
      await db.from("profiles").upsert({
        id: data.user.id,
        email: payload.email,
        full_name: String(displayName),
        role: resolvedRole,
        phone: meta.phone || null,
        location: meta.location || null,
      });
    }

    const user: UserProfile = {
      id: data.user.id,
      name: String(displayName),
      email: payload.email,
      role: resolvedRole,
      phone: profile?.phone || meta.phone || "",
      city: profile?.location || meta.location || "",
      verified: Boolean(profile?.is_verified ?? true),
      skills: Array.isArray(profile?.skills) ? profile.skills : [],
      experience_years: Number(profile?.experience_years || 0),
      bio: profile?.bio || "",
    };

    setAuthSession(data.session.access_token, user);
    return { user, token: data.session.access_token };
  }

  async registerUser(payload: {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    phone?: string;
    city?: string;
    skills?: string[];
  }): Promise<{ user: UserProfile; token: string }> {
    const db = requireSupabase();

    const { data, error } = await db.auth.signUp({
      email: payload.email,
      password: payload.password,
      options: {
        data: {
          display_name: payload.name,
          full_name: payload.name,
          name: payload.name,
          role: payload.role,
          phone: payload.phone || "",
          location: payload.city || "",
          skills: payload.skills || [],
        },
      },
    });

    if (error || !data.user) {
      throw new Error(error?.message || "Gagal mendaftarkan akun baru.");
    }

    let activeSession = data.session;
    if (!activeSession) {
      const signInRes = await db.auth.signInWithPassword({
        email: payload.email,
        password: payload.password,
      });
      if (signInRes.error) {
        if (signInRes.error.message.toLowerCase().includes("email not confirmed")) {
          throw new Error(
            "Verifikasi email masih aktif di Supabase. Matikan 'Confirm email' di Supabase Auth → Providers → Email agar akun baru bisa langsung dipakai."
          );
        }
        throw new Error(signInRes.error.message);
      }
      activeSession = signInRes.data.session;
    }

    await db.from("profiles").upsert({
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
      verified: true,
      skills: payload.skills || [],
    };

    const token = activeSession?.access_token || `supabase-${data.user.id}`;
    setAuthSession(token, user);
    return { user, token };
  }

  async getCurrentProfile(): Promise<UserProfile | null> {
    return getStoredUser();
  }

  async getElderlyProfile(): Promise<ElderlyProfile> {
    const db = requireSupabase();
    const currentUser = getStoredUser();

    let query = db.from("elderly_profiles").select("*");
    if (currentUser?.role === "family") {
      query = query.eq("family_id", currentUser.id);
    }

    const { data } = await query
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (!data) return MOCK_ELDERLY;

    const statusVal = String(data.status || "aman").toLowerCase();
    const status: LenteraStatus =
      statusVal === "darurat" || statusVal === "waspada" ? statusVal : "aman";

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

  async getCareLogs(elderlyId?: string): Promise<CareLog[]> {
    const db = requireSupabase();
    let query = db
      .from("care_logs")
      .select("*, caregiver:profiles!care_logs_caregiver_id_fkey(full_name)")
      .order("logged_at", { ascending: true });

    if (elderlyId && elderlyId !== "demo" && elderlyId !== "default-elderly") {
      query = query.eq("elderly_id", elderlyId);
    }

    const { data } = await query;
    if (!data) return [];

    return data.map((row) => ({
      id: row.id,
      elderly_id: row.elderly_id,
      caregiver_id: row.caregiver_id,
      caregiver_name:
        (row.caregiver as { full_name?: string } | null)?.full_name ||
        "Perawat Bertugas",
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
    const db = requireSupabase();
    const currentUser = getStoredUser();
    if (!currentUser) throw new Error("Silakan masuk terlebih dahulu.");

    let elderlyId =
      payload instanceof FormData
        ? String(payload.get("elderly_id") || "")
        : payload.elderly_id;

    if (!elderlyId || elderlyId === "demo" || elderlyId === "default-elderly") {
      const eld = await this.getElderlyProfile();
      elderlyId = eld.id;
    }

    let photoUrl: string | undefined;
    if (payload instanceof FormData) {
      const file = payload.get("photo") as File | null;
      if (file && file.size > 0) {
        const ext = file.name.split(".").pop() || "jpg";
        const filePath = `${currentUser.id}/${Date.now()}.${ext}`;
        const { error: uploadErr } = await db.storage
          .from("care-photos")
          .upload(filePath, file);
        if (!uploadErr) {
          const { data: pub } = db.storage
            .from("care-photos")
            .getPublicUrl(filePath);
          photoUrl = pub.publicUrl;
        }
      }
    } else {
      photoUrl = payload.photo_url;
    }

    const rowPayload =
      payload instanceof FormData
        ? {
            elderly_id: elderlyId,
            caregiver_id: currentUser.id,
            heart_rate: Number(payload.get("heart_rate") || 78),
            blood_pressure_systolic: Number(payload.get("systolic") || 120),
            blood_pressure_diastolic: Number(payload.get("diastolic") || 80),
            meal_portion: String(payload.get("meal_portion") || "habis"),
            medication_taken: payload.get("medication_taken") !== "false",
            mood: String(payload.get("mood") || "tenang"),
            notes: String(payload.get("notes") || ""),
            photo_url: photoUrl || null,
          }
        : {
            elderly_id: elderlyId,
            caregiver_id: currentUser.id,
            heart_rate: payload.heart_rate,
            blood_pressure_systolic: payload.systolic,
            blood_pressure_diastolic: payload.diastolic,
            meal_portion: payload.meal_portion,
            medication_taken: payload.medication_taken,
            mood: payload.mood,
            notes: payload.notes,
            photo_url: photoUrl || null,
          };

    const { data, error } = await db
      .from("care_logs")
      .insert(rowPayload)
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Gagal menyimpan laporan harian.");
    }

    const created: CareLog = {
      id: data.id,
      elderly_id: data.elderly_id,
      caregiver_id: data.caregiver_id,
      caregiver_name: currentUser.name,
      heart_rate: data.heart_rate,
      systolic: data.blood_pressure_systolic,
      diastolic: data.blood_pressure_diastolic,
      meal_portion: data.meal_portion,
      medication_taken: Boolean(data.medication_taken),
      mood: data.mood,
      notes: data.notes,
      photo_url: data.photo_url || undefined,
      logged_at: data.logged_at || data.created_at,
    };

    notifyUserDevice({
      title: `Laporan Baru dari ${currentUser.name}`,
      body: `TD ${created.systolic}/${created.diastolic} mmHg · Nadi ${created.heart_rate} bpm — ${created.notes}`,
      url: "/notifikasi",
    });

    return created;
  }

  async getJobs(): Promise<CareJob[]> {
    const db = requireSupabase();
    const { data } = await db
      .from("care_jobs")
      .select(
        "*, family:profiles!care_jobs_family_id_fkey(full_name), elderly:elderly_profiles(name, age), applications:job_applications(*, caregiver:profiles!job_applications_caregiver_id_fkey(id, full_name, location, experience_years, skills, is_verified))"
      )
      .order("created_at", { ascending: false });

    if (!data) return [];

    return data.map((j) => {
      const fam = j.family as { full_name?: string } | null;
      const eld = j.elderly as { name?: string; age?: number } | null;
      const rawApps = Array.isArray(j.applications) ? j.applications : [];

      const apps: JobApplication[] = rawApps.map(
        (a: Record<string, unknown>) => {
          const cg = (a.caregiver || {}) as Record<string, unknown>;
          return {
            id: String(a.id),
            job_id: String(a.job_id),
            caregiver_id: String(a.caregiver_id),
            caregiver_name: String(cg.full_name || "Perawat Terdaftar"),
            caregiver_city: String(cg.location || "Indonesia"),
            experience_years: Number(cg.experience_years || 0),
            skills: Array.isArray(cg.skills) ? (cg.skills as string[]) : [],
            verified: Boolean(cg.is_verified ?? true),
            cover_note: String(a.cover_note || ""),
            status: (a.status as JobApplication["status"]) || "pending",
            ai_match_score:
              typeof a.match_score === "number" ? a.match_score : undefined,
            ai_match_reason: a.match_reason
              ? String(a.match_reason)
              : undefined,
            applied_at: String(a.created_at || new Date().toISOString()),
          };
        }
      );

      return {
        id: j.id,
        family_id: j.family_id,
        family_name: fam?.full_name || "Keluarga",
        elderly_name: eld?.name || "Orang Tua",
        elderly_age: Number(eld?.age || 70),
        title: j.title,
        location: j.location,
        schedule: j.schedule,
        salary_display: `Rp ${Number(j.salary_min || 0).toLocaleString("id-ID")} / bulan`,
        medical_notes: j.description,
        required_skills: j.required_skills || [],
        status: j.status === "filled" ? "filled" : "open",
        created_at: j.created_at,
        applications: apps,
      };
    });
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
    const db = requireSupabase();
    const currentUser = getStoredUser();
    if (!currentUser) throw new Error("Silakan masuk terlebih dahulu.");

    // Ensure an elderly_profile exists in Supabase for this family
    const { data: existingEld } = await db
      .from("elderly_profiles")
      .select("id")
      .eq("family_id", currentUser.id)
      .limit(1)
      .maybeSingle();

    let elderlyId = existingEld?.id as string | undefined;
    if (!elderlyId) {
      const { data: createdEld, error: eldErr } = await db
        .from("elderly_profiles")
        .insert({
          family_id: currentUser.id,
          name: payload.elderly_name,
          age: payload.elderly_age || 70,
          address: payload.location,
          medical_conditions: payload.required_skills,
        })
        .select("id")
        .single();
      if (eldErr || !createdEld) {
        throw new Error(eldErr?.message || "Gagal membuat profil lansia.");
      }
      elderlyId = createdEld.id;
    }

    const numeric = Number(payload.salary_display.replace(/[^\d]/g, "")) || 0;
    const { data: jobRow, error } = await db
      .from("care_jobs")
      .insert({
        family_id: currentUser.id,
        elderly_id: elderlyId,
        title: payload.title,
        description: payload.medical_notes,
        schedule: payload.schedule,
        location: payload.location,
        salary_min: numeric,
        salary_max: numeric,
        required_skills: payload.required_skills,
      })
      .select("*")
      .single();

    if (error || !jobRow) {
      throw new Error(error?.message || "Gagal membuat lowongan.");
    }

    return {
      id: jobRow.id,
      family_id: currentUser.id,
      family_name: currentUser.name,
      elderly_name: payload.elderly_name,
      elderly_age: payload.elderly_age,
      title: jobRow.title,
      location: jobRow.location,
      schedule: jobRow.schedule,
      salary_display: payload.salary_display,
      medical_notes: jobRow.description,
      required_skills: jobRow.required_skills || [],
      status: "open",
      created_at: jobRow.created_at,
      applications: [],
    };
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
    const db = requireSupabase();
    const currentUser = getStoredUser();
    if (!currentUser) throw new Error("Silakan masuk terlebih dahulu.");

    const { data, error } = await db
      .from("job_applications")
      .insert({
        job_id: jobId,
        caregiver_id: currentUser.id,
        cover_note: payload.cover_note,
      })
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Gagal mengirim lamaran.");
    }

    return {
      id: data.id,
      job_id: data.job_id,
      caregiver_id: currentUser.id,
      caregiver_name: currentUser.name,
      caregiver_city: currentUser.city || payload.caregiver_city,
      experience_years: currentUser.experience_years || payload.experience_years,
      skills: currentUser.skills || payload.skills,
      verified: true,
      cover_note: data.cover_note || payload.cover_note,
      status: "pending",
      applied_at: data.created_at,
    };
  }

  async updateApplicationStatus(
    applicationId: string,
    status: "accepted" | "rejected"
  ): Promise<{ id: string; status: "accepted" | "rejected" }> {
    const db = requireSupabase();

    const { data: appRow, error } = await db
      .from("job_applications")
      .update({ status })
      .eq("id", applicationId)
      .select("id, job_id, caregiver_id, status")
      .single();

    if (error || !appRow) {
      throw new Error(error?.message || "Gagal memperbarui status lamaran.");
    }

    if (status === "accepted") {
      await db
        .from("care_jobs")
        .update({
          status: "filled",
          assigned_caregiver_id: appRow.caregiver_id,
        })
        .eq("id", appRow.job_id);
    }

    return { id: appRow.id, status };
  }

  async getSosAlerts(): Promise<SosAlert[]> {
    const db = requireSupabase();
    const { data } = await db
      .from("sos_alerts")
      .select("*, elderly:elderly_profiles(name), triggerer:profiles!sos_alerts_triggered_by_fkey(full_name)")
      .order("created_at", { ascending: false });

    if (!data) return [];

    return data.map((row) => ({
      id: row.id,
      elderly_id: row.elderly_id,
      elderly_name:
        (row.elderly as { name?: string } | null)?.name || "Orang Tua",
      triggered_by:
        (row.triggerer as { full_name?: string } | null)?.full_name ||
        "Perawat",
      reason: row.location_note || "Kondisi darurat medis di rumah",
      status: row.status === "resolved" ? "resolved" : "active",
      triage_brief: row.triage_brief as AiTriageBrief | undefined,
      nearest_hospital: "RS Terdekat (119)",
      created_at: row.created_at,
      resolved_at: row.resolved_at || undefined,
    }));
  }

  async triggerSosAlert(payload: {
    elderly_id: string;
    reason: string;
  }): Promise<SosAlert> {
    const db = requireSupabase();
    const currentUser = getStoredUser();
    if (!currentUser) throw new Error("Silakan masuk terlebih dahulu.");

    const elderly = await this.getElderlyProfile();
    const logs = await this.getCareLogs(elderly.id);
    const triageBrief = await this.generateAiTriageBrief({
      elderly_id: elderly.id,
      reason: payload.reason,
    });

    const { data, error } = await db
      .from("sos_alerts")
      .insert({
        elderly_id: elderly.id,
        triggered_by: currentUser.id,
        status: "active",
        location_note: payload.reason,
        triage_brief: triageBrief,
      })
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Gagal mengirim sinyal SOS.");
    }

    const alert: SosAlert = {
      id: data.id,
      elderly_id: data.elderly_id,
      elderly_name: elderly.name,
      triggered_by: currentUser.name,
      reason: payload.reason,
      status: "active",
      nearest_hospital: elderly.nearest_hospital,
      triage_brief: triageBrief,
      created_at: data.created_at,
    };

    void logs;
    notifyUserDevice({
      title: `DARURAT SOS — ${elderly.name}`,
      body: payload.reason,
      url: "/notifikasi",
      urgent: true,
    });

    return alert;
  }

  async resolveSosAlert(sosId: string): Promise<SosAlert> {
    const db = requireSupabase();
    const { data, error } = await db
      .from("sos_alerts")
      .update({
        status: "resolved",
        resolved_at: new Date().toISOString(),
      })
      .eq("id", sosId)
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Gagal menyelesaikan status SOS.");
    }

    return {
      id: data.id,
      elderly_id: data.elderly_id,
      triggered_by: "Perawat",
      reason: data.location_note || "Ditangani",
      status: "resolved",
      created_at: data.created_at,
      resolved_at: data.resolved_at,
    };
  }

  async getNotifications(): Promise<AppNotification[]> {
    const db = requireSupabase();
    const { data } = await db
      .from("notifications")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(20);

    if (!data) return [];

    return data.map((n) => ({
      id: n.id,
      title: n.title,
      message: n.body,
      type:
        n.type === "sos"
          ? "emergency"
          : n.type === "ai_digest"
          ? "warning"
          : "info",
      created_at: n.created_at,
      read: Boolean(n.is_read),
    }));
  }

  async postAnnouncement(payload: {
    title: string;
    message: string;
  }): Promise<AppNotification> {
    const db = requireSupabase();
    const { data, error } = await db
      .from("notifications")
      .insert({
        title: payload.title,
        body: payload.message,
        type: "announcement",
      })
      .select("*")
      .single();

    if (error || !data) {
      throw new Error(error?.message || "Gagal mengirim pengumuman.");
    }

    return {
      id: data.id,
      title: data.title,
      message: data.body,
      type: "announcement",
      created_at: data.created_at,
    };
  }

  async generateAiDailyDigest(payload: {
    elderly_id: string;
    logs?: CareLog[];
  }): Promise<AiDigest> {
    const elderly = await this.getElderlyProfile();
    const logs = payload.logs || (await this.getCareLogs(elderly.id));

    try {
      const res = await fetch("/api/ai/daily-digest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elderly, logs }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.digest) {
          return {
            elderly_id: elderly.id,
            ...data.digest,
          };
        }
      }
    } catch {
      // fallback below
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
    return {
      caregiver_id: payload.caregiver.id,
      match_score: 90,
      reason: "Keahlian pelamar sesuai dengan kebutuhan perawatan keluarga.",
    };
  }

  async generateAiTriageBrief(payload: {
    elderly_id: string;
    reason: string;
  }): Promise<AiTriageBrief> {
    const elderly = await this.getElderlyProfile();
    const logs = await this.getCareLogs(elderly.id);

    const res = await fetch("/api/ai/triage-brief", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ elderly, logs, reason: payload.reason }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.triage_brief) return data.triage_brief;
    }

    return {
      patient_summary: `${elderly.name} (${elderly.age} th)`,
      allergies: elderly.allergies,
      routine_meds: elderly.routine_meds,
      last_24h_vitals: "Vital terakhir terpantau dalam catatan harian.",
      immediate_actions: [
        "Posisikan pasien nyaman dan longgarkan pakaian.",
        "Segera hubungi layanan darurat 119.",
      ],
      emergency_note: payload.reason,
    };
  }

  subscribeToStream(onEvent: (event: StreamEvent) => void): () => void {
    if (!supabase) return () => {};

    const channel = supabase
      .channel("lentera-realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "care_logs" },
        (payload) => {
          const row = payload.new as Record<string, unknown>;
          onEvent({
            type: "care_log",
            data: {
              id: String(row.id),
              elderly_id: String(row.elderly_id),
              caregiver_id: String(row.caregiver_id),
              caregiver_name: "Perawat Bertugas",
              heart_rate: Number(row.heart_rate || 78),
              systolic: Number(row.blood_pressure_systolic || 120),
              diastolic: Number(row.blood_pressure_diastolic || 80),
              meal_portion: String(row.meal_portion || "habis"),
              medication_taken: Boolean(row.medication_taken),
              mood: String(row.mood || "tenang"),
              notes: String(row.notes || ""),
              photo_url: row.photo_url ? String(row.photo_url) : undefined,
              logged_at: String(row.logged_at || row.created_at),
            },
          });
        }
      )
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "sos_alerts" },
        (payload) => {
          const row = payload.new as Record<string, unknown>;
          onEvent({
            type: "sos_alert",
            data: {
              id: String(row.id),
              elderly_id: String(row.elderly_id),
              triggered_by: "Perawat",
              reason: String(row.location_note || "Darurat Medis"),
              status: "active",
              triage_brief: row.triage_brief,
              created_at: String(row.created_at),
            },
          });
        }
      )
      .subscribe();

    return () => {
      supabase?.removeChannel(channel);
    };
  }
}

export const apiService: ILenteraApiService = new LenteraSupabaseService();
