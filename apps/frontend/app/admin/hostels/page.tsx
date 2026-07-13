'use client';

import React, { useState } from 'react';
import { useUpdateSubscriptionRateMutation, useGenerateInvoiceMutation, useMarkAsPaidMutation, useGetPendingPaymentsQuery } from '@/lib/services/adminPaymentApi';
import { toast } from 'react-hot-toast';
import { baseApi } from '@/lib/services/api';
import ConfirmationModal from '@/components/modals/ConfirmationModal';
import { useUpdateHostelMutation } from '@/lib/services/hostelApi';

const adminHostelApi = baseApi.injectEndpoints({
    endpoints: (builder) => ({
        getAllHostelsAdmin: builder.query<any, { search?: string; page?: number; limit?: number; isActive?: string | boolean }>({
            query: (params) => ({
                url: '/hostels',
                method: 'GET',
                params
            }),
            providesTags: ['Hostel']
        })
    }),
    overrideExisting: true,
});
const { useGetAllHostelsAdminQuery } = adminHostelApi;

export default function AdminHostelsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'INACTIVE' | 'PENDING'>('PENDING');
    const [page, setPage] = useState(1);
    const limit = 10;

    const [editingRateId, setEditingRateId] = useState<string | null>(null);
    const [tempRate, setTempRate] = useState<number>(0);

    const [modalConfig, setModalConfig] = useState<{
        isOpen: boolean;
        type: 'APPROVE' | 'REJECT' | 'ACTIVATE' | 'DEACTIVATE' | 'INVOICE' | null;
        hostelId: string | null;
    }>({ isOpen: false, type: null, hostelId: null });
    const [isProcessing, setIsProcessing] = useState(false);

    const { data: hostelsResponse, isLoading, error } = useGetAllHostelsAdminQuery({
        search: searchTerm || undefined,
        page,
        limit,
        isActive: statusFilter === 'ALL' ? 'ALL' : statusFilter === 'ACTIVE' ? 'true' : statusFilter === 'INACTIVE' ? 'false' : 'PENDING'
    });

    const { data: pendingResponse } = useGetPendingPaymentsQuery({});
    const pendingPayments = pendingResponse?.data || [];

    const [updateRate] = useUpdateSubscriptionRateMutation();
    const [generateInvoice] = useGenerateInvoiceMutation();
    const [markPaid] = useMarkAsPaidMutation();
    const [updateHostel] = useUpdateHostelMutation();

    const handleUpdateRate = async (hostelId: string) => {
        try {
            await updateRate({ hostelId, rate: tempRate }).unwrap();
            toast.success('Rate updated successfully');
            setEditingRateId(null);
        } catch (err) {
            toast.error('Failed to update rate');
        }
    };

    const handleGenerateInvoice = async () => {
        if (!modalConfig.hostelId) return;
        setIsProcessing(true);
        try {
            const now = new Date();
            await generateInvoice({
                hostelId: modalConfig.hostelId,
                month: now.getMonth() + 1,
                year: now.getFullYear()
            }).unwrap();
            toast.success('Invoice generated');
            setModalConfig({ ...modalConfig, isOpen: false });
        } catch (err) {
            toast.error('Failed to generate invoice');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleMarkPaid = async (paymentId: string) => {
        try {
            await markPaid(paymentId).unwrap();
            toast.success('Payment marked as received');
        } catch (err) {
            toast.error('Failed to mark paid');
        }
    };

    const getPendingForHostel = (hostelId: string) => {
        return pendingPayments.filter((p: any) => p.hostelId._id === hostelId || p.hostelId === hostelId);
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
        setPage(1);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setStatusFilter(e.target.value as any);
        setPage(1);
    };

    const toggleHostelStatus = async () => {
        if (!modalConfig.hostelId) return;
        const isActive = modalConfig.type === 'DEACTIVATE'; // Currently active, so we are deactivating
        setIsProcessing(true);
        try {
            await updateHostel({ id: modalConfig.hostelId, data: { isActive: !isActive } as any }).unwrap();
            toast.success(`Hostel ${!isActive ? 'activated' : 'deactivated'}`);
            setModalConfig({ ...modalConfig, isOpen: false });
        } catch (err) {
            toast.error('Failed to update status');
        } finally {
            setIsProcessing(false);
        }
    };

    const approveHostel = async () => {
        if (!modalConfig.hostelId) return;
        setIsProcessing(true);
        try {
            await updateHostel({ id: modalConfig.hostelId, data: { status: 'APPROVED', isActive: true } as any }).unwrap();
            toast.success('Hostel approved successfully');
            setModalConfig({ ...modalConfig, isOpen: false });
        } catch (err) {
            toast.error('Failed to approve hostel');
        } finally {
            setIsProcessing(false);
        }
    };

    const rejectHostel = async () => {
        if (!modalConfig.hostelId) return;
        setIsProcessing(true);
        try {
            await updateHostel({ id: modalConfig.hostelId, data: { status: 'REJECTED', isActive: false } as any }).unwrap();
            toast.success('Hostel rejected successfully');
            setModalConfig({ ...modalConfig, isOpen: false });
        } catch (err) {
            toast.error('Failed to reject hostel');
        } finally {
            setIsProcessing(false);
        }
    };

    const handleModalConfirm = () => {
        if (modalConfig.type === 'APPROVE') approveHostel();
        else if (modalConfig.type === 'REJECT') rejectHostel();
        else if (modalConfig.type === 'ACTIVATE' || modalConfig.type === 'DEACTIVATE') toggleHostelStatus();
        else if (modalConfig.type === 'INVOICE') handleGenerateInvoice();
    };

    const getModalDetails = () => {
        switch (modalConfig.type) {
            case 'APPROVE':
                return { title: 'Approve Hostel', message: 'Are you sure you want to approve this hostel? It will become active immediately.', confirmText: 'Approve Hostel', iconName: 'verified', confirmVariant: 'success' as const };
            case 'REJECT':
                return { title: 'Reject Hostel', message: 'Are you sure you want to reject this hostel? It will not be able to operate on the platform.', confirmText: 'Reject Hostel', iconName: 'cancel', confirmVariant: 'error' as const };
            case 'ACTIVATE':
                return { title: 'Activate Hostel', message: 'Are you sure you want to activate this hostel? It will be visible on the platform again.', confirmText: 'Activate', iconName: 'power', confirmVariant: 'primary' as const };
            case 'DEACTIVATE':
                return { title: 'Deactivate Hostel', message: 'Are you sure you want to deactivate this hostel? It will be hidden from the platform.', confirmText: 'Deactivate', iconName: 'power_off', confirmVariant: 'error' as const };
            case 'INVOICE':
                return { title: 'Generate Invoice', message: 'Are you sure you want to generate an invoice for the current month? This cannot be undone.', confirmText: 'Generate Invoice', iconName: 'receipt_long', confirmVariant: 'warning' as const };
            default:
                return { title: '', message: '', confirmText: '' };
        }
    };

    const modalDetails = getModalDetails();

    return (
        <>
            {/* Header Section */}
            <section className="mb-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h2 className="font-display-lg text-display-lg text-primary tracking-tight mb-2">Hostel Management</h2>
                        <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
                            Manage platform hostels, update subscription rates, and collect monthly fees.
                        </p>
                    </div>
                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 px-6 py-3 border border-secondary text-secondary rounded-xl font-label-md text-label-md hover:bg-surface-container-low transition-all">
                            <span className="material-symbols-outlined">download</span>
                            Export CSV
                        </button>
                        <button className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:opacity-90 transition-all shadow-md">
                            <span className="material-symbols-outlined">add_business</span>
                            Add Hostel
                        </button>
                    </div>
                </div>
            </section>

            {/* Filters & Actions */}
            <section className="bg-surface-container-lowest border border-outline-variant p-6 rounded-t-xl flex flex-col md:flex-row gap-4 justify-between items-center mt-6">
                <div className="flex w-full md:w-auto gap-4 flex-col md:flex-row">
                    <div className="relative">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
                        <input
                            type="text"
                            placeholder="Search hostels..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="pl-10 pr-4 py-3 border border-outline-variant rounded-xl bg-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary w-full md:w-80 transition-all"
                        />
                    </div>
                    <select
                        value={statusFilter}
                        onChange={handleStatusChange}
                        className="px-4 py-3 border border-outline-variant rounded-xl bg-surface text-on-surface-variant focus:outline-none focus:border-primary transition-all"
                    >
                        <option value="ALL">All Hostels</option>
                        <option value="PENDING">Pending Approval</option>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                    </select>
                </div>

                <div className="text-sm font-bold text-on-surface-variant">
                    {hostelsResponse?.pagination ? `Showing ${hostelsResponse.data.length} of ${hostelsResponse.pagination.total}` : 'Loading...'}
                </div>
            </section>

            {/* Data Table */}
            <section className="bg-surface-container-lowest border-x border-b border-outline-variant rounded-b-xl overflow-hidden flex flex-col min-h-[400px]">
                <div className="flex-1 overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-surface-container-low border-b border-outline-variant">
                            <tr>
                                <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider">Hostel</th>
                                <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider">Owner</th>
                                <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider">Details</th>
                                <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-outline-variant">
                            {isLoading ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center">
                                        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
                                        <p className="text-on-surface-variant font-bold">Loading hostels...</p>
                                    </td>
                                </tr>
                            ) : error ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-error font-bold bg-error-container/10">
                                        Failed to load hostels. Please try again later.
                                    </td>
                                </tr>
                            ) : hostelsResponse?.data?.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-16 text-center">
                                        <div className="w-16 h-16 bg-surface-variant rounded-full flex items-center justify-center mx-auto mb-4 text-on-surface-variant">
                                            <span className="material-symbols-outlined text-[32px]">domain_disabled</span>
                                        </div>
                                        <h3 className="font-display-sm text-primary mb-1">No Hostels Found</h3>
                                        <p className="text-on-surface-variant font-body-md max-w-sm mx-auto">
                                            There are no hostels matching your current search or filter criteria.
                                        </p>
                                    </td>
                                </tr>
                            ) : (
                                hostelsResponse?.data?.map((hostel: any) => {
                                    const pending = getPendingForHostel(hostel._id);
                                    const hasPending = pending.length > 0;
                                    const isPendingApproval = hostel.status === 'PENDING';

                                    return (
                                        <tr key={hostel._id} className="hover:bg-surface-container-low transition-colors group">
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-sm shadow-sm overflow-hidden flex-shrink-0">
                                                        <span className="material-symbols-outlined">domain</span>
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <p className="font-bold text-primary">{hostel.name}</p>
                                                            {isPendingApproval && (
                                                                <span className="bg-error-container text-on-error-container text-[10px] px-2 py-0.5 rounded-full font-bold">
                                                                    NEW
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                                                            <span className="material-symbols-outlined text-[14px]">location_on</span>
                                                            {hostel.address?.city}
                                                        </p>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <p className="text-sm font-bold text-on-surface">{hostel.ownerId?.name || 'No Owner'}</p>
                                                <p className="text-xs text-on-surface-variant flex items-center gap-1 mt-0.5">
                                                    <span className="material-symbols-outlined text-[14px]">call</span>
                                                    {hostel.ownerId?.phone || 'N/A'}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div>
                                                        <p className="text-xs text-on-surface-variant">Active Students</p>
                                                        <p className="font-mono font-bold text-sm text-primary">{hostel.activeStudentCount ?? '0'}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-xs text-on-surface-variant">Rate/Student</p>
                                                        {editingRateId === hostel._id ? (
                                                            <div className="flex items-center gap-1 mt-0.5">
                                                                <input
                                                                    type="number"
                                                                    autoFocus
                                                                    value={tempRate}
                                                                    onChange={(e) => setTempRate(Number(e.target.value))}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') handleUpdateRate(hostel._id);
                                                                        if (e.key === 'Escape') setEditingRateId(null);
                                                                    }}
                                                                    className="w-16 px-2 py-1 border border-outline-variant rounded bg-surface focus:outline-none focus:border-primary text-xs"
                                                                />
                                                                <button onClick={() => handleUpdateRate(hostel._id)} className="text-primary hover:text-primary/80">
                                                                    <span className="material-symbols-outlined text-[16px]">check_circle</span>
                                                                </button>
                                                                <button onClick={() => setEditingRateId(null)} className="text-error hover:text-error/80">
                                                                    <span className="material-symbols-outlined text-[16px]">cancel</span>
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <p className="font-mono font-bold text-sm text-primary mt-0.5 flex items-center gap-1">
                                                                PKR {hostel.subscriptionRate || 0}
                                                                <button
                                                                    onClick={() => { setEditingRateId(hostel._id); setTempRate(hostel.subscriptionRate || 0); }}
                                                                    className="text-on-surface-variant hover:text-primary opacity-0 group-hover:opacity-100 transition-opacity"
                                                                >
                                                                    <span className="material-symbols-outlined text-[14px]">edit</span>
                                                                </button>
                                                            </p>
                                                        )}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {isPendingApproval ? (
                                                    <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-error-container text-on-error-container">
                                                        Pending
                                                    </span>
                                                ) : hostel.isActive ? (
                                                    <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-primary-container text-on-primary-container">
                                                        Active
                                                    </span>
                                                ) : (
                                                    <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-surface-variant text-on-surface-variant">
                                                        Inactive
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                                                    {/* Approve/Reject Buttons */}
                                                    {isPendingApproval && (
                                                        <>
                                                            <button
                                                                onClick={() => setModalConfig({ isOpen: true, type: 'APPROVE', hostelId: hostel._id })}
                                                                className="p-2 text-primary hover:bg-primary-container hover:text-on-primary-container rounded-lg transition-colors flex items-center"
                                                                title="Approve Hostel"
                                                            >
                                                                <span className="material-symbols-outlined text-[20px]">verified</span>
                                                            </button>
                                                            <button
                                                                onClick={() => setModalConfig({ isOpen: true, type: 'REJECT', hostelId: hostel._id })}
                                                                className="p-2 text-error hover:bg-error-container hover:text-on-error-container rounded-lg transition-colors flex items-center"
                                                                title="Reject Hostel"
                                                            >
                                                                <span className="material-symbols-outlined text-[20px]">cancel</span>
                                                            </button>
                                                        </>
                                                    )}

                                                    {/* Payment Logic */}
                                                    {!isPendingApproval && (
                                                        <>
                                                            {hasPending ? (
                                                                <button
                                                                    onClick={() => handleMarkPaid(pending[0]._id)}
                                                                    className="p-2 text-primary hover:bg-primary-container hover:text-on-primary-container rounded-lg transition-colors flex items-center gap-1"
                                                                    title={`Receive PKR ${pending[0].amount.toLocaleString()}`}
                                                                >
                                                                    <span className="material-symbols-outlined text-[20px]">payments</span>
                                                                    <span className="text-xs font-bold">Receive</span>
                                                                </button>
                                                            ) : hostel.currentMonthPaymentStatus === 'COMPLETED' ? (
                                                                <div
                                                                    className="p-2 text-secondary flex items-center gap-1"
                                                                    title="Fee Collected for Current Month"
                                                                >
                                                                    <span className="material-symbols-outlined text-[20px]">check_circle</span>
                                                                    <span className="text-xs font-bold">Paid</span>
                                                                </div>
                                                            ) : (
                                                                <button
                                                                    onClick={() => setModalConfig({ isOpen: true, type: 'INVOICE', hostelId: hostel._id })}
                                                                    className="p-2 text-on-surface-variant hover:bg-surface-variant rounded-lg transition-colors flex items-center gap-1"
                                                                    title="Generate Invoice for Current Month"
                                                                >
                                                                    <span className="material-symbols-outlined text-[20px]">receipt_long</span>
                                                                    <span className="text-xs font-bold">Invoice</span>
                                                                </button>
                                                            )}
                                                        </>
                                                    )}

                                                    {/* Toggle Active Status */}
                                                    <button
                                                        onClick={() => setModalConfig({ isOpen: true, type: hostel.isActive ? 'DEACTIVATE' : 'ACTIVATE', hostelId: hostel._id })}
                                                        className={`p-2 rounded-lg transition-colors ${hostel.isActive
                                                                ? 'text-error hover:bg-error-container hover:text-on-error-container'
                                                                : 'text-primary hover:bg-primary-container hover:text-on-primary-container'
                                                            }`}
                                                        title={hostel.isActive ? "Deactivate Hostel" : "Activate Hostel"}
                                                    >
                                                        <span className="material-symbols-outlined text-[20px]">power_settings_new</span>
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {hostelsResponse?.pagination && hostelsResponse.pagination.totalPages > 1 && (
                    <div className="p-6 border-t border-outline-variant flex justify-between items-center bg-surface-container-lowest">
                        <button
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={!hostelsResponse.pagination.hasPrev}
                            className="px-4 py-2 border border-outline-variant rounded-lg font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-low transition-colors"
                        >
                            Previous
                        </button>
                        <div className="text-sm font-bold text-on-surface-variant flex gap-2">
                            {[...Array(hostelsResponse.pagination.totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${page === i + 1 ? 'bg-primary text-white' : 'bg-surface-container hover:bg-surface-container-low text-on-surface-variant'
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setPage(p => p + 1)}
                            disabled={!hostelsResponse.pagination.hasNext}
                            className="px-4 py-2 border border-outline-variant rounded-lg font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-container-low transition-colors"
                        >
                            Next
                        </button>
                    </div>
                )}
            </section>

            <ConfirmationModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={handleModalConfirm}
                title={modalDetails.title}
                message={modalDetails.message}
                confirmText={modalDetails.confirmText}
                iconName={modalDetails.iconName}
                confirmVariant={modalDetails.confirmVariant}
                isLoading={isProcessing}
            />
        </>
    );
}
