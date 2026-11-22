import { UserProfile } from "@/types";

const TOKEN_KEY = "lenteraku_token";
export const USER_KEY = "lenteraku_user";
export const AUTH_CHANGE_EVENT = "lentera-auth-change";

export function getStoredToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(TOKEN_KEY);
}

export function getStoredUser(): UserProfile | null {
  if (typeof window === "undefined") return null;
  const raw = window.sessionStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as UserProfile;
  } catch {
    return null;
  }
}

export function setAuthSession(token: string, user: UserProfile): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.setItem(TOKEN_KEY, token);
  window.sessionStorage.setItem(USER_KEY, JSON.stringify(user));
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;
  window.sessionStorage.removeItem(TOKEN_KEY);
  window.sessionStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
}
