'use client';

import ProtectedRoute from '@/components/auth/ProtectedRoute';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { logout } from '@/lib/features/authSlice';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
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
            <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
            <div className="flex items-center gap-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
              >
                Dashboard
              </button>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-red-600 hover:text-red-500 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          <div className="bg-white shadow rounded-lg border border-gray-200 overflow-hidden">
            <div className="px-6 py-5 bg-indigo-600 flex items-center gap-6">
              <div className="h-20 w-20 rounded-full bg-white flex items-center justify-center text-3xl font-bold text-indigo-600 border-4 border-indigo-400">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div className="text-white">
                <h2 className="text-2xl font-bold">{user?.name}</h2>
                <p className="text-indigo-100">{user?.email}</p>
              </div>
            </div>
            
            <div className="px-6 py-6 space-y-6">
              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-500">Role</label>
                  <p className="mt-1 text-sm text-gray-900 font-semibold">{user?.role}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">Phone</label>
                  <p className="mt-1 text-sm text-gray-900 font-semibold">{user?.phone || 'N/A'}</p>
                </div>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">Hostel Management</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Are you a hostel owner? You can request to add your hostel to our platform.
                </p>
                <div className="mt-4">
                  <button 
                    onClick={() => alert('Hostel request system coming soon!')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Request for Add Hostel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
