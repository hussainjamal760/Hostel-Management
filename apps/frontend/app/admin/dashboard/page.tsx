'use client';

import React from 'react';
import { ComposedChart, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useGetDashboardStatsQuery } from '@/lib/services/adminApi';
import { useGetAllHostelsQuery } from '@/lib/services/hostelApi';

export default function AdminDashboardPage() {
  const { data: statsResponse, isLoading, error } = useGetDashboardStatsQuery();
  const { data: hostelsResponse, isLoading: hostelsLoading } = useGetAllHostelsQuery({ limit: 5 });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !statsResponse?.success) {
    return (
      <div className="p-8 bg-error-container/20 rounded-xl text-error text-center font-bold">
        Failed to load dashboard data. Please try again.
      </div>
    );
  }

  const stats = statsResponse.data;
  
  // Replace Occupancy Rate with Pending Payments Amount
  const pendingPaymentsAmount = stats.pendingPaymentsAmount || 0;
  const pendingPaymentsCount = stats.pendingPayments || 0;

  // Format Recharts data
  const chartData = stats.monthlyRevenue.map((item) => ({
    name: item.month,
    Revenue: item.revenue
  }));

  // Mock revenue analytics distribution (since backend doesn't explicitly return plan tiers yet)
  const premiumRev = Math.round(stats.totalRevenue * 0.6);
  const stdRev = Math.round(stats.totalRevenue * 0.3);
  const basicRev = Math.round(stats.totalRevenue * 0.1);

  return (
    <>
      {/* Header Section */}
      <section className="mb-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="font-display-lg text-display-lg text-primary tracking-tight mb-2">Platform Overview</h2>
            <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl">
              Good morning, Administrator. Here is the real-time status of your global HMS ecosystem across all active regions.
            </p>
          </div>
          <div className="flex gap-4">
            <button className="flex items-center gap-2 px-6 py-3 border border-secondary text-secondary rounded-xl font-label-md text-label-md hover:bg-surface-container-low transition-all">
              <span className="material-symbols-outlined">download</span>
              Export Report
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-primary text-on-primary rounded-xl font-label-md text-label-md hover:opacity-90 transition-all shadow-md">
              <span className="material-symbols-outlined">add</span>
              Onboard Hostel
            </button>
          </div>
        </div>
      </section>

      {/* KPI WIDGETS */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        {/* Total Hostels */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl hover:-translate-y-1 hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary-container rounded-lg text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined">apartment</span>
            </div>
            <span className="text-emerald-600 text-xs font-bold flex items-center bg-emerald-50 px-2 py-1 rounded-full">
              +{stats.recentTrends.hostelsGrowth}% <span className="material-symbols-outlined text-xs ml-1">trending_up</span>
            </span>
          </div>
          <p className="text-on-surface-variant font-label-md text-label-md mb-1">Total Hostels</p>
          <h3 className="font-stats-lg text-stats-lg text-primary">{stats.totalHostelsOnboarded.toLocaleString()}</h3>
        </div>

        {/* Total Students */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl hover:-translate-y-1 hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary-container rounded-lg text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined">group</span>
            </div>
            <span className="text-emerald-600 text-xs font-bold flex items-center bg-emerald-50 px-2 py-1 rounded-full">
              +{stats.recentTrends.studentsGrowth}% <span className="material-symbols-outlined text-xs ml-1">trending_up</span>
            </span>
          </div>
          <p className="text-on-surface-variant font-label-md text-label-md mb-1">Total Students</p>
          <h3 className="font-stats-lg text-stats-lg text-primary">{(stats.totalStudents / 1000).toFixed(1)}k</h3>
        </div>

        {/* Total Revenue */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl hover:-translate-y-1 hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary-container rounded-lg text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-emerald-600 text-xs font-bold flex items-center bg-emerald-50 px-2 py-1 rounded-full">
              +{stats.recentTrends.revenueGrowth}% <span className="material-symbols-outlined text-xs ml-1">trending_up</span>
            </span>
          </div>
          <p className="text-on-surface-variant font-label-md text-label-md mb-1">Total Revenue</p>
          <h3 className="font-stats-lg text-stats-lg text-primary">PKR {(stats.totalRevenue / 1000).toFixed(1)}k</h3>
        </div>

        {/* Active Owners */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl hover:-translate-y-1 hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary-container rounded-lg text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined">person_check</span>
            </div>
            <span className="text-on-surface-variant text-xs font-bold flex items-center bg-surface-container px-2 py-1 rounded-full">
              Stable
            </span>
          </div>
          <p className="text-on-surface-variant font-label-md text-label-md mb-1">Active Hostels</p>
          <h3 className="font-stats-lg text-stats-lg text-primary">{stats.totalActiveHostels.toLocaleString()}</h3>
        </div>

        {/* Pending Payments */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl hover:-translate-y-1 hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-error-container rounded-lg text-error flex items-center justify-center">
              <span className="material-symbols-outlined">pending_actions</span>
            </div>
            <span className="text-error text-xs font-bold flex items-center bg-error-container/30 px-2 py-1 rounded-full">
              {pendingPaymentsCount} Pending
            </span>
          </div>
          <p className="text-on-surface-variant font-label-md text-label-md mb-1">Pending Dues</p>
          <h3 className="font-stats-lg text-stats-lg text-primary">PKR {(pendingPaymentsAmount / 1000).toFixed(1)}k</h3>
        </div>
      </section>

      {/* ANALYTICS GRID */}
      <section className="grid grid-cols-12 gap-6 mb-12">
        {/* Platform Growth */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-8 overflow-hidden relative min-h-[400px]">
          <div className="flex justify-between items-center mb-8 relative z-10">
            <div>
              <h4 className="font-headline-md text-headline-md text-primary">Platform Growth</h4>
              <p className="text-body-sm text-on-surface-variant">New hostel registrations vs revenue trends</p>
            </div>
            <select className="bg-surface border-outline-variant rounded-lg font-label-md text-label-md text-on-surface-variant px-3 py-2">
              <option>Last 6 Months</option>
              <option>Last Year</option>
            </select>
          </div>
          {/* Real Recharts Visualization */}
          <div className="w-full h-72 mt-8 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9A67B" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="#C9A67B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#d4c3bd" opacity={0.4} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#82746f', fontSize: 12, fontWeight: '600'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#82746f', fontSize: 12}} tickFormatter={(val) => `PKR ${val/1000}k`} dx={-10} />
                <Tooltip 
                  cursor={{fill: '#f8e4dc', opacity: 0.5}} 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #d4c3bd', backgroundColor: '#fff8f6', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }} 
                  itemStyle={{ color: '#432a1e', fontWeight: '800' }}
                  formatter={(value) => [`PKR ${value}`, 'Revenue']}
                />
                <Bar dataKey="Revenue" fill="#432a1e" radius={[6, 6, 0, 0]} maxBarSize={36} opacity={0.9} />
                <Area type="monotone" dataKey="Revenue" stroke="#C9A67B" strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue Analytics */}
        <div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-8 flex flex-col justify-between">
          <div>
            <h4 className="font-headline-md text-headline-md text-primary mb-2">Revenue Analytics</h4>
            <p className="text-body-sm text-on-surface-variant mb-8">Monthly subscription breakdown</p>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-body-sm mb-2">
                  <span>Premium Plan</span>
                  <span className="font-bold">PKR {(premiumRev / 1000).toFixed(0)}k</span>
                </div>
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[60%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-body-sm mb-2">
                  <span>Standard Plan</span>
                  <span className="font-bold">PKR {(stdRev / 1000).toFixed(0)}k</span>
                </div>
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-[30%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-body-sm mb-2">
                  <span>Basic Plan</span>
                  <span className="font-bold">PKR {(basicRev / 1000).toFixed(0)}k</span>
                </div>
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-outline w-[10%]"></div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-12 p-4 bg-surface-container-low rounded-xl border border-outline-variant/30 flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-secondary shadow-sm">
              <span className="material-symbols-outlined">insights</span>
            </div>
            <div>
              <p className="text-xs font-bold text-on-surface-variant">Insight</p>
              <p className="text-body-sm text-primary">MRR sits at <span className="text-emerald-600">PKR {stats.monthlyRecurringRevenue.toLocaleString()}</span> this month.</p>
            </div>
          </div>
        </div>

        {/* Hostel Distribution Map */}
        <div className="col-span-12 bg-surface-container-lowest border border-outline-variant rounded-xl p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h4 className="font-headline-md text-headline-md text-primary">Hostel Distribution</h4>
              <p className="text-body-sm text-on-surface-variant">Top operating regions (Live data)</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 mb-4">
            {stats.hostelsByCity.map((city, idx) => (
              <div key={idx} className="bg-surface-container px-4 py-2 rounded-xl text-primary font-bold text-sm flex gap-2 items-center shadow-sm">
                <span className="material-symbols-outlined text-[16px]">location_on</span>
                {city.city}: {city.count}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TABLES & FEEDS */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Registrations (Table) */}
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden flex flex-col">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center">
            <h4 className="font-headline-md text-headline-md text-primary">Recent Registrations</h4>
            <button className="text-secondary font-label-md text-label-md hover:underline">View All</button>
          </div>
          <div className="flex-1 overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low border-b border-outline-variant">
                <tr>
                  <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider">Hostel Name</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider">City</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {hostelsLoading ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-on-surface-variant animate-pulse">
                      Loading hostels...
                    </td>
                  </tr>
                ) : hostelsResponse?.data?.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="px-6 py-8 text-center text-on-surface-variant">
                      No hostels registered yet.
                    </td>
                  </tr>
                ) : (
                  hostelsResponse?.data?.slice(0, 5).map((hostel) => (
                    <tr key={hostel._id} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-secondary-container flex items-center justify-center text-primary font-bold text-xs">
                            {hostel.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{hostel.name}</p>
                            <p className="text-xs text-on-surface-variant">
                              Since {new Date(hostel.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-on-surface-variant">
                        {hostel.address?.city || 'N/A'}
                      </td>
                      <td className="px-6 py-4">
                        {hostel.isActive ? (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                            <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                            <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span> Pending
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="space-y-6">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
            <h4 className="font-headline-md text-headline-md text-primary mb-6">Live Activity</h4>
            
            {stats.recentActivity.length === 0 ? (
              <p className="text-sm text-on-surface-variant text-center py-4">No recent activity found.</p>
            ) : (
              <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant">
                {stats.recentActivity.slice(0, 5).map((activity) => (
                  <div key={activity.id} className="relative">
                    <div className={`absolute -left-[22px] top-1 w-3 h-3 rounded-full border-2 border-white ${
                      activity.type === 'payment' ? 'bg-emerald-500' : 
                      activity.type === 'user' ? 'bg-secondary' : 
                      activity.type === 'complaint' ? 'bg-error' : 'bg-primary'
                    }`}></div>
                    <p className="text-xs text-on-surface-variant mb-1">{activity.time}</p>
                    <p className="text-sm">
                      {activity.type === 'payment' ? (
                        <>Payment of <span className="font-bold">{activity.message.match(/PKR [\d,]+/)?.[0] || 'Amount'}</span> received.</>
                      ) : (
                        activity.message
                      )}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Subscription Management */}
      <section className="mt-12 bg-primary p-8 rounded-xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-on-primary">
          <div className="text-center md:text-left">
            <h3 className="font-display-lg text-display-lg-mobile md:text-display-lg mb-2">Optimize Platform Performance</h3>
            <p className="font-body-lg text-body-lg opacity-80">Access advanced data warehousing and AI-driven growth forecasting tools.</p>
          </div>
          <button className="px-8 py-4 bg-white text-primary rounded-xl font-bold hover:scale-105 transition-transform shadow-xl whitespace-nowrap">
            Launch Enterprise Tools
          </button>
        </div>
      </section>
    </>
  );
}

