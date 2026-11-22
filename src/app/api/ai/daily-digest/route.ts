import { NextResponse } from "next/server";
import { GoogleGenAI, Type } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;
const modelName = process.env.GEMINI_MODEL || "gemini-2.5-flash";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { elderly, logs = [] } = body;

    if (apiKey) {
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Kamu adalah asisten perawatan geriatri Lentera yang hangat, ringkas, dan akurat.
Analisis kondisi lansia dan catatan harian berikut, lalu berikan ringkasan dalam Bahasa Indonesia yang mudah dipahami keluarga.

Profil Lansia: ${JSON.stringify(elderly || {})}
Log Terbaru: ${JSON.stringify(logs.slice(0, 6))}

Output JSON: status ("aman"|"waspada"|"darurat"), summary (2 kalimat), meal_suggestion (rekomendasi menu spesifik), hydration_activity_tip (saran hidrasi & aktivitas ringan), anomaly_alert (string atau null).`;

      const response = await ai.models.generateContent({
        model: modelName,
        contents: prompt,
        config: {
          temperature: 0.25,
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING, enum: ["aman", "waspada", "darurat"] },
              summary: { type: Type.STRING },
              meal_suggestion: { type: Type.STRING },
              hydration_activity_tip: { type: Type.STRING },
              anomaly_alert: { type: Type.STRING, nullable: true },
            },
            required: ["status", "summary", "meal_suggestion", "hydration_activity_tip"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      return NextResponse.json({
        digest: {
          ...parsed,
          generated_at: new Date().toISOString(),
        },
      });
    }

    const latest = logs[logs.length - 1];
    const highBp = latest && latest.systolic >= 145;
    return NextResponse.json({
      digest: {
        status: highBp ? "waspada" : "aman",
        summary: latest
          ? `Tekanan darah terakhir ${latest.systolic}/${latest.diastolic} mmHg dengan nadi ${latest.heart_rate} bpm. Secara umum kondisi terpantau ${highBp ? "perlu perhatian" : "stabil"}.`
          : "Kondisi harian terpantau stabil berdasarkan catatan terbaru.",
        meal_suggestion:
          "Menu rendah garam: sup tahu bayam hangat, ikan kukus, dan buah potong segar.",
        hydration_activity_tip:
          "Pastikan minum air putih hangat 1 gelas tiap 2 jam dan jalan santai ringan di teras.",
        anomaly_alert: highBp
          ? `Tekanan darah (${latest.systolic}/${latest.diastolic} mmHg) meningkat, pantau ulang 30 menit lagi.`
          : null,
        generated_at: new Date().toISOString(),
      },
    });
  } catch (err) {
    console.error("[AI Daily Digest Error]", err);
    return NextResponse.json(
      { error: "Gagal memproses AI Daily Digest" },
      { status: 500 }
    );
  }
}
