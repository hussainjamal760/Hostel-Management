'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useVerifyEmailMutation } from '@/lib/services/authApi';

function VerifyEmailForm() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [email, setEmail] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [verifyEmail, { isLoading }] = useVerifyEmailMutation();
  const router = useRouter();

  useEffect(() => {
    const pendingEmail = localStorage.getItem('pendingVerificationEmail');
    if (pendingEmail) {
      setEmail(pendingEmail);
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return;
    
    const newCode = [...code];
    newCode[index] = value.replace(/\D/g, '');
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
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
    const nextEmpty = newCode.findIndex(c => c === '');
    if (nextEmpty !== -1) {
      inputRefs.current[nextEmpty]?.focus();
    } else {
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const verificationCode = code.join('');
    
    if (verificationCode.length !== 6) {
      toast.error('Please enter the complete 6-digit code');
      return;
    }

    if (!email) {
      toast.error('Email not found. Please sign up again.');
      router.push('/signup');
      return;
    }

    try {
      const result = await verifyEmail({ email, code: verificationCode }).unwrap();
      
      toast.success(result.message || 'Email verified successfully!');
      localStorage.removeItem('pendingVerificationEmail');
      
      router.push('/login');
    } catch (error: any) {
      const message = error?.data?.message || error?.message || 'Verification failed';
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
            Verify your email
          </h2>
          <p className="mt-2 text-sm text-brand-text/60 dark:text-dark-text/60">
            We sent a 6-digit verification code to
          </p>
          <p className="font-semibold text-brand-text dark:text-dark-text">
            {email || 'your email'}
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="flex justify-center gap-2" onPaste={handlePaste}>
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
                className="w-12 h-14 text-center text-2xl font-bold rounded-xl bg-brand-primary/5 dark:bg-dark-primary/5 border border-brand-primary/10 dark:border-dark-primary/10 text-brand-text dark:text-dark-text focus:outline-none focus:ring-2 focus:ring-brand-primary dark:focus:ring-dark-primary"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading || code.join('').length !== 6}
            className="w-full py-3 rounded-xl bg-brand-primary dark:bg-dark-primary text-white dark:text-dark-bg font-bold hover:scale-[1.02] active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
          >
            {isLoading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="text-center space-y-2">
          <Link href="/login" className="text-sm text-brand-primary dark:text-dark-primary hover:underline block">
            ← Back to Login
          </Link>
          <p className="text-xs text-brand-text/50 dark:text-dark-text/50">
            Didn&apos;t receive the code? Check your spam folder.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-brand-bg dark:bg-dark-bg">
        <div className="text-brand-text dark:text-dark-text">Loading...</div>
      </div>
    }>
      <VerifyEmailForm />
    </Suspense>
  );
}
