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
    id: "user-budi-001",
    name: "Budi Santoso",
    email: "budi@lentera.id",
    role: "family",
    phone: "0812-3456-7890",
    city: "Jakarta Selatan",
  },
  caregiver: {
    id: "user-rini-002",
    name: "Rini Wulandari, A.Md.Kep",
    email: "rini@lentera.id",
    role: "caregiver",
    phone: "0857-9876-5432",
    city: "Jakarta Selatan",
    verified: true,
    experience_years: 5,
    skills: [
      "Hipertensi & Diabetes",
      "Mobilitas Lansia",
      "Pencegahan Jatuh",
      "Nutrisi Geriatri",
    ],
    bio: "Perawat pendamping lansia berpengalaman 5 tahun menangani hipertensi dan pemulihan di rumah.",
  },
};

export const MOCK_ELDERLY: ElderlyProfile = {
  id: "elderly-pak-joko",
  name: "Pak Joko Widodo (72 th)",
  age: 72,
  family_id: "user-budi-001",
  conditions: [
    "Hipertensi Ringan",
    "Diabetes Tipe 2 Terkontrol",
    "Osteoartritis Lutut",
  ],
  allergies: ["Alergi Udang & Kerang", "Penisilin"],
  routine_meds: [
    "Amlodipine 5mg (Pagi)",
    "Metformin 500mg (Setelah Makan)",
    "Vitamin D3 1000 IU",
  ],
  address: "Jl. Kemang Timur No. 18, Jakarta Selatan",
  nearest_hospital: "RSUD Pasar Minggu (2,4 km — ±8 menit)",
  nearest_hospital_phone: "119",
  status: "aman",
};

export const MOCK_CARE_LOGS: CareLog[] = [
  {
    id: "log-1",
    elderly_id: "elderly-pak-joko",
    caregiver_id: "user-rini-002",
    caregiver_name: "Rini Wulandari",
    heart_rate: 76,
    systolic: 128,
    diastolic: 82,
    meal_portion: "habis",
    medication_taken: true,
    mood: "cerah",
    notes: "Sarapan bubur ayam tanpa kerupuk dan jalan santai 10 menit di teras.",
    logged_at: "2026-11-20T08:30:00Z",
  },
  {
    id: "log-2",
    elderly_id: "elderly-pak-joko",
    caregiver_id: "user-rini-002",
    caregiver_name: "Rini Wulandari",
    heart_rate: 80,
    systolic: 132,
    diastolic: 84,
    meal_portion: "setengah",
    medication_taken: true,
    mood: "tenang",
    notes: "Makan siang sayur bening bayam dan ikan kukus.",
    logged_at: "2026-11-20T13:15:00Z",
  },
  {
    id: "log-3",
    elderly_id: "elderly-pak-joko",
    caregiver_id: "user-rini-002",
    caregiver_name: "Rini Wulandari",
    heart_rate: 74,
    systolic: 122,
    diastolic: 78,
    meal_portion: "habis",
    medication_taken: true,
    mood: "cerah",
    notes: "Tidur malam nyenyak, tensi pagi stabil, latihan gerak lutut ringan.",
    logged_at: "2026-11-21T07:45:00Z",
  },
  {
    id: "log-4",
    elderly_id: "elderly-pak-joko",
    caregiver_id: "user-rini-002",
    caregiver_name: "Rini Wulandari",
    heart_rate: 78,
    systolic: 124,
    diastolic: 80,
    meal_portion: "habis",
    medication_taken: true,
    mood: "tenang",
    notes: "Asupan air hangat cukup, tidak ada keluhan pusing atau nyeri lutut.",
    logged_at: "2026-11-22T09:10:00Z",
  },
];

export const MOCK_AI_DIGEST: AiDigest = {
  id: "digest-today",
  elderly_id: "elderly-pak-joko",
  status: "aman",
  summary:
    "Kondisi Pak Joko hari ini stabil di rentang aman (124/80 mmHg, 78 bpm) dengan kepatuhan obat pagi dan nafsu makan baik.",
  meal_suggestion:
    "Siapkan sup tahu kukus dengan bayam atau pepes ikan nila rendah garam untuk makan malam.",
  hydration_activity_tip:
    "Jaga asupan air putih 1 gelas tiap 2 jam dan dampingi peregangan lutut duduk 10 menit.",
  anomaly_alert: null,
  generated_at: "2026-11-22T09:15:00Z",
};

