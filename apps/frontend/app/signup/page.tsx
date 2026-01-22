'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser, HiOutlinePhone, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { useSignupMutation } from '@/lib/services/authApi';
import { useAppSelector } from '@/lib/hooks';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [signup, { isLoading }] = useSignupMutation();
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const validateForm = () => {
    if (!name.trim()) {
      toast.error('Please enter your full name');
      return false;
    }
    if (!email.trim()) {
      toast.error('Please enter your email');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error('Please enter a valid email address');
      return false;
    }
    if (!phone.trim()) {
      toast.error('Please enter your phone number');
      return false;
    }
    if (!/^[\d+\-\s()]+$/.test(phone) || phone.replace(/\D/g, '').length < 10) {
      toast.error('Please enter a valid phone number');
      return false;
    }
    if (!password) {
      toast.error('Please enter a password');
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      const result = await signup({ name, email, phone, password }).unwrap();
      
      toast.success(result.message || 'Signup successful! Please verify your email.');
      
      // Store email for verification
      localStorage.setItem('pendingVerificationEmail', email);
      
      router.push('/verify-email');
    } catch (error: any) {
      const message = error?.data?.message || error?.message || 'Signup failed';
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-brand-bg dark:bg-dark-bg px-4 py-12 sm:px-6 lg:px-8 transition-colors">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="h-12 w-12 rounded-xl bg-brand-primary dark:bg-dark-primary flex items-center justify-center text-white dark:text-dark-bg font-bold text-2xl transition-transform group-hover:scale-105">
              H
            </div>
          </Link>
          <h2 className="mt-6 text-3xl font-bold tracking-tight text-brand-text dark:text-dark-text">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-brand-text/60 dark:text-dark-text/60">
            Already have an account?{' '}
            <Link href="/login" className="font-semibold text-brand-primary dark:text-dark-primary hover:underline">
              Sign in
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-brand-text dark:text-dark-text mb-2">
                Full Name
              </label>
              <div className="relative">
                <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/50 dark:text-dark-text/50" size={20} />
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-brand-primary/5 dark:bg-dark-primary/5 border border-brand-primary/10 dark:border-dark-primary/10 text-brand-text dark:text-dark-text placeholder:text-brand-text/50 dark:placeholder:text-dark-text/50 focus:outline-none focus:ring-2 focus:ring-brand-primary dark:focus:ring-dark-primary"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-brand-text dark:text-dark-text mb-2">
                Email Address
              </label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/50 dark:text-dark-text/50" size={20} />
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-brand-primary/5 dark:bg-dark-primary/5 border border-brand-primary/10 dark:border-dark-primary/10 text-brand-text dark:text-dark-text placeholder:text-brand-text/50 dark:placeholder:text-dark-text/50 focus:outline-none focus:ring-2 focus:ring-brand-primary dark:focus:ring-dark-primary"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold text-brand-text dark:text-dark-text mb-2">
                Phone Number
              </label>
              <div className="relative">
                <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/50 dark:text-dark-text/50" size={20} />
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-brand-primary/5 dark:bg-dark-primary/5 border border-brand-primary/10 dark:border-dark-primary/10 text-brand-text dark:text-dark-text placeholder:text-brand-text/50 dark:placeholder:text-dark-text/50 focus:outline-none focus:ring-2 focus:ring-brand-primary dark:focus:ring-dark-primary"
                  placeholder="Enter your phone number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-brand-text dark:text-dark-text mb-2">
                Password
              </label>
              <div className="relative">
                <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/50 dark:text-dark-text/50" size={20} />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-brand-primary/5 dark:bg-dark-primary/5 border border-brand-primary/10 dark:border-dark-primary/10 text-brand-text dark:text-dark-text placeholder:text-brand-text/50 dark:placeholder:text-dark-text/50 focus:outline-none focus:ring-2 focus:ring-brand-primary dark:focus:ring-dark-primary"
                  placeholder="Create a password (min 6 characters)"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-text/50 dark:text-dark-text/50 hover:text-brand-text dark:hover:text-dark-text"
                >
                  {showPassword ? <HiOutlineEyeOff size={20} /> : <HiOutlineEye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-brand-primary dark:bg-dark-primary text-white dark:text-dark-bg font-bold hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <div className="text-center">
          <Link href="/" className="text-sm text-brand-text/60 dark:text-dark-text/60 hover:underline">
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
