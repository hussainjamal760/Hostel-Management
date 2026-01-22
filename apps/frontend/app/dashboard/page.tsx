'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { logout } from '@/lib/features/authSlice';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      router.push('/admin/dashboard');
    }
  }, [user, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <div className="flex items-center gap-4">
              <Link href="/profile" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                My Profile
              </Link>
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">{user?.name}</span> ({user?.role})
              </span>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 p-6 text-center">
            <h2 className="text-lg font-medium text-gray-900">Welcome to Hostelite!</h2>
            <p className="mt-2 text-sm text-gray-500">
              You have successfully logged in as a <span className="font-bold">{user?.role}</span>. 
              We are currently preparing your specialized dashboard views.
            </p>
            <div className="mt-6">
              <Link href="/profile" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700">
                View My Profile
              </Link>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
