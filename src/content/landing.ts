export interface EditorialStat {
  value: string;
  target: number;
  decimals: number;
  suffix: string;
  label: string;
  source: string;
  sourceUrl: string;
  accent: string;
}

export const LANDING_STATS: EditorialStat[] = [
  {
    value: "80,8%",
    target: 80.8,
    decimals: 1,
    suffix: "%",
    label: "Lansia dirawat keluarga tanpa pelatihan medis",
    source: "SKI 2023 • Kemenkes RI",
    sourceUrl: "https://www.badankebijakan.kemkes.go.id/hasil-ski-2023/",
    accent: "#E8912E",
  },
  {
    value: "1,3%",
    target: 1.3,
    decimals: 1,
    suffix: "%",
    label: "Yang didampingi caregiver terlatih di rumah",
    source: "SKI 2023 • Databoks",
    sourceUrl: "https://databoks.katadata.co.id/",
    accent: "#4A7C59",
  },
  {
    value: "76,2%",
    target: 76.2,
    decimals: 1,
    suffix: "%",
    label: "Risiko kejadian jatuh pada usia 75+ tahun",
    source: "Riskesdas • Kemenkes RI",
    sourceUrl: "https://layanandata.kemkes.go.id/",
    accent: "#DC4A3D",
  },
  {
    value: "49%",
    target: 49,
    decimals: 0,
    suffix: "%",
    label: "Pekerja produktif termasuk generasi sandwich",
    source: "BPS 2024 • Jakpat",
    sourceUrl: "https://www.bps.go.id/",
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
