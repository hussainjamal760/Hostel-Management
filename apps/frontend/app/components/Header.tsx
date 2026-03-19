"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { HiOutlineMenuAlt3, HiX } from "react-icons/hi";
import { navItems } from "../utils/navItems";
import { useSelector } from "react-redux";
import { setServers } from "node:dns/promises";

const getInitials = (name: string | undefined | null) => {
  if (!name) return "U";
  return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
};

const Header = () => {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useSelector((state: any) => state.auth);
  const pathname = usePathname();

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
            <div className="relative w-9 h-9 bg-brand-primary rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,107,0,0.4)] transition-transform group-hover:scale-110">
              <span className="text-black font-black text-lg">H</span>
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
                <Link href="/profile" className="block transition-transform hover:scale-110">
                  {user.avatar?.url ? (
                    <Image src={user.avatar.url} alt="user" width={32} height={32} className="rounded-full border border-white/20" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white">
                      {getInitials(user.name)}
                    </div>
                  )}
                </Link>
              ) : (
                <Link href="/login" className="px-5 py-2 rounded-full bg-white text-black text-[12px] font-bold uppercase tracking-wider transition-all hover:bg-brand-primary hover:text-black hover:scale-105">
                  Sign In
                </Link>
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
            <div className="w-8 h-8 bg-brand-primary rounded-full flex items-center justify-center shadow-[0_0_12px_rgba(255,107,0,0.4)]">
              <span className="text-black font-black text-base">H</span>
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
            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all" onClick={() => setOpen(false)}>
              {user.avatar?.url ? (
                <Image src={user.avatar.url} alt="user" width={36} height={36} className="rounded-full border border-white/20" />
              ) : (
                <div className="w-9 h-9 rounded-full bg-brand-primary/20 border border-brand-primary/30 flex items-center justify-center text-xs font-bold text-brand-primary">
                  {getInitials(user.name)}
                </div>
              )}
              <div className="flex flex-col">
                <span className="text-white text-sm font-semibold leading-tight">{user.name || "Profile"}</span>
                <span className="text-white/40 text-xs">View profile</span>
              </div>
            </Link>
          ) : (
            <div className="flex flex-col gap-3">
              <Link href="/login" className="w-full text-center py-3 rounded-xl bg-brand-primary text-black text-sm font-bold uppercase tracking-wider hover:opacity-90 transition-opacity" onClick={() => setOpen(false)}>
                Sign In
              </Link>
              <Link href="/signup" className="w-full text-center py-3 rounded-xl border border-white/20 text-white text-sm font-bold uppercase tracking-wider hover:bg-white/5 transition-colors" onClick={() => setOpen(false)}>
                Sign Up
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
