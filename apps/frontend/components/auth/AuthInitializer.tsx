'use client';

import { useEffect, useState } from 'react';
import { useGetMeQuery } from '@/lib/services/authApi';
import { useAppDispatch } from '@/lib/hooks';
import { setInitialized, updateUser, setCredentials, logout } from '@/lib/features/authSlice';
import { skipToken } from '@reduxjs/toolkit/query';

export default function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [hasRestored, setHasRestored] = useState(false);

  useEffect(() => {
    if (!hasRestored) {
      if (typeof window !== 'undefined') {
        const storedToken = localStorage.getItem('token');
        const storedRefreshToken = localStorage.getItem('refreshToken');
        const storedUser = localStorage.getItem('user');
        
        if (storedToken && storedUser) {
          try {
            dispatch(setCredentials({
              token: storedToken,
              refreshToken: storedRefreshToken || undefined,
              user: JSON.parse(storedUser)
            }));
          } catch (err) {
             // Invalid JSON in localStorage
             localStorage.removeItem('user');
          }
        }
      }
      setHasRestored(true);
    }
  }, [dispatch, hasRestored]);

  // Only run getMeQuery AFTER we've checked localStorage
  const { data, error, isLoading, isUninitialized } = useGetMeQuery(hasRestored ? undefined : skipToken);

  useEffect(() => {
    if (hasRestored && !isLoading && !isUninitialized) {
      if (data?.data?.user) {
        dispatch(updateUser(data.data.user as any));
      } else if (error) {
        dispatch(logout());
      }
      dispatch(setInitialized());
    }
  }, [data, error, isLoading, isUninitialized, dispatch, hasRestored]);

  if (!hasRestored || isLoading || isUninitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return <>{children}</>;
}
