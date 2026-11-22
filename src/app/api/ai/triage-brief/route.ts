import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { elderly, logs = [], reason = "Kondisi darurat medis di rumah" } = body;

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Buat Kartu Triage Darurat Medis ringkas untuk tim IGD/119 dan keluarga dalam Bahasa Indonesia.
Pasien: ${JSON.stringify(elderly || {})}
Alasan SOS: ${reason}
Log 24 Jam Terakhir: ${JSON.stringify(logs.slice(0, 5))}`;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          temperature: 0.1,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              patient_summary: { type: Type.STRING },
              last_24h_vitals: { type: Type.STRING },
              immediate_actions: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              emergency_note: { type: Type.STRING },
            },
            required: ["patient_summary", "last_24h_vitals", "immediate_actions", "emergency_note"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return NextResponse.json({
        triage_brief: {
          ...parsed,
          allergies: elderly?.allergies || [],
          routine_meds: elderly?.routine_meds || [],
        },
      });
    }

    return NextResponse.json({
      triage_brief: {
        patient_summary: `${elderly?.name || "Pasien Lansia"} (${elderly?.age || 72} th)`,
        allergies: elderly?.allergies || [],
        routine_meds: elderly?.routine_meds || [],
        last_24h_vitals: "Vital terakhir terpantau dalam catatan harian.",
        immediate_actions: [
          "Posisikan pasien nyaman dan longgarkan pakaian.",
          "Hubungi layanan darurat 119 dan siapkan daftar alergi serta obat rutin.",
        ],
        emergency_note: reason,
      },
    });
  } catch (err) {
    console.error("[AI Triage Brief Error]", err);
    return NextResponse.json(
      { error: "Gagal memproses AI Triage Brief" },
      { status: 500 }
    );
  }
}
