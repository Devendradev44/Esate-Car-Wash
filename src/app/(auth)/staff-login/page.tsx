"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { AuthGate } from "@/components/AuthGate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function StaffLoginPage() {
  const router = useRouter();
  const setMockUser = useStore((state) => state.setMockUser);

  const [error, setError] = useState("");
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");

  const handleLogin = () => {
    setError("");

    if (phone.length !== 10) { setError("Please enter a valid 10-digit phone number."); return; }
    if (pin.length !== 6) { setError("Please enter a valid 6-digit PIN."); return; }

    const state = useStore.getState();
    const staffMember = state.staff.find(s => s.phone === phone && s.pin === pin && s.status === "ACTIVE");
    if (!staffMember) {
      setError("Invalid phone number or PIN.");
      return;
    }

    setMockUser({
      id: staffMember.id,
      role: "STAFF",
      name: staffMember.name,
      email: "",
      phone: staffMember.phone,
    });

    router.replace("/staff/staff-dashboard");
  };

  return (
    <AuthGate>
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-row items-center justify-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" fill="none" width="24" height="24">
                <circle cx="60" cy="60" r="56" fill="#FFCC00"/>
                <path d="M30 80 L30 58 C30 50 36 44 44 44 L76 44 C84 44 90 50 90 58 L90 80" stroke="#000000" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                <path d="M40 54 L40 48 L52 48 L56 54 Z" fill="#000000"/>
                <path d="M60 54 L60 48 L72 48 L74 54 Z" fill="#000000"/>
                <circle cx="42" cy="80" r="10" stroke="#000000" strokeWidth="4" fill="none"/>
                <circle cx="42" cy="80" r="4" fill="#000000"/>
                <circle cx="78" cy="80" r="10" stroke="#000000" strokeWidth="4" fill="none"/>
                <circle cx="78" cy="80" r="4" fill="#000000"/>
              </svg>
            </div>
            <div className="text-left">
              <h1 className="text-lg font-bold text-ink leading-none">Estate Car Spa</h1>
              <p className="text-[10px] font-medium text-muted mt-1">Staff Portal</p>
            </div>
          </div>

          <Card className="flex min-h-[480px] flex-col rounded-xl border border-zinc-800 bg-zinc-900 py-0 shadow-2xl shadow-black/50 ring-0">
            <CardContent className="flex flex-1 flex-col p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-ink mb-1">Staff Sign In</h2>
                <p className="text-xs text-body">Access the staff dashboard.</p>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <div className="animate-fade-in-up space-y-4">
                  <div>
                    <Label className="mb-2 block text-[10px] font-bold leading-normal text-muted">Phone Number</Label>
                  <Input
                    type="tel"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                    placeholder="98765 43210"
                  />
                </div>
                <div>
                  <Label className="mb-2 block text-[10px] font-bold leading-normal text-muted">6-Digit PIN</Label>
                  <Input
                    type="password"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
                    placeholder="******"
                    maxLength={6}
                    className="text-center text-xl tracking-[0.5em]"
                  />
                </div>
                <Button
                  onClick={handleLogin}
                  className="h-auto w-full rounded-lg bg-yellow-400 py-3 text-sm font-bold text-black transition-all hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/20 active:scale-95"
                >
                  Login
                </Button>

                {error && (
                  <div className="mt-4 text-center text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 py-2 rounded-lg">
                    {error}
                  </div>
                )}
              </div>
            </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </AuthGate>
  );
}