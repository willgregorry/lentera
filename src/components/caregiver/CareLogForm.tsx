"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Camera, CheckCircle2, Send } from "lucide-react";
import { CareLog } from "@/types";

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
  const [heartRate, setHeartRate] = useState(78);
  const [systolic, setSystolic] = useState(124);
  const [diastolic, setDiastolic] = useState(80);
  const [mealPortion, setMealPortion] =
    useState<CareLog["meal_portion"]>("habis");
  const [medicationTaken, setMedicationTaken] = useState(true);
  const [mood, setMood] = useState<CareLog["mood"]>("cerah");
  const [notes, setNotes] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await onSubmit({
      heartRate,
      systolic,
      diastolic,
      mealPortion,
      medicationTaken,
      mood,
      notes,
      photoFile,
    });
    setNotes("");
    setPhotoFile(null);
    setPhotoPreview(null);
  }

  return (
    <section className="rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] p-6 lg:col-span-7">
      <h2 className="font-display text-lg font-bold text-[#1F2937]">
        Formulir Laporan Harian
      </h2>
      <p className="mt-1 text-xs text-[#6B7280]">
        Isi tanda vital dan aktivitas terbaru Pak Joko.
      </p>

      {successMsg && (
        <div className="mt-4 flex items-center justify-between gap-3 border-l-4 border-[#4A7C59] bg-[#EDF4EF] px-4 py-3 text-xs font-semibold text-[#355E42]">
          <span className="inline-flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            {successMsg}
          </span>
          <Link href="/dashboard" className="shrink-0 underline">
            Lihat Dashboard
          </Link>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-5 space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold text-[#1F2937]">
              Detak Jantung (bpm)
            </label>
            <input
              type="number"
              required
              min={35}
              max={200}
              value={heartRate}
              onChange={(e) => setHeartRate(Number(e.target.value))}
              className="font-mono-vital mt-1.5 w-full rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] px-3.5 py-2.5 text-sm font-semibold text-[#1F2937] focus:border-[#E8912E] focus:bg-[#FFFFFF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2937]">
              Tensi Sistolik (mmHg)
            </label>
            <input
              type="number"
              required
              min={60}
              max={240}
              value={systolic}
              onChange={(e) => setSystolic(Number(e.target.value))}
              className="font-mono-vital mt-1.5 w-full rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] px-3.5 py-2.5 text-sm font-semibold text-[#1F2937] focus:border-[#E8912E] focus:bg-[#FFFFFF] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2937]">
              Tensi Diastolik (mmHg)
            </label>
            <input
              type="number"
              required
              min={40}
              max={150}
              value={diastolic}
              onChange={(e) => setDiastolic(Number(e.target.value))}
              className="font-mono-vital mt-1.5 w-full rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] px-3.5 py-2.5 text-sm font-semibold text-[#1F2937] focus:border-[#E8912E] focus:bg-[#FFFFFF] focus:outline-none"
            />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-xs font-semibold text-[#1F2937]">
              Porsi Makan
            </label>
            <select
              value={mealPortion}
              onChange={(e) =>
                setMealPortion(e.target.value as CareLog["meal_portion"])
              }
              className="mt-1.5 w-full rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#1F2937] focus:border-[#E8912E] focus:bg-[#FFFFFF] focus:outline-none"
            >
              <option value="habis">Habis (1 porsi penuh)</option>
              <option value="setengah">Setengah Porsi</option>
              <option value="sedikit">Hanya Sedikit</option>
              <option value="tidak_makan">Belum Mau Makan</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1F2937]">
              Suasana Hati / Mood
            </label>
            <select
              value={mood}
              onChange={(e) => setMood(e.target.value as CareLog["mood"])}
              className="mt-1.5 w-full rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#1F2937] focus:border-[#E8912E] focus:bg-[#FFFFFF] focus:outline-none"
            >
              <option value="cerah">Cerah & Bersemangat</option>
              <option value="tenang">Tenang & Nyaman</option>
              <option value="lelah">Agak Lelah</option>
              <option value="gelisah">Gelisah / Kurang Nyaman</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 border-y border-[#E5E5E5] py-3">
          <input
            id="med-taken"
            type="checkbox"
            checked={medicationTaken}
            onChange={(e) => setMedicationTaken(e.target.checked)}
            className="h-4 w-4 accent-[#4A7C59]"
          />
          <label
            htmlFor="med-taken"
            className="text-sm font-medium text-[#1F2937]"
          >
            Obat rutin (Amlodipine & Metformin) sudah diminum sesuai jadwal
          </label>
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1F2937]">
            Catatan Aktivitas & Keluhan
          </label>
          <textarea
            rows={3}
            required
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Contoh: Pak Joko sudah jalan santai 10 menit di teras, tidak ada keluhan pusing..."
            className="mt-1.5 w-full rounded-xl border border-[#E5E5E5] bg-[#FFFFFF] px-3.5 py-2.5 text-sm text-[#1F2937] focus:border-[#E8912E] focus:bg-[#FFFFFF] focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-[#1F2937]">
            Unggah Foto Kondisi / Makanan (Opsional)
          </label>
          <label className="mt-1.5 flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-[#D6C8B8] bg-[#FFFFFF] px-4 py-4 text-xs font-medium text-[#6B7280] hover:border-[#E8912E]">
            <Camera className="h-4 w-4 text-[#B8640B]" />
            <span>
              {photoFile
                ? `Terpilih: ${photoFile.name}`
                : "Pilih foto dari perangkat (JPG/PNG)"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoChange}
              className="hidden"
            />
          </label>
          {photoPreview && (
            <img
              src={photoPreview}
              alt="Pratinjau foto laporan"
              className="mt-2.5 h-36 w-full rounded-xl border border-[#E5E5E5] object-cover"
            />
          )}
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#C26D10] px-5 py-3 text-sm font-semibold text-white hover:bg-[#A65B0B] disabled:opacity-60 transition-colors cursor-pointer"
        >
          <Send className="h-4 w-4" />
          <span>{submitting ? "Mengirim..." : "Kirim Laporan Harian"}</span>
        </button>
      </form>
    </section>
  );
}
