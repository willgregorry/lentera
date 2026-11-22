"use client";

import React from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { CareLog } from "@/types";

interface VitalChartProps {
  logs: CareLog[];
}

export function VitalChart({ logs }: VitalChartProps) {
  const chartData = logs.map((log) => {
    const d = new Date(log.logged_at);
    const label =
      d.toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
      }) +
      " " +
      d.toLocaleTimeString("id-ID", {
        hour: "2-digit",
        minute: "2-digit",
      });
    return {
      waktu: label,
      Sistolik: log.systolic,
      Diastolik: log.diastolic,
      DetakJantung: log.heart_rate,
    };
  });

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center border-t border-[#E5E5E5] text-sm text-[#6B7280]">
        Belum ada catatan tanda vital untuk ditampilkan.
      </div>
    );
  }

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{ top: 10, right: 16, left: -12, bottom: 4 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E5E5" />
          <XAxis
            dataKey="waktu"
            tick={{ fontSize: 11, fill: "#6B7280" }}
            stroke="#E5E5E5"
          />
          <YAxis
            domain={[50, 170]}
            tick={{ fontSize: 11, fill: "#6B7280" }}
            stroke="#E5E5E5"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#FFFFFF",
              borderColor: "#E5E5E5",
              borderRadius: "12px",
              fontSize: "12px",
              color: "#1F2937",
            }}
          />
          <Legend wrapperStyle={{ fontSize: "12px" }} />
          <Line
            type="monotone"
            dataKey="Sistolik"
            name="Tensi Sistolik (mmHg)"
            stroke="#E8912E"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#E8912E" }}
            activeDot={{ r: 6 }}
          />
          <Line
            type="monotone"
            dataKey="Diastolik"
            name="Tensi Diastolik (mmHg)"
            stroke="#4A7C59"
            strokeWidth={2.5}
            dot={{ r: 4, fill: "#4A7C59" }}
          />
          <Line
            type="monotone"
            dataKey="DetakJantung"
            name="Detak Jantung (bpm)"
            stroke="#1F2937"
            strokeWidth={2}
            strokeDasharray="4 4"
            dot={{ r: 3.5, fill: "#1F2937" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
