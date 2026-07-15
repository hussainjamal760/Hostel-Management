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
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      if (!user?.role) {
        router.push('/owner/hostel');
        return;
      }
      const role = user.role.toUpperCase();
      if (role === 'ADMIN') router.push('/admin/dashboard');
      else if (role === 'MANAGER') router.push('/manager/dashboard');
      else if (role === 'OWNER') router.push('/owner/dashboard');
      else if (role === 'STUDENT') router.push('/student/dashboard');
      else router.push('/owner/hostel');
    }
  }, [isAuthenticated, user, router]);

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
      
      localStorage.setItem('pendingVerificationEmail', email);
      
      router.push('/verify-email');
    } catch (error: any) {
      const message = error?.data?.message || error?.message || 'Signup failed';
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
            <span className="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-sm font-medium">Join Our Community</span>
          </div>
          <h1 className="text-4xl font-bold mb-4">Hostelite Manager</h1>
          <p className="text-on-primary-fixed-variant text-lg max-w-md">
            The easiest way to manage your hostel business, track payments, and communicate with students.
          </p>
          
          <div className="mt-8 flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center p-1.5 shadow-lg">
              <img src="/logo.png" alt="Hostelite Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <p className="font-bold">Hostelite Admin</p>
              <p className="text-sm opacity-80">Property Management</p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Form */}
      <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-12 bg-surface-container-lowest py-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <Link href="/" className="inline-flex items-center gap-2 lg:hidden mb-6">
              <img src="/logo.png" alt="Hostelite Logo" className="h-12 w-auto object-contain" />
            </Link>
            <h2 className="text-4xl font-bold tracking-tight text-primary">
              Create an account
            </h2>
            <p className="mt-2 text-lg text-on-surface-variant font-medium">
              Start managing your hostel today
            </p>
          </div>
          
          <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <div className="relative">
                  <HiOutlineUser className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border-2 border-outline-variant text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <HiOutlineMail className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border-2 border-outline-variant text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <HiOutlinePhone className="absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant" size={20} />
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    className="w-full pl-12 pr-4 py-4 rounded-2xl bg-surface border-2 border-outline-variant text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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
                    minLength={6}
                    className="w-full pl-12 pr-12 py-4 rounded-2xl bg-surface border-2 border-outline-variant text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                    placeholder="Create a password"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-2xl bg-primary text-on-primary font-bold text-lg hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/30 active:translate-y-0 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none mt-4"
            >
              {isLoading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-on-surface-variant font-medium">Already have an account? </span>
            <Link href="/login" className="font-bold text-primary hover:text-secondary transition-colors">
              Sign in
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
