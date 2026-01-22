"use client";

import React, { useState, useRef, useEffect } from "react";
import { HiX } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { useVerifyEmailMutation } from "@/lib/services/authApi";

interface VerificationProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRoute: (route: string) => void;
}

const Verification: React.FC<VerificationProps> = ({ open, setOpen, setRoute }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [email, setEmail] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();

  useEffect(() => {
    // Get email from localStorage
    const pendingEmail = localStorage.getItem('pendingVerificationEmail');
    if (pendingEmail) {
      setEmail(pendingEmail);
    }
  }, [open]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newCode = [...code];
    for (let i = 0; i < pastedData.length; i++) {
      if (/^\d$/.test(pastedData[i])) {
        newCode[i] = pastedData[i];
      }
    }
    setCode(newCode);
    // Focus the next empty input or the last one
    const nextEmpty = newCode.findIndex(c => c === '');
    if (nextEmpty !== -1) {
      inputRefs.current[nextEmpty]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join("");
    
    if (verificationCode.length !== 6) {
      toast.error("Please enter the complete 6-digit code");
      return;
    }

    if (!email) {
      toast.error("Email not found. Please sign up again.");
      setRoute("Sign-Up");
      return;
    }

    try {
      const result = await verifyEmail({ email, code: verificationCode }).unwrap();
      
      toast.success(result.message || "Email verified successfully!");
      
      // Clear stored email
      localStorage.removeItem('pendingVerificationEmail');
      
      // Navigate to login
      setRoute("Login");
    } catch (error: any) {
      const message = error?.data?.message || error?.message || "Verification failed";
      toast.error(message);
    }
  };

  if (!open) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-[99998] bg-black/50 backdrop-blur-sm"
        onClick={() => setOpen(false)}
      />
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4">
        <div 
          className="w-full max-w-md bg-[#fcf2e9] dark:bg-[#1a0f0a] rounded-3xl shadow-2xl overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-[#2c1b13] dark:text-[#fcf2e9]">Verify Email</h2>
            <button 
              onClick={() => setOpen(false)}
              className="p-2 rounded-full hover:bg-[#2c1b13]/10 dark:hover:bg-[#fcf2e9]/10 transition-colors"
            >
              <HiX size={24} className="text-[#2c1b13] dark:text-[#fcf2e9]" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="text-center">
              <p className="text-[#2c1b13]/70 dark:text-[#fcf2e9]/70">
                We&apos;ve sent a verification code to
              </p>
              <p className="font-semibold text-[#2c1b13] dark:text-[#fcf2e9] mt-1">
                {email || "your email"}
              </p>
            </div>
            
            <div className="flex justify-center gap-2" onPaste={handlePaste}>
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value.replace(/\D/g, ''))}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold rounded-xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 text-[#2c1b13] dark:text-[#fcf2e9] focus:outline-none focus:ring-2 focus:ring-[#2c1b13] dark:focus:ring-[#fcf2e9]"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || code.join("").length !== 6}
              className="w-full py-3 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="p-6 pt-0 text-center space-y-2">
            <button 
              onClick={() => setRoute("Login")}
              className="text-[#2c1b13]/70 dark:text-[#fcf2e9]/70 hover:underline"
            >
              Back to Login
            </button>
            <p className="text-sm text-[#2c1b13]/50 dark:text-[#fcf2e9]/50">
              Didn&apos;t receive the code? Check your spam folder.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Verification;
