'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { logout } from '@/lib/features/authSlice';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();

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
              <span className="text-sm text-gray-600">
                Welcome, <span className="font-semibold">{user?.username}</span> ({user?.role})
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
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
