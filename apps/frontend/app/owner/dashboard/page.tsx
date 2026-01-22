'use client';

import React from 'react';
import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { logout } from '@/lib/features/authSlice';

export default function OwnerDashboardPage() {
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    if (user && user.role !== 'OWNER') {
       router.push('/unauthorized');
    }
  }, [user, router]);

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 flex flex-col p-8">
        <div className="flex justify-between items-center mb-8">
           <h1 className="text-3xl font-bold text-gray-800">Owner Dashboard</h1>
           <button onClick={handleLogout} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">Logout</button>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm">
           <h2 className="text-xl font-semibold mb-4">Welcome, {user?.name}</h2>
           <p className="text-gray-600">This is your property management dashboard.</p>
           {/* Add Owner specific features here */}
        </div>
      </div>
    </ProtectedRoute>
  );
}
