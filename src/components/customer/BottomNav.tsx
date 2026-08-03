"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, CalendarPlus, Car, User } from "lucide-react";

const navItems = [
  { icon: Home, label: "Home", href: "/customer/my-dashboard" },
  { icon: CalendarPlus, label: "Book", href: "/customer/book" },
  { icon: Car, label: "Garage", href: "/customer/garage" },
  { icon: User, label: "Profile", href: "/customer/profile" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-hairline bg-surface-card">
      <div className="mx-auto flex max-w-lg items-center justify-around">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex flex-1 flex-col items-center gap-1 py-4 transition-colors duration-200 ${
                isActive ? "text-m-blue-dark" : "text-muted hover:text-body"
              }`}
            >
              <item.icon size={20} strokeWidth={1.5} />
              <span className="text-[10px] font-bold uppercase tracking-machined">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}