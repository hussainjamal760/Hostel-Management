'use client';

import React from 'react';
import Link from 'next/link';
import { HiOutlinePlus, HiOutlineUsers, HiOutlineOfficeBuilding, HiOutlineDocumentReport, HiOutlineCog } from 'react-icons/hi';

interface QuickAction {
  name: string;
  description: string;
  href: string;
  icon: React.ElementType;
  color: string;
}

const actions: QuickAction[] = [
  {
    name: 'Add New User',
    description: 'Register a new student or staff',
    href: '/admin/users/new',
    icon: HiOutlinePlus,
    color: 'bg-blue-500 hover:bg-blue-600',
  },
  {
    name: 'Manage Rooms',
    description: 'Add or update room details',
    href: '/admin/rooms',
    icon: HiOutlineOfficeBuilding,
    color: 'bg-purple-500 hover:bg-purple-600',
  },
  {
    name: 'View Reports',
    description: 'Access financial reports',
    href: '/admin/reports',
    icon: HiOutlineDocumentReport,
    color: 'bg-green-500 hover:bg-green-600',
  },
  {
    name: 'User Directory',
    description: 'Browse all users',
    href: '/admin/users',
    icon: HiOutlineUsers,
    color: 'bg-orange-500 hover:bg-orange-600',
  },
];

const QuickActions: React.FC = () => {
  return (
    <div className="bg-white dark:bg-dark-card/50 rounded-2xl p-6 shadow-sm border border-brand-card/30 dark:border-dark-card/30">
      <h3 className="text-lg font-bold text-brand-text dark:text-dark-text mb-4">Quick Actions</h3>
      <div className="grid grid-cols-2 gap-3">
        {actions.map((action) => (
          <Link
            key={action.name}
            href={action.href}
            className="group p-4 rounded-xl bg-brand-bg dark:bg-dark-bg hover:shadow-md transition-all border border-brand-card/30 dark:border-dark-card/30"
          >
            <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
              <action.icon size={20} className="text-white" />
            </div>
            <p className="font-semibold text-sm text-brand-text dark:text-dark-text">{action.name}</p>
            <p className="text-xs text-brand-text/50 dark:text-dark-text/50 mt-1">{action.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default QuickActions;
