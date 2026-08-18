"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Wrench, Car, MapPin, User } from "lucide-react";
import { BottomNav } from "@/components/customer/BottomNav";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: "/customer/my-dashboard", label: "Home", icon: Home },
    { href: "/customer/book", label: "Book", icon: Wrench },
    { href: "/customer/garage", label: "Garage", icon: Car },
    { href: "/customer/addresses", label: "Address", icon: MapPin }, 
    { href: "/customer/profile", label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      {/* Desktop Top Nav */}
      <div className="hidden md:flex sticky top-0 z-40 border-b border-hairline bg-surface-soft py-4 px-8 justify-between items-center">
        <Link href="/customer/my-dashboard" className="cursor-pointer">
          <h1 className="text-lg font-bold tracking-machined text-ink">ESTATE</h1>
          <p className="text-[10px] font-bold tracking-machined text-body">CAR WASH</p>
        </Link>
        <nav className="flex gap-8">
          {navItems.map((item) => (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-2 text-xs font-bold uppercase tracking-machined ${
                pathname === item.href ? "text-m-blue-dark" : "text-muted hover:text-ink"
              }`}
            >
              <item.icon size={16} />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main Content - pb-24 for mobile bottom nav spacing, md:pb-12 for desktop */}
      <main className="flex-1 pb-24 md:pb-12">
        {children}
      </main>

      {/* Mobile Bottom Nav (Hidden on desktop) */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}