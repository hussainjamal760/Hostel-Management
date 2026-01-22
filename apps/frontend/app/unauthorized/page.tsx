'use client';

import Link from 'next/link';
import { HiOutlineExclamationCircle } from 'react-icons/hi';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen bg-brand-bg dark:bg-dark-bg flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
          <HiOutlineExclamationCircle size={40} className="text-red-500" />
        </div>
        <h1 className="text-3xl font-bold text-brand-text dark:text-dark-text mb-2">
          Access Denied
        </h1>
        <p className="text-brand-text/60 dark:text-dark-text/60 mb-6 max-w-md">
          You don&apos;t have permission to access this page. Please contact an administrator if you believe this is an error.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/dashboard"
            className="px-6 py-3 rounded-xl bg-brand-primary dark:bg-dark-primary text-white dark:text-dark-bg font-semibold hover:scale-105 transition-transform"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/"
            className="px-6 py-3 rounded-xl border-2 border-brand-primary dark:border-dark-primary text-brand-primary dark:text-dark-primary font-semibold hover:scale-105 transition-transform"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
