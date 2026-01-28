'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useChangePasswordMutation } from '@/lib/services/authApi';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { logout } from '@/lib/features/authSlice';
import { toast } from 'react-hot-toast';
import { HiOutlineLockClosed, HiOutlineEye, HiOutlineEyeOff } from 'react-icons/hi';

export default function ChangePasswordPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const toggleShowPassword = (field: 'current' | 'new' | 'confirm') => {
    setShowPassword({
      ...showPassword,
      [field]: !showPassword[field],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    try {
      await changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
        confirmPassword: passwordData.confirmPassword,
      }).unwrap();

      toast.success('Password changed successfully. Please login again.');
      
      // Logout and redirect to login
      dispatch(logout());
      router.push('/login');
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to change password');
    }
  };

  const isFirstLogin = user?.isFirstLogin;

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-dark-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
            <div className="h-12 w-12 rounded-xl bg-brand-primary dark:bg-dark-primary flex items-center justify-center text-white dark:text-dark-bg font-bold text-2xl">
              H
            </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-brand-text dark:text-dark-text">
          {isFirstLogin ? 'Set New Password' : 'Change Password'}
        </h2>
        {isFirstLogin && (
          <p className="mt-2 text-center text-sm text-brand-text/60 dark:text-dark-text/60">
            For security reasons, you must update your password before proceeding.
          </p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow rounded-lg sm:px-10 border border-gray-100 dark:border-gray-700">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="currentPassword"
                  type={showPassword.current ? "text" : "password"}
                  required
                  value={passwordData.currentPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                  placeholder={isFirstLogin ? "Enter the password you use to login" : "Enter current password"}
                />
                <button
                  type="button"
                  onClick={() => toggleShowPassword('current')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                   {showPassword.current ? <HiOutlineEyeOff className="h-5 w-5 text-gray-400" /> : <HiOutlineEye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

            {/* New Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                New Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="newPassword"
                  type={showPassword.new ? "text" : "password"}
                  required
                  value={passwordData.newPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                  placeholder="Minimum 6 characters"
                />
                 <button
                  type="button"
                  onClick={() => toggleShowPassword('new')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                   {showPassword.new ? <HiOutlineEyeOff className="h-5 w-5 text-gray-400" /> : <HiOutlineEye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

             {/* Confirm Password */}
             <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Confirm New Password
              </label>
              <div className="mt-1 relative rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HiOutlineLockClosed className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  name="confirmPassword"
                  type={showPassword.confirm ? "text" : "password"}
                  required
                  value={passwordData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 focus:ring-brand-primary focus:border-brand-primary sm:text-sm"
                  placeholder="Re-enter new password"
                />
                 <button
                  type="button"
                  onClick={() => toggleShowPassword('confirm')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                   {showPassword.confirm ? <HiOutlineEyeOff className="h-5 w-5 text-gray-400" /> : <HiOutlineEye className="h-5 w-5 text-gray-400" />}
                </button>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-brand-primary hover:bg-brand-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary disabled:opacity-50"
              >
                {isLoading ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
