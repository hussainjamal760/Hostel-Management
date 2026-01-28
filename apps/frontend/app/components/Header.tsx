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

const getInitials = (name: string) => {
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
  const { user } = useSelector((state: any) => state.auth);

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
        className={`fixed top-0 left-0 w-full z-[999] transition-all duration-500 ${
          active
            ? "bg-brand-bg/80 dark:bg-dark-bg/80 backdrop-blur-xl py-3 shadow-lg"
            : "bg-transparent py-6"
        }`}
      >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between px-6 md:px-12">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="relative w-10 h-10 overflow-hidden rounded-xl bg-brand-primary dark:bg-dark-primary flex items-center justify-center transition-transform group-hover:scale-105">
            <span className="text-white dark:text-[#2c1b13] font-bold text-xl">H</span>
          </div>
          <div className="flex flex-col">
          <span className="font-bold text-2xl tracking-tight text-brand-primary dark:text-dark-text">
            HOSTELITE
          </span>
           <span className="text-sm tracking-tight text-brand-primary dark:text-dark-text">
            <i>Beyond Ordinary</i>
          </span>
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-10">
          {navItems.map((item, index) => (
            <Link
              key={index}
              href={item.url}
              className="text-[14px] uppercase tracking-widest font-semibold text-brand-text/70 hover:text-brand-primary dark:text-dark-text/60 dark:hover:text-dark-primary transition-all relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-brand-primary dark:bg-dark-primary transition-all duration-300 group-hover:w-full" />
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          
          <div className="hidden md:block cursor-pointer">
            {user ? (
              <Link href={"/profile"}>
                {user.avatar?.url ? (
                  <Image
                    src={user.avatar.url}
                    alt="user"
                    width={35}
                    height={35}
                    className="rounded-full border-2 border-brand-primary dark:border-dark-primary"
                  />
                ) : (
                  <div className="w-[35px] h-[35px] rounded-full bg-[#2c1b13] dark:bg-[#fcf2e9] flex items-center justify-center text-[#fcf2e9] dark:text-[#2c1b13] text-sm font-bold border-2 border-brand-primary dark:border-dark-primary">
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
                  className="text-black dark:text-[#fff8f2] hover:opacity-80 transition-opacity"
                />
              </div>
            )}
          </div>

          <button
            className="md:hidden ml-2 text-brand-primary dark:text-dark-text outline-none"
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
          <div className={`absolute right-0 top-0 bottom-0 w-[85%] max-w-sm bg-[#fcf2e9] dark:bg-[#2c1b13] shadow-2xl transform transition-transform duration-300 ease-out ${
            open ? 'translate-x-0' : 'translate-x-full'
          }`}>
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-[#2c1b13]/10 dark:border-[#fcf2e9]/10">
                <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-[#2c1b13] dark:bg-[#fcf2e9] flex items-center justify-center">
                    <span className="text-white dark:text-[#2c1b13] font-bold text-xl">H</span>
                  </div>
                  <span className="font-bold text-xl text-[#2c1b13] dark:text-[#fcf2e9]">HOSTELITE</span>
                </Link>
                <button
                  onClick={() => setOpen(false)}
                  className="p-2 rounded-xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 hover:bg-[#2c1b13]/10 dark:hover:bg-[#fcf2e9]/10 transition-colors"
                >
                  <HiX size={24} className="text-[#2c1b13] dark:text-[#fcf2e9]" />
                </button>
              </div>

              {/* Profile Section */}
              <div className="p-6 border-b border-[#2c1b13]/10 dark:border-[#fcf2e9]/10">
                {user ? (
                  <Link href="/profile" onClick={() => setOpen(false)} className="flex items-center gap-4 p-4 rounded-2xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 hover:bg-[#2c1b13]/10 dark:hover:bg-[#fcf2e9]/10 transition-all">
                    {user.avatar?.url ? (
                      <Image
                        src={user.avatar.url}
                        alt="user"
                        width={56}
                        height={56}
                        className="rounded-full border-2 border-[#2c1b13] dark:border-[#fcf2e9]"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-full bg-[#2c1b13] dark:bg-[#fcf2e9] flex items-center justify-center text-[#fcf2e9] dark:text-[#2c1b13] text-lg font-bold border-2 border-[#2c1b13] dark:border-[#fcf2e9]">
                        {getInitials(user.name)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-[#2c1b13] dark:text-[#fcf2e9] truncate">{user.name}</p>
                      <p className="text-sm text-[#2c1b13]/60 dark:text-[#fcf2e9]/60 truncate">{user.email}</p>
                    </div>
                  </Link>
                ) : (
                  <button
                    onClick={() => {
                      setRoute("Login");
                      setOpenAuth(true);
                      setOpen(false);
                    }}
                    className="w-full flex items-center gap-4 p-4 rounded-2xl bg-[#2c1b13] dark:bg-[#fcf2e9] text-[#fcf2e9] dark:text-[#2c1b13] hover:scale-[1.02] active:scale-95 transition-transform"
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
                    className="flex items-center gap-4 p-4 rounded-2xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5 hover:bg-[#2c1b13] dark:hover:bg-[#fcf2e9] hover:text-[#fcf2e9] dark:hover:text-[#2c1b13] text-[#2c1b13] dark:text-[#fcf2e9] font-semibold transition-all group"
                  >
                    <div className="w-2 h-2 rounded-full bg-[#2c1b13] dark:bg-[#fcf2e9] group-hover:bg-[#fcf2e9] dark:group-hover:bg-[#2c1b13] group-hover:scale-150 transition-all" />
                    <span className="text-lg">{item.name}</span>
                  </Link>
                ))}
              </nav>

              <div className="p-6 border-t border-[#2c1b13]/10 dark:border-[#fcf2e9]/10 space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-[#2c1b13]/5 dark:bg-[#fcf2e9]/5">
                  <span className="text-sm font-semibold text-[#2c1b13] dark:text-[#fcf2e9]">Theme</span>
                  <ThemeSwitcher />
                </div>
                
                <p className="text-xs text-center text-[#2c1b13]/40 dark:text-[#fcf2e9]/40 tracking-wider">
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
