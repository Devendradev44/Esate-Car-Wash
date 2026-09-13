"use client";
import { useState, forwardRef, useImperativeHandle } from "react";
import { Eye, EyeOff } from "lucide-react";
import { motion } from "motion/react";

interface PasswordInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  error?: string;
  disabled?: boolean;
  autoComplete?: string;
  className?: string;
}

export const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ value, onChange, placeholder = "••••••••", label, error, disabled, autoComplete = "current-password", className = "" }, ref) => {
    const [showPassword, setShowPassword] = useState(false);

    useImperativeHandle(ref, () => ({
      focus: () => inputRef.current?.focus(),
    }));

    const inputRef = useState<HTMLInputElement>(null)[0];

    const inputClasses = "w-full bg-zinc-950 border border-zinc-800 text-white px-4 py-3 text-sm font-normal focus:border-yellow-400 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 transition-all rounded-lg appearance-none";
    const labelClasses = "block text-[10px] font-bold text-zinc-500 mb-2";

    return (
      <div className={className}>
        {label && <label className={labelClasses}>{label}</label>}
        <div className="relative flex items-center">
          <input
            ref={inputRef}
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`${inputClasses} pr-12 ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={disabled}
            autoComplete={autoComplete}
            aria-invalid={error ? "true" : "false"}
          />
          <motion.button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 text-zinc-500 hover:text-yellow-400 transition-colors p-1 -ml-12"
            whileTap={{ scale: 0.9 }}
            aria-label={showPassword ? "Hide password" : "Show password"}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </motion.button>
        </div>
        {error && (
          <motion.p 
            className="mt-1 text-[10px] font-medium text-red-500" 
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.p>
        )}
      </div>
    );
  }
);

PasswordInput.displayName = "PasswordInput";