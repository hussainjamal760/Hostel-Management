"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineMenuAlt3, HiOutlineUserCircle, HiX } from "react-icons/hi";
import { navItems } from "../utils/navItems";
import { useSelector } from "react-redux";

const getInitials = (name: string | undefined | null) => {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

const Header = () => {
  const [active, setActive] = useState(false);
  const [open, setOpen] = useState(false);
  const [openAuth, setOpenAuth] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { user } = useSelector((state: any) => state.auth);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setActive(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full z-[999] px-6 py-4 flex justify-center pointer-events-none">
      <header
        className={`pointer-events-auto flex items-center justify-between px-6 py-3 rounded-full transition-all duration-700 
        ${active 
          ? "w-full max-w-[1200px] bg-black/60 backdrop-blur-3xl border border-white/10 shadow-[0_20px_50px_rgba(0,0,0,0.5)]" 
          : "w-full max-w-[1400px] bg-transparent"
        }`}
      >
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-9 h-9 bg-brand-primary rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(255,107,0,0.4)] transition-transform group-hover:scale-110">
             <span className="text-black font-black text-lg">H</span>
          </div>
          <div className="flex flex-col">
            <span className="text-white font-black text-xl tracking-tighter leading-none">
              HOSTELITE
            </span>
            <span className="text-brand-primary text-[10px] font-light italic tracking-[0.2em] mt-0.5">
              BEYOND ORDINARY
            </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-8 absolute left-1/2 -translate-x-1/2">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.url}
              className="text-[12px] text-white/70 hover:text-brand-primary uppercase tracking-[0.15em] font-bold transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-0 h-[2px] bg-brand-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:block">
            {mounted && user ? (
              <Link href={"/profile"} className="block transition-transform hover:scale-110">
                {user.avatar?.url ? (
                  <Image
                    src={user.avatar.url}
                    alt="user"
                    width={32}
                    height={32}
                    className="rounded-full border border-white/20"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-[10px] font-bold text-white">
                    {getInitials(user.name)}
                  </div>
                )}
              </Link>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 rounded-full bg-white text-black text-[12px] font-bold uppercase tracking-wider transition-all hover:bg-brand-primary hover:text-black hover:scale-105"
              >
                Sign In
              </Link>
            )}
          </div>

          <button
            className="md:hidden text-white hover:text-brand-primary transition-colors"
            onClick={() => setOpen(!open)}
          >
            <HiOutlineMenuAlt3 size={28} />
          </button>
        </div>
      </header>

      {/* Mobile Menu logic would go here if needed, keeping it simple for now */}
    </div>
  );
};

export default Header;
