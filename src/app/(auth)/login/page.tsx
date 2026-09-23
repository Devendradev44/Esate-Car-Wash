"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Car } from "lucide-react";
import { useStore, verifyMockHash, mockHash } from "@/lib/store";
import { AuthGate } from "@/components/AuthGate";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent } from "@/components/ui/card";

enum Step { LOGIN, SIGNUP_PHONE, SIGNUP_OTP, SIGNUP_DETAILS }

export default function LoginPage() {
  const router = useRouter();
  const setMockUser = useStore((state) => state.setMockUser);
  const addCustomer = useStore((state) => state.addCustomer);

  const [step, setStep] = useState<Step>(Step.LOGIN);
  const [, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleCustomerLogin = () => {
    setError("");

    if (phone.length !== 10) { setError("Please enter a valid 10-digit phone number."); return; }
    if (password.length < 4) { setError("Password must be at least 4 characters."); return; }

    const state = useStore.getState();
    const customer = state.customers.find(
      (c) => c.phone === phone && verifyMockHash(password, c.passwordHash)
    );

    if (!customer) {
      setError("Invalid phone number or password. No account found.");
      return;
    }

    setMockUser({
      id: customer.id,
      role: "CUSTOMER",
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
    });

    router.replace("/customer/my-dashboard");
  };

  const handleSignupDetails = () => {
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

    setMockUser({
      id: newCustomerId,
      role: "CUSTOMER",
      name: fullName,
      email,
      phone,
    });

    router.replace("/customer/my-dashboard");
  };

  const handleLogin = () => {
    setError("");

    if (step === Step.SIGNUP_DETAILS) {
      handleSignupDetails();
      return;
    }

    handleCustomerLogin();
  };

  const handleRequestOTP = () => {
    setError("");
    if (phone.length !== 10) { setError("Please enter a valid 10-digit phone number."); return; }

    setStep(Step.SIGNUP_OTP);
  };

  const handleVerifyOTP = () => {
    setError("");
    if (otp.length !== 6) { setError("Please enter the 6-digit OTP."); return; }

    if (otp !== "123456") {
      setError("Invalid OTP. Use 123456 for demo.");
      return;
    }

    setStep(Step.SIGNUP_DETAILS);
  };

  const handleBackToPhone = () => {
    setError("");
    setStep(Step.SIGNUP_PHONE);
    setOtp("");
  };

  return (
    <AuthGate>
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 font-sans">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="mb-8 flex flex-row items-center justify-center gap-3">
            <div className="bg-yellow-400 p-2 rounded-lg">
              <Car size={24} className="text-black" />
            </div>
            <div className="text-left">
              <h1 className="text-lg font-bold text-ink leading-none">Estate Car Spa</h1>
              <p className="text-[10px] font-medium text-muted mt-1">Premium Car Care</p>
            </div>
          </div>

          {/* Card Container - Aceternity Style */}
          <Card className="flex min-h-[480px] flex-col rounded-xl border border-zinc-800 bg-zinc-900 py-0 shadow-2xl shadow-black/50 ring-0">
            <CardContent className="flex flex-1 flex-col p-8">
              <div className="mb-6">
              <h2 className="text-2xl font-bold text-ink mb-1">Sign in</h2>
              <p className="text-xs text-body">Welcome back. Access your car spa portal.</p>
            </div>

            {/* FORM AREA */}
            <div className="flex-1 flex flex-col justify-center">
              <div key={step} className="animate-fade-in-up space-y-4">

                {/* CUSTOMER - Phone + Password Login */}
                {step === Step.LOGIN && (
                  <div className="space-y-4">
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
                  <PasswordInput
                    value={password}
                    onChange={setPassword}
                    placeholder="••••••••"
                    label="Password"
                    autoComplete="current-password"
                  />
                  <div className="flex items-center justify-between mt-1 mb-2">
                    <Label className="flex cursor-pointer items-center gap-2 text-[10px] font-medium text-muted">
                      <Checkbox
                        checked={rememberMe}
                        onCheckedChange={(c) => setRememberMe(c)}
                        className="h-4 w-4 rounded border-zinc-700 accent-yellow-400 focus:ring-yellow-400"
                      />
                      Remember me
                    </Label>
                    <Button
                      variant="ghost"
                      className="h-auto rounded-lg px-0 text-[10px] font-semibold text-muted transition-colors hover:bg-transparent hover:text-yellow-400"
                    >
                      Forgot Password?
                    </Button>
                  </div>
                  <Button onClick={handleLogin} className="h-auto w-full rounded-lg bg-yellow-400 py-3 text-sm font-bold text-black transition-all hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/20 active:scale-95">
                    Sign in
                  </Button>

                    <Button
                      variant="ghost"
                      onClick={() => setStep(Step.SIGNUP_PHONE)}
                      className="h-auto w-full rounded-lg px-2 py-2 text-center text-xs font-semibold text-muted transition-colors hover:bg-transparent hover:text-yellow-400"
                    >
                      Create new account
                    </Button>
                  </div>
                )}

                {/* CUSTOMER - Signup Step 1: Phone Number */}
                {step === Step.SIGNUP_PHONE && (
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-yellow-400 text-center">Create your account</p>
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
                  <Button onClick={handleRequestOTP} className="h-auto w-full rounded-lg bg-yellow-400 py-3 text-sm font-bold text-black transition-all hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/20 active:scale-95">
                    Get OTP
                  </Button>

                    <Button
                      variant="ghost"
                      onClick={() => setStep(Step.LOGIN)}
                      className="h-auto w-full rounded-lg px-2 py-2 text-center text-xs font-semibold text-muted transition-colors hover:bg-transparent hover:text-yellow-400"
                    >
                      Back to login
                    </Button>
                  </div>
                )}

                {/* CUSTOMER - OTP Verification */}
                {step === Step.SIGNUP_OTP && (
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-yellow-400 text-center">Verify your phone number</p>
                    <p className="text-xs text-muted text-center">Enter the 6-digit code sent to {phone}</p>
<div>
                    <Label className="mb-2 block text-[10px] font-bold leading-normal text-muted">Enter OTP</Label>
                    <Input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                      placeholder="6-digit code"
                      maxLength={6}
                      className="text-center text-xl tracking-[0.5em]"
                    />
                  </div>
                  <Button onClick={handleVerifyOTP} className="h-auto w-full rounded-lg bg-yellow-400 py-3 text-sm font-bold text-black transition-all hover:bg-yellow-300 hover:shadow-lg hover:shadow-yellow-400/20 active:scale-95">
                    Verify & Continue
                  </Button>
                    <Button
                      variant="ghost"
                      onClick={handleBackToPhone}
                      className="h-auto w-full rounded-lg px-2 py-2 text-center text-xs font-semibold text-muted transition-colors hover:bg-transparent hover:text-yellow-400"
                    >
                      Change phone number
                    </Button>
                  </div>
                )}

                {/* CUSTOMER - Signup Step 3: Details */}
                {step === Step.SIGNUP_DETAILS && (
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-yellow-400 text-center">Complete your profile</p>
<div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="mb-2 block text-[10px] font-bold leading-normal text-muted">First Name</Label>
                        <Input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Rahul" />
                      </div>
                      <div>
                        <Label className="mb-2 block text-[10px] font-bold leading-normal text-muted">Last Name</Label>
                        <Input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Sharma" />
                      </div>
                    </div>
                    <div>
                      <Label className="mb-2 block text-[10px] font-bold leading-normal text-muted">Email</Label>
                      <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                    </div>
                    <PasswordInput
                      value={password}
                      onChange={setPassword}
                      placeholder="••••••••"
                      label="Password"
                      autoComplete="new-password"
                    />
                    <Button onClick={handleLogin} className="h-auto w-full rounded-lg bg-green-500 py-3 text-sm font-bold text-black transition-all hover:bg-green-400 hover:shadow-lg hover:shadow-green-500/20 active:scale-95">
                      Create Account
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={handleBackToPhone}
                      className="h-auto w-full rounded-lg px-2 py-2 text-center text-xs font-semibold text-muted transition-colors hover:bg-transparent hover:text-yellow-400"
                    >
                      Change phone number
                    </Button>
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