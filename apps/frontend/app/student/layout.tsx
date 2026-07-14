'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAppSelector, useAppDispatch } from '@/lib/hooks';
import { logout } from '@/lib/features/authSlice';
import { toast } from 'react-hot-toast';

interface StudentLayoutProps {
  children: React.ReactNode;
}

const menuItems = [
  { name: 'Dashboard', href: '/student/dashboard', icon: 'dashboard' },
  { name: 'My Profile', href: '/student/profile', icon: 'person' },
  { name: 'Room Details', href: '/student/room', icon: 'meeting_room' },
  { name: 'Find Room', href: '/student/find-room', icon: 'search' },
  { name: 'Invoices', href: '/student/invoices', icon: 'payments' },
  { name: 'Complaints', href: '/student/complaints', icon: 'support_agent' },
];

export default function StudentLayout({ children }: StudentLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [desktopCollapsed, setDesktopCollapsed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    setMounted(true);
    if (mounted && !isAuthenticated) {
        router.push('/login');
    } else if (mounted && user?.role !== 'STUDENT') {
        toast.error('Unauthorized access');
        router.back();
    }
  }, [isAuthenticated, user, router, mounted]);

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

  if (mounted && (!user || user.role !== 'STUDENT')) return null;

  return (
    <div className="bg-surface text-on-surface antialiased overflow-x-hidden min-h-screen">
      {/* Mobile sidebar backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          sidebarOpen ? 'opacity-100 visible' : 'opacity-0 invisible'
        }`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* SIDEBAR */}
      <aside
        className={`h-screen w-72 fixed left-0 top-0 bg-surface border-r border-outline-variant flex flex-col py-6 z-50 transform transition-transform duration-300 ease-in-out ${
          sidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        } ${desktopCollapsed ? 'md:-translate-x-full' : 'md:translate-x-0'}`}
      >
        <div className="px-6 mb-10 flex justify-between items-center">
          <div>
            <h1 className="font-headline-md text-headline-md font-bold text-primary">Hostelite</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant opacity-70">Student Portal</p>
          </div>
          {/* Mobile close button */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
          {/* Desktop collapse button */}
          <button
            onClick={() => setDesktopCollapsed(true)}
            className="hidden md:block p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
            title="Collapse Sidebar"
          >
            <span className="material-symbols-outlined">menu_open</span>
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 custom-scrollbar">
          {menuItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 mx-4 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'text-primary font-bold bg-secondary-container/60 shadow-sm'
                    : 'text-on-surface-variant hover:bg-surface-container hover:text-primary font-medium'
                }`}
              >
                <span className="material-symbols-outlined">{item.icon}</span>
                <span className={isActive ? 'font-body-md text-body-md' : ''}>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="px-6 mt-auto pt-6 border-t border-outline-variant/30">
          <div className="p-4 bg-surface-container rounded-xl border border-outline-variant text-center">
            <p className="font-label-md text-label-md text-primary font-bold tracking-widest uppercase truncate">{user?.name || 'Student'}</p>
            <p className="text-xs text-on-surface-variant mb-4 truncate">{user?.email}</p>
            <div className="flex gap-2">
              <Link
                href="/"
                className="w-12 flex justify-center items-center bg-surface-container-high text-primary py-2.5 rounded-lg hover:bg-surface-container-highest transition-colors shadow-sm"
                title="Home Website"
              >
                <span className="material-symbols-outlined text-[20px]">home</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 bg-primary text-on-primary py-2.5 rounded-lg font-label-md text-label-md hover:bg-on-primary-fixed-variant transition-colors shadow-sm"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* TOP NAVIGATION */}
      <header className={`fixed top-0 right-0 w-full z-40 bg-surface/80 backdrop-blur-md flex justify-between items-center px-6 md:px-10 h-20 shadow-sm border-b border-outline-variant transition-all duration-300 ${
        desktopCollapsed ? 'md:w-full' : 'md:w-[calc(100%-18rem)]'
      }`}>
        <div className="flex items-center gap-4 flex-1">
          {/* Mobile Menu Button */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="md:hidden text-primary p-2 hover:bg-surface-container rounded-lg transition-colors"
          >
            <span className="material-symbols-outlined">menu</span>
          </button>
          
          {/* Desktop Menu Button - only visible when collapsed */}
          {desktopCollapsed && (
            <button
              onClick={() => setDesktopCollapsed(false)}
              className="hidden md:block text-primary p-2 hover:bg-surface-container rounded-lg transition-colors"
              title="Expand Sidebar"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
          )}
          
          <div className="hidden sm:block">
            <h1 className="text-xl font-bold text-primary">
              {menuItems.find((item) => item.href === pathname)?.name || 'Dashboard'}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden lg:flex flex-col items-end mr-2">
            <span className="font-label-md text-label-md text-primary">{user?.name}</span>
            <span className="text-xs text-on-surface-variant">Student Member</span>
          </div>
          <div className="flex items-center gap-3">
            <button className="text-on-surface-variant hover:text-primary transition-colors p-2">
              <span className="material-symbols-outlined">notifications</span>
            </button>

            <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-secondary-container ml-2 bg-surface-container flex justify-center items-center font-bold text-primary">
              {mounted && user?.name ? getInitials(user.name) : 'S'}
            </div>
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className={`pt-24 px-6 md:px-10 pb-20 transition-all duration-300 ${
        desktopCollapsed ? 'md:ml-0' : 'md:ml-72'
      }`}>
        {children}
      </main>

      {/* FAB for Quick Actions (Optional) */}
      <Link href="/student/complaints" className="fixed bottom-10 right-10 w-16 h-16 bg-primary text-on-primary rounded-full shadow-2xl flex items-center justify-center hover:-translate-y-1 hover:shadow-primary/30 transition-all duration-300 z-50">
        <span className="material-symbols-outlined text-3xl">add</span>
      </Link>
    </div>
  );
}
