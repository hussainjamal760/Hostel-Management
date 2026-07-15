"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { navItems } from "../utils/navItems";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "@/lib/features/authSlice";
import { useRouter } from "next/navigation";

const getInitials = (name: string | undefined | null) => {
  if (!name) return "U";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

const Header = () => {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/login');
  };

  const getDashboardUrl = (role: string | undefined) => {
    if (!role) return '/owner/hostel';
    const r = role.toUpperCase();
    if (r === 'ADMIN') return '/admin/dashboard';
    if (r === 'MANAGER') return '/manager/dashboard';
    if (r === 'OWNER') return '/owner/dashboard';
    if (r === 'STUDENT') return '/student/dashboard';
    return '/owner/hostel';
  };

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => setActive(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setOpen(false); }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <div className="fixed top-0 left-0 w-full z-[999] px-4 md:px-6 py-4 flex justify-center pointer-events-none">
        <header
          className={`pointer-events-auto flex items-center justify-between px-5 py-3 rounded-full transition-all duration-700 
          ${active
              ? "w-full max-w-[1200px] bg-black/60 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
              : "w-full max-w-[1400px] bg-transparent"
            }`}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 shadow-[0_0_15px_rgba(255,107,0,0.4)] transition-transform group-hover:scale-110">
              <img src="/logo.png" alt="Hostelite Logo" className="w-full h-full object-contain" />
            </div>
            <div className="flex flex-col">
              <span className="text-white font-black text-xl tracking-tighter leading-none">HOSTELITE</span>
              <span className="text-brand-primary text-[10px] font-light italic tracking-[0.2em] mt-0.5">BEYOND ORDINARY</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.url}
                className={`text-[12px] uppercase tracking-[0.15em] font-bold transition-colors relative group
                  ${pathname === item.url ? "text-brand-primary" : "text-white/70 hover:text-brand-primary"}`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-[2px] bg-brand-primary transition-all duration-300
                  ${pathname === item.url ? "w-full" : "w-0 group-hover:w-full"}`} />
              </Link>
            ))}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="hidden md:block">
              {mounted && user ? (
                <div className="relative group">
                  <div className="cursor-pointer block transition-transform hover:scale-110">
                    <div className="w-9 h-9 rounded-full bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-xs font-bold text-brand-primary">
                      {getInitials(user.name)}
                    </div>
                  </div>
                  {/* Dropdown menu */}
                  <div className="absolute right-0 mt-2 w-48 py-2 bg-black/90 backdrop-blur-md rounded-xl shadow-xl border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link href={getDashboardUrl(user.role)} className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors">
                      Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-white/5 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <Link href="/login" className="px-5 py-2 rounded-full text-white/80 hover:text-white text-[12px] font-bold uppercase tracking-wider transition-all">
                    Sign In
                  </Link>
                  <Link href="/signup" className="px-5 py-2 rounded-full bg-brand-primary text-black text-[12px] font-bold uppercase tracking-wider transition-all hover:scale-105 shadow-[0_0_15px_rgba(255,107,0,0.4)]">
                    List Hostel
                  </Link>
                </div>
              )}
            </div>
            <button
              className="md:hidden text-white hover:text-brand-primary transition-colors p-1"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              {open ? <HiX size={26} /> : <HiOutlineMenuAlt3 size={26} />}
            </button>
          </div>
        </header>
      </div>

      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[998] md:hidden transition-all duration-300
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
      </div>

      {/* Mobile Drawer */}s
      <div
        className={`fixed top-0 right-0 h-full w-[280px] z-[999] md:hidden bg-[#0a0a0a] border-l border-white/10
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
          <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center p-1 shadow-[0_0_12px_rgba(255,107,0,0.4)]">
              <img src="/logo.png" alt="Hostelite Logo" className="w-full h-full object-contain" />
            </div>
            <span className="text-white font-black text-lg tracking-tighter">HOSTELITE</span>
          </Link>
          <button onClick={() => setOpen(false)} className="text-white/60 hover:text-white transition-colors p-1" aria-label="Close menu">
            <HiX size={22} />
          </button>
        </div>

        {/* Nav Links */}
        <nav className="flex flex-col px-4 py-6 gap-1">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.url}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold uppercase tracking-[0.12em] transition-all duration-200
                ${pathname === item.url
                  ? "bg-brand-primary/15 text-brand-primary border border-brand-primary/30"
                  : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${pathname === item.url ? "bg-brand-primary" : "bg-white/20"}`} />
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="mx-6 border-t border-white/10" />

        {/* Mobile Auth */}
        <div className="px-6 py-6">
          {mounted && user ? (
            <div className="flex flex-col gap-3">
              <Link href={getDashboardUrl(user.role)} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all" onClick={() => setOpen(false)}>
                <div className="w-9 h-9 rounded-full bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-xs font-bold text-brand-primary">
                  {getInitials(user.name)}
                </div>
                <div className="flex flex-col">
                  <span className="text-white text-sm font-semibold leading-tight">{user.name || "User"}</span>
                  <span className="text-white/40 text-xs">Dashboard</span>
                </div>
              </Link>
              <button onClick={() => { handleLogout(); setOpen(false); }} className="w-full text-left px-4 py-3 rounded-xl border border-red-500/30 text-red-400 text-sm font-bold uppercase tracking-wider hover:bg-red-500/10 transition-colors">
                Logout
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Link href="/login" className="w-full text-center py-3 rounded-xl bg-brand-primary text-black text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity" onClick={() => setOpen(false)}>
                Sign In
              </Link>
              <Link href="/signup" className="w-full text-center py-3 rounded-xl border border-brand-primary text-brand-primary text-sm font-bold uppercase tracking-wider hover:bg-brand-primary/10 transition-colors" onClick={() => setOpen(false)}>
                List Hostel
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
