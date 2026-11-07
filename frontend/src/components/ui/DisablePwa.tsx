"use client";

import { useEffect } from "react";

/**
 * Ensures the website behaves strictly as a normal website in all browsers:
 * - Prevents the browser's PWA install prompt / address bar install icon (`beforeinstallprompt`).
 * - Unregisters any active or legacy service workers that might have been registered previously.
 */
export function DisablePwa() {
  useEffect(() => {
    // Intercept and cancel any browser PWA installation prompts
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
    };
    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // Unregister any active or legacy service workers
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister();
        }
      }).catch(() => {
        // Silent catch
      });
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    };
  }, []);

  return null;
}
