"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Car, Building2, CalendarDays, IndianRupee, Settings, LogOut } from "lucide-react";

const navItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
  { icon: CalendarDays, label: "Bookings", href: "/bookings" },
  { icon: Building2, label: "Communities", href: "/communities" },
  { icon: Car, label: "Vehicles", href: "/vehicles" },
  { icon: Users, label: "Staff", href: "/staff" },
  { icon: IndianRupee, label: "Revenue", href: "/revenue" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-screen w-64 flex-col border-r border-hairline bg-surface-card">
      {/* M Stripe at the top */}
      <div className="flex h-1 w-full">
        <div className="flex-1 bg-m-blue-light" />
        <div className="flex-1 bg-m-blue-dark" />
        <div className="flex-1 bg-m-red" />
      </div>

      {/* Logo / Brand */}
      <div className="px-6 py-8">
        <h1 className="text-xl font-bold tracking-machined text-ink">
          ESTATE
        </h1>
        <p className="text-xs font-bold tracking-machined text-body">
          CAR WASH
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 space-y-1 px-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`
                flex items-center gap-4 px-4 py-3 text-xs font-bold uppercase tracking-machined transition-all duration-200
                ${isActive 
                  ? "bg-surface-elevated text-ink border-l-2 border-m-blue-dark" 
                  : "text-body hover:bg-surface-soft hover:text-ink border-l-2 border-transparent"}
              `}
            >
              <item.icon size={16} strokeWidth={1.5} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout at the bottom */}
      <div className="border-t border-hairline p-4">
        <button
          className="flex w-full items-center gap-4 px-4 py-3 text-xs font-bold uppercase tracking-machined text-muted hover:text-m-red transition-colors duration-200"
        >
          <LogOut size={16} strokeWidth={1.5} />
          Logout
        </button>
      </div>
    </aside>
  );
}