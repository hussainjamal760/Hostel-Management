'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { logout } from '@/lib/features/authSlice';
import { toast } from 'react-hot-toast';
import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineCurrencyDollar,
  HiOutlineClipboardList,
  HiOutlineLogout,
  HiOutlineMenu,
  HiX,
  HiOutlineInformationCircle,
  HiOutlineSearch
} from 'react-icons/hi';

interface StudentLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { name: 'Dashboard', href: '/student/dashboard', icon: HiOutlineHome },
  { name: 'My Profile', href: '/student/profile', icon: HiOutlineUser },
  { name: 'Room Details', href: '/student/room', icon: HiOutlineInformationCircle },
  { name: 'Find Room', href: '/student/find-room', icon: HiOutlineSearch },
  { name: 'Invoices', href: '/student/invoices', icon: HiOutlineCurrencyDollar },
  { name: 'Complaints', href: '/student/complaints', icon: HiOutlineClipboardList },
];

export default function StudentLayout({ children }: StudentLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
        router.push('/login');
    } else if (user?.role !== 'STUDENT') {
        toast.error('Unauthorized access');
        router.back();
    }
  }, [isAuthenticated, user, router]);

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

  if (!user || user.role !== 'STUDENT') return null;

  return (
    <div className="min-h-screen bg-brand-bg dark:bg-dark-bg">
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-50 h-full w-72 bg-[#1a2c38] dark:bg-[#0f1a23] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-[#e0f2fe]/10">
            <Link href="/student/dashboard" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#e0f2fe] flex items-center justify-center">
                <span className="text-[#1a2c38] font-bold text-xl">H</span>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-[#e0f2fe]">HOSTELITE</span>
                <span className="text-xs text-[#e0f2fe]/60">Student Portal</span>
              </div>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-[#e0f2fe]/10 transition-colors"
            >
              <HiX size={24} className="text-[#e0f2fe]" />
            </button>
          </div>

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

          <div className="p-4 border-t border-[#e0f2fe]/10">
            <div className="flex items-center gap-3 p-3 rounded-xl bg-[#e0f2fe]/5">
              <div className="w-10 h-10 rounded-full bg-[#e0f2fe] flex items-center justify-center text-[#1a2c38] font-bold text-sm">
                {user?.name ? getInitials(user.name) : 'S'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[#e0f2fe] truncate text-sm">{user?.name}</p>
                <p className="text-xs text-[#e0f2fe]/60 truncate">{user?.email || 'Student'}</p>
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

      <div className="lg:ml-72">
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
              <div className="hidden sm:flex items-center gap-3 pl-4 border-l border-brand-card/30 dark:border-dark-card/30">
                <div className="w-9 h-9 rounded-full bg-brand-primary dark:bg-dark-primary flex items-center justify-center text-white dark:text-dark-bg font-bold text-sm">
                  {user?.name ? getInitials(user.name) : 'S'}
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-semibold text-brand-text dark:text-dark-text">{user?.name}</p>
                  <p className="text-xs text-brand-text/60 dark:text-dark-text/60">{user?.role}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
