"use client";

import React, { useState } from "react";
import { Check } from "lucide-react";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { CustomSelect, SelectOption } from "@/components/shared/CustomSelect";
import {
  CustomDateRangePicker,
  formatIndonesianDate,
} from "@/components/shared/CustomDateRangePicker";

const SHIFT_OPTIONS: SelectOption<string>[] = [
  {
    value: "Harian Pagi – Sore (08.00 – 16.00 WIB)",
    label: "Harian Pagi – Sore (08.00 – 16.00 WIB)",
  },
  {
    value: "Harian Penuh (07.00 – 19.00 WIB)",
    label: "Harian Penuh (07.00 – 19.00 WIB)",
  },
  {
    value: "Menginap di Rumah (Live-in)",
    label: "Menginap di Rumah (Live-in)",
  },
  {
    value: "Shift Malam (19.00 – 07.00 WIB)",
    label: "Shift Malam (19.00 – 07.00 WIB)",
  },
  {
    value: "Akhir Pekan (Sabtu – Minggu)",
    label: "Akhir Pekan (Sabtu – Minggu)",
  },
];

const SUGGESTED_SKILLS = [
  "Hipertensi & Diabetes",
  "Pasca Stroke",
  "Pencegahan Jatuh",
  "Pendampingan Obat",
  "Demensia / Pikun",
  "Fisioterapi Ringan",
];

