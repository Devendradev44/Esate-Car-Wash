"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useStore, mockHash } from "@/lib/store";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function SignupPage() {
  const router = useRouter();
  const addCustomer = useStore((state) => state.addCustomer);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

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

    useStore.getState().setMockUser({
      id: newCustomerId,
      role: "CUSTOMER",
      name: fullName,
      email,
      phone,
    });

    router.push("/customer/my-dashboard");
  };

  return (
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
            <p className="text-[10px] font-medium text-muted mt-1">Premium Car Care</p>
          </div>
        </div>

        <Card className="flex min-h-[520px] flex-col rounded-xl border border-zinc-800 bg-zinc-900 py-0 shadow-2xl shadow-black/50 ring-0">
          <CardContent className="flex flex-col p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-ink mb-1">Join Estate</h2>
              <p className="text-xs text-body">Register to book services and manage your garage.</p>
            </div>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center space-y-5">
            <div className="mb-4 flex flex-col space-y-2 md:flex-row md:space-y-0 md:space-x-2">
              <div className="flex w-full flex-col space-y-2">
                <Label htmlFor="firstname" className="mb-2 block text-[10px] font-bold leading-normal text-muted">First name</Label>
                <Input
                  id="firstname"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="Rahul"
                  type="text"
                />
              </div>
              <div className="flex w-full flex-col space-y-2">
                <Label htmlFor="lastname" className="mb-2 block text-[10px] font-bold leading-normal text-muted">Last name</Label>
                <Input
                  id="lastname"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Sharma"
                  type="text"
                />
              </div>
            </div>

            <div className="flex w-full flex-col space-y-2 mb-4">
              <Label htmlFor="email" className="mb-2 block text-[10px] font-bold leading-normal text-muted">Email Address</Label>
              <Input
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                type="email"
              />
            </div>

            <div className="flex w-full flex-col space-y-2 mb-4">
              <Label htmlFor="phone" className="mb-2 block text-[10px] font-bold leading-normal text-muted">Phone Number</Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                placeholder="9876543210"
                type="tel"
                maxLength={10}
              />
            </div>

            <PasswordInput
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              label="Password"
              autoComplete="new-password"
              className="mb-8"
            />

            {error && (
              <p className="text-center text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 py-2 rounded-lg">
                {error}
              </p>
            )}

            <Button
              type="submit"
              className="h-auto w-full rounded-lg bg-yellow-400 py-3 text-sm font-bold text-black transition-all hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/20 active:scale-95"
            >
              Sign up
            </Button>
          </form>

          <div className="my-8 h-[1px] w-full bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

          <p className="text-center text-xs text-muted">
            Already have an account?{" "}
            <a href="/login" className="text-yellow-400 font-bold hover:underline ml-1">
              Sign in
            </a>
          </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}