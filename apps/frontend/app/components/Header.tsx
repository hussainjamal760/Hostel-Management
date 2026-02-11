"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { HiOutlineMenuAlt3, HiOutlineUserCircle, HiX } from "react-icons/hi";
import { navItems } from "../utils/navItems";
import { ThemeSwitcher } from "../utils/ThemeSwitcher";
import Login from "../Auth/Login";
import SignUp from "../Auth/Signup";
import Verification from "../Auth/Verification";
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
  const [route, setRoute] = useState("Login");
  const [mounted, setMounted] = useState(false);
  const { user } = useSelector((state: any) => state.auth);

  // Prevent hydration mismatch by only rendering user-dependent content on client
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setActive(window.scrollY > 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (open || openAuth) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [open, openAuth]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 w-full z-[999] transition-all duration-500 ${active
          ? "bg-brand-bg/90 dark:bg-brand-primary/90 backdrop-blur-xl py-3 shadow-lg"
          : "bg-transparent py-6"
          }`}
      >
        <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 md:px-12">
          <Link href="/" className="flex items-center gap-2 group">
             {/* Logo Icon Box 
                - Top: White text on Transparent (Box looks weird if transparent? Let's make box white/dark based on scroll)
                - Wait, standard design: 
                  - Top: Box White/Glass? 
                  - Scroll: Box Brand Color?
             */}
            <div className={`relative w-10 h-10 overflow-hidden rounded-xl flex items-center justify-center transition-all group-hover:scale-105 ${
                active 
                ? 'bg-brand-primary dark:bg-brand-bg' // Scroll: Dark Box (Light Mode), Light Box (Dark Mode)
                : 'bg-white/10 backdrop-blur-md border border-white/20' // Top: Glassy White
            }`}>
              <span className={`font-bold text-xl ${
                  active 
                  ? 'text-brand-bg dark:text-brand-primary' 
                  : 'text-white'
              }`}>H</span>
            </div>
            <div className="flex flex-col">
              <span className={`font-bold text-2xl tracking-tight transition-colors ${
                  active 
                  ? 'text-brand-primary dark:text-brand-bg' 
                  : 'text-white'
              }`}>
                HOSTELITE
              </span>
              <span className={`text-sm tracking-tight transition-colors ${
                   active 
                   ? 'text-brand-primary/70 dark:text-brand-bg/70' 
                   : 'text-white/70'
              }`}>
                <i>Beyond Ordinary</i>
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-10">
            {navItems.map((item, index) => (
              <Link
                key={index}
                href={item.url}
                className={`text-[14px] uppercase tracking-widest font-semibold transition-all relative group ${
                    active 
                    ? 'text-brand-text/70 hover:text-brand-primary dark:text-brand-bg/70 dark:hover:text-brand-bg' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                {item.name}
                <span className={`absolute -bottom-1 left-0 w-0 h-[2px] transition-all duration-300 group-hover:w-full ${
                    active 
                    ? 'bg-brand-primary dark:bg-brand-bg' 
                    : 'bg-white'
                }`} />
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeSwitcher />

            <div className="hidden md:block cursor-pointer">
              {mounted && user ? (
                <Link href={"/profile"}>
                  {user.avatar?.url ? (
                    <Image
                      src={user.avatar.url}
                      alt="user"
                      width={35}
                      height={35}
                      className={`rounded-full border-2 ${
                          active 
                          ? 'border-brand-primary dark:border-brand-bg' 
                          : 'border-white'
                      }`}
                    />
                  ) : (
                    <div className={`w-[35px] h-[35px] rounded-full flex items-center justify-center text-sm font-bold border-2 ${
                        active 
                        ? 'bg-brand-primary dark:bg-brand-bg text-brand-bg dark:text-brand-primary border-brand-primary dark:border-brand-bg' 
                        : 'bg-white/10 text-white border-white'
                    }`}>
                      {getInitials(user.name)}
                    </div>
                  )}
                </Link>
              ) : (
                <div
                  onClick={() => {
                    setRoute("Login");
                    setOpenAuth(true);
                  }}
                >
                  <HiOutlineUserCircle
                    size={32}
                    className={`transition-opacity hover:opacity-80 ${
                        active 
                        ? 'text-brand-primary dark:text-brand-bg' 
                        : 'text-white'
                    }`}
                  />
                </div>
              )}
            </div>

            <button
              className={`md:hidden ml-2 outline-none ${
                 active 
                 ? 'text-brand-primary dark:text-brand-bg' 
                 : 'text-white'
              }`}
              onClick={() => setOpen(!open)}
            >
              <HiOutlineMenuAlt3 size={30} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="fixed inset-0 z-[9999] md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />

          {/* Sidebar Panel */}
          <div className={`absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-brand-bg dark:bg-brand-primary shadow-2xl transform transition-transform duration-300 ease-out ${open ? 'translate-x-0' : 'translate-x-full'
            }`}>
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-brand-primary/10 dark:border-brand-bg/10">
                <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary dark:bg-brand-bg flex items-center justify-center">
                    <span className="text-white dark:text-brand-primary font-bold text-xl">H</span>
                  </div>
                  <span className="font-bold text-xl text-brand-primary dark:text-brand-bg">HOSTELITE</span>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-xl bg-brand-primary/5 dark:bg-brand-bg/5 hover:bg-brand-primary/10 dark:hover:bg-brand-bg/10 transition-colors"
                >
                  <HiX size={24} className="text-brand-primary dark:text-brand-bg" />
                </button>
              </div>

              {/* Profile Section */}
              <div className="p-6 border-b border-brand-primary/10 dark:border-brand-bg/10">
                {mounted && user ? (
                  <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-brand-primary/5 dark:bg-brand-bg/5 hover:bg-brand-primary/10 dark:hover:bg-brand-bg/10 transition-all">
                    {user.avatar?.url ? (
                      <Image
                        src={user.avatar.url}
                        alt="user"
                        width={56}
                        height={56}
                        className="rounded-full border-2 border-brand-primary dark:border-brand-bg"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-brand-primary dark:bg-brand-bg flex items-center justify-center text-brand-bg dark:text-brand-primary text-lg font-bold border-2 border-brand-primary dark:border-brand-bg">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-brand-primary dark:text-brand-bg truncate">{user.name}</p>
                      <p className="text-sm text-brand-primary/60 dark:text-brand-bg/60 truncate">{user.email}</p>
                    </div>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setRoute("Login");
                      setOpenAuth(true);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-brand-primary dark:bg-brand-bg text-brand-bg dark:text-brand-primary hover:scale-[1.02] active:scale-95 transition-transform"
                  >
                    <HiOutlineUserCircle size={28} />
                    <span className="font-bold text-lg">Login / Sign Up</span>
                  </button>
                )}
              </div>

              {/* Navigation Links */}
              <nav className="flex-1 overflow-y-auto p-6 space-y-2">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.url}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-4 p-4 rounded-2xl bg-brand-primary/5 dark:bg-brand-bg/5 hover:bg-brand-primary dark:hover:bg-brand-bg hover:text-brand-bg dark:hover:text-brand-primary text-brand-primary dark:text-brand-bg font-semibold transition-all group"
                  >
                    <div className="w-2 h-2 rounded-full bg-brand-primary dark:bg-brand-bg group-hover:bg-brand-bg dark:group-hover:bg-brand-primary group-hover:scale-150 transition-all" />
                    <span className="text-lg">{item.name}</span>
                  </Link>
                ))}
              </nav>

              <div className="p-6 border-t border-brand-primary/10 dark:border-brand-bg/10 space-y-4">

                <p className="text-xs text-center text-brand-primary/40 dark:text-brand-bg/40 tracking-wider">
                  © {new Date().getFullYear()} HOSTELITE
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auth Modals */}
      {route === "Login" && (
        <Login open={openAuth} setOpen={setOpenAuth} setRoute={setRoute} />
        
      )}
      {route === "Sign-Up" && (
        <SignUp open={openAuth} setOpen={setOpenAuth} setRoute={setRoute} />
      )}
      {route === "Verification" && (
        <Verification open={openAuth} setOpen={setOpenAuth} setRoute={setRoute} />
      )}
    </>
  );
};

export default Header;
