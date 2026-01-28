"use client";

import React, { useState } from "react";
import { HiX, HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlinePhone, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { useSignupMutation } from "@/lib/services/authApi";

interface SignUpProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRoute: (route: string) => void;
  setSignupEmail?: (email: string) => void;
}

const SignUp: React.FC<SignUpProps> = ({ open, setOpen, setRoute, setSignupEmail }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [signup, { isLoading }] = useSignupMutation();

  const validateForm = () => {
    if (!name.trim()) {
      toast.error("Please enter your full name");
      return false;
    }
    if (!email.trim()) {
      toast.error("Please enter your email");
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return false;
    }
    if (!phone.trim()) {
      toast.error("Please enter your phone number");
      return false;
    }
    if (!/^[\d+\-\s()]+$/.test(phone) || phone.replace(/\D/g, '').length < 10) {
      toast.error("Please enter a valid phone number");
      return false;
    }
    if (!password) {
      toast.error("Please enter a password");
      return false;
    }
    if (password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const result = await signup({ name, email, phone, password }).unwrap();
      
      toast.success(result.message || "Signup successful! Please verify your email.");
      
      if (setSignupEmail) {
        setSignupEmail(email);
      }
      localStorage.setItem('pendingVerificationEmail', email);
      
      setRoute("Verification");
    } catch (error: any) {
      const message = error?.data?.message || error?.message || "Signup failed";
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
          className="w-full max-w-md bg-[#fcf2e9] dark:bg-[#1a0f0a] rounded-3xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 flex items-center justify-between sticky top-0 bg-[#fcf2e9] dark:bg-[#1a0f0a] z-10">
            <h2 className="text-2xl font-bold text-[#2c1b13] dark:text-[#fcf2e9]">Create Account</h2>
            <button 
              onClick={() => setOpen(false)}
              className="p-2 rounded-full hover:bg-[#2c1b13]/10 dark:hover:bg-[#fcf2e9]/10 transition-colors"
            >
              <HiX size={24} className="text-[#2c1b13] dark:text-[#fcf2e9]" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">Full Name</label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c1b13]/50 dark:text-[#fcf2e9]/50" size={20} />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 text-[#2c1b13] dark:text-[#fcf2e9] placeholder:text-[#2c1b13]/50 dark:placeholder:text-[#fcf2e9]/50 focus:outline-none focus:ring-2 focus:ring-[#2c1b13] dark:focus:ring-[#fcf2e9]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">Email</label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c1b13]/50 dark:text-[#fcf2e9]/50" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 text-[#2c1b13] dark:text-[#fcf2e9] placeholder:text-[#2c1b13]/50 dark:placeholder:text-[#fcf2e9]/50 focus:outline-none focus:ring-2 focus:ring-[#2c1b13] dark:focus:ring-[#fcf2e9]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">Phone Number</label>
              <div className="relative">
                <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c1b13]/50 dark:text-[#fcf2e9]/50" size={20} />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter your phone number"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 text-[#2c1b13] dark:text-[#fcf2e9] placeholder:text-[#2c1b13]/50 dark:placeholder:text-[#fcf2e9]/50 focus:outline-none focus:ring-2 focus:ring-[#2c1b13] dark:focus:ring-[#fcf2e9]"
                  required
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c1b13]/50 dark:text-[#fcf2e9]/50" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password (min 6 characters)"
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 text-[#2c1b13] dark:text-[#fcf2e9] placeholder:text-[#2c1b13]/50 dark:placeholder:text-[#fcf2e9]/50 focus:outline-none focus:ring-2 focus:ring-[#2c1b13] dark:focus:ring-[#fcf2e9]"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#2c1b13]/50 dark:text-[#fcf2e9]/50 hover:text-[#2c1b13] dark:hover:text-[#fcf2e9]"
                >
                  {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] font-bold hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating account..." : "Create Account"}
            </button>
          </form>

          <div className="p-6 pt-0 text-center">
            <p className="text-[#2c1b13]/70 dark:text-[#fcf2e9]/70">
              Already have an account?{" "}
              <button 
                onClick={() => setRoute("Login")}
                className="font-bold text-[#2c1b13] dark:text-[#fcf2e9] hover:underline"
              >
                Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SignUp;
