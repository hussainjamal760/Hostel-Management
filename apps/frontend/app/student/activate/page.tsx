'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import { useActivateStudentMutation, useVerifyActivationTokenQuery } from '@/lib/services/authApi';
import Link from 'next/link';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';

const schema = z.object({
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof schema>;

export default function ActivateStudentPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { data: verifyData, isLoading: isVerifying, error: verifyError } = useVerifyActivationTokenQuery(token as string, {
    skip: !token
  });

  const [activateStudent, { isLoading }] = useActivateStudentMutation();

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    if (!token) {
      toast.error('Invalid or missing activation token.');
    }
  }, [token]);

  const onSubmit = async (data: FormData) => {
    if (!token) {
      toast.error('No activation token found.');
      return;
    }

    try {
      await activateStudent({ token, password: data.password }).unwrap();
      toast.success('Account activated successfully! You can now log in.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.data?.message || 'Failed to activate account. The link might be expired.');
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest p-4">
        <div className="bg-surface p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-error-container rounded-full flex items-center justify-center mx-auto text-error">
            <span className="material-symbols-outlined text-[40px]">error</span>
          </div>
          <h2 className="text-display-sm text-error">Invalid Link</h2>
          <p className="text-on-surface-variant">
            This activation link is missing or invalid. Please check your email or request a new link from your manager.
          </p>
          <Link href="/login" className="block w-full py-4 bg-primary text-on-primary font-bold rounded-xl hover:bg-on-primary-fixed-variant transition-colors">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  if (isVerifying) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-surface-container-lowest p-4">
         <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
         <p className="text-on-surface-variant font-bold text-lg animate-pulse">Verifying secure link...</p>
      </div>
    );
  }

  if (verifyError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest p-4">
        <div className="bg-surface p-8 rounded-3xl shadow-xl max-w-md w-full text-center space-y-6">
          <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center mx-auto text-primary shadow-inner">
            <span className="material-symbols-outlined text-[40px]">check_circle</span>
          </div>
          <h2 className="text-display-sm text-primary">Account Activated</h2>
          <p className="text-on-surface-variant">
            This account has already been activated, or the link has expired. If you've already set your password, you can head straight to login.
          </p>
          <Link href="/login" className="block w-full py-4 bg-primary text-on-primary font-bold rounded-xl hover:bg-on-primary-fixed-variant transition-colors shadow-lg shadow-primary/20 hover:-translate-y-1">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-surface-container-lowest p-4 relative overflow-hidden">
      {/* Background blobs for premium feel */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/20 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 z-0" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-tertiary/20 rounded-full blur-[120px] translate-x-1/3 translate-y-1/3 z-0" />

      <div className="bg-surface p-8 rounded-3xl shadow-2xl max-w-md w-full relative z-10 border border-outline-variant/50">
        <div className="text-center mb-10">
          <div className="w-20 h-20 bg-primary-container rounded-full flex items-center justify-center mx-auto text-primary mb-6 shadow-inner">
            <span className="material-symbols-outlined text-[40px]">vpn_key</span>
          </div>
          <h1 className="text-display-md text-primary font-bold">Activate Account</h1>
          <p className="text-body-lg text-on-surface-variant mt-2">Set up your password to securely access your student portal.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-2 relative">
            <label className="text-label-md font-bold uppercase text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">lock</span>
              New Password
            </label>
            <div className="relative">
                <input
                    type={showPassword ? "text" : "password"}
                    {...register('password')}
                    placeholder="Enter your new password"
                    className={`w-full pl-4 pr-12 py-4 rounded-xl bg-background border transition-all outline-none focus:ring-2 focus:ring-primary focus:border-primary text-primary font-bold ${errors.password ? 'border-error ring-error/20' : 'border-outline-variant hover:border-outline'}`}
                />
                <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                    {showPassword ? <MdVisibilityOff size={24} /> : <MdVisibility size={24} />}
                </button>
            </div>
            {errors.password && <p className="text-xs text-error flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>{errors.password.message}</p>}
          </div>

          <div className="space-y-2 relative">
            <label className="text-label-md font-bold uppercase text-on-surface-variant flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">lock_reset</span>
              Confirm Password
            </label>
            <div className="relative">
                <input
                    type={showConfirmPassword ? "text" : "password"}
                    {...register('confirmPassword')}
                    placeholder="Confirm your new password"
                    className={`w-full pl-4 pr-12 py-4 rounded-xl bg-background border transition-all outline-none focus:ring-2 focus:ring-primary focus:border-primary text-primary font-bold ${errors.confirmPassword ? 'border-error ring-error/20' : 'border-outline-variant hover:border-outline'}`}
                />
                <button 
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-on-surface-variant hover:text-primary transition-colors"
                >
                    {showConfirmPassword ? <MdVisibilityOff size={24} /> : <MdVisibility size={24} />}
                </button>
            </div>
            {errors.confirmPassword && <p className="text-xs text-error flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">error</span>{errors.confirmPassword.message}</p>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 mt-8 bg-primary text-on-primary font-bold rounded-xl hover:bg-on-primary-fixed-variant hover:-translate-y-1 transition-all shadow-lg shadow-primary/30 disabled:opacity-50 disabled:hover:translate-y-0 text-lg flex items-center justify-center gap-2"
          >
            {isLoading ? (
                <>
                    <div className="w-6 h-6 border-2 border-on-primary border-t-transparent rounded-full animate-spin"></div>
                    Activating...
                </>
            ) : (
                <>
                    <span className="material-symbols-outlined">how_to_reg</span>
                    Activate Account
                </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
