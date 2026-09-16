"use client";
import React from "react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Car } from "lucide-react";
import { useStore, verifyMockHash, mockHash } from "@/lib/store";
import { AuthGate } from "@/components/AuthGate";
import { PasswordInput } from "@/components/ui/PasswordInput";
import { cn } from "@/lib/utils";

enum Step { LOGIN, SIGNUP_PHONE, SIGNUP_OTP, SIGNUP_DETAILS }

export default function LoginPage() {
  const router = useRouter();
  const setMockUser = useStore((state) => state.setMockUser);
  const addCustomer = useStore((state) => state.addCustomer);

  const [step, setStep] = useState<Step>(Step.LOGIN);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(true);

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const inputClasses = "w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 text-sm font-normal focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 transition-all rounded-lg appearance-none";
  const labelClasses = "block text-[10px] font-bold text-muted mb-2";
  const buttonClasses = "w-full bg-yellow-400 py-3 text-sm font-bold text-black hover:bg-yellow-300 transition-all rounded-lg active:scale-95 hover:shadow-lg hover:shadow-yellow-400/20";

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
          <div className="bg-zinc-900 border border-zinc-800 p-8 min-h-[480px] flex flex-col rounded-xl shadow-2xl shadow-black/50">
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
                      <label className={labelClasses}>Phone Number</label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        placeholder="98765 43210"
                        className={inputClasses}
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
                      <label className="flex items-center gap-2 text-[10px] font-medium text-muted cursor-pointer">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="w-4 h-4 accent-yellow-400 border-zinc-700 rounded focus:ring-yellow-400"
                        />
                        Remember me
                      </label>
                      <button className="text-[10px] font-semibold text-muted hover:text-yellow-400 transition-colors">
                        Forgot Password?
                      </button>
                    </div>
                    <button onClick={handleLogin} className={buttonClasses}>Sign in</button>

                    <button
                      onClick={() => setStep(Step.SIGNUP_PHONE)}
                      className="w-full text-center text-xs font-semibold text-muted hover:text-yellow-400 transition-colors py-2"
                    >
                      Create new account
                    </button>
                  </div>
                )}

                {/* CUSTOMER - Signup Step 1: Phone Number */}
                {step === Step.SIGNUP_PHONE && (
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-yellow-400 text-center">Create your account</p>
                    <div>
                      <label className={labelClasses}>Phone Number</label>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
                        placeholder="98765 43210"
                        className={inputClasses}
                      />
                    </div>
                    <button onClick={handleRequestOTP} className={buttonClasses}>Get OTP</button>

                    <button
                      onClick={() => setStep(Step.LOGIN)}
                      className="w-full text-center text-xs font-semibold text-muted hover:text-yellow-400 transition-colors py-2"
                    >
                      Back to login
                    </button>
                  </div>
                )}

                {/* CUSTOMER - OTP Verification */}
                {step === Step.SIGNUP_OTP && (
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-yellow-400 text-center">Verify your phone number</p>
                    <p className="text-xs text-muted text-center">Enter the 6-digit code sent to {phone}</p>
                    <div>
                      <label className={labelClasses}>Enter OTP</label>
                      <input
                        type="text"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                        placeholder="6-digit code"
                        maxLength={6}
                        className={inputClasses + " text-center text-xl tracking-[0.5em]"}
                      />
                    </div>
                    <button onClick={handleVerifyOTP} className={buttonClasses}>Verify & Continue</button>
                    <button
                      onClick={handleBackToPhone}
                      className="w-full text-center text-xs font-semibold text-muted hover:text-yellow-400 transition-colors py-2"
                    >
                      Change phone number
                    </button>
                  </div>
                )}

                {/* CUSTOMER - Signup Step 3: Details */}
                {step === Step.SIGNUP_DETAILS && (
                  <div className="space-y-4">
                    <p className="text-xs font-bold text-yellow-400 text-center">Complete your profile</p>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className={labelClasses}>First Name</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Rahul" className={inputClasses} />
                      </div>
                      <div>
                        <label className={labelClasses}>Last Name</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Sharma" className={inputClasses} />
                      </div>
                    </div>
                    <div>
                      <label className={labelClasses}>Email</label>
                      <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className={inputClasses} />
                    </div>
                    <PasswordInput
                      value={password}
                      onChange={setPassword}
                      placeholder="••••••••"
                      label="Password"
                      autoComplete="new-password"
                    />
                    <button onClick={handleLogin} className="w-full bg-green-500 py-3 text-sm font-bold text-black hover:bg-green-400 transition-all rounded-lg active:scale-95 hover:shadow-lg hover:shadow-green-500/20">
                      Create Account
                    </button>
                    <button
                      onClick={handleBackToPhone}
                      className="w-full text-center text-xs font-semibold text-muted hover:text-yellow-400 transition-colors py-2"
                    >
                      Change phone number
                    </button>
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