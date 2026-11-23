"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import {
  AUTH_CHANGE_EVENT,
  USER_KEY,
  clearAuthSession,
  getStoredToken,
  getStoredUser,
  setAuthSession,
} from "@/services/authStorage";
import { UserProfile } from "@/types";

let cachedRaw: string | null | undefined;
let cachedUser: UserProfile | null = null;

function subscribe(callback: () => void) {
  window.addEventListener(AUTH_CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(AUTH_CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): UserProfile | null {
  const raw =
    typeof window !== "undefined"
      ? window.sessionStorage.getItem(USER_KEY)
      : null;
  if (raw !== cachedRaw) {
    cachedRaw = raw;
    cachedUser = getStoredUser();
  }
  return cachedUser;
}

function getServerSnapshot(): UserProfile | null {
  return null;
}

function getHydratedSnapshot(): boolean {
  return true;
}

function getServerHydratedSnapshot(): boolean {
  return false;
}

export function useAuth() {
  const router = useRouter();
  const user = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const hydrated = useSyncExternalStore(
    subscribe,
    getHydratedSnapshot,
    getServerHydratedSnapshot
  );

  // Sync display_name / full_name from active Supabase Auth session
  useEffect(() => {
    if (!supabase || !user) return;
    let active = true;

    supabase.auth.getUser().then(({ data }) => {
      if (!active || !data?.user) return;
      const meta = data.user.user_metadata || {};
      const realName = String(
        meta.display_name || meta.full_name || meta.name || ""
      ).trim();

      if (realName && realName !== user.name) {
        setAuthSession(getStoredToken() || "supabase-session", {
          ...user,
          name: realName,
        });
      }
    });

    return () => {
      active = false;
    };
  }, [user]);

  function logout() {
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    clearAuthSession();
    cachedRaw = undefined;
    router.push("/login");
  }

  return { user, hydrated, logout };
}
