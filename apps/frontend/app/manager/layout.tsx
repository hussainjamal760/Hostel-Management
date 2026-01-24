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
  HiOutlineCollection,
  HiOutlineBell,
  HiOutlineLogout,
  HiOutlineMenu,
  HiX,
  HiOutlinePlus,
} from 'react-icons/hi';

interface ManagerLayoutProps {
  children: React.ReactNode;
}

// Manager specific menu items (Subset of owner items)
const menuItems = [
  { name: 'Dashboard', href: '/manager/dashboard', icon: HiOutlineHome },
  { name: 'My Hostel', href: '/manager/hostel', icon: HiOutlineOfficeBuilding },
  { name: 'Create Room', href: '/manager/create-room', icon: HiOutlinePlus },
  { name: 'Manage Rooms', href: '/manager/rooms', icon: HiOutlineCollection },
  { name: 'Students', href: '/manager/students', icon: HiOutlineUsers },
  { name: 'Payments', href: '/manager/payments', icon: HiOutlineCollection },
  { name: 'Complaints', href: '/manager/complaints', icon: HiOutlineClipboardList },
];

export default function ManagerLayout({ children }: ManagerLayoutProps) {
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
    <div className="min-h-screen bg-brand-bg dark:bg-dark-bg">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-[#1a2c38] dark:bg-[#0f1a23] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between p-6 border-b border-[#e0f2fe]/10">
            <Link href="/manager/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e0f2fe] flex items-center justify-center">
                <span className="text-[#1a2c38] font-bold text-xl">H</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-[#e0f2fe]">HOSTELITE</span>
                <span className="text-xs text-[#e0f2fe]/60">Manager Panel</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#e0f2fe]/10 transition-colors"
            >
              <HiX size={24} className="text-[#e0f2fe]" />
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
                      ? 'bg-[#e0f2fe] text-[#1a2c38]'
                      : 'text-[#e0f2fe]/70 hover:bg-[#e0f2fe]/10 hover:text-[#e0f2fe]'
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
          <div className="p-4 border-t border-[#e0f2fe]/10">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#e0f2fe]/5">
              <div className="w-10 h-10 rounded-full bg-[#e0f2fe] flex items-center justify-center text-[#1a2c38] font-bold text-sm">
                {user?.name ? getInitials(user.name) : 'M'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#e0f2fe] truncate text-sm">{user?.name || 'Manager'}</p>
                <p className="text-xs text-[#e0f2fe]/60 truncate">{user?.email}</p>
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
      <div className="lg:ml-72">
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
                  {user?.name ? getInitials(user.name) : 'M'}
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
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
