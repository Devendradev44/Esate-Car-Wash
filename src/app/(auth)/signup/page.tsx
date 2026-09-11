"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function SignupPage() {
  const router = useRouter();
  const setMockUser = useStore((state) => state.setMockUser);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"CUSTOMER" | "STAFF" | "ADMIN">("CUSTOMER");

  const handleRegister = () => {
    document.cookie = `mock_session=${role}; path=/; max-age=86400`;
    setMockUser({ id: `mock_${Date.now()}`, role, name, phone, email });

    if (role === "ADMIN") router.push("/dashboard");
    else if (role === "STAFF") router.push("/staff/staff-dashboard");
    else router.push("/customer/my-dashboard");
  };

  const inputClasses = "w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 text-sm font-normal focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 transition-all rounded-lg appearance-none";
  const labelClasses = "block text-[10px] font-bold uppercase tracking-wide text-zinc-500 mb-2";

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Logo Beside Text */}
        <div className="mb-8 flex flex-row items-center justify-center gap-3">
          <div className="bg-yellow-400 p-1.5 rounded-lg">
            <Image src="/logo.svg" alt="Estate Car Spa" width={24} height={24} className="object-contain" />
          </div>
          <div className="text-left">
            <h1 className="text-lg font-bold tracking-tight text-white leading-none">ESTATE CAR SPA</h1>
            <p className="text-[9px] font-medium uppercase tracking-widest text-zinc-500 mt-1">Premium Car Care</p>
          </div>
        </div>

        {/* Static Card Container */}
        <div className="bg-zinc-900 border border-zinc-800 p-8 min-h-[520px] flex flex-col rounded-xl shadow-2xl shadow-black/50 animate-fade-in-up">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1 tracking-tight">Join Estate</h2>
            <p className="text-xs font-light text-zinc-400">Register to book services and manage your garage.</p>
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
                    className={`p-3 text-[10px] font-bold uppercase tracking-wide transition-all rounded-lg active:scale-95 ${
                      role === r ? "bg-yellow-400 text-black hover:bg-yellow-300" : "bg-zinc-950 text-zinc-400 border border-zinc-800 hover:text-white hover:border-zinc-700"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <button 
            onClick={handleRegister} 
            className="mt-6 w-full bg-yellow-400 py-3 text-xs font-bold uppercase tracking-wide text-black hover:bg-yellow-300 transition-all rounded-lg active:scale-95 hover:shadow-lg hover:shadow-yellow-400/20"
          >
            Create account
          </button>
        </div>

        <p className="mt-8 text-center text-xs font-light text-zinc-500">
          Already have an account? <Link href="/login" className="text-yellow-400 font-bold hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  );
}