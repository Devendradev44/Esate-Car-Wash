"use client";

import { useState } from "react";
import { ArrowRight, User, Phone, Shield, Lock } from "lucide-react";

enum Role { CUSTOMER = "CUSTOMER", STAFF = "STAFF", ADMIN = "ADMIN" }
enum Step { LOGIN, OTP, SIGNUP }

export default function LoginPage() {
  const [role, setRole] = useState<Role>(Role.CUSTOMER);
  const [step, setStep] = useState<Step>(Step.LOGIN);

  // Form States
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const inputClasses = "w-full bg-surface-card border border-hairline text-ink p-4 text-sm font-light focus:border-m-blue-dark focus:outline-none transition-colors appearance-none";
  const labelClasses = "block text-xs font-bold uppercase tracking-machined text-muted mb-3";

  const handleRequestOTP = () => {
    // Backend will send OTP via MSG91/Twilio
    alert(`OTP Sent to ${phone}! (Mocked)`);
    setStep(Step.OTP);
  };

  const handleVerifyOTP = () => {
    // If new user, Better Auth creates User, then we need CustomerProfile (firstName/lastName)
    alert(`OTP Verified! Is new user? -> Go to Signup Step. (Mocked)`);
    setStep(Step.SIGNUP); // Force signup step for UI demo
  };

  const handleLogin = () => {
    alert(`Logged in as ${role}! Redirecting... (Mocked)`);
  };

  return (
    <div className="w-full max-w-sm">
      {/* Logo */}
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-bold tracking-machined text-ink">ESTATE</h1>
        <p className="text-sm font-bold tracking-machined text-body">CAR WASH</p>
      </div>

      {/* Role Tabs (Industrial BMW style) */}
      <div className="mb-8 flex border-b border-hairline">
        {[
          { role: Role.CUSTOMER, icon: Phone, label: "Customer" },
          { role: Role.STAFF, icon: User, label: "Staff" },
          { role: Role.ADMIN, icon: Shield, label: "Admin" }
        ].map(tab => (
          <button 
            key={tab.role}
            onClick={() => { setRole(tab.role); setStep(Step.LOGIN); }}
            className={`flex-1 flex items-center justify-center gap-2 pb-3 text-xs font-bold uppercase tracking-machined transition-colors ${
              role === tab.role ? "text-ink border-b-2 border-m-blue-dark" : "text-muted hover:text-body"
            }`}
          >
            <tab.icon size={14} /> {tab.label}
          </button>
        ))}
      </div>

      {/* FORM AREA - Conditionally renders based on Role and Step */}
      
      {/* CUSTOMER: Phone -> OTP -> Signup (if new) */}
      {role === Role.CUSTOMER && step === Step.LOGIN && (
        <div>
          <label className={labelClasses}>Phone Number</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className={inputClasses} />
          <button onClick={handleRequestOTP} className="mt-6 flex w-full items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light">
            Get OTP <ArrowRight size={14} />
          </button>
        </div>
      )}

      {role === Role.CUSTOMER && step === Step.OTP && (
        <div>
          <label className={labelClasses}>Enter OTP</label>
          <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="6-digit code" maxLength={6} className={inputClasses + " text-center text-xl tracking-[0.5em]"} />
          <button onClick={handleVerifyOTP} className="mt-6 flex w-full items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light">
            Verify & Continue <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* Customer Profile Creation (Schema requires firstName & lastName!) */}
      {role === Role.CUSTOMER && step === Step.SIGNUP && (
        <div>
          <label className="block text-xs font-bold uppercase tracking-machined text-m-blue-dark mb-4">Complete Your Profile</label>
          <div className="mb-4">
            <label className={labelClasses}>First Name</label>
            <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Rahul" className={inputClasses} />
          </div>
          <div className="mb-4">
            <label className={labelClasses}>Last Name</label>
            <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Sharma" className={inputClasses} />
          </div>
          <button onClick={handleLogin} className="mt-6 flex w-full items-center justify-center gap-2 bg-success py-4 text-xs font-bold uppercase tracking-machined text-ink">
            Start Booking <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* STAFF: Phone + PIN */}
      {role === Role.STAFF && (
        <div>
          <label className={labelClasses}>Phone Number</label>
          <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+91 98765 43210" className={inputClasses + " mb-4"} />
          <label className={labelClasses}>4-Digit PIN</label>
          <input type="password" value={pin} onChange={(e) => setPin(e.target.value)} placeholder="****" maxLength={4} className={inputClasses + " text-center text-xl tracking-[0.5em]"} />
          <button onClick={handleLogin} className="mt-6 flex w-full items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light">
            Login <Lock size={14} />
          </button>
        </div>
      )}

      {/* ADMIN: Email + Password */}
      {role === Role.ADMIN && (
        <div>
          <label className={labelClasses}>Email Address</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@estatecarwash.com" className={inputClasses + " mb-4"} />
          <label className={labelClasses}>Password</label>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClasses} />
          <button onClick={handleLogin} className="mt-6 flex w-full items-center justify-center gap-2 bg-m-blue-dark py-4 text-xs font-bold uppercase tracking-machined text-ink hover:bg-m-blue-light">
            Login <Lock size={14} />
          </button>
        </div>
      )}
    </div>
  );
}