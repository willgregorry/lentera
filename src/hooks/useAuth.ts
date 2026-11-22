"use client";

import { useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import { clearAuthSession, getStoredUser } from "@/services/authStorage";
import { UserProfile } from "@/types";

let cachedRaw: string | null | undefined;
let cachedUser: UserProfile | null = null;

function subscribe(callback: () => void) {
  window.addEventListener("storage", callback);
  return () => window.removeEventListener("storage", callback);
}

function getSnapshot(): UserProfile | null {
  const raw =
    typeof window !== "undefined"
      ? window.localStorage.getItem("lenteraku_auth_user")
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

  function logout() {
    clearAuthSession();
    cachedRaw = undefined;
    window.dispatchEvent(new Event("storage"));
    router.push("/login");
  }

  return { user, hydrated, logout };
}
