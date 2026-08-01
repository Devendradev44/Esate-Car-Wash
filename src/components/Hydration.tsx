"use client";

import { useStore } from "@/lib/store";

export default function Hydration({ children }: { children: React.ReactNode }) {
  // Safely check if persist exists and is hydrated
  // If persist isn't set up, it assumes hydrated is true
  const hydrated = useStore.persist?.hasHydrated?.() ?? true;

  if (!hydrated) {
    // Show a blank dark screen while localStorage loads
    return <div className="min-h-screen bg-canvas" />;
  }

  return <>{children}</>;
}