"use client";

import React from "react";
import { Bell } from "lucide-react";
import { AppNotification } from "@/types";

interface NotificationBannerProps {
  notification: AppNotification;
}

export function NotificationBanner({ notification }: NotificationBannerProps) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-3 rounded-2xl border border-[#E5E5E5] bg-[#FFFFFF] px-5 py-3.5 sm:flex-row sm:items-center">
      <div className="flex items-start gap-3 sm:items-center">
        <Bell className="mt-0.5 h-4 w-4 shrink-0 text-[#B8640B] sm:mt-0" />
        <div>
          <p className="text-xs font-semibold text-[#1F2937]">
            {notification.title}
          </p>
          <p className="text-xs text-[#6B7280]">{notification.message}</p>
        </div>
      </div>
      <span className="font-mono-vital shrink-0 text-[11px] text-[#6B7280]">
        {new Date(notification.created_at).toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
        })}{" "}
        WIB
      </span>
    </div>
  );
}
