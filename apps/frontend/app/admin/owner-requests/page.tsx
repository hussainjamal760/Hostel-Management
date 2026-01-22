'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import { useAppSelector } from '@/lib/hooks';
import {
  useGetAllOwnerRequestsQuery,
  useReviewOwnerRequestMutation,
  OwnerRequest,
} from '@/lib/services/ownerRequestApi';
import {
  HiOutlineCheck,
  HiOutlineX,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineMail,
  HiOutlinePhone,
  HiOutlineOfficeBuilding,
  HiOutlineLocationMarker,
  HiOutlineRefresh,
} from 'react-icons/hi';

export default function OwnerRequestsPage() {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<string>('PENDING');
  const [page, setPage] = useState(1);
  const [selectedRequest, setSelectedRequest] = useState<OwnerRequest | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');

  const { data: response, isLoading, refetch } = useGetAllOwnerRequestsQuery({
    status: statusFilter || undefined,
    page,
    limit: 10,
  });

  const [reviewRequest, { isLoading: reviewing }] = useReviewOwnerRequestMutation();

  if (!isAuthenticated || user?.role !== 'ADMIN') {
    router.push('/unauthorized');
    return null;
  }

  const requests = response?.data?.requests || [];
  const pagination = response?.data?.pagination;

  const handleReview = async (status: 'APPROVED' | 'REJECTED') => {
    if (!selectedRequest) return;

    try {
      await reviewRequest({
        id: selectedRequest._id,
        data: {
          status,
          adminNotes: reviewNotes || undefined,
        },
      }).unwrap();

      toast.success(`Request ${status.toLowerCase()} successfully!`);
      setSelectedRequest(null);
      setReviewNotes('');
      refetch();
    } catch (error: any) {
      toast.error(error?.data?.message || 'Failed to review request');
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
            <HiOutlineClock size={14} />
            Pending
          </span>
        );
      case 'APPROVED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
            <HiOutlineCheck size={14} />
            Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
            <HiOutlineX size={14} />
            Rejected
          </span>
        );
      default:
        return null;
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-text dark:text-dark-text">
            Owner Requests
          </h1>
          <p className="text-brand-text/60 dark:text-dark-text/60">
            Manage hostel owner listing requests
          </p>
        </div>
        <button
          onClick={() => refetch()}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-card/30 dark:bg-dark-card/30 text-brand-text dark:text-dark-text hover:bg-brand-card/50 dark:hover:bg-dark-card/50 transition-colors"
        >
          <HiOutlineRefresh size={18} />
          Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {['PENDING', 'APPROVED', 'REJECTED', ''].map((status) => (
          <button
            key={status}
            onClick={() => {
              setStatusFilter(status);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${
              statusFilter === status
                ? 'bg-brand-primary dark:bg-dark-primary text-white dark:text-dark-bg'
                : 'bg-white dark:bg-dark-card/50 text-brand-text dark:text-dark-text border border-brand-card/30 dark:border-dark-card/30'
            }`}
          >
            {status || 'All'}
          </button>
        ))}
      </div>

      {/* Requests List */}
      <div className="bg-white dark:bg-dark-card/50 rounded-2xl shadow-sm border border-brand-card/30 dark:border-dark-card/30 overflow-hidden">
        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-pulse text-brand-text/50 dark:text-dark-text/50">Loading requests...</div>
          </div>
        ) : requests.length === 0 ? (
          <div className="p-8 text-center text-brand-text/50 dark:text-dark-text/50">
            <HiOutlineOfficeBuilding size={48} className="mx-auto mb-4 opacity-50" />
            <p className="text-lg">No {statusFilter.toLowerCase() || ''} requests found</p>
          </div>
        ) : (
          <div className="divide-y divide-brand-card/30 dark:divide-dark-card/30">
            {requests.map((request) => (
              <div
                key={request._id}
                className="p-6 hover:bg-brand-card/10 dark:hover:bg-dark-card/20 transition-colors cursor-pointer"
                onClick={() => setSelectedRequest(request)}
              >
                <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                  {/* User info */}
                  <div className="flex items-center gap-3 flex-1">
                    <div className="w-12 h-12 rounded-xl bg-brand-primary dark:bg-dark-primary flex items-center justify-center text-white dark:text-dark-bg font-bold">
                      {request.userId?.name?.charAt(0) || 'U'}
                    </div>
                    <div>
                      <p className="font-semibold text-brand-text dark:text-dark-text">
                        {request.userId?.name}
                      </p>
                      <p className="text-sm text-brand-text/60 dark:text-dark-text/60">
                        {request.userId?.email}
                      </p>
                    </div>
                  </div>

                  {/* Business name */}
                  <div className="flex-1">
                    <p className="text-sm text-brand-text/60 dark:text-dark-text/60">Business</p>
                    <p className="font-medium text-brand-text dark:text-dark-text">{request.businessName}</p>
                  </div>

                  {/* Status and date */}
                  <div className="flex flex-col items-end gap-2">
                    {getStatusBadge(request.status)}
                    <p className="text-xs text-brand-text/50 dark:text-dark-text/50">
                      {formatDate(request.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="px-6 py-4 border-t border-brand-card/30 dark:border-dark-card/30 flex items-center justify-between">
            <p className="text-sm text-brand-text/60 dark:text-dark-text/60">
              Page {pagination.page} of {pagination.totalPages} ({pagination.total} total)
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={!pagination.hasPrev}
                className="px-3 py-1 rounded-lg border border-brand-card/30 dark:border-dark-card/30 text-brand-text dark:text-dark-text disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={!pagination.hasNext}
                className="px-3 py-1 rounded-lg border border-brand-card/30 dark:border-dark-card/30 text-brand-text dark:text-dark-text disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Request Detail Modal */}
      {selectedRequest && (
        <>
          <div
            className="fixed inset-0 z-[99998] bg-black/50 backdrop-blur-sm"
            onClick={() => setSelectedRequest(null)}
          />
          <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 overflow-y-auto">
            <div
              className="w-full max-w-2xl bg-white dark:bg-dark-bg rounded-3xl shadow-2xl max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-brand-card/30 dark:border-dark-card/30 flex items-center justify-between">
                <h2 className="text-xl font-bold text-brand-text dark:text-dark-text">
                  Request Details
                </h2>
                {getStatusBadge(selectedRequest.status)}
              </div>

              <div className="p-6 space-y-6">
                {/* User Info */}
                <div className="flex items-center gap-4 p-4 rounded-xl bg-brand-bg dark:bg-dark-card/50">
                  <div className="w-16 h-16 rounded-xl bg-brand-primary dark:bg-dark-primary flex items-center justify-center text-white dark:text-dark-bg text-2xl font-bold">
                    {selectedRequest.userId?.name?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <p className="text-lg font-bold text-brand-text dark:text-dark-text">
                      {selectedRequest.userId?.name}
                    </p>
                    <div className="flex flex-wrap gap-3 mt-1 text-sm text-brand-text/60 dark:text-dark-text/60">
                      <span className="flex items-center gap-1">
                        <HiOutlineMail size={14} />
                        {selectedRequest.userId?.email}
                      </span>
                      <span className="flex items-center gap-1">
                        <HiOutlinePhone size={14} />
                        {selectedRequest.userId?.phone}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Business Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-brand-bg dark:bg-dark-card/50">
                    <p className="text-xs text-brand-text/50 dark:text-dark-text/50 flex items-center gap-1">
                      <HiOutlineOfficeBuilding size={14} />
                      Business Name
                    </p>
                    <p className="font-medium text-brand-text dark:text-dark-text mt-1">
                      {selectedRequest.businessName}
                    </p>
                  </div>
                  <div className="p-4 rounded-xl bg-brand-bg dark:bg-dark-card/50">
                    <p className="text-xs text-brand-text/50 dark:text-dark-text/50 flex items-center gap-1">
                      <HiOutlinePhone size={14} />
                      Business Phone
                    </p>
                    <p className="font-medium text-brand-text dark:text-dark-text mt-1">
                      {selectedRequest.businessPhone}
                    </p>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-brand-bg dark:bg-dark-card/50">
                  <p className="text-xs text-brand-text/50 dark:text-dark-text/50 flex items-center gap-1">
                    <HiOutlineLocationMarker size={14} />
                    Business Address
                  </p>
                  <p className="font-medium text-brand-text dark:text-dark-text mt-1">
                    {selectedRequest.businessAddress}
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-brand-bg dark:bg-dark-card/50">
                  <p className="text-xs text-brand-text/50 dark:text-dark-text/50">Reason</p>
                  <p className="text-brand-text dark:text-dark-text mt-1">
                    {selectedRequest.reason}
                  </p>
                </div>

                <p className="text-xs text-brand-text/50 dark:text-dark-text/50 text-right">
                  Submitted on {formatDate(selectedRequest.createdAt)}
                </p>

                {/* Review Actions */}
                {selectedRequest.status === 'PENDING' && (
                  <div className="pt-4 border-t border-brand-card/30 dark:border-dark-card/30 space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-brand-text dark:text-dark-text mb-2">
                        Admin Notes (optional)
                      </label>
                      <textarea
                        value={reviewNotes}
                        onChange={(e) => setReviewNotes(e.target.value)}
                        placeholder="Add notes for the applicant (will be shown if rejected)..."
                        rows={2}
                        className="w-full px-4 py-3 rounded-xl bg-brand-bg dark:bg-dark-card/50 border border-brand-card/30 dark:border-dark-card/30 text-brand-text dark:text-dark-text placeholder:text-brand-text/50 dark:placeholder:text-dark-text/50 focus:outline-none focus:ring-2 focus:ring-brand-primary dark:focus:ring-dark-primary resize-none"
                      />
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleReview('REJECTED')}
                        disabled={reviewing}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition-colors disabled:opacity-50"
                      >
                        <HiOutlineX size={20} />
                        Reject
                      </button>
                      <button
                        onClick={() => handleReview('APPROVED')}
                        disabled={reviewing}
                        className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition-colors disabled:opacity-50"
                      >
                        <HiOutlineCheck size={20} />
                        Approve
                      </button>
                    </div>
                  </div>
                )}

                {/* Previously reviewed */}
                {selectedRequest.status !== 'PENDING' && (
                  <div className="pt-4 border-t border-brand-card/30 dark:border-dark-card/30">
                    {selectedRequest.adminNotes && (
                      <div className="p-4 rounded-xl bg-brand-bg dark:bg-dark-card/50">
                        <p className="text-xs text-brand-text/50 dark:text-dark-text/50">Admin Notes</p>
                        <p className="text-brand-text dark:text-dark-text mt-1">
                          {selectedRequest.adminNotes}
                        </p>
                      </div>
                    )}
                    <p className="text-xs text-brand-text/50 dark:text-dark-text/50 mt-3">
                      Reviewed by {selectedRequest.reviewedBy?.name} on{' '}
                      {selectedRequest.reviewedAt && formatDate(selectedRequest.reviewedAt)}
                    </p>
                  </div>
                )}
              </div>

              <div className="p-6 border-t border-brand-card/30 dark:border-dark-card/30">
                <button
                  onClick={() => {
                    setSelectedRequest(null);
                    setReviewNotes('');
                  }}
                  className="w-full py-3 rounded-xl border border-brand-card/50 dark:border-dark-card/50 text-brand-text dark:text-dark-text font-medium hover:bg-brand-card/30 dark:hover:bg-dark-card/30 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
