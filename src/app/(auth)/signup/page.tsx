"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { AuthGate } from "@/components/AuthGate";

export default function SignupPage() {
  const router = useRouter();
  const setMockUser = useStore((state) => state.setMockUser);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "STAFF" | "ADMIN">("CUSTOMER");
  const [error, setError] = useState("");

  const handleRegister = () => {
    setError("");
    
    if (!name.trim()) { setError("Please enter your full name."); return; }
    if (phone.length !== 10) { setError("Please enter a valid 10-digit phone number."); return; }
    if (!email.includes("@") || !email.includes(".")) { setError("Please enter a valid email address."); return; }
    if (password.length < 4) { setError("Password must be at least 4 characters."); return; }

    setMockUser({ id: `mock_${Date.now()}`, role, name, phone, email });

    if (role === "ADMIN") router.replace("/dashboard");
    else if (role === "STAFF") router.replace("/staff/staff-dashboard");
    else router.replace("/customer/my-dashboard");
  };

  const inputClasses = "w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 text-sm font-normal focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 transition-all rounded-lg appearance-none";
  const labelClasses = "block text-[10px] font-bold text-muted mb-2";

  return (
    <AuthGate>
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 flex flex-row items-center justify-center gap-3">
          <Image 
            src="/logo.svg" 
            alt="Estate Car Spa" 
            width={40} 
            height={40} 
            className="bg-yellow-400 p-2 rounded-lg"
          />
          <div className="text-left">
            <h1 className="text-lg font-bold text-ink leading-none">Estate Car Spa</h1>
            <p className="text-[10px] font-medium text-muted mt-1">Premium Car Care</p>
          </div>
        </div>

        {/* Static Card Container */}
        <div className="bg-zinc-900 border border-zinc-800 p-8 min-h-[520px] flex flex-col rounded-xl shadow-2xl shadow-black/50 animate-fade-in-up">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-ink mb-1">Join Estate</h2>
            <p className="text-xs text-body">Register to book services and manage your garage.</p>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-5">
            <div>
              <label className={labelClasses}>Full Name</label>
              <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="John Doe" className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Phone</label>
              <input type="tel" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="9876543210" className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@example.com" className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClasses} />
            </div>

            <div>
              <label className={labelClasses}>Account Type</label>
              <div className="grid grid-cols-3 gap-2">
                {(["CUSTOMER", "STAFF", "ADMIN"] as const).map((r) => (
                  <button 
                    key={r} 
                    onClick={() => setRole(r)}
                    className={`p-3 text-xs font-semibold transition-all rounded-lg active:scale-95 ${
                      role === r ? "bg-yellow-400 text-black hover:bg-yellow-300" : "bg-surface-card text-muted border border-hairline hover:text-ink hover:border-body"
                    }`}
                  >
                    {r.charAt(0) + r.slice(1).toLowerCase()}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleRegister} 
            className="mt-6 w-full bg-yellow-400 py-3 text-sm font-bold text-black hover:bg-yellow-300 transition-all rounded-lg active:scale-95 hover:shadow-lg hover:shadow-yellow-400/20"
          >
            Create account
          </button>
          
          {/* Error Display */}
          {error && (
            <div className="mt-4 text-center text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 py-2 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-zinc-500">
          Already have an account? <Link href="/login" className="text-yellow-400 font-bold hover:underline">Sign in</Link>
        </p>
        </div>
      </div>
    </AuthGate>
  );
}
