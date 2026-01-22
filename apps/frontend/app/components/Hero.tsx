"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { HiSearch, HiLocationMarker } from "react-icons/hi";

const Hero = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push(`/hostels?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-brand-bg dark:bg-dark-bg transition-colors duration-500">
      <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-brand-card/30 rounded-full blur-[120px] -z-10 animate-pulse" />
      <div className="absolute bottom-[10%] right-[-5%] w-[300px] h-[300px] bg-brand-primary/10 rounded-full blur-[100px] -z-10" />

      <div className="max-w-[1440px] mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        
        <div className="flex flex-col gap-5 z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-card/20 border border-brand-card/30 w-fit">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-brand-primary dark:text-dark-primary">
              Discover Your Next Home
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-brand-primary dark:text-dark-text leading-[1.1]">
            Find a Stay <br />
            <span className="italic font-light text-brand-text dark:text-dark-primary">Beyond </span> 
            Ordinary.
          </h1>

          <p className="text-lg text-brand-text/80 tracking-widest text-brand-primary dark:text-dark-text/70 max-w-lg leading-relaxed">
            Experience the finest hostels. Your perfect room is just a click away.
          </p>

       <div className="relative max-w-xl w-full group">
  <div className="absolute -inset-1 bg-gradient-to-r from-brand-primary to-brand-card rounded-[2rem] blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
  
  <div className="relative flex items-center rounded-[1.8rem] p-2 shadow-2xl transition-all duration-500 
    bg-[#2c1b13] 
    dark:bg-[#fcf2e9]">
    
    <div className="flex items-center gap-2 flex-1 px-4">
      <HiLocationMarker className="size-6 transition-colors duration-500
        text-[#fcf2e9] 
        dark:text-[#2c1b13]" 
      />
      
      <input 
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
        placeholder="Where do you want to stay?" 
        className="w-full bg-transparent border-none outline-none transition-colors duration-500
          text-[#fcf2e9] placeholder:text-[#fcf2e9]/50
          dark:text-[#2c1b13] dark:placeholder:text-[#2c1b13]/50"
      />
    </div>

    <button 
      onClick={handleSearch}
      className="px-8 py-4 rounded-[1.5rem] font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg
      bg-[#fcf2e9] text-[#2c1b13]
      dark:bg-[#2c1b13] dark:text-[#fcf2e9]">
      <HiSearch size={20} />
      <span className="hidden sm:inline">Search</span>
    </button>
  </div>
</div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8 mt-10">
  <div className="flex items-center">
    <div className="flex -space-x-4">
      {[1, 2, 3].map((index) => (
        <div 
          key={index} 
          className="relative w-14 h-14 rounded-full border-4 border-[#fcf2e9] dark:border-[#1f1710] overflow-hidden transition-all duration-300 hover:scale-110 hover:z-10 cursor-pointer shadow-md bg-brand-primary/20 flex items-center justify-center"
        >
          <span className="text-brand-primary dark:text-dark-primary font-bold">
            {['A', 'B', 'C'][index - 1]}
          </span>
        </div>
      ))}
    </div>
    
    <div className="ml-5">
      <div className="flex items-center gap-0.5 mb-1">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-3.5 h-3.5 text-orange-500 fill-current" viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <p className="text-[12px] font-bold uppercase tracking-tight text-brand-primary dark:text-dark-primary">
        Trusted by 2k+ Students
      </p>
    </div>
  </div>

  <div className="hidden sm:block h-12 w-[1px] bg-brand-primary/10 dark:bg-white/10" />

  <div className="flex flex-col">
    <div className="flex items-baseline gap-1">
      <span className="text-3xl font-bold text-brand-primary dark:text-dark-primary leading-none">
        12k
      </span>
      <span className="text-brand-primary dark:text-dark-primary font-bold text-xl">+</span>
    </div>
    <span className="text-[10px] uppercase tracking-[0.2em] font-bold text-brand-primary dark:text-dark-primary opacity-50">
      Verified Stays
    </span>
  </div>
</div>


    </div>

      <div className="relative h-[350px] md:h-[450px] w-full group isolation-isolate">
  <div className="absolute inset-0 border-[12px] border-brand-card/30 rounded-[2.5rem] rotate-6 scale-104 -z-10 group-hover:rotate-0 group-hover:scale-100 transition-all duration-700 ease-in-out will-change-transform"></div>
  
  <div className="relative h-full w-full rounded-[2.5rem] shadow-2xl transition-all duration-700 ease-in-out rotate-6 group-hover:rotate-0 group-hover:scale-[0.98] transform-gpu will-change-transform overflow-hidden bg-gradient-to-br from-brand-primary/20 to-brand-card/40">
    {/* Placeholder for hero image */}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-brand-primary/20 flex items-center justify-center">
          <span className="text-4xl">🏨</span>
        </div>
        <p className="text-brand-text/50 dark:text-dark-text/50">Luxury Hostel</p>
      </div>
    </div>
    
    <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-60 group-hover:opacity-30 transition-opacity duration-700 rounded-[2.5rem]"></div>
    
    <div className="absolute bottom-8 left-6 right-6 p-5 bg-white/10 dark:bg-black/40 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-3xl shadow-2xl transition-all duration-500 group-hover:translate-y-[-10px] z-20">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-full bg-brand-primary flex items-center justify-center text-white font-bold shadow-lg">
          H
        </div>
        <div>
          <h4 className="font-bold text-white text-lg">Find your perfect room</h4>
          <p className="text-xs text-white/80 tracking-wide">Starting from PKR 10000/month</p>
        </div>
      </div>
    </div>
  </div>
</div>
      </div>
    </section>
  );
};

export default Hero;
