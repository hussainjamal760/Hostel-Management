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
        refreshToken: result.tokens.refreshToken,
        user: result.user as any,
      }));

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
          if (!result.user.hostelId) {
            router.push('/owner/hostel');
          } else {
            router.push('/owner/dashboard');
          }
          break;
        case 'STUDENT':
          toast.success(`Welcome back, ${result.user.name}!`);
          router.push('/student/dashboard');
          break;

        case 'ADMIN':
          router.push('/admin/dashboard');
          break;
        default:
          console.warn('Unknown role:', role);
          router.push('/owner/hostel');
      }
    } catch (error: any) {
      const message = error?.data?.message || error?.message || 'Login failed';
      toast.error(message);
    }
  };

  return (
    <div className="flex min-h-screen bg-surface">
      {/* Left Side - Image with slant */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-primary items-end pb-12 px-12 overflow-hidden rounded-r-[60px] shadow-2xl z-10">
        <div className="absolute inset-0">
          <img
            src="/images/hostel_lounge.png"
            alt="Modern Hostel Lounge"
            className="w-full h-full object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent"></div>
        </div>

        <div className="relative z-20 text-on-primary">
          <div className="mb-4">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium">Premium Experience</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Welcome to Hostelite</h1>
          <p className="text-white -fixed-variant text-lg max-w-md">
            Manage your hostels, students, and payments effortlessly with our modern management system.
          </p>

          <div className="mt-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1.5 shadow-lg">
              <img src="/logo.png" alt="Hostelite Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="font-bold">Hostelite </p>
              <p className="text-sm opacity-80">Smart Hostel Management</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 bg-surface-container-lowest">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-2 lg:hidden mb-6">
              <img src="/logo.png" alt="Hostelite Logo" className="h-12 w-auto object-contain" />
            </Link>
            <h2 className="text-4xl font-bold tracking-tight text-primary">
              Hi there,
            </h2>
            <p className="mt-2 text-lg text-on-surface-variant font-medium">
              Welcome back to Hostelite
            </p>
          </div>

          <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-5">
              <div>
                <div className="relative">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                  <input
                    id="identifier"
                    name="identifier"
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border-2 border-outline-variant text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                    placeholder="Email or Username"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <div className="relative">
                  <HiOutlineLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-surface border-2 border-outline-variant text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
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
                  className="h-4 w-4 rounded border-outline-variant text-primary focus:ring-primary"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm font-medium text-on-surface-variant">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link href="/forgot-password" className="font-bold text-secondary hover:text-primary transition-colors">
                  Forgot password?
                </Link>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-primary text-on-primary font-bold text-lg hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none"
            >
              {isLoading ? 'Signing in...' : 'Login'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-on-surface-variant font-medium">Don't have an account? </span>
            <Link href="/signup" className="font-bold text-primary hover:text-secondary transition-colors">
              Sign up
            </Link>
          </div>

          <div className="mt-8 text-center">
            <Link href="/" className="text-sm font-medium text-on-surface-variant hover:text-primary transition-colors">
              ← Back to home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
