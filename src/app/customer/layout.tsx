import { BottomNav } from "@/components/customer/BottomNav";
import Link from "next/link";
import { Home, CalendarPlus, Car, User } from "lucide-react";
import Hydration from "@/components/Hydration";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-canvas flex flex-col">
      
      {/* DESKTOP TOP HEADER (Hidden on Mobile) */}
      <header className="hidden md:flex items-center justify-between border-b border-hairline bg-surface-card px-12 py-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold tracking-machined text-ink">ESTATE</h1>
          <p className="text-xs font-bold tracking-machined text-body">CAR WASH</p>
        </div>
        
        {/* Desktop Navigation Links */}
        <nav className="flex items-center gap-8">
          {[
            { icon: Home, label: "Dashboard", href: "/customer/my-dashboard" },
            { icon: CalendarPlus, label: "Book Service", href: "/customer/book" },
            { icon: Car, label: "My Garage", href: "/customer/garage" },
            { icon: User, label: "Profile", href: "/customer/profile" },
          ].map(item => (
            <Link key={item.label} href={item.href} className="flex items-center gap-2 text-xs font-bold uppercase tracking-machined text-body hover:text-ink transition-colors">
              <item.icon size={14} /> {item.label}
            </Link>
          ))}
        </nav>
      </header>

      {/* MAIN CONTENT - Adds bottom padding only on mobile to clear the BottomNav */}
      <main className="flex-1 pb-20 md:pb-0">
        <Hydration>
          {children}
        </Hydration>
      </main>
      
      {/* MOBILE BOTTOM NAV (Hidden on Desktop) */}
      <div className="md:hidden">
        <BottomNav />
      </div>
    </div>
  );
}