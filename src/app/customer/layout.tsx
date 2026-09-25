"use client";
import { AuthGate } from "@/components/AuthGate";
import { CustomerSidebar } from "@/components/customer/CustomerSidebar";
import { Toaster } from "@/components/ui/sonner";

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <AuthGate role="CUSTOMER">
      <div className="min-h-screen bg-canvas">
        <CustomerSidebar />
        {/* Left padding accounts for the fixed desktop sidebar; extra bottom padding for mobile drawer spacing */}
        <main className="flex-1 pb-24 pt-16 lg:pb-0 lg:pl-72 lg:pt-0">{children}</main>
        <Toaster position="top-right" />
      </div>
    </AuthGate>
  );
}