"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthSession, getStoredUser } from "@/services/authStorage";
import { UserProfile } from "@/types";

export function useAuth() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    setUser(getStoredUser());
  }, [pathname]);

  function logout() {
    clearAuthSession();
    setUser(null);
    router.push("/login");
  }

  return { user, logout };
}
