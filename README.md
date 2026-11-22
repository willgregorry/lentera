# Lentera — Pendampingan Lansia Hangat & Terintegrasi AI

**Lentera** adalah aplikasi web pendampingan lansia yang menghubungkan **Keluarga** (pencari caregiver), **Lansia** di rumah, dan **Caregiver** terverifikasi dalam satu platform pemantauan kesehatan harian berbasis **Artificial Intelligence (AI)** dan respon darurat **SOS 119**.

Dikembangkan untuk **IT RUSH 2026 — Web Development (HIMATIF Universitas Bengkulu)** — Subtema **Kesehatan Masyarakat** *(serta mendukung SDG 8: Pekerjaan Layak bagi caregiver)*.

---

## ✨ Fitur Utama
- **Loker & Rekrutmen Caregiver + AI Caregiver Matcher:** Keluarga memasang kebutuhan rawat lansia, caregiver melamar, dan AI menghitung skor kecocokan (%) beserta alasannya.
- **Pemantauan Harian Real-Time:** Caregiver mencatat tekanan darah, detak jantung, porsi makan, kepatuhan obat, mood, serta foto aktivitas harian.
- **AI Daily Digest & Saran Perawatan:** AI merangkum catatan harian menjadi laporan singkat bagi keluarga, memberi rekomendasi menu makanan/hidrasi/aktivitas, serta deteksi dini anomali.
- **Respon Darurat SOS 119 + AI Triage Brief:** Satu ketukan SOS mengirim alert darurat ke keluarga, menampilkan kontak cepat `119` & RS terdekat, serta menyusun Kartu Triage Medis 24 jam terakhir.

---

## 🔐 Akun Demo
- **Keluarga:** `budi@lentera.id` / `lenteraku2026` *(atau klik tombol isi cepat di halaman Masuk)*
- **Caregiver:** `rini@lentera.id` / `lenteraku2026` *(atau klik tombol isi cepat di halaman Masuk)*

---

## 🛠️ Tech Stack
- **Frontend & API:** Next.js 16 (App Router), React 19, TypeScript
- **Styling & Visual:** Tailwind CSS v4, Lucide Icons, Recharts, GSAP
- **Database & Auth:** Supabase (PostgreSQL, Auth, Realtime, Storage)
- **AI Engine:** Google Gemini API (`gemini-2.5-flash`)

---

## 🚀 Menjalankan Secara Lokal
```bash
npm install
cp .env.example .env.local
npm run dev
```

---

## 📝 Transparansi Library & AI Coding Assistant
- Proyek ini menggunakan library open-source: `next`, `react`, `tailwindcss`, `lucide-react`, `recharts`, `gsap`.
- Dalam proses pengembangan, tim memanfaatkan AI coding assistant untuk mempercepat scaffolding komponen UI, refactoring TypeScript, dan generasi aset ilustrasi.
