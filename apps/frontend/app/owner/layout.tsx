'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { logout } from '@/lib/features/authSlice';
import { toast } from 'react-hot-toast';
import {
  HiOutlineHome,
  HiOutlineUsers,
  HiOutlineOfficeBuilding,
  HiOutlineClipboardList,
  HiOutlineBell,
  HiOutlineLogout,
  HiOutlineMenu,
  HiX,
  HiOutlineChartBar,
  HiOutlineUserAdd,
  HiOutlineUserGroup
} from 'react-icons/hi';

interface OwnerLayoutProps {
  children: React.ReactNode;
}

// Owner specific menu items
const menuItems = [
  { name: 'Dashboard', href: '/owner/dashboard', icon: HiOutlineHome },
  { name: 'My Hostel', href: '/owner/hostel', icon: HiOutlineOfficeBuilding },
  { name: 'Manage Managers', href: '/owner/managers', icon: HiOutlineUsers },
  { name: 'All Students', href: '/owner/students', icon: HiOutlineUsers },
  { name: 'Complaints', href: '/owner/complaints', icon: HiOutlineClipboardList },
  { name: 'Reports', href: '/owner/reports', icon: HiOutlineChartBar },
  { name: 'Settings', href: '/owner/settings', icon: HiOutlineOfficeBuilding } // Reusing icon or new one
];

export default function OwnerLayout({ children }: OwnerLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    toast.success('Logged out successfully');
    router.push('/login');
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
    <div className="flex h-screen bg-brand-bg dark:bg-dark-bg overflow-hidden">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#2c1b13] dark:bg-[#1a0f0a] transform transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-[#fcf2e9]/10">
            <Link href="/owner/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#fcf2e9] flex items-center justify-center">
                <span className="text-[#2c1b13] font-bold text-xl">H</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-[#fcf2e9]">HOSTELITE</span>
                <span className="text-xs text-[#fcf2e9]/60">Owner Panel</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#fcf2e9]/10 transition-colors"
            >
              <HiX size={24} className="text-[#fcf2e9]" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto p-4 space-y-1">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all ${
                    isActive
                      ? 'bg-[#fcf2e9] text-[#2c1b13]'
                      : 'text-[#fcf2e9]/70 hover:bg-[#fcf2e9]/10 hover:text-[#fcf2e9]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <item.icon size={20} />
                    <span>{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="p-4 border-t border-[#fcf2e9]/10">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#fcf2e9]/5">
              <div className="w-10 h-10 rounded-full bg-[#fcf2e9] flex items-center justify-center text-[#2c1b13] font-bold text-sm">
                {user?.name ? getInitials(user.name) : 'O'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#fcf2e9] truncate text-sm">{user?.name || 'Owner'}</p>
                <p className="text-xs text-[#fcf2e9]/60 truncate">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full mt-3 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors font-medium"
            >
              <HiOutlineLogout size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-brand-bg/80 dark:bg-dark-bg/80 backdrop-blur-xl border-b border-brand-card/30 dark:border-dark-card/30">
          <div className="flex items-center justify-between px-6 py-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-xl hover:bg-brand-card/30 dark:hover:bg-dark-card/30 transition-colors"
            >
              <HiOutlineMenu size={24} className="text-brand-text dark:text-dark-text" />
            </button>
            
            <div className="hidden lg:block">
              <h1 className="text-xl font-bold text-brand-text dark:text-dark-text">
                {menuItems.find((item) => item.href === pathname)?.name || 'Dashboard'}
              </h1>
            </div>

            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-xl hover:bg-brand-card/30 dark:hover:bg-dark-card/30 transition-colors">
                <HiOutlineBell size={24} className="text-brand-text dark:text-dark-text" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-brand-card/30 dark:border-dark-card/30">
                <div className="w-9 h-9 rounded-full bg-brand-primary dark:bg-dark-primary flex items-center justify-center text-white dark:text-dark-bg font-bold text-sm">
                  {user?.name ? getInitials(user.name) : 'O'}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-brand-text dark:text-dark-text">{user?.name}</p>
                  <p className="text-xs text-brand-text/60 dark:text-dark-text/60">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-brand-bg dark:bg-dark-bg p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
