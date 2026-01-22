'use client';

import React from 'react';
import { HiOutlineUser, HiOutlineCurrencyDollar, HiOutlineClipboardList, HiOutlineOfficeBuilding } from 'react-icons/hi';
import { RecentActivity as RecentActivityType } from '@/lib/services/adminApi';

interface RecentActivityProps {
  activities?: RecentActivityType[];
  isLoading?: boolean;
}

const iconMap = {
  user: { icon: HiOutlineUser, bg: 'bg-blue-100 dark:bg-blue-900/30', color: 'text-blue-600 dark:text-blue-400' },
  payment: { icon: HiOutlineCurrencyDollar, bg: 'bg-green-100 dark:bg-green-900/30', color: 'text-green-600 dark:text-green-400' },
  complaint: { icon: HiOutlineClipboardList, bg: 'bg-red-100 dark:bg-red-900/30', color: 'text-red-600 dark:text-red-400' },
  hostel: { icon: HiOutlineOfficeBuilding, bg: 'bg-purple-100 dark:bg-purple-900/30', color: 'text-purple-600 dark:text-purple-400' },
};

const RecentActivity: React.FC<RecentActivityProps> = ({ activities, isLoading }) => {
  return (
    <div className="bg-white dark:bg-dark-card/50 rounded-2xl shadow-sm border border-brand-card/30 dark:border-dark-card/30 overflow-hidden h-full">
      <div className="p-6 border-b border-brand-card/30 dark:border-dark-card/30">
        <h3 className="text-lg font-bold text-brand-text dark:text-dark-text">Recent Activity</h3>
      </div>
      
      {isLoading ? (
        <div className="p-4 space-y-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-start gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-brand-card/30 dark:bg-dark-card/50" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-brand-card/30 dark:bg-dark-card/50 rounded w-3/4" />
                <div className="h-3 bg-brand-card/20 dark:bg-dark-card/30 rounded w-1/4" />
              </div>
            </div>
          ))}
        </div>
      ) : !activities || activities.length === 0 ? (
        <div className="p-8 text-center text-brand-text/50 dark:text-dark-text/50">
          <p className="text-lg">No recent activity</p>
          <p className="text-sm mt-1">Activities will appear as users interact with the platform</p>
        </div>
      ) : (
        <div className="divide-y divide-brand-card/30 dark:divide-dark-card/30 max-h-[400px] overflow-y-auto">
          {activities.map((activity) => {
            const { icon: Icon, bg, color } = iconMap[activity.type];
            return (
              <div key={activity.id} className="p-4 hover:bg-brand-card/10 dark:hover:bg-dark-card/20 transition-colors">
                <div className="flex items-start gap-4">
                  <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}>
                    <Icon size={20} className={color} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-brand-text dark:text-dark-text line-clamp-2">{activity.message}</p>
                    <p className="text-xs text-brand-text/50 dark:text-dark-text/50 mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="p-4 border-t border-brand-card/30 dark:border-dark-card/30">
        <button className="w-full text-sm font-medium text-brand-primary dark:text-dark-primary hover:underline">
          View All Activity
        </button>
      </div>
    </div>
  );
};

export default RecentActivity;
