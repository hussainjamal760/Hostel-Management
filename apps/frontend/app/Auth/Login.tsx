"use client";

import React, { useState } from "react";
import { HiX, HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from "react-icons/hi";
import { toast } from "react-hot-toast";
import { useLoginMutation } from "@/lib/services/authApi";
import { useDispatch } from "react-redux";
import { setCredentials } from "@/lib/features/authSlice";
import { useRouter } from "next/navigation";

interface LoginProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  setRoute: (route: string) => void;
}

const Login: React.FC<LoginProps> = ({ open, setOpen, setRoute }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const response = await login({ email, password }).unwrap();
      // API wraps response in 'data' property
      const result = response.data || response;
      
      dispatch(setCredentials({
        token: result.tokens.accessToken,
        user: result.user as any,
      }));

      // Store refresh token
      localStorage.setItem('refreshToken', result.tokens.refreshToken);
      
      toast.success(`Welcome back, ${result.user.name}!`);
      setOpen(false);
      
      // Redirect based on role
      if (result.user.role === 'ADMIN' || result.user.role === 'SUPER_ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
    } catch (error: any) {
      const message = error?.data?.message || error?.message || "Login failed";
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
            <h2 className="text-2xl font-bold text-[#2c1b13] dark:text-[#fcf2e9]">Welcome Back</h2>
            <button 
              onClick={() => setOpen(false)}
              className="p-2 rounded-full hover:bg-[#2c1b13]/10 dark:hover:bg-[#fcf2e9]/10 transition-colors"
            >
              <HiX size={24} className="text-[#2c1b13] dark:text-[#fcf2e9]" />
            </button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
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
              <label className="block text-sm font-semibold text-[#2c1b13] dark:text-[#fcf2e9] mb-2">Password</label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2c1b13]/50 dark:text-[#fcf2e9]/50" size={20} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 border border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 text-[#2c1b13] dark:text-[#fcf2e9] placeholder:text-[#2c1b13]/50 dark:placeholder:text-[#fcf2e9]/50 focus:outline-none focus:ring-2 focus:ring-[#2c1b13] dark:focus:ring-[#fcf2e9]"
                  required
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
              {isLoading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <div className="p-6 pt-0 text-center">
            <p className="text-[#2c1b13]/70 dark:text-[#fcf2e9]/70">
              Don&apos;t have an account?{" "}
              <button 
                onClick={() => setRoute("Sign-Up")}
                className="font-bold text-[#2c1b13] dark:text-[#fcf2e9] hover:underline"
              >
                Sign Up
              </button>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
