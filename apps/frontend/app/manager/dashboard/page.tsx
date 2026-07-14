'use client';

import React from 'react';
import { useAppSelector } from '@/lib/hooks';
import { useGetStudentStatsQuery, useGetStudentsQuery } from '@/lib/services/studentApi';
import { useGetExpenseStatsQuery, useGetExpensesQuery } from '@/lib/services/expenseApi';
import { useGetComplaintsQuery } from '@/lib/services/complaintApi';
import { useGetRoomsQuery } from '@/lib/services/roomApi';
import { format } from 'date-fns';

export default function ManagerDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  
  const { data: statsResponse, isLoading: isLoadingStats } = useGetStudentStatsQuery(user?.hostelId!, {
    skip: !user?.hostelId
  });
  const stats = statsResponse?.data || { totalCapacity: 0, currentOccupancy: 0, dueStudents: 0, totalStudents: 0 };

  const { data: expenseStatsResponse, isLoading: isLoadingExpenses } = useGetExpenseStatsQuery(user?.hostelId, {
      skip: !user?.hostelId
  });
  const expenseStats = expenseStatsResponse?.data || { pendingCount: 0, totalPending: 0 };

  // Fetch empty rooms
  const { data: emptyRoomsResponse } = useGetRoomsQuery({ hostelId: user?.hostelId, status: 'EMPTY', limit: 5 }, { skip: !user?.hostelId });
  const emptyRooms = emptyRoomsResponse?.data || [];

  // Fetch recent complaints
  const { data: complaintsResponse } = useGetComplaintsQuery({ limit: 5 });
  const complaints = complaintsResponse?.data || [];

  // Fetch overdue students
  const { data: dueStudentsResponse } = useGetStudentsQuery({ hostelId: user?.hostelId, feeStatus: 'DUE', limit: 5 }, { skip: !user?.hostelId });
  const dueStudents = dueStudentsResponse?.data || [];

  // Fetch recent students for activity stream
  const { data: recentStudentsResponse } = useGetStudentsQuery({ hostelId: user?.hostelId, limit: 5 }, { skip: !user?.hostelId });
  const recentStudents = recentStudentsResponse?.data || [];

  // Fetch recent expenses
  const { data: expensesResponse } = useGetExpensesQuery({ hostelId: user?.hostelId, limit: 5 }, { skip: !user?.hostelId });
  const recentExpenses = expensesResponse?.data || [];

  const isLoading = isLoadingStats || isLoadingExpenses;

  if (isLoading) {
    return (
       <div className="flex items-center justify-center h-full pt-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const managerFirstName = user?.name ? user.name.split(' ')[0] : 'Manager';
  const currentDate = format(new Date(), 'EEEE, MMM do');

  return (
    <>
      {/* Header & Stats Row */}
      <section className="mb-6">
        <div className="flex justify-between items-end mb-2">
          <div>
            <h2 className="text-display-lg-mobile md:text-display-lg text-primary">Daily Operations</h2>
            <p className="text-body-md text-on-surface-variant mt-2">{currentDate} • Welcome back, {managerFirstName}.</p>
          </div>
          <button className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl text-label-md hover:bg-on-primary-fixed-variant transition-colors shadow-sm">
            <span className="material-symbols-outlined">add</span>New Entry
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          {/* Stat Cards */}
          <div className="bg-surface p-6 rounded-2xl border border-outline-variant hover:border-secondary transition-colors cursor-pointer group shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-label-md text-on-surface-variant uppercase tracking-wider">Total Beds</span>
              <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">bed</span>
            </div>
            <p className="text-stats-lg text-primary">{stats.totalCapacity}</p>
            <div className="flex items-center gap-1 mt-2 text-on-tertiary-fixed-variant text-label-md">
              <span className="material-symbols-outlined text-sm">arrow_upward</span>
              <span>Available: {Math.max(0, stats.totalCapacity - stats.currentOccupancy)}</span>
            </div>
          </div>
          <div className="bg-surface p-6 rounded-2xl border border-outline-variant hover:border-secondary transition-colors cursor-pointer group shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-label-md text-on-surface-variant uppercase tracking-wider">Occupied Beds</span>
              <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">person</span>
            </div>
            <p className="text-stats-lg text-primary">{stats.currentOccupancy}</p>
            <div className="flex items-center gap-1 mt-2 text-on-surface-variant text-label-md">
              <span>{stats.totalCapacity > 0 ? Math.round((stats.currentOccupancy / stats.totalCapacity) * 100) : 0}% Filled</span>
            </div>
          </div>
          <div className="bg-surface p-6 rounded-2xl border border-outline-variant hover:border-secondary transition-colors cursor-pointer group shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-label-md text-on-surface-variant uppercase tracking-wider">Fee Defaulters</span>
              <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">warning</span>
            </div>
            <p className="text-stats-lg text-primary">{stats.dueStudents}</p>
            <div className="flex items-center gap-1 mt-2 text-on-surface-variant text-label-md">
              <span>Attention Required</span>
            </div>
          </div>
          <div className="bg-surface p-6 rounded-2xl border border-outline-variant hover:border-secondary transition-colors cursor-pointer group shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-label-md text-on-surface-variant uppercase tracking-wider">Pending Expenses</span>
              <span className="material-symbols-outlined text-secondary group-hover:scale-110 transition-transform">receipt_long</span>
            </div>
            <p className="text-stats-lg text-primary">{expenseStats.pendingCount}</p>
            <div className="flex items-center gap-1 mt-2 text-on-tertiary-fixed-variant text-label-md">
              <span>Rs {expenseStats.totalPending?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Bento Grid */}
      <div className="grid grid-cols-12 gap-6 mt-8">
        {/* Left Column: Operations (8 cols) */}
        <div className="col-span-12 lg:col-span-8 space-y-6">
          {/* Empty Rooms & Recent Complaints */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Empty Rooms */}
            <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden flex flex-col shadow-sm">
              <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                <h3 className="text-body-lg font-bold text-primary">Empty Rooms</h3>
                <button className="text-on-secondary-container hover:text-primary transition-colors">
                  <span className="material-symbols-outlined">open_in_new</span>
                </button>
              </div>
              <div className="p-6 space-y-4">
                {emptyRooms.length > 0 ? emptyRooms.map((room: any) => (
                  <div key={room._id} className="flex items-center justify-between p-3 bg-background border border-outline-variant rounded-xl">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-xs">{room.roomNumber}</div>
                      <div>
                        <p className="text-label-md">Room {room.roomNumber}</p>
                        <p className="text-body-sm text-on-surface-variant">{room.roomType} • {room.totalBeds} Beds</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 bg-surface-container-high text-primary rounded-full text-[10px] font-bold uppercase tracking-tight">Available</span>
                  </div>
                )) : <p className="text-body-sm text-on-surface-variant">No empty rooms.</p>}
              </div>
            </div>

            {/* Recent Complaints */}
            <div className="bg-surface border border-outline-variant rounded-2xl overflow-hidden flex flex-col shadow-sm">
              <div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
                <h3 className="text-body-lg font-bold text-primary">Recent Complaints</h3>
                <span className="px-2 py-1 bg-surface-container-highest text-on-surface-variant rounded-md text-label-md text-[10px]">{complaints.length} Open</span>
              </div>
              <div className="p-6 space-y-4">
                {complaints.length > 0 ? complaints.slice(0, 3).map((complaint: any) => (
                  <div key={complaint._id} className="flex items-center gap-4">
                    <div className="flex flex-col items-center">
                      <span className="material-symbols-outlined text-error text-[20px]">report</span>
                      <div className="w-[2px] h-4 bg-outline-variant"></div>
                    </div>
                    <div className="flex-1 p-3 bg-surface-container rounded-xl flex items-center justify-between border-l-4 border-error">
                      <span className="text-label-md truncate max-w-[150px]">{complaint.title}</span>
                      <span className="text-[10px] uppercase font-bold text-on-surface-variant">{complaint.status}</span>
                    </div>
                  </div>
                )) : <p className="text-body-sm text-on-surface-variant">No recent complaints.</p>}
              </div>
            </div>
          </div>

          {/* Open Complaints Table */}
          <div className="bg-surface border border-outline-variant rounded-2xl shadow-sm overflow-hidden">
            <div className="flex border-b border-outline-variant flex-wrap sm:flex-nowrap">
              <button className="px-6 py-4 text-label-md text-primary border-b-2 border-secondary font-bold">Open Complaints</button>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left min-w-[600px]">
                <thead>
                  <tr className="bg-surface-container-low">
                    <th className="px-6 py-4 text-label-md text-on-secondary-container">Complaint Title</th>
                    <th className="px-6 py-4 text-label-md text-on-secondary-container">Severity</th>
                    <th className="px-6 py-4 text-label-md text-on-secondary-container">Room</th>
                    <th className="px-6 py-4 text-label-md text-on-secondary-container">Status</th>
                    <th className="px-6 py-4 text-label-md text-on-secondary-container"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {complaints.length > 0 ? complaints.map((complaint: any) => (
                    <tr key={complaint._id} className="hover:bg-background transition-colors cursor-pointer group">
                      <td className="px-6 py-4 text-body-md text-primary font-medium">{complaint.title}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${complaint.severity === 'HIGH' ? 'bg-error-container text-error' : 'bg-surface-container-highest text-on-surface-variant'}`}>
                          {complaint.severity || 'NORMAL'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-body-sm text-on-surface-variant">{complaint.room?.roomNumber || 'General'}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${complaint.status === 'OPEN' ? 'bg-error' : 'bg-secondary'}`}></div>
                          <span className="text-body-sm">{complaint.status}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="material-symbols-outlined text-outline group-hover:text-primary transition-colors">more_vert</button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className="px-6 py-4 text-center text-body-sm text-on-surface-variant">No open complaints found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              <div className="p-4 border-t border-outline-variant text-center bg-surface-container-low/30">
                <button className="text-primary text-label-md hover:underline font-bold">View All Complaints</button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Context & Interaction (4 cols) */}
        <aside className="col-span-12 lg:col-span-4 space-y-6">
          {/* Quick Calendar & Notes */}
          <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-label-md text-on-surface-variant tracking-widest uppercase">Calendar</h3>
              <div className="flex gap-2">
                <button className="material-symbols-outlined text-sm hover:text-primary transition-colors p-1 bg-surface-container rounded-lg">chevron_left</button>
                <button className="material-symbols-outlined text-sm hover:text-primary transition-colors p-1 bg-surface-container rounded-lg">chevron_right</button>
              </div>
            </div>
            
            {/* Simplified Calendar UI */}
            <div className="grid grid-cols-7 gap-2 text-center mb-8">
              <span className="text-[10px] font-bold text-on-surface-variant">S</span>
              <span className="text-[10px] font-bold text-on-surface-variant">M</span>
              <span className="text-[10px] font-bold text-on-surface-variant">T</span>
              <span className="text-[10px] font-bold text-on-surface-variant">W</span>
              <span className="text-[10px] font-bold text-on-surface-variant">T</span>
              <span className="text-[10px] font-bold text-on-surface-variant">F</span>
              <span className="text-[10px] font-bold text-on-surface-variant">S</span>
              
              {/* Date Grid */}
              <span className="text-xs py-2 text-outline">21</span>
              <span className="text-xs py-2 text-outline">22</span>
              <span className="text-xs py-2 bg-primary text-on-primary rounded-lg font-bold shadow-md flex items-center justify-center">23</span>
              <span className="text-xs py-2 hover:bg-surface-container rounded-lg cursor-pointer transition-colors">24</span>
              <span className="text-xs py-2 hover:bg-surface-container rounded-lg cursor-pointer transition-colors">25</span>
              <span className="text-xs py-2 hover:bg-surface-container rounded-lg cursor-pointer transition-colors">26</span>
              <span className="text-xs py-2 hover:bg-surface-container rounded-lg cursor-pointer transition-colors">27</span>
            </div>
            
            <div className="border-t border-outline-variant pt-6">
              <h3 className="text-label-md text-on-surface-variant tracking-widest uppercase mb-4">Quick Notes</h3>
              <textarea 
                className="w-full bg-background border-none ring-1 ring-outline-variant rounded-xl p-4 text-body-sm focus:ring-2 focus:ring-secondary h-32 resize-none outline-none transition-shadow placeholder:text-outline/70" 
                placeholder="Draft a memo or reminder..."
              ></textarea>
              <div className="flex justify-end mt-2">
                <button className="text-secondary text-label-md hover:underline font-bold mt-2">Save Draft</button>
              </div>
            </div>
          </div>

          {/* Recent Activities (Students Added) */}
          <div className="bg-surface border border-outline-variant rounded-2xl flex flex-col h-[400px] shadow-sm">
            <div className="p-6 border-b border-outline-variant bg-surface-container-low">
              <h3 className="text-body-lg font-bold text-primary">Recent Students</h3>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
              {recentStudents.length > 0 ? recentStudents.slice(0, 5).map((student: any) => (
                <div key={student._id} className="flex gap-4">
                  <div className="relative">
                    <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center border border-outline-variant/30 z-10 relative">
                      <span className="material-symbols-outlined text-[16px] text-primary">person_add</span>
                    </div>
                    <div className="absolute top-8 left-[15px] w-[2px] h-[calc(100%+24px)] bg-outline-variant/50"></div>
                  </div>
                  <div className="pb-4">
                    <p className="text-label-md text-primary mb-0.5">New Student Added</p>
                    <p className="text-body-sm text-on-surface-variant">{student.fullName} assigned to Room {student.room?.roomNumber || 'TBD'}</p>
                    <p className="text-[10px] text-outline mt-1.5 uppercase font-bold tracking-wider">
                      {student.createdAt ? format(new Date(student.createdAt), 'MMM dd, yyyy') : 'Recently'}
                    </p>
                  </div>
                </div>
              )) : <p className="text-body-sm text-on-surface-variant">No recent students.</p>}
            </div>
          </div>
        </aside>
      </div>

      {/* Lower Lists: Payments & Requests */}
      <section className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Payment Follow-ups */}
        <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-body-lg font-bold text-primary">Payment Overdue</h3>
            <button className="text-secondary text-label-md hover:underline font-bold">Remind All</button>
          </div>
          <div className="space-y-4">
            {dueStudents.length > 0 ? dueStudents.map((student: any) => (
              <div key={student._id} className="flex items-center justify-between p-4 bg-background rounded-2xl border border-outline-variant hover:border-secondary transition-colors cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container font-bold text-xl border border-outline-variant">
                    {student.fullName?.[0] || 'S'}
                  </div>
                  <div>
                    <p className="text-label-md group-hover:text-primary transition-colors">{student.fullName}</p>
                    <p className="text-body-sm text-error font-medium">Room {student.room?.roomNumber || 'N/A'}</p>
                  </div>
                </div>
                <p className="text-label-md text-primary font-bold">DUE</p>
              </div>
            )) : <p className="text-body-sm text-on-surface-variant">No overdue payments.</p>}
          </div>
        </div>

        {/* Recent Expenses */}
        <div className="bg-surface border border-outline-variant rounded-2xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-body-lg font-bold text-primary">Recent Expenses</h3>
            <span className="bg-secondary-container text-on-secondary-container px-3 py-1 rounded-full text-xs font-bold tracking-wider">New</span>
          </div>
          <div className="space-y-4">
            {recentExpenses.length > 0 ? recentExpenses.map((expense: any) => (
              <div key={expense._id} className="flex items-center justify-between p-4 bg-background rounded-2xl border border-outline-variant hover:border-secondary transition-colors group">
                <div>
                  <p className="text-label-md group-hover:text-primary transition-colors mb-0.5">{expense.title}</p>
                  <p className="text-body-sm text-on-surface-variant">{expense.category} • Rs {expense.amount}</p>
                </div>
                <div className="flex gap-2 items-center">
                  <span className={`px-2 py-1 rounded text-[10px] font-bold ${expense.status === 'PENDING' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'}`}>
                    {expense.status}
                  </span>
                </div>
              </div>
            )) : <p className="text-body-sm text-on-surface-variant">No recent expenses.</p>}
          </div>
        </div>
      </section>
    </>
  );
}
