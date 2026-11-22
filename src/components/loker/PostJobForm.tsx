"use client";

import React, { useState } from "react";

interface PostJobFormProps {
  onSubmit: (payload: {
    title: string;
    elderly_name: string;
    elderly_age: number;
    location: string;
    schedule: string;
    salary_display: string;
    medical_notes: string;
    required_skills: string[];
  }) => Promise<unknown>;
  onCancel: () => void;
}

export function PostJobForm({ onSubmit, onCancel }: PostJobFormProps) {
  const [title, setTitle] = useState("");
  const [elderlyName, setElderlyName] = useState("");
  const [elderlyAge, setElderlyAge] = useState(72);
  const [location, setLocation] = useState("");
  const [schedule, setSchedule] = useState("Senin – Sabtu, 08.00 – 16.00 WIB");
  const [salaryDisplay, setSalaryDisplay] = useState("Rp 4.000.000 / bulan");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [skillsInput, setSkillsInput] = useState(
    "Hipertensi & Diabetes, Pencegahan Jatuh"
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({
      title,
      elderly_name: elderlyName,
      elderly_age: Number(elderlyAge),
      location,
      schedule,
      salary_display: salaryDisplay,
      medical_notes: medicalNotes,
      required_skills: skillsInput
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
    });
    onCancel();
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-6 rounded-2xl border border-border bg-surface p-6"
    >
      <h2 className="font-display text-lg font-bold text-ink">
        Pasang Lowongan Caregiver Baru
      </h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-ink">
            Judul Lowongan
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Pendamping Lansia Harian (Pasca Stroke Ringan)"
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-primary focus:bg-surface focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink">
            Nama Lansia
          </label>
          <input
            type="text"
            required
            value={elderlyName}
            onChange={(e) => setElderlyName(e.target.value)}
            placeholder="Contoh: Ibu Hartini"
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-primary focus:bg-surface focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink">
            Usia Lansia (tahun)
          </label>
          <input
            type="number"
            required
            min={55}
            max={110}
            value={elderlyAge}
            onChange={(e) => setElderlyAge(Number(e.target.value))}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-primary focus:bg-surface focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink">
            Lokasi Rumah
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Contoh: Tebet, Jakarta Selatan"
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-primary focus:bg-surface focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink">
            Jadwal Kerja
          </label>
          <input
            type="text"
            required
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-primary focus:bg-surface focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink">
            Estimasi Kompensasi
          </label>
          <input
            type="text"
            required
            value={salaryDisplay}
            onChange={(e) => setSalaryDisplay(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-primary focus:bg-surface focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink">
            Keahlian Dibutuhkan (pisahkan koma)
          </label>
          <input
            type="text"
            value={skillsInput}
            onChange={(e) => setSkillsInput(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-primary focus:bg-surface focus:outline-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-ink">
            Profil Medis & Kebutuhan Perawatan
          </label>
          <textarea
            rows={3}
            required
            value={medicalNotes}
            onChange={(e) => setMedicalNotes(e.target.value)}
            placeholder="Jelaskan riwayat penyakit, jadwal obat, atau perhatian khusus..."
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm focus:border-primary focus:bg-surface focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-xs font-semibold text-ink-muted cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          className="rounded-xl bg-primary px-5 py-2 text-xs font-semibold text-white hover:bg-primary-hover cursor-pointer"
        >
          Terbitkan Lowongan
        </button>
      </div>
    </form>
  );
}
