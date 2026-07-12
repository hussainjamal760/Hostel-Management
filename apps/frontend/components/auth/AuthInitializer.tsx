'use client';

import { useEffect } from 'react';
import { useGetMeQuery } from '@/lib/services/authApi';
import { useAppDispatch } from '@/lib/hooks';
import { setInitialized, updateUser, logout } from '@/lib/features/authSlice';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const { data, error, isLoading, isUninitialized } = useGetMeQuery();

  useEffect(() => {
    if (!isLoading && !isUninitialized) {
      if (data?.data?.user) {
        dispatch(updateUser(data.data.user as any));
      } else if (error) {
        // If /me fails, they are not authenticated. logout will clear any remaining state.
        dispatch(logout());
      }
      dispatch(setInitialized());
    }
  }, [data, error, isLoading, isUninitialized, dispatch]);

  // Show nothing or a global loader until auth state is known
  if (isLoading || isUninitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
