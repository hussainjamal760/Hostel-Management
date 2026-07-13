'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  useGetOwnerHostelsQuery, 
  useGetHostelStatsQuery 
} from '@/lib/services/hostelApi';
import { 
  useGetExpenseStatsQuery, 
  useGetExpensesQuery 
} from '@/lib/services/expenseApi';
import { useGetComplaintsQuery } from '@/lib/services/complaintApi';
import { useGetManagersQuery } from '@/lib/services/managerApi';
import CreateHostelForm from '@/components/hostel/CreateHostelForm';

export default function OwnerDashboard() {
  const [selectedHostelId, setSelectedHostelId] = useState<string>('ALL');

  const { data: hostelResponse, isLoading: isHostelLoading } = useGetOwnerHostelsQuery();
  const hasHostel = hostelResponse?.data && hostelResponse.data.length > 0;

  const statsQueryArg = selectedHostelId === 'ALL' ? undefined : { hostelId: selectedHostelId };
  
  const { data: statsResponse, isLoading: isStatsLoading } = useGetHostelStatsQuery(statsQueryArg, {
    skip: !hasHostel,
  });

  const { data: expenseStatsResponse } = useGetExpenseStatsQuery(
    selectedHostelId === 'ALL' ? undefined : selectedHostelId, 
    { skip: !hasHostel }
  );

  const { data: complaintsResponse } = useGetComplaintsQuery(
    { limit: 3, status: 'OPEN' },
    { skip: !hasHostel }
  );

  const { data: managersResponse } = useGetManagersQuery(
    undefined,
    { skip: !hasHostel }
  );

  const { data: expensesResponse } = useGetExpensesQuery(
    { limit: 5 },
    { skip: !hasHostel }
  );

  if (isHostelLoading) {
    return (
      <div className="flex items-center justify-center h-full pt-32">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!hasHostel) {
    return (
      <div className="container mx-auto max-w-5xl">
         <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold mb-4 text-primary">Welcome, Owner!</h1>
            <p className="text-on-surface-variant font-body-md">Let's get started by setting up your first hostel.</p>
         </div>
         <CreateHostelForm />
      </div>
    );
  }

  const stats = statsResponse?.data || {
    totalHostels: 0,
    totalRooms: 0,
    totalBeds: 0,
    totalStudents: 0,
    occupancyRate: 0,
    revenue: 0,
    totalRemaining: 0,
    currentMonthRevenue: 0,
    currentMonthPending: 0,
    monthlyRevenue: []
  };

  const expenseStats = expenseStatsResponse?.data || {
      totalPending: 0,
      totalApproved: 0,
      totalRejected: 0,
      pendingCount: 0
  };

  const complaints = complaintsResponse?.data || [];
  const managers = managersResponse?.data?.slice(0, 4) || [];
  const expenses = expensesResponse?.data || [];
  const hostels = hostelResponse?.data || [];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PK', {
      style: 'currency',
      currency: 'PKR',
      maximumFractionDigits: 0
    }).format(amount || 0);
  };

  const getInitials = (name: string) => {
    return name?.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2) || 'M';
  };

  return (
    <div className="space-y-8">
      {/* Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-1">Owner Overview</h2>
          <p className="text-on-surface-variant font-body-md opacity-80">Real-time performance and operational health across your properties.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-4">
            {hostels.length > 0 && (
              <div className="flex items-center gap-2 mr-4">
                  <span className="text-sm font-medium text-on-surface-variant">Filter by:</span>
                  <select 
                      value={selectedHostelId}
                      onChange={(e) => setSelectedHostelId(e.target.value)}
                      className="bg-surface-container-lowest border border-outline-variant rounded-lg px-3 py-2 text-sm font-medium text-primary focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                      <option value="ALL">All Hostels</option>
                      {hostels.map((hostel: any) => (
                          <option key={hostel._id} value={hostel._id}>{hostel.name}</option>
                      ))}
                  </select>
              </div>
          )}
          <div className="flex flex-wrap gap-3">
            <Link href="/owner/students" className="flex items-center gap-2 px-5 py-3 bg-surface-container border border-outline-variant rounded-xl text-primary font-label-md hover:bg-surface-container-high transition-all">
              <span className="material-symbols-outlined text-[20px]">group</span>
              View Students
            </Link>
            <Link href="/owner/expenses" className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl text-label-md hover:shadow-lg transition-all active:scale-95">
              <span className="material-symbols-outlined text-[20px]">receipt_long</span>
              Manage Expenses
            </Link>
          </div>
        </div>
      </div>

      {isStatsLoading ? (
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-pulse">
            {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-surface-container-high rounded-2xl"></div>
            ))}
         </div>
      ) : (
        <>
          {/* KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
            {/* KPI 1 */}
            <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)] group hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-primary-container/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-primary">groups</span>
                </div>
                <span className="text-label-md text-secondary font-semibold">{stats.totalHostels} Hostels</span>
              </div>
              <div className="space-y-1">
                <p className="text-on-surface-variant text-sm font-label-md uppercase tracking-wider">Total Students</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-stats-lg font-stats-lg text-primary">{stats.totalStudents}</h3>
                </div>
              </div>
            </div>

            {/* KPI 2 */}
            <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)] group hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-tertiary-container/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-tertiary">hotel</span>
                </div>
                <span className="text-label-md text-tertiary font-semibold">{stats.occupancyRate.toFixed(1)}% Capacity</span>
              </div>
              <div className="space-y-1">
                <p className="text-on-surface-variant text-sm font-label-md uppercase tracking-wider">Rooms & Beds</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-stats-lg font-stats-lg text-primary">{stats.totalRooms}</h3>
                  <span className="text-body-sm text-on-surface-variant pb-1">/ {stats.totalBeds} beds</span>
                </div>
              </div>
            </div>

            {/* KPI 3 */}
            <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)] group hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-secondary-container/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-secondary">payments</span>
                </div>
                <div className="w-24 h-1.5 bg-outline-variant rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-3/4"></div>
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-on-surface-variant text-sm font-label-md uppercase tracking-wider">Total Revenue</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-headline-lg font-headline-lg text-primary">{formatCurrency(stats.revenue)}</h3>
                </div>
              </div>
            </div>

            {/* KPI 4 */}
            <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)] group hover:-translate-y-1 transition-transform duration-300">
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-error-container/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-error">priority_high</span>
                </div>
                <Link href="/owner/students" className="text-xs font-label-md text-error underline decoration-2 underline-offset-4">Remind All</Link>
              </div>
              <div className="space-y-1">
                <p className="text-on-surface-variant text-sm font-label-md uppercase tracking-wider">Pending Dues</p>
                <div className="flex items-end gap-2">
                  <h3 className="text-headline-lg font-headline-lg text-error">{formatCurrency(stats.totalRemaining)}</h3>
                </div>
              </div>
            </div>
          </div>

          {/* Bento Analytics Grid */}
          <div className="grid grid-cols-12 gap-6 mb-10">
            {/* Revenue Trend - 8 cols */}
            <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant p-8 rounded-3xl shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)]">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h4 className="font-headline-md text-primary">Financial Trajectory</h4>
                  <p className="text-sm text-on-surface-variant">Revenue over the past months</p>
                </div>
              </div>
              {/* Chart Placeholder */}
              <div className="h-64 flex items-end justify-between gap-4 relative pt-10">
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
                  <div className="border-b border-outline-variant/30 w-full"></div>
                  <div className="border-b border-outline-variant/30 w-full"></div>
                  <div className="border-b border-outline-variant/30 w-full"></div>
                  <div className="border-b border-outline-variant/30 w-full"></div>
                </div>
                
                {stats.monthlyRevenue && stats.monthlyRevenue.length > 0 ? (
                  stats.monthlyRevenue.slice(-6).map((data: any, idx: number) => {
                    const maxRev = Math.max(...stats.monthlyRevenue.map((d: any) => d.revenue)) || 1;
                    const height = `${Math.max(10, (data.revenue / maxRev) * 100)}%`;
                    
                    return (
                      <div key={idx} className="flex-1 flex flex-col items-center group relative z-10">
                        <div 
                          className="w-full bg-primary/10 rounded-t-lg group-hover:bg-primary/20 transition-all duration-500 relative"
                          style={{ height }}
                        >
                          <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity z-20 whitespace-nowrap">
                            {formatCurrency(data.revenue)}
                          </div>
                        </div>
                        <span className="mt-4 text-[11px] font-label-md text-on-surface-variant">{data.month.substring(0, 3).toUpperCase()}</span>
                      </div>
                    );
                  })
                ) : (
                  <div className="w-full flex justify-center items-center h-full text-on-surface-variant">
                    No revenue data available
                  </div>
                )}
              </div>
            </div>

            {/* Room Occupancy - 4 cols */}
            <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant p-8 rounded-3xl shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)] flex flex-col">
              <h4 className="font-headline-md text-primary mb-1">Occupancy Hub</h4>
              <p className="text-sm text-on-surface-variant mb-8">Capacity across properties</p>
              <div className="flex-1 flex items-center justify-center relative py-6">
                {/* Donut Chart visual approximation using CSS conic-gradient */}
                <div 
                  className="w-48 h-48 rounded-full flex items-center justify-center relative"
                  style={{
                    background: `conic-gradient(var(--color-primary) ${stats.occupancyRate}%, var(--color-surface-container) 0)`
                  }}
                >
                  <div className="w-32 h-32 bg-surface-container-lowest rounded-full flex flex-col items-center justify-center">
                    <span className="text-stats-lg font-stats-lg text-primary">{stats.occupancyRate.toFixed(0)}%</span>
                    <span className="text-[10px] font-label-md text-on-surface-variant uppercase">Booked</span>
                  </div>
                </div>
              </div>
              <div className="space-y-4 mt-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-primary"></span>
                    <span className="text-sm font-body-md text-on-surface-variant">Total Rooms</span>
                  </div>
                  <span className="text-sm font-semibold">{stats.totalRooms}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-secondary"></span>
                    <span className="text-sm font-body-md text-on-surface-variant">Total Beds</span>
                  </div>
                  <span className="text-sm font-semibold">{stats.totalBeds}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-outline-variant"></span>
                    <span className="text-sm font-body-md text-on-surface-variant">Total Students</span>
                  </div>
                  <span className="text-sm font-semibold">{stats.totalStudents}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Operational Lists - 12 cols */}
          <div className="grid grid-cols-12 gap-6 mb-10">
            {/* Maintenance Requests (Complaints) */}
            <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)]">
              <div className="flex justify-between items-center mb-6">
                <h5 className="font-headline-sm font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">build</span>
                  Active Complaints
                </h5>
                <Link className="text-xs font-label-md text-secondary hover:underline" href="/owner/complaints">View All</Link>
              </div>
              <div className="space-y-4">
                {complaints.length > 0 ? complaints.map((complaint: any) => (
                  <div key={complaint._id} className="p-4 bg-error-container/10 border-l-4 border-error rounded-r-xl">
                    <div className="flex justify-between items-start mb-1">
                      <h6 className="font-bold text-sm truncate max-w-[150px]">{complaint.title}</h6>
                      <span className="text-[10px] bg-error/10 text-error px-2 py-0.5 rounded uppercase font-bold">{complaint.type}</span>
                    </div>
                    <p className="text-xs text-on-surface-variant mb-2 truncate">Room: {complaint.student?.room?.number || 'N/A'} - {complaint.student?.name}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-[10px] text-outline font-label-md">{new Date(complaint.createdAt).toLocaleDateString()}</span>
                      <Link href="/owner/complaints" className="text-[10px] font-label-md text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/20 hover:bg-primary/10 transition-colors">Resolve</Link>
                    </div>
                  </div>
                )) : (
                  <div className="text-center p-4 text-on-surface-variant text-sm">
                    No active complaints.
                  </div>
                )}
              </div>
            </div>

            {/* Staff Attendance (Managers) */}
            <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)]">
              <div className="flex justify-between items-center mb-6">
                <h5 className="font-headline-sm font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">badge</span>
                  Managers
                </h5>
                <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest bg-tertiary/10 px-2 py-1 rounded">{managers.length} Staff</span>
              </div>
              <div className="space-y-4">
                {managers.length > 0 ? managers.map((manager: any) => (
                  <div key={manager._id} className="flex items-center justify-between p-2 hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full overflow-hidden bg-surface-container flex items-center justify-center text-primary font-bold">
                        {manager.user?.name ? getInitials(manager.user.name) : 'M'}
                      </div>
                      <div>
                        <p className="text-sm font-bold">{manager.user?.name || 'Unknown'}</p>
                        <p className="text-[10px] text-on-surface-variant truncate max-w-[120px]">{manager.hostel?.name || 'Unassigned'}</p>
                      </div>
                    </div>
                    <span className={`w-2.5 h-2.5 rounded-full ${manager.isActive ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`}></span>
                  </div>
                )) : (
                  <div className="text-center p-4 text-on-surface-variant text-sm">
                    No managers found.
                  </div>
                )}
              </div>
              <Link href="/owner/managers" className="block text-center w-full mt-6 py-3 border border-outline-variant rounded-xl text-xs font-label-md text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all">Manage Staff</Link>
            </div>

            {/* Upcoming Bookings (Hostel Status) */}
            <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)]">
              <div className="flex justify-between items-center mb-6">
                <h5 className="font-headline-sm font-bold text-primary flex items-center gap-2">
                  <span className="material-symbols-outlined text-[20px]">apartment</span>
                  Your Properties
                </h5>
              </div>
              <div className="space-y-6">
                {hostels.slice(0, 3).map((hostel: any, idx: number) => (
                  <div key={hostel._id} className="relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-0 before:w-[2px] before:bg-outline-variant last:before:hidden">
                    <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary-container/20 border-4 border-surface flex items-center justify-center">
                      <div className={`w-1.5 h-1.5 rounded-full ${hostel.status === 'APPROVED' ? 'bg-green-500' : 'bg-orange-500'}`}></div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">{hostel.status}</span>
                      <p className="text-sm font-bold text-primary">{hostel.name}</p>
                      <p className="text-xs text-on-surface-variant truncate">
                        {typeof hostel.address === 'object' 
                          ? `${hostel.address?.street || ''}, ${hostel.address?.city || ''}`
                          : hostel.address}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Expense Breakdown Table */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)] overflow-hidden">
            <div className="p-8 border-b border-outline-variant flex justify-between items-center">
              <div>
                <h4 className="font-headline-md text-primary">Recent Expenses</h4>
                <p className="text-sm text-on-surface-variant">Latest operational costs</p>
              </div>
              <Link href="/owner/expenses" className="p-3 bg-surface border border-outline-variant rounded-xl text-primary hover:bg-surface-container transition-all">
                <span className="material-symbols-outlined">visibility</span>
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="px-8 py-4 text-label-md text-on-primary-fixed-variant uppercase tracking-wider">Title / Category</th>
                    <th className="px-8 py-4 text-label-md text-on-primary-fixed-variant uppercase tracking-wider">Hostel</th>
                    <th className="px-8 py-4 text-label-md text-on-primary-fixed-variant uppercase tracking-wider">Amount</th>
                    <th className="px-8 py-4 text-label-md text-on-primary-fixed-variant uppercase tracking-wider">Date</th>
                    <th className="px-8 py-4 text-label-md text-on-primary-fixed-variant uppercase tracking-wider">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {expenses.length > 0 ? expenses.map((expense: any) => (
                    <tr key={expense._id} className="hover:bg-surface-container transition-colors group cursor-pointer">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-primary/5 rounded-lg text-primary">
                            <span className="material-symbols-outlined">receipt</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="font-bold text-primary">{expense.title}</span>
                            <span className="text-xs text-on-surface-variant uppercase">{expense.category}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-on-surface-variant font-body-md">{expense.hostel?.name || 'N/A'}</td>
                      <td className="px-8 py-5 font-bold text-primary">{formatCurrency(expense.amount)}</td>
                      <td className="px-8 py-5 text-on-surface-variant font-body-md">{new Date(expense.date).toLocaleDateString()}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          expense.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                          expense.status === 'REJECTED' ? 'bg-red-100 text-red-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          {expense.status}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-8 py-8 text-center text-on-surface-variant">No recent expenses recorded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
