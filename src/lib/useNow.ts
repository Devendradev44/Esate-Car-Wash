"use client";

import { useSyncExternalStore } from "react";

// Shared wall-clock ticker. `Date.now()` cannot be called during render
// (eslint react-hooks/purity) and setState-in-effect is also banned, so the
// clock is a module-level value refreshed every 15s and observed via
// useSyncExternalStore. Used by staff-dashboard, NotificationBell, SlotLoad.
const nowCache = { value: 0 };
const nowListeners = new Set<() => void>();

if (typeof window !== "undefined") {
  nowCache.value = Date.now();
  setInterval(() => {
    nowCache.value = Date.now();
    nowListeners.forEach((l) => l());
  }, 15000);
}

export function useNow(): number {
  return useSyncExternalStore(
    (cb) => {
      nowListeners.add(cb);
      return () => nowListeners.delete(cb);
    },
    () => nowCache.value,
    () => nowCache.value,
  );
}