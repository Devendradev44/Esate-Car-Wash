"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wrench, Car, MapPin, User } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/customer/my-dashboard", label: "Home", icon: Home },
    { href: "/customer/book", label: "Book", icon: Wrench },
    { href: "/customer/garage", label: "Garage", icon: Car },
    { href: "/customer/addresses", label: "Addresses", icon: MapPin }, // ADDED
    { href: "/customer/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-hairline bg-canvas py-3 px-6 flex justify-around items-center">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link 
            key={item.href} 
            href={item.href}
            className={`flex flex-col items-center gap-1 text-xs font-bold uppercase tracking-machined ${
              isActive ? "text-m-blue-dark" : "text-muted"
            }`}
          >
            <item.icon size={20} />
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}