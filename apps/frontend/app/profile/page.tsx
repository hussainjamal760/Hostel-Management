'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { logout } from '@/lib/features/authSlice';
import { 
  useGetMyLatestRequestQuery, 
  useCreateOwnerRequestMutation 
} from '@/lib/services/ownerRequestApi';
import {
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineOfficeBuilding,
  HiOutlineCheck,
  HiOutlineClock,
  HiOutlineX,
  HiOutlineLogout,
  HiOutlineHome,
  HiOutlinePencil,
} from 'react-icons/hi';

export default function ProfilePage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const [showRequestModal, setShowRequestModal] = useState(false);
  
  const { data: latestRequestData, isLoading: requestLoading, refetch } = useGetMyLatestRequestQuery();
  const [createRequest, { isLoading: submitting }] = useCreateOwnerRequestMutation();
  
  const latestRequest = latestRequestData?.data;

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    router.push('/login');
  };

  if (!isAuthenticated) {
    router.push('/login');
    return null;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <HiOutlineClock size={16} />
            Pending Review
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <HiOutlineCheck size={16} />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <HiOutlineX size={16} />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-dark-bg">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-brand-bg/80 dark:bg-dark-bg/80 backdrop-blur-xl border-b border-brand-card/30 dark:border-dark-card/30">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-brand-primary dark:bg-dark-primary flex items-center justify-center">
              <span className="text-white dark:text-dark-bg font-bold text-lg">H</span>
            </div>
            <span className="font-bold text-lg text-brand-text dark:text-dark-text">Hostelite</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl hover:bg-brand-card/30 dark:hover:bg-dark-card/30 transition-colors"
            >
              <HiOutlineHome size={24} className="text-brand-text dark:text-dark-text" />
            </Link>
            <button
              onClick={handleLogout}
              className="p-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors text-red-500"
            >
              <HiOutlineLogout size={24} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Card */}
        <div className="bg-white dark:bg-dark-card/50 rounded-3xl shadow-lg border border-brand-card/30 dark:border-dark-card/30 overflow-hidden">
          {/* Header with gradient */}
          <div className="h-32 bg-gradient-to-r from-brand-primary to-brand-primary/70 dark:from-dark-primary/30 dark:to-dark-card" />
          
          {/* Profile content */}
          <div className="px-6 pb-6 -mt-16">
            <div className="flex flex-col sm:flex-row sm:items-end gap-4">
              {/* Avatar */}
              <div className="w-28 h-28 rounded-2xl bg-brand-card dark:bg-dark-card border-4 border-white dark:border-dark-bg flex items-center justify-center text-brand-text dark:text-dark-text text-3xl font-bold shadow-lg">
                {user?.name ? getInitials(user.name) : 'U'}
              </div>
              
              {/* Name and role */}
              <div className="flex-1">
                <h1 className="text-2xl font-bold text-brand-text dark:text-dark-text">
                  {user?.name}
                </h1>
                <span className="inline-block mt-1 px-3 py-1 rounded-full text-sm font-medium bg-brand-primary/10 dark:bg-dark-primary/20 text-brand-primary dark:text-dark-primary">
                  {user?.role}
                </span>
              </div>
              
              {/* Edit button */}
              <button className="flex items-center gap-2 px-4 py-2 rounded-xl border border-brand-card/50 dark:border-dark-card/50 text-brand-text dark:text-dark-text hover:bg-brand-card/30 dark:hover:bg-dark-card/30 transition-colors">
                <HiOutlinePencil size={18} />
                Edit Profile
              </button>
            </div>
            
            {/* Info grid */}
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-brand-bg dark:bg-dark-bg">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <HiOutlineMail size={20} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-xs text-brand-text/50 dark:text-dark-text/50">Email</p>
                  <p className="font-medium text-brand-text dark:text-dark-text">{user?.email}</p>
                </div>
              </div>
              
              <div className="flex items-center gap-3 p-4 rounded-xl bg-brand-bg dark:bg-dark-bg">
                <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                  <HiOutlinePhone size={20} className="text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="text-xs text-brand-text/50 dark:text-dark-text/50">Phone</p>
                  <p className="font-medium text-brand-text dark:text-dark-text">{user?.phone || 'Not provided'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Portal Link */}
        {user?.role === 'ADMIN' && (
          <div className="mt-6 bg-white dark:bg-dark-card/50 rounded-3xl shadow-lg border border-brand-card/30 dark:border-dark-card/30 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <HiOutlineOfficeBuilding size={24} className="text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-brand-text dark:text-dark-text">
                  Admin Portal
                </h2>
                <p className="text-brand-text/60 dark:text-dark-text/60">
                  Manage users, hostels, payments, and system settings.
                </p>
              </div>
            </div>
            <div className="mt-4">
              <Link
                href="/admin/dashboard"
                className="inline-block px-6 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 hover:scale-105 transition-all shadow-lg shadow-blue-600/20"
              >
                Open Admin Portal
              </Link>
            </div>
          </div>
        )}

        {/* Owner Dashboard Link */}
        {user?.role === 'OWNER' && (
          <div className="mt-6 bg-white dark:bg-dark-card/50 rounded-3xl shadow-lg border border-brand-card/30 dark:border-dark-card/30 p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <HiOutlineCheck size={24} className="text-green-600 dark:text-green-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-brand-text dark:text-dark-text">
                  Owner Dashboard
                </h2>
                <p className="text-brand-text/60 dark:text-dark-text/60">
                  Manage your properties, bookings, and view earnings.
                </p>
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <Link
                href="/owner/dashboard"
                className="inline-block px-6 py-3 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 hover:scale-105 transition-all shadow-lg shadow-green-600/20"
              >
                Open Owner Dashboard
              </Link>
            </div>
          </div>
        )}

        {/* Request to List Hostel Section (For Students) */}
        {user?.role === 'STUDENT' && (
          <div className="mt-6 bg-white dark:bg-dark-card/50 rounded-3xl shadow-lg border border-brand-card/30 dark:border-dark-card/30 p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0">
                <HiOutlineOfficeBuilding size={24} className="text-purple-600 dark:text-purple-400" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-brand-text dark:text-dark-text">
                  Become a Hostel Owner
                </h2>
                <p className="mt-1 text-brand-text/60 dark:text-dark-text/60">
                  List your hostel on our platform and reach thousands of students looking for accommodation.
                </p>
                
                {requestLoading ? (
                  <div className="mt-4 animate-pulse h-10 w-32 bg-brand-card/30 dark:bg-dark-card/50 rounded-xl" />
                ) : latestRequest ? (
                  <div className="mt-4 p-4 rounded-xl bg-brand-bg dark:bg-dark-bg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-brand-text/70 dark:text-dark-text/70">Your request status:</span>
                      {getStatusBadge(latestRequest.status)}
                    </div>
                    {latestRequest.status === 'REJECTED' && latestRequest.adminNotes && (
                      <div className="mt-3 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 text-sm text-red-600 dark:text-red-400">
                        <p className="font-medium">Reason:</p>
                        <p>{latestRequest.adminNotes}</p>
                      </div>
                    )}
                    {latestRequest.status === 'REJECTED' && (
                      <button
                        onClick={() => setShowRequestModal(true)}
                        className="mt-4 px-4 py-2 rounded-xl bg-brand-primary dark:bg-dark-primary text-white dark:text-dark-bg font-medium hover:scale-105 transition-transform"
                      >
                        Submit New Request
                      </button>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => setShowRequestModal(true)}
                    className="mt-4 px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold hover:scale-105 transition-transform shadow-lg"
                  >
                    Request to List Hostel
                  </button>
                )}
              </div>
            </div>
          </div>
        )}


      </main>

      {/* Request Modal */}
      {showRequestModal && (
        <RequestModal
          onClose={() => setShowRequestModal(false)}
          onSuccess={() => {
            setShowRequestModal(false);
            refetch();
          }}
          createRequest={createRequest}
          submitting={submitting}
        />
      )}
    </div>
  );
}

