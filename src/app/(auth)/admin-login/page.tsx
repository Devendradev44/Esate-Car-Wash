"use client";
import { useState } from "react";
import { Car } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore, verifyMockHash } from "@/lib/store";
import { AuthGate } from "@/components/AuthGate";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function AdminLoginPage() {
  const router = useRouter();
  const setMockUser = useStore((state) => state.setMockUser);

  const [error, setError] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    setError("");

    if (!email.includes("@") || !email.includes(".")) { setError("Please enter a valid email address."); return; }
    if (password.length < 4) { setError("Password must be at least 4 characters."); return; }

    const state = useStore.getState();
    const admin = state.admins.find(
      (a) => a.email === email && verifyMockHash(password, a.passwordHash) && a.status === "ACTIVE"
    );

    if (!admin) {
      setError("Invalid email or password.");
      return;
    }

    setMockUser({
      id: admin.id,
      role: "ADMIN",
      name: admin.name,
      email: admin.email,
    });

    router.replace("/dashboard");
  };

  return (
    <AuthGate>
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md">
          <div className="mb-8 flex flex-row items-center justify-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-lg">
              <Car size={24} className="text-black" />
            </div>
            <div className="text-left">
              <h1 className="text-lg font-bold text-ink leading-none">Estate Car Spa</h1>
              <p className="text-[10px] font-medium text-muted mt-1">Admin Portal</p>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 p-8 min-h-[480px] flex flex-col rounded-xl shadow-2xl shadow-black/50">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ink mb-1">Admin Sign In</h2>
              <p className="text-xs text-body">Access the admin dashboard.</p>
            </div>

            <div className="flex-1 flex flex-col justify-center">
              <div className="animate-fade-in-up space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-muted mb-2">Email Address</label>
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="admin@estatecarspa.com"
                    autoComplete="email"
                  />
                </div>
                <PasswordInput
                  value={password}
                  onChange={setPassword}
                  placeholder="••••••••"
                  label="Password"
                  autoComplete="current-password"
                />
                <Button
                  onClick={handleLogin}
                  className="w-full bg-yellow-400 py-3 text-sm font-bold text-black hover:bg-yellow-300 transition-all rounded-lg active:scale-95 hover:shadow-lg hover:shadow-yellow-400/20"
                >
                  Sign in
                </Button>

                {error && (
                  <div className="mt-4 text-center text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 py-2 rounded-lg">
                    {error}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  );
}