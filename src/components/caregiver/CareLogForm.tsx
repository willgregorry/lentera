"use client";

import React, { useState } from "react";
import { Camera, CheckCircle2, Send } from "lucide-react";
import { CustomSelect, SelectOption } from "@/components/shared/CustomSelect";
import { ConfirmDialog } from "@/components/shared/ConfirmDialog";
import { CareLog } from "@/types";

const MEAL_OPTIONS: SelectOption<CareLog["meal_portion"]>[] = [
  { value: "habis", label: "Habis (1 porsi penuh)" },
  { value: "setengah", label: "Setengah Porsi" },
  { value: "sedikit", label: "Hanya Sedikit" },
  { value: "tidak_makan", label: "Belum Mau Makan" },
];

const MOOD_OPTIONS: SelectOption<CareLog["mood"]>[] = [
  { value: "cerah", label: "Cerah & Bersemangat" },
  { value: "tenang", label: "Tenang & Nyaman" },
  { value: "lelah", label: "Agak Lelah" },
  { value: "gelisah", label: "Gelisah / Kurang Nyaman" },
];

interface CareLogFormProps {
  submitting: boolean;
  successMsg: string | null;
  onSubmit: (input: {
    heartRate: number;
    systolic: number;
    diastolic: number;
    mealPortion: CareLog["meal_portion"];
    medicationTaken: boolean;
    mood: CareLog["mood"];
    notes: string;
    photoFile: File | null;
  }) => Promise<void>;
}

