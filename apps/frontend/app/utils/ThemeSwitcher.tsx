"use client";

import { useState, useEffect } from "react";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi";

export const ThemeSwitcher = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const isDark = localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("theme", newDarkMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-[#2c1b13]/10 dark:hover:bg-[#fcf2e9]/10 transition-colors"
      aria-label="Toggle theme"
    >
      {darkMode ? (
        <HiOutlineSun size={24} className="text-[#fcf2e9]" />
      ) : (
        <HiOutlineMoon size={24} className="text-[#2c1b13]" />
      )}
    </button>
  );
};
