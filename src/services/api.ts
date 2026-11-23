import {
  MOCK_AI_DIGEST,
  MOCK_ELDERLY,
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

function requireSupabase() {
  if (!supabase) {
    throw new Error(
      "Konfigurasi Supabase belum tersedia. Pastikan NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY terisi."
    );
  }
  return supabase;
}

function mapSupabaseError(
  error: { message?: string; code?: string } | null | undefined,
  fallback: string
): Error {
  const raw = error?.message || "";
  const lower = raw.toLowerCase();
  if (lower.includes("row-level security")) {
    return new Error(
      "Sesi akun Anda tidak sesuai atau sudah berakhir. Silakan keluar lalu masuk kembali."
    );
  }
  if (lower.includes("duplicate key") || error?.code === "23505") {
    return new Error("Data ini sudah pernah dikirim sebelumnya.");
  }
  return new Error(raw || fallback);
}

class LenteraSupabaseService implements ILenteraApiService {
  /**
   * Verifies the cryptographic Supabase Auth JWT for this tab, ensures a
   * matching row exists in `public.profiles`, and returns the authoritative
   * actor identity (`auth.uid()`).
   */
  private async requireAuthenticatedActor(): Promise<UserProfile> {
    const db = requireSupabase();
    const { data: authData, error: authErr } = await db.auth.getUser();
    const authUser = authData?.user;

    if (authErr || !authUser) {
      throw new Error(
        "Sesi login Anda telah berakhir. Silakan masuk kembali untuk melanjutkan."
      );
    }

    const stored = getStoredUser();
    const meta = authUser.user_metadata || {};

    const { data: profile } = await db
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();

    const resolvedName = String(
      profile?.full_name ||
        meta.display_name ||
        meta.full_name ||
        meta.name ||
        (stored?.id === authUser.id ? stored.name : "") ||
        authUser.email?.split("@")[0] ||
        "Pengguna"
    );

    const resolvedRole: UserRole =
      (profile?.role as UserRole) ||
      (meta.role as UserRole) ||
      (stored?.id === authUser.id ? stored.role : "family") ||
      "family";

    if (!profile) {
      await db.from("profiles").upsert({
        id: authUser.id,
        email: authUser.email || stored?.email || `${authUser.id}@lentera.id`,
        full_name: resolvedName,
        role: resolvedRole,
        phone: meta.phone || (stored?.id === authUser.id ? stored.phone : null) || null,
        location:
          meta.location || (stored?.id === authUser.id ? stored.city : null) || null,
        skills: Array.isArray(meta.skills) ? meta.skills : [],
      });
    }

    return {
      id: authUser.id,
      name: resolvedName,
      email: authUser.email || stored?.email || "",
      role: resolvedRole,
      phone: profile?.phone || meta.phone || "",
      city: profile?.location || meta.location || "",
      verified: Boolean(profile?.is_verified ?? true),
      skills: Array.isArray(profile?.skills) ? profile.skills : [],
      experience_years: Number(profile?.experience_years || 0),
      bio: profile?.bio || "",
    };
  }
  async loginUser(payload: {
    email: string;
    password: string;
    role?: UserRole;
  }): Promise<{ user: UserProfile; token: string }> {
    const db = requireSupabase();

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
    const currentUser = await this.requireAuthenticatedActor().catch(() =>
      getStoredUser()
    );

    let data: Record<string, unknown> | null = null;

    if (currentUser?.role === "caregiver") {
      let targetElderlyId: string | null = null;

      const { data: assignedJob } = await db
        .from("care_jobs")
        .select("elderly_id")
        .eq("assigned_caregiver_id", currentUser.id)
        .eq("status", "filled")
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (assignedJob?.elderly_id) {
        targetElderlyId = String(assignedJob.elderly_id);
      } else {
        const { data: acceptedApp } = await db
          .from("job_applications")
          .select("job_id")
          .eq("caregiver_id", currentUser.id)
          .eq("status", "accepted")
          .order("created_at", { ascending: false })
          .limit(1)
          .maybeSingle();

        if (acceptedApp?.job_id) {
          const { data: jobRow } = await db
            .from("care_jobs")
            .select("elderly_id")
            .eq("id", acceptedApp.job_id)
            .maybeSingle();
          if (jobRow?.elderly_id) {
            targetElderlyId = String(jobRow.elderly_id);
          }
        }
      }

      if (targetElderlyId) {
        const res = await db
          .from("elderly_profiles")
          .select("*")
          .eq("id", targetElderlyId)
          .maybeSingle();
        data = res.data as Record<string, unknown> | null;
      }
    } else if (currentUser?.role === "family") {
      const res = await db
        .from("elderly_profiles")
        .select("*")
        .eq("family_id", currentUser.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();
      data = res.data as Record<string, unknown> | null;
    }

    if (!data) return MOCK_ELDERLY;

    const statusVal = String(data.status || "aman").toLowerCase();
    const status: LenteraStatus =
      statusVal === "darurat" || statusVal === "waspada" ? statusVal : "aman";

    return {
      id: String(data.id),
      name: String(data.name || "Orang Tua"),
      age: Number(data.age || 0),
      family_id: String(data.family_id || ""),
      conditions: Array.isArray(data.medical_conditions)
        ? (data.medical_conditions as string[])
        : [],
      allergies: Array.isArray(data.allergies)
        ? (data.allergies as string[])
        : [],
      routine_meds: Array.isArray(data.routine_medications)
        ? (data.routine_medications as Array<string | { name?: string }>).map(
            (m) => (typeof m === "string" ? m : m?.name || "Obat")
          )
        : [],
      address: String(data.address || ""),
      nearest_hospital: "RS Terdekat (119)",
      nearest_hospital_phone: "119",
      status,
    };
  }

  async getCareLogs(elderlyId?: string): Promise<CareLog[]> {
    const db = requireSupabase();
    let targetElderlyId = elderlyId;
    if (
      !targetElderlyId ||
      targetElderlyId === "demo" ||
      targetElderlyId === "default-elderly"
    ) {
      const eld = await this.getElderlyProfile();
      targetElderlyId = eld.id;
    }
    if (!targetElderlyId || targetElderlyId === "default-elderly") {
      return [];
    }

    const { data } = await db
      .from("care_logs")
      .select("*, caregiver:profiles!care_logs_caregiver_id_fkey(full_name)")
      .eq("elderly_id", targetElderlyId)
      .order("logged_at", { ascending: true });

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
    const currentUser = await this.requireAuthenticatedActor();

    const elderlyProfile = await this.getElderlyProfile();
    let elderlyId =
      payload instanceof FormData
        ? String(payload.get("elderly_id") || "")
        : payload.elderly_id;

    if (!elderlyId || elderlyId === "demo" || elderlyId === "default-elderly") {
      elderlyId = elderlyProfile.id;
    }

    if (!elderlyId || elderlyId === "default-elderly") {
      throw new Error(
        "Profil lansia untuk penugasan Anda belum ditemukan. Pastikan Anda sudah ditugaskan oleh keluarga."
      );
    }

    let photoUrl: string | undefined;
    if (payload instanceof FormData) {
      const file = payload.get("photo") as File | null;
      if (file && file.size > 0) {
        const rawExt = file.name.split(".").pop() || "jpg";
        const ext = rawExt.replace(/[^a-zA-Z0-9]/g, "") || "jpg";
        const filePath = `${currentUser.id}/${Date.now()}.${ext}`;
        try {
          const uploadPromise = db.storage
            .from("care-photos")
            .upload(filePath, file, {
              upsert: true,
              contentType: file.type || "image/jpeg",
            });
          const timeoutPromise = new Promise<{ error: Error }>((resolve) =>
            setTimeout(() => resolve({ error: new Error("timeout") }), 8000)
          );
          const result = await Promise.race([uploadPromise, timeoutPromise]);
          if (!result.error) {
            const { data: pub } = db.storage
              .from("care-photos")
              .getPublicUrl(filePath);
            photoUrl = pub.publicUrl;
          }
        } catch {
          // Proceed saving care log even if optional photo upload fails
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
      throw mapSupabaseError(error, "Gagal menyimpan laporan harian.");
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

    if (elderlyProfile.family_id) {
      await db
        .from("notifications")
        .insert({
          user_id: elderlyProfile.family_id,
          type: "care_log",
          title: `Laporan Baru dari ${currentUser.name}`,
          body: `TD ${created.systolic}/${created.diastolic} mmHg · Nadi ${created.heart_rate} bpm — ${created.notes}`,
          metadata: {
            kind: "care_log",
            elderly_id: elderlyId,
            care_log_id: created.id,
          },
        })
        .then(() => {});
    }

    return created;
  }

  async getJobs(): Promise<CareJob[]> {
    const db = requireSupabase();
    const currentUser = await this.requireAuthenticatedActor().catch(() =>
      getStoredUser()
    );

    let query = db
      .from("care_jobs")
      .select(
        "*, family:profiles!care_jobs_family_id_fkey(full_name), elderly:elderly_profiles(name, age), applications:job_applications(*, caregiver:profiles!job_applications_caregiver_id_fkey(id, full_name, location, experience_years, skills, is_verified))"
      )
      .order("created_at", { ascending: false });

    if (currentUser?.role === "family") {
      query = query.eq("family_id", currentUser.id);
    }

    const { data } = await query;

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
    const currentUser = await this.requireAuthenticatedActor();

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
        throw mapSupabaseError(eldErr, "Gagal membuat profil lansia.");
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
      throw mapSupabaseError(error, "Gagal membuat lowongan.");
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

  async sendInterviewInvite(caregiver: {
    id: string;
    name: string;
  }): Promise<void> {
    const db = requireSupabase();
    const actor = await this.requireAuthenticatedActor();

    const { error } = await db.from("notifications").insert({
      user_id: caregiver.id,
      type: "job",
      title: `Undangan Wawancara dari ${actor.name}`,
      body: `Keluarga ${actor.name} mengundang Anda untuk wawancara pendampingan lansia.`,
      metadata: {
        kind: "interview_invite",
        status: "pending",
        family_id: actor.id,
        family_name: actor.name,
        family_phone: actor.phone || "",
        family_city: actor.city || "",
        caregiver_id: caregiver.id,
        caregiver_name: caregiver.name,
      },
    });

    if (error) {
      throw mapSupabaseError(
        error,
        "Gagal mengirim undangan wawancara ke perawat."
      );
    }
  }

  async hireCaregiverDirectly(caregiver: {
    id: string;
    name: string;
    skills?: string[];
  }): Promise<void> {
    const db = requireSupabase();
    const actor = await this.requireAuthenticatedActor();

    if (actor.role !== "family") {
      throw new Error("Hanya akun keluarga yang dapat menugaskan perawat.");
    }

    const { data: existingElderly } = await db
      .from("elderly_profiles")
      .select("id")
      .eq("family_id", actor.id)
      .limit(1)
      .maybeSingle();

    let elderlyId = existingElderly?.id as string | undefined;
    if (!elderlyId) {
      const { data: createdElderly, error: eldErr } = await db
        .from("elderly_profiles")
        .insert({
          family_id: actor.id,
          name: `Orang Tua ${actor.name.split(" ")[0]}`,
          age: 70,
          address: actor.city || "Indonesia",
          status: "aman",
        })
        .select("id")
        .single();

      if (eldErr || !createdElderly) {
        throw mapSupabaseError(eldErr, "Gagal menyiapkan profil orang tua.");
      }
      elderlyId = createdElderly.id;
    }

    const { error: jobErr } = await db.from("care_jobs").insert({
      family_id: actor.id,
      elderly_id: elderlyId,
      title: `Pendamping Lansia — Keluarga ${actor.name.split(" ")[0]}`,
      description: "Penugasan langsung setelah wawancara disetujui.",
      schedule: "Senin – Sabtu, 08.00 – 16.00 WIB",
      location: actor.city || "Indonesia",
      salary_min: 3500000,
      salary_max: 4000000,
      required_skills: caregiver.skills || [],
      status: "filled",
      assigned_caregiver_id: caregiver.id,
    });

    if (jobErr) {
      throw mapSupabaseError(jobErr, "Gagal menugaskan perawat.");
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
    const db = requireSupabase();
    const currentUser = await this.requireAuthenticatedActor();

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
      throw mapSupabaseError(error, "Gagal mengirim lamaran.");
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
    await this.requireAuthenticatedActor();

    const { data: appRow, error } = await db
      .from("job_applications")
      .update({ status })
      .eq("id", applicationId)
      .select("id, job_id, caregiver_id, status")
      .single();

    if (error || !appRow) {
      throw mapSupabaseError(error, "Gagal memperbarui status lamaran.");
    }

    if (status === "accepted") {
      const { data: updatedJob, error: fillErr } = await db
        .from("care_jobs")
        .update({
          status: "filled",
          assigned_caregiver_id: appRow.caregiver_id,
        })
        .eq("id", appRow.job_id)
        .select("id")
        .single();
      if (fillErr || !updatedJob) {
        throw mapSupabaseError(fillErr, "Gagal menugaskan caregiver pada lowongan.");
      }
    }

    return { id: appRow.id, status };
  }

  async getSosAlerts(elderlyId?: string): Promise<SosAlert[]> {
    const db = requireSupabase();
    let targetElderlyId = elderlyId;
    if (!targetElderlyId) {
      const eld = await this.getElderlyProfile();
      targetElderlyId = eld.id;
    }
    if (!targetElderlyId || targetElderlyId === "default-elderly") {
      return [];
    }

    const { data } = await db
      .from("sos_alerts")
      .select("*, elderly:elderly_profiles(name), triggerer:profiles!sos_alerts_triggered_by_fkey(full_name)")
      .eq("elderly_id", targetElderlyId)
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
    const currentUser = await this.requireAuthenticatedActor();

    const elderly = await this.getElderlyProfile();
    if (!elderly.id || elderly.id === "default-elderly") {
      throw new Error("Profil lansia belum tersedia untuk pengiriman SOS.");
    }

    const fallbackBrief: AiTriageBrief = {
      patient_summary: `${elderly.name}${elderly.age > 0 ? ` (${elderly.age} th)` : ""}`,
      allergies: elderly.allergies,
      routine_meds: elderly.routine_meds,
      last_24h_vitals: "Pantau tanda vital terbaru dan kesiapan tim medis.",
      immediate_actions: [
        "Posisikan lansia nyaman, longgarkan pakaian, dan tetap tenang.",
        "Segera hubungi layanan ambulans 119 dan kabari keluarga.",
      ],
      emergency_note: payload.reason,
    };

    let triageBrief: AiTriageBrief = fallbackBrief;
    try {
      triageBrief = await Promise.race([
        this.generateAiTriageBrief({
          elderly_id: elderly.id,
          reason: payload.reason,
        }),
        new Promise<AiTriageBrief>((resolve) =>
          setTimeout(() => resolve(fallbackBrief), 5000)
        ),
      ]);
    } catch {
      triageBrief = fallbackBrief;
    }

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
      throw mapSupabaseError(error, "Gagal mengirim sinyal SOS.");
    }

    // Write real SOS notification directly to Family's notification feed
    if (elderly.family_id) {
      await db
        .from("notifications")
        .insert({
          user_id: elderly.family_id,
          type: "sos",
          title: `DARURAT SOS — ${elderly.name}`,
          body: `${currentUser.name} mengirim sinyal darurat: ${payload.reason}`,
          metadata: {
            kind: "sos",
            sos_id: data.id,
            elderly_id: elderly.id,
            triggered_by: currentUser.name,
          },
        })
        .then(() => {});
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

    try {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 5000);
      const res = await fetch("/api/ai/triage-brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ elderly, logs, reason: payload.reason }),
        signal: controller.signal,
      });
      clearTimeout(timer);
      if (res.ok) {
        const data = await res.json();
        if (data.triage_brief) return data.triage_brief;
      }
    } catch {
      // Fall back to immediate clinical triage brief
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

    const uniqueSuffix = Math.random().toString(36).slice(2, 8);
    let channel: ReturnType<typeof supabase.channel> | null = null;
    try {
      channel = supabase
        .channel(`lentera-realtime-${uniqueSuffix}`)
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
        .on(
          "postgres_changes",
          { event: "UPDATE", schema: "public", table: "sos_alerts" },
          (payload) => {
            const row = payload.new as Record<string, unknown>;
            if (row.status === "resolved") {
              onEvent({
                type: "sos_resolved",
                data: {
                  id: String(row.id),
                  elderly_id: String(row.elderly_id),
                  status: "resolved",
                },
              });
            }
          }
        )
        .on(
          "postgres_changes",
          { event: "INSERT", schema: "public", table: "notifications" },
          (payload) => {
            const row = payload.new as Record<string, unknown>;
            onEvent({
              type: "notification",
              data: {
                id: String(row.id),
                title: String(row.title || "Notifikasi Lentera"),
                message: String(row.body || ""),
                type:
                  row.type === "sos"
                    ? "emergency"
                    : row.type === "ai_digest"
                    ? "warning"
                    : "info",
                created_at: String(row.created_at || new Date().toISOString()),
                read: Boolean(row.is_read),
              },
            });
          }
        )
        .subscribe();
    } catch {
      channel = null;
    }

    return () => {
      if (channel) supabase?.removeChannel(channel);
    };
  }
}

export const apiService: ILenteraApiService = new LenteraSupabaseService();
