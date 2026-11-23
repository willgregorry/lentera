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

  const userId = user?.id;
  const userName = user?.name;

  // Keep local session profile strictly aligned with the tab's real Supabase auth.uid()
  useEffect(() => {
    if (!supabase || !userId) return;
    let active = true;

    supabase.auth.getUser().then(({ data, error }) => {
      if (!active) return;

      // If the underlying Supabase JWT is gone or belongs to a different user,
      // clear stale client profile to prevent RLS mismatch errors.
      if (error || !data?.user || data.user.id !== userId) {
        clearAuthSession();
        return;
      }

      const meta = data.user.user_metadata || {};
      const realName = String(
        meta.display_name || meta.full_name || meta.name || ""
      ).trim();

      if (realName && realName !== userName) {
        const latest = getStoredUser();
        if (latest && latest.id === userId) {
          setAuthSession(getStoredToken() || "supabase-session", {
            ...latest,
            name: realName,
          });
        }
      }
    });

    return () => {
      active = false;
    };
  }, [userId, userName]);

  function logout() {
    if (supabase) {
      supabase.auth.signOut({ scope: "local" }).catch(() => {});
    }
    clearAuthSession();
    router.push("/login");
  }

  return { user, hydrated, logout };
}
