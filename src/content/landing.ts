export interface EditorialStat {
  value: string;
  label: string;
  source: string;
  accent: string;
}

export const LANDING_STATS: EditorialStat[] = [
  {
    value: "80,8%",
    label: "Lansia dirawat keluarga tanpa pelatihan medis",
    source: "SKI 2023 • Kemenkes RI",
    accent: "#E8912E",
  },
  {
    value: "1,3%",
    label: "Yang didampingi caregiver terlatih di rumah",
    source: "SKI 2023 • Databoks",
    accent: "#4A7C59",
  },
  {
    value: "76,2%",
    label: "Risiko kejadian jatuh pada usia 75+ tahun",
    source: "Riskesdas • Kemenkes RI",
    accent: "#DC4A3D",
  },
  {
    value: "48–50%",
    label: "Pekerja produktif adalah generasi sandwich",
    source: "BPS 2024 • Tirto & Jakpat",
    accent: "#1F2937",
  },
];

export const FAQ_ITEMS = [
  {
    q: "Apakah Lentera bisa dipakai sebelum punya caregiver?",
    a: "Bisa. Pasang lowongan di halaman Loker Caregiver dan biarkan AI Caregiver Matcher menilai kecocokan keahlian pelamar dengan kondisi orang tua Anda.",
  },
  {
    q: "Apa yang dirangkum oleh AI Daily Digest?",
    a: "AI merangkum tensi, detak jantung, porsi makan, dan kepatuhan obat harian menjadi ringkasan singkat beserta saran menu dan deteksi anomali.",
  },
  {
    q: "Apa yang terjadi saat tombol SOS ditekan?",
    a: "Dashboard keluarga langsung menerima peringatan darurat, kontak 119 & RS terdekat muncul, dan AI menyusun Kartu Triage berisi alergi serta vital 24 jam terakhir.",
  },
  {
    q: "Bagaimana cara langsung mencoba aplikasi ini?",
    a: "Buka halaman Masuk, pilih peran Keluarga atau Caregiver, lalu gunakan tombol isi cepat akun demo yang tersedia.",
  },
];