export function CareLogForm({
  submitting,
  successMsg,
  onSubmit,
}: CareLogFormProps) {
  const [heartRateInput, setHeartRateInput] = useState("");
  const [systolicInput, setSystolicInput] = useState("");
  const [diastolicInput, setDiastolicInput] = useState("");
  const [mealPortion, setMealPortion] =
    useState<CareLog["meal_portion"]>("habis");
  const [medicationTaken, setMedicationTaken] = useState(true);
  const [mood, setMood] = useState<CareLog["mood"]>("cerah");
  const [notes, setNotes] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] || null;
    setPhotoFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhotoPreview(String(reader.result));
      reader.readAsDataURL(file);
    } else {
      setPhotoPreview(null);
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setValidationError(null);
    const hr = Number(heartRateInput);
    const sys = Number(systolicInput);
    const dia = Number(diastolicInput);
    if (!heartRateInput || hr < 35 || hr > 200) {
      setValidationError("Mohon isi detak nadi antara 35 – 200 bpm.");
      return;
    }
    if (!systolicInput || sys < 60 || sys > 240) {
      setValidationError("Mohon isi tekanan sistolik antara 60 – 240 mmHg.");
      return;
    }
    if (!diastolicInput || dia < 40 || dia > 150) {
      setValidationError("Mohon isi tekanan diastolik antara 40 – 150 mmHg.");
      return;
    }
    setConfirmOpen(true);
  }

  async function handleConfirmSubmit() {
    await onSubmit({
      heartRate: Number(heartRateInput),
      systolic: Number(systolicInput),
      diastolic: Number(diastolicInput),
      mealPortion,
      medicationTaken,
      mood,
      notes,
      photoFile,
    });
    setConfirmOpen(false);
    setHeartRateInput("");
    setSystolicInput("");
    setDiastolicInput("");
    setNotes("");
    setPhotoFile(null);
    setPhotoPreview(null);
  }

  return (
    <section className="rounded-2xl border border-card-blue-border bg-card-blue/45 p-4 sm:p-6 lg:col-span-7">
      <h2 className="font-display text-base font-bold text-ink sm:text-lg">
        Catatan Perawatan Harian
      </h2>
      <p className="mt-0.5 text-xs text-ink-muted">
        Isi tanda vital, makan, obat, dan aktivitas orang tua hari ini.
      </p>

      {successMsg && (
        <div className="mt-4 flex items-center gap-2 rounded-xl border-l-4 border-secondary bg-secondary-soft px-3.5 py-3 text-xs font-semibold text-secondary">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          <span>{successMsg}</span>
        </div>
      )}

      {validationError && (
        <div
          role="alert"
          className="mt-4 rounded-xl border border-danger/25 bg-red-50 px-3.5 py-2.5 text-xs font-medium text-danger"
        >
          {validationError}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="grid grid-cols-3 gap-2.5 sm:gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-ink sm:text-xs">
              Nadi (bpm)
            </label>
            <input
              type="text"
              inputMode="numeric"
              required
              maxLength={3}
              value={heartRateInput}
              onChange={(e) => {
                setHeartRateInput(e.target.value.replace(/[^\d]/g, ""));
                if (validationError) setValidationError(null);
              }}
              placeholder="Contoh: 78"
              className="mt-1.5 min-h-[44px] w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold tabular-nums text-ink placeholder:font-normal placeholder:text-ink-muted focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-ink sm:text-xs">
              Sistolik (atas)
            </label>
            <input
              type="text"
              inputMode="numeric"
              required
              maxLength={3}
              value={systolicInput}
              onChange={(e) => {
                setSystolicInput(e.target.value.replace(/[^\d]/g, ""));
                if (validationError) setValidationError(null);
              }}
              placeholder="Contoh: 120"
              className="mt-1.5 min-h-[44px] w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold tabular-nums text-ink placeholder:font-normal placeholder:text-ink-muted focus:border-primary focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-ink sm:text-xs">
              Diastolik (bawah)
            </label>
            <input
              type="text"
              inputMode="numeric"
              required
              maxLength={3}
              value={diastolicInput}
              onChange={(e) => {
                setDiastolicInput(e.target.value.replace(/[^\d]/g, ""));
                if (validationError) setValidationError(null);
              }}
              placeholder="Contoh: 80"
              className="mt-1.5 min-h-[44px] w-full rounded-xl border border-border bg-surface px-3 py-2 text-sm font-semibold tabular-nums text-ink placeholder:font-normal placeholder:text-ink-muted focus:border-primary focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <CustomSelect
            label="Porsi Makan"
            value={mealPortion}
            options={MEAL_OPTIONS}
            onChange={setMealPortion}
          />
          <CustomSelect
            label="Suasana Hati"
            value={mood}
            options={MOOD_OPTIONS}
            onChange={setMood}
          />
        </div>

        <button
          type="button"
          onClick={() => setMedicationTaken((prev) => !prev)}
          className={`flex min-h-[48px] w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left transition-colors cursor-pointer ${
            medicationTaken
              ? "border-secondary/40 bg-secondary-soft"
              : "border-border bg-canvas-subtle"
          }`}
        >
          <span className="text-xs font-semibold text-ink sm:text-sm">
            Obat rutin sudah diminum sesuai jadwal
          </span>
          <span
            className={`inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors ${
              medicationTaken ? "bg-secondary" : "bg-border"
            }`}
          >
            <span
              className={`h-5 w-5 rounded-full bg-white shadow-xs transition-transform ${
                medicationTaken ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </span>
        </button>

        <div>
          <label className="block text-xs font-semibold text-ink">
            Catatan Aktivitas & Keluhan
          </label>
          <textarea
            rows={3}
            required
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Jalan santai 10 menit di teras, makan siang lahap, tidak ada keluhan pusing..."
            className="mt-1.5 w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-muted focus:border-primary focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-ink">
            Foto Aktivitas / Makanan (Opsional)
          </label>
          <label className="mt-1.5 flex min-h-[52px] cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-border bg-canvas-subtle px-4 py-3 text-xs font-medium text-ink-muted transition-colors hover:border-primary hover:text-ink">
            <Camera className="h-4 w-4 text-primary" />
            <span className="truncate">
              {photoFile
                ? `Terpilih: ${photoFile.name}`
                : "Ambil atau pilih foto (JPG/PNG)"}
            </span>
            <input
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Pratinjau foto laporan"
              className="mt-2.5 h-36 w-full rounded-xl border border-border object-cover"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="btn-diagonal-secondary flex min-h-[48px] w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-white disabled:opacity-60 cursor-pointer"
        >
          <Send className="h-4 w-4" />
          <span>{submitting ? "Mengirim..." : "Kirim Laporan Harian"}</span>
        </button>
      </form>
      <ConfirmDialog
        open={confirmOpen}
        title="Kirim Laporan Harian?"
        description={`Catatan vital (tensi ${systolicInput}/${diastolicInput} mmHg, nadi ${heartRateInput} bpm) beserta dokumentasi akan langsung dikirimkan ke keluarga.`}
        confirmLabel="Ya, Kirim Laporan"
        loading={submitting}
        onConfirm={handleConfirmSubmit}
        onCancel={() => setConfirmOpen(false)}
      />
    </section>
  );
}
