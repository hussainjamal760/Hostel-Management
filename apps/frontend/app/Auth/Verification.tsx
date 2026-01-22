"use client";

import React, { useState, useRef } from "react";
import { HiX } from "react-icons/hi";

interface VerificationProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRoute: (route: string) => void;
}

const Verification: React.FC<VerificationProps> = ({ open, setOpen, setRoute }) => {
  const [code, setCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join("");
    if (verificationCode.length !== 6) return;
    
    setIsLoading(true);
    // TODO: Implement verification logic
    setTimeout(() => {
      setIsLoading(false);
      setOpen(false);
      setRoute("Login");
    }, 1000);
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
            <p className="text-center text-[#2c1b13]/70 dark:text-[#fcf2e9]/70">
              We&apos;ve sent a verification code to your email. Please enter it below.
            </p>
            
            <div className="flex justify-center gap-2">
              {code.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-12 h-14 text-center text-2xl font-bold rounded-xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 text-[#2c1b13] dark:text-[#fcf2e9] focus:outline-none focus:ring-2 focus:ring-[#2c1b13] dark:focus:ring-[#fcf2e9]"
                />
              ))}
            </div>

            <button
              type="submit"
              disabled={isLoading || code.join("").length !== 6}
              className="w-full py-3 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Verify Email"}
            </button>
          </form>

          <div className="p-6 pt-0 text-center">
            <button 
              onClick={() => setRoute("Login")}
              className="text-[#2c1b13]/70 dark:text-[#fcf2e9]/70 hover:underline"
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Verification;
