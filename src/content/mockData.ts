import {
  AiDigest,
  AppNotification,
  CareJob,
  CareLog,
  ElderlyProfile,
  SosAlert,
  UserProfile,
} from "@/types";

export const DEMO_USERS: Record<"family" | "caregiver", UserProfile> = {
  family: {
    id: "user-family-001",
    name: "Akun Keluarga",
    email: "keluarga@lentera.id",
    role: "family",
    phone: "",
    city: "",
  },
  caregiver: {
    id: "user-caregiver-001",
    name: "Akun Caregiver",
    email: "caregiver@lentera.id",
    role: "caregiver",
    phone: "",
    city: "",
    verified: false,
    skills: [],
    experience_years: 0,
    bio: "",
  },
};

export const MOCK_ELDERLY: ElderlyProfile = {
  id: "default-elderly",
  name: "Belum ada profil lansia",
  age: 0,
  family_id: "",
  conditions: [],
  allergies: [],
  routine_meds: [],
  address: "Tambahkan data orang tua di pengaturan profil.",
  nearest_hospital: "RS Terdekat (119)",
  nearest_hospital_phone: "119",
  status: "aman",
};

export const MOCK_CARE_LOGS: CareLog[] = [];

export const MOCK_AI_DIGEST: AiDigest = {
  elderly_id: "default-elderly",
  status: "aman",
  summary:
    "Belum ada catatan perawatan hari ini. Ringkasan AI akan muncul otomatis setelah caregiver mengirim log pertama.",
  meal_suggestion: "Saran menu akan disesuaikan setelah profil medis & log diisi.",
  hydration_activity_tip:
    "Tips hidrasi & aktivitas harian akan tampil otomatis dari catatan vital.",
  anomaly_alert: null,
  generated_at: new Date().toISOString(),
};

export const MOCK_JOBS: CareJob[] = [];

export const MOCK_SOS_LIST: SosAlert[] = [];

export const MOCK_NOTIFICATIONS: AppNotification[] = [];
