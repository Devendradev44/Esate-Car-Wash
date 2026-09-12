"use client";
import { useState } from "react";
import Link from "next/link";
import { Car } from "lucide-react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";
import { AuthGate } from "@/components/AuthGate";

enum Role { CUSTOMER = "CUSTOMER", STAFF = "STAFF", ADMIN = "ADMIN" }
enum Step { LOGIN, OTP, SIGNUP }

export default function LoginPage() {
  const router = useRouter();
  const setMockUser = useStore((state) => state.setMockUser);

  const [role, setRole] = useState<Role>(Role.CUSTOMER);
  const [step, setStep] = useState<Step>(Step.LOGIN);
  const [error, setError] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [pin, setPin] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");

  const inputClasses = "w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 text-sm font-normal focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 transition-all rounded-lg appearance-none";
  const labelClasses = "block text-[10px] font-bold text-zinc-500 mb-2";
  const buttonClasses = "w-full bg-yellow-400 py-3 text-sm font-bold text-black hover:bg-yellow-300 transition-all rounded-lg active:scale-95 hover:shadow-lg hover:shadow-yellow-400/20";

  const handleLogin = () => {
    setError("");

    if (role === Role.CUSTOMER) {
      if (step === Step.SIGNUP && (!firstName.trim() || !lastName.trim())) {
        setError("Please enter your first and last name."); return;
      }
    } else if (role === Role.STAFF) {
      if (phone.length !== 10) { setError("Please enter a valid 10-digit phone number."); return; }
      if (pin.length !== 4) { setError("Please enter a valid 4-digit PIN."); return; }
    } else if (role === Role.ADMIN) {
      if (!email.includes("@") || !email.includes(".")) { setError("Please enter a valid email address."); return; }
      if (password.length < 4) { setError("Password must be at least 4 characters."); return; }
    }

    setMockUser({
      id: "mock_123",
      role,
      name: role === "ADMIN" ? "Admin User" : role === "STAFF" ? "Staff User" : (firstName || "Customer User"),
      email: role === "ADMIN" ? email : "",
      phone: role !== "ADMIN" ? phone : "",
    });

    if (role === "ADMIN") router.replace("/dashboard");
    else if (role === "STAFF") router.replace("/staff/staff-dashboard");
    else router.replace("/customer/my-dashboard");
  };

  const handleRequestOTP = () => {
    setError("");
    if (phone.length !== 10) { setError("Please enter a valid 10-digit phone number."); return; }
    setStep(Step.OTP);
  };

  const handleVerifyOTP = () => {
    setError("");
    if (otp.length !== 6) { setError("Please enter the 6-digit OTP."); return; }
    setStep(Step.SIGNUP);
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
            <h1 className="text-lg font-bold text-white leading-none">Estate Car Spa</h1>
            <p className="text-[10px] font-medium text-zinc-500 mt-1">Premium Car Care</p>
          </div>
        </div>

        {/* Card Container */}
        <div className="bg-zinc-900 border border-zinc-800 p-8 min-h-[480px] flex flex-col rounded-xl shadow-2xl shadow-black/50">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-white mb-1">Sign in</h2>
            <p className="text-xs text-zinc-400">Welcome back. Access your car spa portal.</p>
          </div>

          {/* Role Tabs */}
          <div className="mb-6 flex border-b border-zinc-800">
            {[
              { role: Role.CUSTOMER, label: "Customer" },
              { role: Role.STAFF, label: "Staff" },
              { role: Role.ADMIN, label: "Admin" }
            ].map(tab => (
              <button 
                key={tab.role}
                onClick={() => { setRole(tab.role); setStep(Step.LOGIN); setError(""); }}
                className={`flex-1 pb-3 text-xs font-semibold transition-colors ${
                  role === tab.role ? "text-yellow-400 border-b-2 border-yellow-400" : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* FORM AREA */}
          <div className="flex-1 flex flex-col justify-center">
            <div key={`${role}-${step}`} className="animate-fade-in-up">
              {role === Role.CUSTOMER && step === Step.LOGIN && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClasses}>Phone Number</label>
                    <input type="tel" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="98765 43210" className={inputClasses} />
                  </div>
                  <button onClick={handleRequestOTP} className={buttonClasses}>Get OTP</button>
                </div>
              )}

              {role === Role.CUSTOMER && step === Step.OTP && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClasses}>Enter OTP</label>
                    <input type="text" value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} placeholder="6-digit code" maxLength={6} className={inputClasses + " text-center text-xl tracking-[0.5em]"} />
                  </div>
                  <button onClick={handleVerifyOTP} className={buttonClasses}>Verify & Continue</button>
                </div>
              )}

              {role === Role.CUSTOMER && step === Step.SIGNUP && (
                <div className="space-y-4">
                  <p className="text-xs font-bold text-yellow-400 text-center">Complete Your Profile</p>
                  <div>
                    <label className={labelClasses}>First Name</label>
                    <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} placeholder="Rahul" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Last Name</label>
                    <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} placeholder="Sharma" className={inputClasses} />
                  </div>
                  <button onClick={handleLogin} className="w-full bg-green-500 py-3 text-sm font-bold text-black hover:bg-green-400 transition-all rounded-lg active:scale-95 hover:shadow-lg hover:shadow-green-500/20">
                    Start Booking
                  </button>
                </div>
              )}

              {role === Role.STAFF && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClasses}>Phone Number</label>
                    <input type="tel" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} placeholder="98765 43210" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>4-Digit PIN</label>
                    <input type="password" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} placeholder="****" maxLength={4} className={inputClasses + " text-center text-xl tracking-[0.5em]"} />
                  </div>
                  <button onClick={handleLogin} className={buttonClasses}>Login</button>
                </div>
              )}

              {role === Role.ADMIN && (
                <div className="space-y-4">
                  <div>
                    <label className={labelClasses}>Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@estatecarspa.com" className={inputClasses} />
                  </div>
                  <div>
                    <label className={labelClasses}>Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className={inputClasses} />
                  </div>
                  <div className="text-right mt-1 mb-1">
                    <button className="text-[10px] font-semibold text-zinc-500 hover:text-yellow-400 transition-colors">
                      Forgot Password?
                    </button>
                  </div>
                  <button onClick={handleLogin} className={buttonClasses}>Sign in</button>
                </div>
              )}
            </div>
          </div>
          
          {/* Error Display */}
          {error && (
            <div className="mt-4 text-center text-xs font-semibold text-red-500 bg-red-500/10 border border-red-500/20 py-2 rounded-lg">
              {error}
            </div>
          )}
        </div>

        <p className="mt-8 text-center text-xs text-zinc-500">
          No account? <Link href="/signup" className="text-yellow-400 font-bold hover:underline">Create one</Link>
        </p>
        </div>
      </div>
    </AuthGate>
  );
}
