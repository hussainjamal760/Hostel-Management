'use client';

import React from 'react';
import { ComposedChart, Bar, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const chartData = [
  { name: 'Jan', Revenue: 3000 },
  { name: 'Feb', Revenue: 4500 },
  { name: 'Mar', Revenue: 3800 },
  { name: 'Apr', Revenue: 6000 },
  { name: 'May', Revenue: 5200 },
  { name: 'Jun', Revenue: 7500 },
  { name: 'Jul', Revenue: 8500 },
  { name: 'Aug', Revenue: 7000 },
  { name: 'Sep', Revenue: 9500 },
];

export default function AdminDashboardPage() {
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
              +12% <span className="material-symbols-outlined text-xs ml-1">trending_up</span>
            </span>
          </div>
          <p className="text-on-surface-variant font-label-md text-label-md mb-1">Total Hostels</p>
          <h3 className="font-stats-lg text-stats-lg text-primary">1,284</h3>
        </div>

        {/* Total Students */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl hover:-translate-y-1 hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary-container rounded-lg text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined">group</span>
            </div>
            <span className="text-emerald-600 text-xs font-bold flex items-center bg-emerald-50 px-2 py-1 rounded-full">
              +8% <span className="material-symbols-outlined text-xs ml-1">trending_up</span>
            </span>
          </div>
          <p className="text-on-surface-variant font-label-md text-label-md mb-1">Total Students</p>
          <h3 className="font-stats-lg text-stats-lg text-primary">42.5k</h3>
        </div>

        {/* Total Revenue */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl hover:-translate-y-1 hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary-container rounded-lg text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined">payments</span>
            </div>
            <span className="text-emerald-600 text-xs font-bold flex items-center bg-emerald-50 px-2 py-1 rounded-full">
              +24% <span className="material-symbols-outlined text-xs ml-1">trending_up</span>
            </span>
          </div>
          <p className="text-on-surface-variant font-label-md text-label-md mb-1">Total Revenue</p>
          <h3 className="font-stats-lg text-stats-lg text-primary">$1.42M</h3>
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
          <p className="text-on-surface-variant font-label-md text-label-md mb-1">Active Owners</p>
          <h3 className="font-stats-lg text-stats-lg text-primary">942</h3>
        </div>

        {/* Occupancy Rate */}
        <div className="bg-surface-container-lowest border border-outline-variant p-6 rounded-xl hover:-translate-y-1 hover:shadow-lg transition-all group">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-secondary-container rounded-lg text-on-secondary-container flex items-center justify-center">
              <span className="material-symbols-outlined">bed</span>
            </div>
            <div className="w-16 h-2 bg-surface-container rounded-full overflow-hidden self-center">
              <div className="h-full bg-secondary w-[88%]"></div>
            </div>
          </div>
          <p className="text-on-surface-variant font-label-md text-label-md mb-1">Occupancy Rate</p>
          <h3 className="font-stats-lg text-stats-lg text-primary">88.4%</h3>
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
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#82746f', fontSize: 12}} tickFormatter={(val) => `$${val/1000}k`} dx={-10} />
                <Tooltip 
                  cursor={{fill: '#f8e4dc', opacity: 0.5}} 
                  contentStyle={{ borderRadius: '12px', border: '1px solid #d4c3bd', backgroundColor: '#fff8f6', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px' }} 
                  itemStyle={{ color: '#432a1e', fontWeight: '800' }}
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
                  <span className="font-bold">$842k</span>
                </div>
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[75%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-body-sm mb-2">
                  <span>Standard Plan</span>
                  <span className="font-bold">$410k</span>
                </div>
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-secondary w-[45%]"></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-body-sm mb-2">
                  <span>Basic Plan</span>
                  <span className="font-bold">$168k</span>
                </div>
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-outline w-[25%]"></div>
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
              <p className="text-body-sm text-primary">Revenue increased by <span className="text-emerald-600">14%</span> this month.</p>
            </div>
          </div>
        </div>

        {/* Hostel Distribution Map */}
        <div className="col-span-12 bg-surface-container-lowest border border-outline-variant rounded-xl p-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
            <div>
              <h4 className="font-headline-md text-headline-md text-primary">Hostel Distribution</h4>
              <p className="text-body-sm text-on-surface-variant">Global presence and regional performance</p>
            </div>
            <div className="flex gap-4 mt-4 md:mt-0">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-primary rounded-full"></span>
                <span className="text-xs text-on-surface-variant">High Density</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-secondary rounded-full"></span>
                <span className="text-xs text-on-surface-variant">Medium Density</span>
              </div>
            </div>
          </div>
          <div className="h-[400px] w-full bg-surface-container rounded-xl relative overflow-hidden group">
            <div 
              className="absolute inset-0 grayscale opacity-40 group-hover:grayscale-0 transition-all duration-700 bg-cover bg-center" 
              style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBg526P1s4UhAumh_4IUpsN1ET-svvXBoHRiS0Ylni_zKfxjVdLwRT5a1hN4T_LmyMSNhDu0qrzt02le0RYjsNTL80a_qZo7fQJ52rKsF4IF6bOH6C82bGg51VzsTEUXIjtik6m59G2tbOlQHnZJWEJWKsECjHO-Q91yhYkDWPoaNADPABBcrE7kQNIVRbqKIv7AJTvk-dO32FEx5uVhbMB-6DJ9ecAfF2jTdreRpY5wDXDvObN9Mcjo4Cy1EJwXjovRN13naHadh1j')" }}
            ></div>
            {/* Pins */}
            <div className="absolute top-1/4 left-1/3 group-hover:scale-110 transition-transform duration-300">
              <div className="relative">
                <div className="absolute -inset-2 bg-primary/20 rounded-full animate-ping"></div>
                <div className="h-4 w-4 bg-primary border-2 border-white rounded-full relative z-10"></div>
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-white px-3 py-1 rounded shadow-lg text-[10px] font-bold whitespace-nowrap hidden group-hover:block">
                  London Hub (420)
                </div>
              </div>
            </div>
            <div className="absolute top-1/2 left-1/2">
              <div className="h-4 w-4 bg-secondary border-2 border-white rounded-full"></div>
            </div>
            <div className="absolute bottom-1/3 right-1/4">
              <div className="h-4 w-4 bg-primary border-2 border-white rounded-full"></div>
            </div>
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
                  <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider">Owner</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider">Plan</th>
                  <th className="px-6 py-4 font-label-md text-label-md text-primary uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-secondary-container flex items-center justify-center text-primary font-bold text-xs">SV</div>
                      <div>
                        <p className="font-bold text-sm">Sunset Villa</p>
                        <p className="text-xs text-on-surface-variant">California, US</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">John Sterling</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold bg-primary-container text-on-primary-container px-2 py-1 rounded-full">Premium</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span> Active
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-secondary-container flex items-center justify-center text-primary font-bold text-xs">GH</div>
                      <div>
                        <p className="font-bold text-sm">Green Heights</p>
                        <p className="text-xs text-on-surface-variant">London, UK</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">Amara Okafor</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold bg-surface-variant text-on-surface-variant px-2 py-1 rounded-full">Standard</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
                      <span className="w-1.5 h-1.5 bg-amber-600 rounded-full"></span> Pending
                    </span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-secondary-container flex items-center justify-center text-primary font-bold text-xs">TP</div>
                      <div>
                        <p className="font-bold text-sm">The Pavilion</p>
                        <p className="text-xs text-on-surface-variant">Paris, FR</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-on-surface-variant">Julian S.</td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold bg-primary-container text-on-primary-container px-2 py-1 rounded-full">Premium</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-600">
                      <span className="w-1.5 h-1.5 bg-emerald-600 rounded-full"></span> Active
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Activity & Health Feed */}
        <div className="space-y-6">
          {/* System Health */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
            <h4 className="font-headline-md text-headline-md text-primary mb-4">System Health</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-600">dns</span>
                  <span className="text-sm font-bold">Server Load</span>
                </div>
                <span className="text-xs text-on-surface-variant">14% - Optimal</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-surface-container-low rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-emerald-600">database</span>
                  <span className="text-sm font-bold">DB Sync</span>
                </div>
                <span className="text-xs text-on-surface-variant">99.9% Success</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-error-container/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <span className="material-symbols-outlined text-error">warning</span>
                  <span className="text-sm font-bold text-error">API Latency</span>
                </div>
                <span className="text-xs text-error">Spike in Asia-East</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Feed */}
          <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-6">
            <h4 className="font-headline-md text-headline-md text-primary mb-6">Live Activity</h4>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-[1px] before:bg-outline-variant">
              <div className="relative">
                <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-secondary border-2 border-white"></div>
                <p className="text-xs text-on-surface-variant mb-1">2 mins ago</p>
                <p className="text-sm">Payment of <span className="font-bold">$4,200</span> received from <span className="text-primary font-bold">Elite Residency</span>.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-outline-variant border-2 border-white"></div>
                <p className="text-xs text-on-surface-variant mb-1">15 mins ago</p>
                <p className="text-sm">New Hostel Onboarded: <span className="text-primary font-bold">Riverfront Suites</span>.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-outline-variant border-2 border-white"></div>
                <p className="text-xs text-on-surface-variant mb-1">1 hour ago</p>
                <p className="text-sm">System Update: Platform Core v2.4.1 deployed successfully.</p>
              </div>
              <div className="relative">
                <div className="absolute -left-[22px] top-1 w-3 h-3 rounded-full bg-secondary border-2 border-white"></div>
                <p className="text-xs text-on-surface-variant mb-1">4 hours ago</p>
                <p className="text-sm">New subscription: <span className="text-primary font-bold">The Grand Hostel</span> upgraded to Premium.</p>
              </div>
            </div>
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
