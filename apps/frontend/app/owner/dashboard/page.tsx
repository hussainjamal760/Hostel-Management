'use client';

import React from 'react';

export default function OwnerDashboard() {
  return (
    <div className="space-y-8">
      {/* Header & Quick Actions */}
      <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-10">
        <div>
          <h2 className="font-headline-lg text-headline-lg text-primary mb-1">Owner Overview</h2>
          <p className="text-on-surface-variant font-body-md opacity-80">Real-time performance and operational health for The Heritage Grand.</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 px-5 py-3 bg-surface-container border border-outline-variant rounded-xl text-primary font-label-md hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined text-[20px]">person_add</span>
            Add Student
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-surface-container border border-outline-variant rounded-xl text-primary font-label-md hover:bg-surface-container-high transition-all">
            <span className="material-symbols-outlined text-[20px]">event_available</span>
            New Booking
          </button>
          <button className="flex items-center gap-2 px-5 py-3 bg-primary text-white rounded-xl text-label-md hover:shadow-lg transition-all active:scale-95">
            <span className="material-symbols-outlined text-[20px]">description</span>
            Generate Invoice
          </button>
        </div>
      </div>

      {/* KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-10">
        {/* KPI 1 */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)] group hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary-container/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-primary">move_down</span>
            </div>
            <span className="text-label-md text-secondary font-semibold">+12% vs LW</span>
          </div>
          <div className="space-y-1">
            <p className="text-on-surface-variant text-sm font-label-md uppercase tracking-wider">Today's Activity</p>
            <div className="flex items-end gap-2">
              <h3 className="text-stats-lg font-stats-lg text-primary">18</h3>
              <span className="text-body-sm text-on-surface-variant pb-1">/ 12 out</span>
            </div>
          </div>
        </div>

        {/* KPI 2 */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)] group hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-tertiary-container/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-tertiary">hotel</span>
            </div>
            <span className="text-label-md text-tertiary font-semibold">92% Capacity</span>
          </div>
          <div className="space-y-1">
            <p className="text-on-surface-variant text-sm font-label-md uppercase tracking-wider">Room Occupancy</p>
            <div className="flex items-end gap-2">
              <h3 className="text-stats-lg font-stats-lg text-primary">148</h3>
              <span className="text-body-sm text-on-surface-variant pb-1">/ 12 empty</span>
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
            <p className="text-on-surface-variant text-sm font-label-md uppercase tracking-wider">Monthly Revenue</p>
            <div className="flex items-end gap-2">
              <h3 className="text-stats-lg font-stats-lg text-primary">$42,850</h3>
            </div>
          </div>
        </div>

        {/* KPI 4 */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-2xl shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)] group hover:-translate-y-1 transition-transform duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-error-container/10 rounded-xl group-hover:scale-110 transition-transform duration-300">
              <span className="material-symbols-outlined text-error">priority_high</span>
            </div>
            <button className="text-xs font-label-md text-error underline decoration-2 underline-offset-4">Remind All</button>
          </div>
          <div className="space-y-1">
            <p className="text-on-surface-variant text-sm font-label-md uppercase tracking-wider">Pending Dues</p>
            <div className="flex items-end gap-2">
              <h3 className="text-stats-lg font-stats-lg text-error">$3,120</h3>
              <span className="text-body-sm text-on-surface-variant pb-1">8 students</span>
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
              <p className="text-sm text-on-surface-variant">Revenue vs Expenses over 6 months</p>
            </div>
            <select className="bg-surface border-outline-variant text-xs font-label-md rounded-lg focus:ring-primary focus:border-primary">
              <option>Last 6 Months</option>
              <option>Fiscal Year</option>
            </select>
          </div>
          {/* Chart Placeholder */}
          <div className="h-64 flex items-end justify-between gap-4 relative pt-10">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none">
              <div className="border-b border-outline-variant/30 w-full"></div>
              <div className="border-b border-outline-variant/30 w-full"></div>
              <div className="border-b border-outline-variant/30 w-full"></div>
              <div className="border-b border-outline-variant/30 w-full"></div>
            </div>
            {/* Bars/Line Sim */}
            <div className="flex-1 flex flex-col items-center group">
              <div className="w-full bg-primary/10 rounded-t-lg h-[40%] group-hover:bg-primary/20 transition-all duration-500 relative">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">$28k</div>
              </div>
              <span className="mt-4 text-[11px] font-label-md text-on-surface-variant">MAR</span>
            </div>
            <div className="flex-1 flex flex-col items-center group">
              <div className="w-full bg-primary/10 rounded-t-lg h-[55%] group-hover:bg-primary/20 transition-all duration-500 relative">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">$32k</div>
              </div>
              <span className="mt-4 text-[11px] font-label-md text-on-surface-variant">APR</span>
            </div>
            <div className="flex-1 flex flex-col items-center group">
              <div className="w-full bg-primary/10 rounded-t-lg h-[65%] group-hover:bg-primary/20 transition-all duration-500 relative">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">$38k</div>
              </div>
              <span className="mt-4 text-[11px] font-label-md text-on-surface-variant">MAY</span>
            </div>
            <div className="flex-1 flex flex-col items-center group">
              <div className="w-full bg-primary h-[85%] rounded-t-lg group-hover:opacity-90 transition-all duration-500 relative">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">$45k</div>
              </div>
              <span className="mt-4 text-[11px] font-label-md text-on-surface-variant">JUN</span>
            </div>
            <div className="flex-1 flex flex-col items-center group">
              <div className="w-full bg-primary/10 rounded-t-lg h-[75%] group-hover:bg-primary/20 transition-all duration-500 relative">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">$41k</div>
              </div>
              <span className="mt-4 text-[11px] font-label-md text-on-surface-variant">JUL</span>
            </div>
            <div className="flex-1 flex flex-col items-center group">
              <div className="w-full bg-primary/10 rounded-t-lg h-[80%] group-hover:bg-primary/20 transition-all duration-500 relative">
                <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-primary text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">$42k</div>
              </div>
              <span className="mt-4 text-[11px] font-label-md text-on-surface-variant">AUG</span>
            </div>
          </div>
        </div>

        {/* Room Occupancy - 4 cols */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant p-8 rounded-3xl shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)] flex flex-col">
          <h4 className="font-headline-md text-primary mb-1">Occupancy Hub</h4>
          <p className="text-sm text-on-surface-variant mb-8">Capacity by wing</p>
          <div className="flex-1 flex items-center justify-center relative py-6">
            {/* Simulated Donut Chart */}
            <div className="w-48 h-48 rounded-full border-[16px] border-surface-container flex items-center justify-center relative">
              <div className="absolute inset-0 rounded-full border-[16px] border-primary border-r-transparent border-b-transparent -rotate-12"></div>
              <div className="flex flex-col items-center">
                <span className="text-stats-lg font-stats-lg text-primary">92%</span>
                <span className="text-[10px] font-label-md text-on-surface-variant uppercase">Booked</span>
              </div>
            </div>
          </div>
          <div className="space-y-4 mt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-primary"></span>
                <span className="text-sm font-body-md text-on-surface-variant">Premium Wing</span>
              </div>
              <span className="text-sm font-semibold">100%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-secondary"></span>
                <span className="text-sm font-body-md text-on-surface-variant">Student Wing A</span>
              </div>
              <span className="text-sm font-semibold">88%</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-outline-variant"></span>
                <span className="text-sm font-body-md text-on-surface-variant">Student Wing B</span>
              </div>
              <span className="text-sm font-semibold">91%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Lists - 12 cols */}
      <div className="grid grid-cols-12 gap-6 mb-10">
        {/* Maintenance Requests */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)]">
          <div className="flex justify-between items-center mb-6">
            <h5 className="font-headline-sm font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">build</span>
              Maintenance
            </h5>
            <a className="text-xs font-label-md text-secondary hover:underline" href="#">View All</a>
          </div>
          <div className="space-y-4">
            <div className="p-4 bg-error-container/10 border-l-4 border-error rounded-r-xl">
              <div className="flex justify-between items-start mb-1">
                <h6 className="font-bold text-sm">AC Leakage - Room 204</h6>
                <span className="text-[10px] bg-error/10 text-error px-2 py-0.5 rounded uppercase font-bold">Urgent</span>
              </div>
              <p className="text-xs text-on-surface-variant mb-2">Reported by: Alex Rivera</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-outline font-label-md">2h ago</span>
                <button className="text-[10px] font-label-md text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/20 hover:bg-primary/10 transition-colors">Assign Staff</button>
              </div>
            </div>
            <div className="p-4 bg-surface-container-low border-l-4 border-secondary rounded-r-xl opacity-80">
              <div className="flex justify-between items-start mb-1">
                <h6 className="font-bold text-sm">Wi-Fi Connectivity</h6>
                <span className="text-[10px] bg-secondary/10 text-secondary px-2 py-0.5 rounded uppercase font-bold">Medium</span>
              </div>
              <p className="text-xs text-on-surface-variant mb-2">Common Area - Floor 3</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-outline font-label-md">5h ago</span>
                <button className="text-[10px] font-label-md text-primary bg-primary/5 px-3 py-1 rounded-full border border-primary/20 hover:bg-primary/10 transition-colors">Assign Staff</button>
              </div>
            </div>
          </div>
        </div>

        {/* Staff Attendance */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)]">
          <div className="flex justify-between items-center mb-6">
            <h5 className="font-headline-sm font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">badge</span>
              Staff Presence
            </h5>
            <span className="text-[10px] font-bold text-tertiary uppercase tracking-widest bg-tertiary/10 px-2 py-1 rounded">12 Online</span>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-2 hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-surface-container">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBx4kbtMYItvAZO4GOe8JalV2x6TKSf2sr00SUpZD8G6E4X5eIup5j2166vKCfa_XDEX1Zz8aTS4t2gcSZw9qJ_xNZLMQstzwyXwfUs46qLkDl0jn-DedaEnGuyKuA2t9SXI7yNUyQ-I_Aj0L5I-Bc0WjDrpaYB1D9zADuMbgxoa7UwJThqDZdWxY_mTkhQxwhvniebDyZlB3q9XU4Qi46qW01TkpAMs80afNoE43e1IZd3SViLFzWh6ExvRKhBOTt9gyLN4m8Txbf" alt="Elena" />
                </div>
                <div>
                  <p className="text-sm font-bold">Elena Vance</p>
                  <p className="text-[10px] text-on-surface-variant">Front Desk Manager</p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-surface-container">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCNQWjHNaJMhZj0UJGCicvYt9rnJTIQC2-i9zni2Qy7J0_rKTxxnZPCwccRnfvjpab5LCT71Pf6WbNQDRmaDhLwQYvWOnki3UUVc-VJxVfZHaWFmkDSvYFxIFMbKxsI7UFIKvYlzqIUsapo4S-A9b-2E3eAhhTmz5QQlPd1gkDt1qAlKJ4-NqKarpB-WLIs2w57v6hAR44bBEqShAX4Oak6lBpjiU6fxYN1DTN96WZ0EA00c5alqQAbxJ8lWmT9rrYwzBLTb7JJl32W" alt="John" />
                </div>
                <div>
                  <p className="text-sm font-bold">John Cooper</p>
                  <p className="text-[10px] text-on-surface-variant">Security Lead</p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
            </div>
            <div className="flex items-center justify-between p-2 hover:bg-surface-container-low rounded-xl transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden bg-surface-container">
                  <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCoky0DppUIIhPdyUqJ5TGNvB9HFArYzASt9YxOq4-8oirCBh_VTVwrGWvAM8nO8S1oKu90Txq6jzARc4ckA9rWCwg3NVYSBrGe2sxfwZt129uIGwetJdeVrPTHrWZIfoWYjTWMay3DgqNWkZZQsnpFsNfvAey2db21BmTTclcPoIWjomMNihwos12jXkRvwIHZWo9t3IgO8D9ZjWbaPrp_JhkmvGfj2cZcp--O1FBdHHDUmqOflSCZlpwR0_7-edRHzs71gMNPOEG" alt="Marcus" />
                </div>
                <div>
                  <p className="text-sm font-bold">Marcus Thorne</p>
                  <p className="text-[10px] text-on-surface-variant">IT Operations</p>
                </div>
              </div>
              <span className="w-2.5 h-2.5 rounded-full bg-orange-400"></span>
            </div>
          </div>
          <button className="w-full mt-6 py-3 border border-outline-variant rounded-xl text-xs font-label-md text-on-surface-variant hover:bg-surface-container hover:text-primary transition-all">View All Roster</button>
        </div>

        {/* Upcoming Bookings */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant p-6 rounded-3xl shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)]">
          <div className="flex justify-between items-center mb-6">
            <h5 className="font-headline-sm font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-[20px]">calendar_month</span>
              Pipeline
            </h5>
          </div>
          <div className="space-y-6">
            <div className="relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-0 before:w-[2px] before:bg-outline-variant last:before:hidden">
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary-container/20 border-4 border-surface flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-secondary uppercase tracking-tighter">Sept 12 (Tomorrow)</span>
                <p className="text-sm font-bold text-primary">Suite 405 Check-in</p>
                <p className="text-xs text-on-surface-variant">Resident: Julian Smith (Paid)</p>
              </div>
            </div>
            <div className="relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-0 before:w-[2px] before:bg-outline-variant last:before:hidden">
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary-container/10 border-4 border-surface flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-outline-variant"></div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase tracking-tighter">Sept 15</span>
                <p className="text-sm font-bold text-primary">Room 102 Checkout</p>
                <p className="text-xs text-on-surface-variant">Resident: Maria Garcia</p>
              </div>
            </div>
            <div className="relative pl-8 before:absolute before:left-3 before:top-2 before:bottom-0 before:w-[2px] before:bg-outline-variant last:before:hidden">
              <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary-container/10 border-4 border-surface flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-outline-variant"></div>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-[10px] font-bold text-on-surface-variant opacity-60 uppercase tracking-tighter">Sept 18</span>
                <p className="text-sm font-bold text-primary">3 Group Bookings</p>
                <p className="text-xs text-on-surface-variant">Academic Quarter Intake</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expense Breakdown Table */}
      <div className="bg-surface-container-lowest border border-outline-variant rounded-3xl shadow-[0_4px_20px_-2px_rgba(92,64,51,0.08)] overflow-hidden">
        <div className="p-8 border-b border-outline-variant flex justify-between items-center">
          <div>
            <h4 className="font-headline-md text-primary">Expense Breakdown</h4>
            <p className="text-sm text-on-surface-variant">Top operational costs this month</p>
          </div>
          <button className="p-3 bg-surface border border-outline-variant rounded-xl text-primary hover:bg-surface-container transition-all">
            <span className="material-symbols-outlined">filter_list</span>
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="px-8 py-4 text-label-md text-on-primary-fixed-variant uppercase tracking-wider">Category</th>
                <th className="px-8 py-4 text-label-md text-on-primary-fixed-variant uppercase tracking-wider">Provider</th>
                <th className="px-8 py-4 text-label-md text-on-primary-fixed-variant uppercase tracking-wider">Amount</th>
                <th className="px-8 py-4 text-label-md text-on-primary-fixed-variant uppercase tracking-wider">Date</th>
                <th className="px-8 py-4 text-label-md text-on-primary-fixed-variant uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              <tr className="hover:bg-surface-container transition-colors group cursor-pointer">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/5 rounded-lg text-primary">
                      <span className="material-symbols-outlined">bolt</span>
                    </div>
                    <span className="font-bold text-primary">Utilities</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-on-surface-variant font-body-md">Municipal Power Grid</td>
                <td className="px-8 py-5 font-bold text-primary">$4,210.00</td>
                <td className="px-8 py-5 text-on-surface-variant font-body-md">Aug 28, 2023</td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">Paid</span>
                </td>
              </tr>
              <tr className="hover:bg-surface-container transition-colors group cursor-pointer">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/5 rounded-lg text-primary">
                      <span className="material-symbols-outlined">restaurant</span>
                    </div>
                    <span className="font-bold text-primary">Catering</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-on-surface-variant font-body-md">Boutique Kitchens Inc</td>
                <td className="px-8 py-5 font-bold text-primary">$12,850.00</td>
                <td className="px-8 py-5 text-on-surface-variant font-body-md">Aug 30, 2023</td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-bold uppercase">Paid</span>
                </td>
              </tr>
              <tr className="hover:bg-surface-container transition-colors group cursor-pointer">
                <td className="px-8 py-5">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/5 rounded-lg text-primary">
                      <span className="material-symbols-outlined">cleaning_services</span>
                    </div>
                    <span className="font-bold text-primary">Maintenance</span>
                  </div>
                </td>
                <td className="px-8 py-5 text-on-surface-variant font-body-md">Pristine Care Co.</td>
                <td className="px-8 py-5 font-bold text-primary">$1,800.00</td>
                <td className="px-8 py-5 text-on-surface-variant font-body-md">Sept 01, 2023</td>
                <td className="px-8 py-5">
                  <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-[10px] font-bold uppercase">Processing</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
