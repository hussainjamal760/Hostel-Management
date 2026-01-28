'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';
import { toast } from 'react-hot-toast';
import { useLoginMutation } from '@/lib/services/authApi';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { setCredentials } from '@/lib/features/authSlice';

export default function LoginPage() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!identifier || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      const response = await login({ identifier, password }).unwrap();
      const result = response.data || response;
      
      dispatch(setCredentials({ 
        token: result.tokens.accessToken, 
        user: result.user as any,
      }));

      localStorage.setItem('refreshToken', result.tokens.refreshToken);
      
      const role = result.user.role ? result.user.role.toUpperCase() : '';

      if (result.user.isFirstLogin && role === 'STUDENT') {
        toast('Please change your password first');
        window.location.href = '/change-password';
        return;
      }

      switch (role) {
        case 'MANAGER':
          toast.success(`Welcome back, ${result.user.name}!`);
          router.push('/manager/dashboard');
          break;
        case 'OWNER':
          toast.success(`Welcome back, ${result.user.name}!`);
          router.push('/owner/dashboard');
          break;
        case 'STUDENT':
          toast.success(`Welcome back, ${result.user.name}!`);
          router.push('/student/dashboard');
          break;
        case 'CLIENT':
          toast.success(`Welcome back, ${result.user.name}!`);
          router.push('/profile');
          break;
        case 'ADMIN':
          router.push('/admin/dashboard');
          break;
        default:
          console.warn('Unknown role:', role);
          router.push('/profile');
      }
    } catch (error: any) {
      const message = error?.data?.message || error?.message || 'Login failed';
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
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-brand-text/60 dark:text-dark-text/60">
            Or {' '}
            <Link href="/signup" className="font-semibold text-brand-primary dark:text-dark-primary hover:underline">
              create a new account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="identifier" className="block text-sm font-semibold text-brand-text dark:text-dark-text mb-2">
                Email or Username
              </label>
              <div className="relative">
                <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-text/50 dark:text-dark-text/50" size={20} />
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-brand-primary/5 dark:bg-dark-primary/5 border border-brand-primary/10 dark:border-dark-primary/10 text-brand-text dark:text-dark-text placeholder:text-brand-text/50 dark:placeholder:text-dark-text/50 focus:outline-none focus:ring-2 focus:ring-brand-primary dark:focus:ring-dark-primary"
                  placeholder="Enter email or username"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
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
                  className="w-full pl-12 pr-12 py-3 rounded-xl bg-brand-primary/5 dark:bg-dark-primary/5 border border-brand-primary/10 dark:border-dark-primary/10 text-brand-text dark:text-dark-text placeholder:text-brand-text/50 dark:placeholder:text-dark-text/50 focus:outline-none focus:ring-2 focus:ring-brand-primary dark:focus:ring-dark-primary"
                  placeholder="Enter your password"
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

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 rounded border-brand-primary/30 text-brand-primary focus:ring-brand-primary"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-brand-text dark:text-dark-text">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <Link href="/forgot-password" className="font-semibold text-brand-primary dark:text-dark-primary hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 rounded-xl bg-brand-primary dark:bg-dark-primary text-white dark:text-dark-bg font-bold hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
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
