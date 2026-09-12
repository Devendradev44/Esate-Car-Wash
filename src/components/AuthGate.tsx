"use client";

import { useEffect, useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

type UserRole = "CUSTOMER" | "STAFF" | "ADMIN";

const roleHome: Record<UserRole, string> = {
  CUSTOMER: "/customer/my-dashboard",
  STAFF: "/staff/staff-dashboard",
  ADMIN: "/dashboard",
};

type AuthGateProps = {
  role?: UserRole;
  children: React.ReactNode;
};

const subscribeToHydration = (onStoreChange: () => void) => {
  const unsubscribeHydrate = useStore.persist.onHydrate(onStoreChange);
  const unsubscribeFinish = useStore.persist.onFinishHydration(onStoreChange);

  return () => {
    unsubscribeHydrate();
    unsubscribeFinish();
  };
};

const getHydrated = () => useStore.persist.hasHydrated();

export function AuthGate({ role, children }: AuthGateProps) {
  const pathname = usePathname();
  const router = useRouter();
  const hydrated = useSyncExternalStore(
    subscribeToHydration,
    getHydrated,
    () => false,
  );
  const user = useStore((state) => state.mockUser);

  useEffect(() => {
    if (!hydrated) return;

    if (!user) {
      if (role && pathname !== "/login" && pathname !== "/signup") {
        router.replace("/login");
      }
      return;
    }

    if (role && user.role !== role) {
      router.replace(roleHome[user.role]);
      return;
    }

    if (!role && (pathname === "/login" || pathname === "/signup")) {
      router.replace(roleHome[user.role]);
    }
  }, [hydrated, pathname, role, router, user]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-canvas text-sm font-medium text-body">
        Loading Estate Car Spa...
      </div>
    );
  }

  if (
    (role && !user) ||
    (!role && user && (pathname === "/login" || pathname === "/signup"))
  ) {
    return null;
  }

  return <>{children}</>;
}