// Request Modal Component
interface RequestModalProps {
  onClose: () => void;
  onSuccess: () => void;
  createRequest: any;
  submitting: boolean;
}

function RequestModal({ onClose, onSuccess, createRequest, submitting }: RequestModalProps) {
  const [formData, setFormData] = useState({
    businessName: '',
    businessPhone: '',
    businessAddress: '',
    reason: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.businessName || !formData.businessPhone || !formData.businessAddress || !formData.reason) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      await createRequest(formData).unwrap();
      toast.success('Request submitted successfully! We will review it soon.');
      onSuccess();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to submit request');
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-[99998] bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto">
        <div
          className="w-full max-w-lg bg-white dark:bg-dark-bg rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-brand-card/30 dark:border-dark-card/30">
            <h2 className="text-xl font-bold text-brand-text dark:text-dark-text">
              Request to List Your Hostel
            </h2>
            <p className="mt-1 text-sm text-brand-text/60 dark:text-dark-text/60">
              Fill in your business details to become a hostel owner
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-brand-text dark:text-dark-text mb-2">
                Business/Hostel Name *
              </label>
              <input
                type="text"
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                placeholder="e.g., Green Valley Hostel"
                className="w-full px-4 py-3 rounded-xl bg-brand-bg dark:bg-dark-card/50 border border-brand-card/30 dark:border-dark-card/30 text-brand-text dark:text-dark-text placeholder:text-brand-text/50 dark:placeholder:text-dark-text/50 focus:outline-none focus:ring-2 focus:ring-brand-primary dark:focus:ring-dark-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text dark:text-dark-text mb-2">
                Business Phone *
              </label>
              <input
                type="tel"
                value={formData.businessPhone}
                onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                placeholder="e.g., +92 300 1234567"
                className="w-full px-4 py-3 rounded-xl bg-brand-bg dark:bg-dark-card/50 border border-brand-card/30 dark:border-dark-card/30 text-brand-text dark:text-dark-text placeholder:text-brand-text/50 dark:placeholder:text-dark-text/50 focus:outline-none focus:ring-2 focus:ring-brand-primary dark:focus:ring-dark-primary"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text dark:text-dark-text mb-2">
                Business Address *
              </label>
              <textarea
                value={formData.businessAddress}
                onChange={(e) => setFormData({ ...formData, businessAddress: e.target.value })}
                placeholder="Full address of your hostel"
                rows={2}
                className="w-full px-4 py-3 rounded-xl bg-brand-bg dark:bg-dark-card/50 border border-brand-card/30 dark:border-dark-card/30 text-brand-text dark:text-dark-text placeholder:text-brand-text/50 dark:placeholder:text-dark-text/50 focus:outline-none focus:ring-2 focus:ring-brand-primary dark:focus:ring-dark-primary resize-none"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-brand-text dark:text-dark-text mb-2">
                Why do you want to list your hostel? *
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                placeholder="Tell us about your hostel and why you want to join Hostelite..."
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-brand-bg dark:bg-dark-card/50 border border-brand-card/30 dark:border-dark-card/30 text-brand-text dark:text-dark-text placeholder:text-brand-text/50 dark:placeholder:text-dark-text/50 focus:outline-none focus:ring-2 focus:ring-brand-primary dark:focus:ring-dark-primary resize-none"
                required
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-xl border border-brand-card/50 dark:border-dark-card/50 text-brand-text dark:text-dark-text font-medium hover:bg-brand-card/30 dark:hover:bg-dark-card/30 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 py-3 rounded-xl bg-brand-primary dark:bg-dark-primary text-white dark:text-dark-bg font-bold hover:scale-[1.02] transition-transform disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Request'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