function formatRupiahDigits(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  if (!digits) return "";
  return digits.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

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
  const [elderlyAgeInput, setElderlyAgeInput] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [shift, setShift] = useState(SHIFT_OPTIONS[0].value);
  const [salaryDigits, setSalaryDigits] = useState("");
  const [medicalNotes, setMedicalNotes] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [validationError, setValidationError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function toggleSkill(skill: string) {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  }

  function buildScheduleLabel(): string {
    const datePart = startDate
      ? endDate
        ? `${formatIndonesianDate(startDate)} – ${formatIndonesianDate(endDate)}`
        : `Mulai ${formatIndonesianDate(startDate)}`
      : "";
    return datePart ? `${datePart} · ${shift}` : shift;
  }

  function buildSkillsList(): string[] {
    const extra = customSkillInput
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    return Array.from(new Set([...selectedSkills, ...extra]));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError(null);

    const parsedAge = Number(elderlyAgeInput);
    if (!elderlyAgeInput || parsedAge < 45 || parsedAge > 115) {
      setValidationError("Mohon isi usia lansia yang sesuai (antara 45 – 115 tahun).");
      return;
    }
    if (!startDate) {
      setValidationError("Mohon pilih tanggal mulai perawatan pada kalender.");
      return;
    }
    if (!salaryDigits) {
      setValidationError("Mohon isi estimasi kompensasi per bulan.");
      return;
    }

    setConfirmOpen(true);
  }

  async function handleConfirmSubmit() {
    setSubmitting(true);
    try {
      await onSubmit({
        title: title.trim(),
        elderly_name: elderlyName.trim(),
        elderly_age: Number(elderlyAgeInput),
        location: location.trim(),
        schedule: buildScheduleLabel(),
        salary_display: `Rp ${formatRupiahDigits(salaryDigits)} / bulan`,
        medical_notes: medicalNotes.trim(),
        required_skills: buildSkillsList(),
      });
      setConfirmOpen(false);
      onCancel();
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-5 rounded-2xl border border-card-cream-border bg-card-cream/60 p-5 sm:p-6"
    >
      <div>
        <h2 className="font-display text-lg font-bold text-ink">
          Pasang Lowongan Caregiver Baru
        </h2>
        <p className="mt-0.5 text-xs text-ink-muted">
          Isi detail kebutuhan perawatan agar perawat yang melamar benar-benar
          sesuai dengan kondisi orang tua Anda.
        </p>
      </div>

      {validationError && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-danger/25 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-danger"
        >
          {validationError}
        </div>
      )}

      <div className="mt-5 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-ink">
            Judul Lowongan<span className="ml-0.5 text-primary">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Contoh: Pendamping harian Ibu pasca stroke ringan"
            className="mt-1.5 min-h-[44px] w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink">
            Nama Orang Tua / Lansia<span className="ml-0.5 text-primary">*</span>
          </label>
          <input
            type="text"
            required
            value={elderlyName}
            onChange={(e) => setElderlyName(e.target.value)}
            placeholder="Contoh: Ibu Hartini atau Bapak Suyono"
            className="mt-1.5 min-h-[44px] w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink">
            Usia Lansia<span className="ml-0.5 text-primary">*</span>
          </label>
          <div className="relative mt-1.5">
            <input
              type="text"
              inputMode="numeric"
              required
              maxLength={3}
              value={elderlyAgeInput}
              onChange={(e) => {
                const clean = e.target.value.replace(/[^\d]/g, "");
                setElderlyAgeInput(clean);
                if (validationError) setValidationError(null);
              }}
              placeholder="Contoh: 72"
              className="min-h-[44px] w-full rounded-xl border border-border bg-surface py-2.5 pr-16 pl-3.5 text-sm tabular-nums text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
            />
            <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs font-medium text-ink-muted">
              tahun
            </span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink">
            Lokasi Rumah<span className="ml-0.5 text-primary">*</span>
          </label>
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Contoh: Kec. Tebet, Jakarta Selatan"
            className="mt-1.5 min-h-[44px] w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink">
            Estimasi Kompensasi<span className="ml-0.5 text-primary">*</span>
          </label>
          <div className="relative mt-1.5">
            <span className="pointer-events-none absolute top-1/2 left-3.5 -translate-y-1/2 text-xs font-semibold text-ink-muted">
              Rp
            </span>
            <input
              type="text"
              inputMode="numeric"
              required
              value={formatRupiahDigits(salaryDigits)}
              onChange={(e) => {
                const clean = e.target.value.replace(/[^\d]/g, "");
                setSalaryDigits(clean);
                if (validationError) setValidationError(null);
              }}
              placeholder="Contoh: 3.500.000"
              className="min-h-[44px] w-full rounded-xl border border-border bg-surface py-2.5 pr-16 pl-10 text-sm tabular-nums text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
            />
            <span className="pointer-events-none absolute top-1/2 right-3.5 -translate-y-1/2 text-xs font-medium text-ink-muted">
              / bulan
            </span>
          </div>
        </div>

        <CustomDateRangePicker
          label="Periode Mulai & Selesai"
          required
          startDate={startDate}
          endDate={endDate}
          onChange={({ startDate: s, endDate: e }) => {
            setStartDate(s);
            setEndDate(e);
            if (validationError) setValidationError(null);
          }}
        />

        <CustomSelect
          label="Jam Pendampingan"
          value={shift}
          options={SHIFT_OPTIONS}
          onChange={setShift}
        />

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-ink">
            Keahlian yang Dibutuhkan
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {SUGGESTED_SKILLS.map((skill) => {
              const active = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors cursor-pointer ${
                    active
                      ? "bg-sidebar text-white"
                      : "border border-border bg-surface text-ink hover:border-primary/50"
                  }`}
                >
                  {active && <Check className="h-3.5 w-3.5 text-primary" />}
                  <span>{skill}</span>
                </button>
              );
            })}
          </div>
          <input
            type="text"
            value={customSkillInput}
            onChange={(e) => setCustomSkillInput(e.target.value)}
            placeholder="Keahlian lain (opsional), pisahkan dengan koma — contoh: Perawatan luka, Masak diet rendah garam"
            className="mt-2.5 min-h-[42px] w-full rounded-xl border border-border bg-surface px-3.5 py-2 text-xs text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none sm:text-sm"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-semibold text-ink">
            Profil Medis & Kebutuhan Perawatan
            <span className="ml-0.5 text-primary">*</span>
          </label>
          <textarea
            rows={3}
            required
            value={medicalNotes}
            onChange={(e) => setMedicalNotes(e.target.value)}
            placeholder="Ceritakan riwayat penyakit, obat rutin yang diminum, pantangan makan, atau kebiasaan harian orang tua yang perlu diketahui perawat..."
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-5 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-xl px-4 py-2 text-xs font-semibold text-ink-muted hover:text-ink cursor-pointer"
        >
          Batal
        </button>
        <button
          type="submit"
          className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-white hover:bg-primary-hover cursor-pointer"
        >
          Terbitkan Lowongan
        </button>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Terbitkan Lowongan Sekarang?"
        description={`Lowongan "${title || "Perawatan Lansia"}" (${buildScheduleLabel()}, Rp ${formatRupiahDigits(salaryDigits)} / bulan) akan langsung tampil bagi perawat terdaftar di Lentera.`}
        confirmLabel="Ya, Terbitkan"
        loading={submitting}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setConfirmOpen(false)}
      />
    </form>
  );
}
