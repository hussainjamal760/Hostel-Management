"use client";

import Header from "./components/Header";
import Hero from "./components/Hero";
import HowItWorks from "./components/HowItWorks";
import Stats from "./components/Stats";
import Testimonials from "./components/Testimonials";
import FAQ from "./components/FAQ";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-bg dark:bg-brand-primary transition-colors duration-500 font-sans selection:bg-brand-primary selection:text-white">
      <Header />
      <Hero />
      
      {/* FEATURES SECTION */}
      {/* Dark Mode BG: brand-primary (Brown) */}
      <section id="features" className="py-24 sm:py-32 bg-brand-primary dark:bg-brand-primary relative overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute -top-20 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -z-10" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] -z-10" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-bg dark:text-brand-bg text-xs font-bold tracking-widest uppercase mb-4">
              Core Features
            </div>
            {/* Dark Mode Text: text-brand-bg (Cream) */}
            <h2 className="text-4xl font-bold tracking-tight text-white dark:text-brand-bg sm:text-5xl mb-6">
              Empowering your hostel business
            </h2>
            <p className="text-lg leading-8 text-brand-bg/80 dark:text-brand-bg/80">
              Powerful tools designed to simplify detailed management for every role.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[minmax(250px,auto)]">
             {/* Large Card 1 */}
             {/* Dark Mode Card: bg-brand-bg (Cream) */}
            <div className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-brand-bg dark:bg-brand-bg p-8 shadow-lg ring-1 ring-white/10 hover:ring-white/20 transition-all duration-300">
               <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-500">
                  <svg className="w-64 h-64 text-brand-primary" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
               </div>
               <div className="relative z-10 flex flex-col h-full justify-end">
                   {/* Dark Mode Icon BG: brand-primary, Text: White/Cream */}
                   <div className="w-12 h-12 rounded-xl bg-brand-primary dark:bg-brand-primary flex items-center justify-center text-white dark:text-brand-bg mb-4 shadow-lg">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                   </div>
                   {/* Dark Mode Text: brand-text (Dark Brown) */}
                   <h3 className="text-2xl font-bold text-brand-text dark:text-brand-text mb-2">Resident Management</h3>
                   <p className="text-brand-text/70 dark:text-brand-text/70 text-lg leading-relaxed max-w-md">Comprehensive student onboarding, digital document tracking, and real-time room allocation.</p>
               </div>
            </div>

            {/* Card 2 */}
            <div className="relative group overflow-hidden rounded-3xl bg-brand-bg dark:bg-brand-bg p-8 shadow-lg ring-1 ring-white/10 hover:translate-y-[-4px] transition-all duration-300">
               <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-600 mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
               </div>
               <h3 className="text-xl font-bold text-brand-text dark:text-brand-text mb-2">Automated Billing</h3>
               <p className="text-brand-text/70 dark:text-brand-text/70">Generate receipts, rent reminders, and track payments.</p>
            </div>

            {/* Card 3 */}
            <div className="relative group overflow-hidden rounded-3xl bg-brand-bg dark:bg-brand-bg p-8 shadow-lg ring-1 ring-white/10 hover:translate-y-[-4px] transition-all duration-300">
               <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 mb-4">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
               </div>
               <h3 className="text-xl font-bold text-brand-text dark:text-brand-text mb-2">Smart Operations</h3>
               <p className="text-brand-text/70 dark:text-brand-text/70">Inventory management, attendance tracking, and utilities.</p>
            </div>

            {/* Large Card 2 */}
            <div className="md:col-span-2 relative group overflow-hidden rounded-3xl bg-brand-bg dark:bg-brand-bg p-8 shadow-lg ring-1 ring-white/10 hover:translate-y-[-4px] transition-all duration-300">
               <div className="relative z-10">
                   <div className="w-12 h-12 rounded-xl bg-brand-primary dark:bg-brand-primary flex items-center justify-center text-white dark:text-brand-bg mb-4">
                      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
                   </div>
                   <h3 className="text-2xl font-bold text-brand-text dark:text-brand-text mb-2">Analytics & Reports</h3>
                   <p className="text-brand-text/70 dark:text-brand-text/80 text-lg leading-relaxed max-w-md">Make data-driven decisions with detailed financial reports, occupancy insights, and student trends.</p>
               </div>
               <div className="absolute bottom-0 right-0 w-64 h-48 bg-gradient-to-t from-black/5 to-transparent z-0 pointer-events-none" />
            </div>
          </div>
        </div>
      </section>

      <HowItWorks />
      <Stats />
      <Testimonials />
      <FAQ />

      {/* FOOTER SECTION */}
      {/* Dark Mode BG: brand-primary (Brown) */}
      <footer className="bg-brand-bg dark:bg-brand-primary border-t border-brand-primary/10 dark:border-white/10 pt-24 pb-12 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-brand-primary/20 to-transparent"></div>
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
                <div className="max-w-md">
                   <div className="flex items-center gap-3 mb-6">
                      <div className="h-12 w-12 rounded-2xl bg-brand-primary dark:bg-brand-bg flex items-center justify-center text-white dark:text-brand-text text-xl font-bold font-serif">H</div>
                      <span className="font-bold text-3xl text-brand-primary dark:text-brand-bg tracking-tight">HOSTELITE</span>
                   </div>
                   <p className="text-brand-text/70 dark:text-brand-bg/70 text-lg leading-relaxed">
                     Modernizing student living with intelligent management solutions. 
                     Join thousands of hostels streamlining their daily operations.
                   </p>
                </div>
                
                <div className="flex gap-16 flex-wrap">
                    <div>
                        <h3 className="font-bold text-brand-text dark:text-brand-bg mb-6">Product</h3>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-brand-text/60 dark:text-brand-bg/60 hover:text-brand-primary dark:hover:text-brand-bg hover:pl-1 transition-all">Features</Link></li>
                            <li><Link href="#" className="text-brand-text/60 dark:text-brand-bg/60 hover:text-brand-primary dark:hover:text-brand-bg hover:pl-1 transition-all">Pricing</Link></li>
                            <li><Link href="#" className="text-brand-text/60 dark:text-brand-bg/60 hover:text-brand-primary dark:hover:text-brand-bg hover:pl-1 transition-all">Support</Link></li>
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-bold text-brand-text dark:text-brand-bg mb-6">Company</h3>
                        <ul className="space-y-4">
                            <li><Link href="#" className="text-brand-text/60 dark:text-brand-bg/60 hover:text-brand-primary dark:hover:text-brand-bg hover:pl-1 transition-all">About</Link></li>
                            <li><Link href="#" className="text-brand-text/60 dark:text-brand-bg/60 hover:text-brand-primary dark:hover:text-brand-bg hover:pl-1 transition-all">Careers</Link></li>
                            <li><Link href="#" className="text-brand-text/60 dark:text-brand-bg/60 hover:text-brand-primary dark:hover:text-brand-bg hover:pl-1 transition-all">Contact</Link></li>
                        </ul>
                    </div>
                </div>
            </div>

            <div className="relative border-t border-brand-primary/5 dark:border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <p className="text-brand-text/40 dark:text-brand-bg/40 text-sm">
                  © {new Date().getFullYear()} Hostelite Inc. All rights reserved.
                </p>
                
                <div className="flex gap-6">
                    <a href="#" className="text-brand-text/40 hover:text-brand-primary dark:text-brand-bg/40 dark:hover:text-brand-bg transition-colors">
                        <span className="sr-only">Twitter</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                    </a>
                    <a href="#" className="text-brand-text/40 hover:text-brand-primary dark:text-brand-bg/40 dark:hover:text-brand-bg transition-colors">
                        <span className="sr-only">GitHub</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                    </a>
                </div>
            </div>
            
            {/* Massive Background Text Effect */}
            <div className="absolute bottom-[-5%] left-1/2 -translate-x-1/2 select-none pointer-events-none opacity-[0.03] dark:opacity-[0.05]">
                <span className="text-[200px] font-black text-brand-primary dark:text-brand-bg leading-none tracking-tighter">HOSTELITE</span>
            </div>
        </div>
      </footer>
    </div>
  );
}
