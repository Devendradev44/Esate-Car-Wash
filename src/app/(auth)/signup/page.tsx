"use client";
import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Car } from "lucide-react";
import { useStore, mockHash } from "@/lib/store";
import { AuthGate } from "@/components/AuthGate";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { cn } from "@/lib/utils";

export default function SignupPage() {
  const router = useRouter();
  const addCustomer = useStore((state) => state.addCustomer);
  const setMockUser = useStore((state) => state.setMockUser);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const inputClasses = "w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 text-sm font-normal focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 transition-all rounded-lg appearance-none";
  const labelClasses = "block text-[10px] font-bold text-muted mb-2";
  const buttonClasses = "w-full bg-yellow-400 py-3 text-sm font-bold text-black hover:bg-yellow-300 transition-all rounded-lg active:scale-95 hover:shadow-lg hover:shadow-yellow-400/20";

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (!firstName.trim() || !lastName.trim()) {
      setError("Please enter your first and last name.");
      return;
    }
    if (!email.includes("@") || !email.includes(".")) { setError("Please enter a valid email address."); return; }
    if (password.length < 4) { setError("Password must be at least 4 characters."); return; }
    if (phone.length !== 10) { setError("Please enter a valid 10-digit phone number."); return; }

    const state = useStore.getState();
    const existingCustomer = state.customers.find(c => c.email === email || c.phone === phone);
    if (existingCustomer) {
      setError("An account with this email or phone already exists.");
      return;
    }

    const fullName = `${firstName} ${lastName}`;
    const passwordHash = mockHash(password);
    const newCustomerId = `cust_${Date.now()}`;
    const newCustomer = {
      id: newCustomerId,
      name: `${firstName} ${lastName}`,
      email,
      phone,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    addCustomer(newCustomer);

    // Auto-login after signup
    const setMockUser = useStore.getState().setMockUser;
    setMockUser({
      id: newCustomerId,
      role: "CUSTOMER",
      name: `${firstName} ${lastName}`,
      email,
      phone,
    });

    // Use router after state update
    setTimeout(() => {
      window.location.href = "/customer/my-dashboard";
    }, 100);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans">
      <div className="w-full max-w-md">
        {/* Logo */}
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
            <p className="text-[10px] font-medium text-muted mt-1">Premium Car Care</p>
          </div>
        </div>

        {/* Card Container - Aceternity Style */}
        <div className="bg-zinc-900 border border-zinc-800 p-8 min-h-[520px] flex flex-col rounded-xl shadow-2xl shadow-black/50">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-ink mb-1">Join Estate</h2>
            <p className="text-xs text-body">Register to book services and manage your garage.</p>
          </div>

          <form onSubmit={(e) => { e.preventDefault(); }} className="flex-1 flex flex-col justify-center space-y-5">
            <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <div className="flex w-full flex-col space-y-2">
                <label htmlFor="firstname" className="block text-[10px] font-bold text-muted mb-2">First name</label>
                <input
                  id="firstname"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Rahul"
                  type="text"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 text-sm font-normal focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 transition-all rounded-lg appearance-none"
                />
              </div>
              <div className="flex w-full flex-col space-y-2">
                <label htmlFor="lastname" className="block text-[10px] font-bold text-muted mb-2">Last name</label>
                <input
                  id="lastname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Sharma"
                  type="text"
                  className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 text-sm font-normal focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 transition-all rounded-lg appearance-none"
                />
              </div>
            </div>

            <div className="flex w-full flex-col space-y-2 mb-4">
              <label htmlFor="email" className="block text-[10px] font-bold text-muted mb-2">Email Address</label>
              <input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
                className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 text-sm font-normal focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 transition-all rounded-lg appearance-none"
              />
            </div>

            <div className="flex w-full flex-col space-y-2 mb-4">
              <label htmlFor="phone" className="block text-[10px] font-bold text-muted mb-2">Phone Number</label>
              <input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                type="tel"
                maxLength={10}
                className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 text-sm font-normal focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 transition-all rounded-lg appearance-none"
              />
            </div>

            <div className="flex w-full flex-col space-y-2 mb-8">
              <label htmlFor="password" className="block text-[10px] font-bold text-muted mb-2">Password</label>
              <input
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                type="password"
                className="w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 text-sm font-normal focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 transition-all rounded-lg appearance-none"
              />
            </div>

            <button
              type="submit"
              className="group/btn relative block h-10 w-full rounded-md bg-gradient-to-br from-yellow-400 to-yellow-500 font-medium text-white shadow-[0px_1px_0px_0px_#ffffff40_inset,0px_-1px_0px_0px_#ffffff40_inset] dark:from-zinc-900 dark:to-zinc-900"
            >
              Sign up
              <BottomGradient />
            </button>
          </form>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

          <p className="text-center text-xs text-muted">
            Already have an account?{" "}
            <a href="/login" className="text-yellow-400 font-bold hover:underline ml-1">
              Sign in
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

const BottomGradient = () => {
  return (
    <>
      <span className="absolute inset-x-0 -bottom-px block h-px w-full bg-gradient-to-r from-transparent via-yellow-500 to-transparent opacity-0 transition duration-500 group-hover/btn:opacity-100" />
      <span className="absolute inset-x-10 -bottom-px mx-auto block h-px w-1/2 bg-gradient-to-r from-transparent via-yellow-600 to-transparent opacity-0 blur-sm transition duration-500 group-hover/btn:opacity-100" />
    </>
  );
};