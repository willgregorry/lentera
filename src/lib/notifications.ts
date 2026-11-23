export async function registerNotificationSw(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }
  try {
    return await navigator.serviceWorker.register("/sw.js");
  } catch {
    return null;
  }
}

export async function requestBrowserNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }
  await registerNotificationSw();
  if (Notification.permission === "granted") return "granted";
  return await Notification.requestPermission();
}

export async function notifyUserDevice(payload: {
  title: string;
  body: string;
  url?: string;
  urgent?: boolean;
}): Promise<void> {
  if (typeof window === "undefined" || !("Notification" in window)) return;
  if (Notification.permission !== "granted") return;

  const options: NotificationOptions = {
    body: payload.body,
    icon: "/images/icons/lentera-icon.png",
    badge: "/images/icons/lentera-icon.png",
    tag: payload.urgent ? "lentera-sos" : "lentera-report",
    requireInteraction: Boolean(payload.urgent),
    data: { url: payload.url || "/notifikasi" },
  };

  try {
    const reg = await registerNotificationSw();
    if (reg && "showNotification" in reg) {
      await reg.showNotification(payload.title, options);
      return;
    }
  } catch {
    // fallback to standard Notification API
  }

  try {
    new Notification(payload.title, options);
  } catch {
    // ignore browser restriction
  }
}
