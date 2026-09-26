"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, CalendarPlus, Car, MapPin, History, User, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetClose } from "@/components/ui/sheet";

const NAV_ITEMS = [
  { href: "/customer/my-dashboard", label: "Home", icon: Home },
  { href: "/customer/garage", label: "My Garage", icon: Car },
  { href: "/customer/addresses", label: "My Address", icon: MapPin },
  { href: "/customer/book", label: "Book Service", icon: CalendarPlus },
  { href: "/customer/booking-history", label: "Booking History", icon: History },
  { href: "/customer/profile", label: "Profile", icon: User },
] as const;

function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="/customer/my-dashboard" className="flex items-center gap-2.5" aria-label="Estate Car Spa home">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-yellow-dark/10 ring-1 ring-yellow-dark/25">
        <Car size={18} className="text-yellow-dark" aria-hidden="true" />
      </div>
      {!compact && (
        <span className="flex flex-col leading-none">
          <span className="text-sm font-bold tracking-machined text-ink">ESTATE CAR SPA</span>
          <span className="mt-0.5 text-[9px] font-semibold uppercase tracking-[0.22em] text-muted">Customer Portal</span>
        </span>
      )}
    </Link>
  );
}

function SidebarFooter({ onNavigate }: { onNavigate?: () => void }) {
  const router = useRouter();
  const mockUser = useStore((state) => state.mockUser);
  const logoutMockUser = useStore((state) => state.logoutMockUser);

  const name = mockUser?.name || "Customer";
  const email = mockUser?.email || "";
  const initials = (mockUser?.name || "C")
    .split(" ")
    .map((p) => p[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = () => {
    logoutMockUser();
    onNavigate?.();
    router.replace("/login");
  };

  return (
    <div className="space-y-3 border-t border-hairline p-4">
      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted">Customer information</p>
      <div className="flex min-w-0 items-center gap-3">
        <Avatar size="sm" className="ring-1 ring-yellow-dark/20">
          <AvatarFallback className="bg-yellow-dark/10 text-yellow-dark">{initials}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-ink">{name}</p>
          <p className="truncate text-xs font-light text-muted">{email || "Customer"}</p>
        </div>
      </div>
      <Button
        variant="outline"
        onClick={handleLogout}
        className="flex w-full items-center justify-center gap-2 rounded-lg border-hairline py-2 text-xs font-bold uppercase tracking-machined text-muted hover:border-m-red/50 hover:bg-m-red/10 hover:text-m-red"
      >
        <LogOut size={14} /> Logout
      </Button>
    </div>
  );
}

function NavList({ pathname, onNavigate }: { pathname: string; onNavigate?: () => void }) {
  return (
    <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-6" aria-label="Customer navigation">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-dark/40",
              isActive
                ? "bg-yellow-dark/10 text-yellow-dark ring-1 ring-yellow-dark/25"
                : "text-muted hover:bg-surface-elevated hover:text-ink"
            )}
          >
            <Icon size={18} className="shrink-0" aria-hidden="true" />
            <span className="truncate">{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function CustomerSidebar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile hamburger (drawer trigger) */}
      <Button
        variant="ghost"
        size="icon-lg"
        className="lg:hidden fixed top-3 left-3 z-50 border border-hairline bg-canvas/80 backdrop-blur"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        <Menu size={20} />
      </Button>

      {/* Desktop fixed sidebar */}
      <aside
        className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-hairline bg-canvas lg:flex"
        aria-label="Main navigation"
      >
        <div className="flex h-16 items-center border-b border-hairline px-5">
          <Logo />
        </div>
        <NavList pathname={pathname} />
        <SidebarFooter />
      </aside>

      {/* Mobile drawer */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" showCloseButton={false} className="max-h-[100dvh] gap-0 border-r border-hairline bg-canvas p-0">
          <div className="flex h-14 items-center justify-between border-b border-hairline px-4">
            <Logo />
            <SheetClose render={<Button variant="ghost" size="icon-sm" aria-label="Close menu" />}>
              <svg className="size-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
              <span className="sr-only">Close</span>
            </SheetClose>
          </div>
          <div className="flex min-h-0 flex-1 flex-col">
            <NavList pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            <SidebarFooter onNavigate={() => setMobileOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}