export const MOCK_JOBS: CareJob[] = [
  {
    id: "job-1",
    family_id: "user-budi-001",
    family_name: "Keluarga Budi Santoso",
    elderly_name: "Pak Joko (72 th)",
    elderly_age: 72,
    title: "Pendamping Lansia Harian (Hipertensi & Diabetes Terkontrol)",
    location: "Kemang Timur, Jakarta Selatan",
    schedule: "Senin – Sabtu, 07.30 – 16.30 WIB",
    salary_display: "Rp 4.200.000 / bulan",
    medical_notes:
      "Hipertensi ringan, diabetes tipe 2, butuh pengawasan minum obat dan pencegahan jatuh di kamar mandi.",
    required_skills: [
      "Hipertensi & Diabetes",
      "Pencegahan Jatuh",
      "Nutrisi Geriatri",
    ],
    status: "open",
    created_at: "2026-11-19T10:00:00Z",
    applications: [
      {
        id: "app-1",
        job_id: "job-1",
        caregiver_id: "user-rini-002",
        caregiver_name: "Rini Wulandari, A.Md.Kep",
        caregiver_city: "Jakarta Selatan",
        experience_years: 5,
        skills: [
          "Hipertensi & Diabetes",
          "Mobilitas Lansia",
          "Pencegahan Jatuh",
          "Nutrisi Geriatri",
        ],
        verified: true,
        cover_note:
          "Terbiasa mendampingi pasien hipertensi & diabetes di rumah, termasuk pencatatan tensi dan menu rendah gula.",
        status: "pending",
        ai_match_score: 96,
        ai_match_reason:
          "Pengalaman 5 tahun keperawatan geriatri sangat sesuai dengan kebutuhan kontrol hipertensi, diabetes, dan pencegahan jatuh Pak Joko.",
        applied_at: "2026-11-20T09:00:00Z",
      },
      {
        id: "app-2",
        job_id: "job-1",
        caregiver_id: "cg-andi-003",
        caregiver_name: "Andi Pratama",
        caregiver_city: "Depok",
        experience_years: 3,
        skills: ["Mobilitas Lansia", "Fisioterapi Dasar", "Pertolongan Pertama"],
        verified: true,
        cover_note:
          "Berpengalaman mendampingi lansia pasca-operasi lutut dan rutin melatih jalan pagi.",
        status: "pending",
        ai_match_score: 84,
        ai_match_reason:
          "Kuat di latihan mobilitas lutut dan pertolongan pertama, namun perlu adaptasi untuk diet diabetes.",
        applied_at: "2026-11-20T14:20:00Z",
      },
    ],
  },
  {
    id: "job-2",
    family_id: "fam-sari-004",
    family_name: "Keluarga Ibu Sari",
    elderly_name: "Ibu Ratna (78 th)",
    elderly_age: 78,
    title: "Caregiver Pendamping Lansia Demensia Ringan",
    location: "Bintaro Sektor 7, Tangerang Selatan",
    schedule: "Senin – Jumat, 08.00 – 17.00 WIB",
    salary_display: "Rp 4.500.000 / bulan",
    medical_notes:
      "Demensia tahap awal, sering lupa jadwal minum obat dan butuh teman bicara yang sabar.",
    required_skills: [
      "Pendampingan Demensia",
      "Komunikasi Empatik",
      "Pengingat Obat",
    ],
    status: "open",
    created_at: "2026-11-21T08:00:00Z",
    applications: [],
  },
];

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: "notif-1",
    title: "Laporan Pagi Pak Joko Sudah Masuk",
    message:
      "Rini Wulandari mencatat tensi 124/80 mmHg dan obat pagi sudah diminum.",
    type: "info",
    created_at: "2026-11-22T09:12:00Z",
  },
];

export const MOCK_SOS_LIST: SosAlert[] = [];
