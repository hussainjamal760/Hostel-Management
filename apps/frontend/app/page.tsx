'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  const [scrolled, setScrolled] = useState(false);
  const [activeTab, setActiveTab] = useState('analytics');

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);

      // Reveal logic
      const reveals = document.querySelectorAll(".reveal");
      for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < windowHeight - elementVisible) {
          reveals[i].classList.add("active");
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // initial trigger

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Counter Animation
    const counters = document.querySelectorAll('.counter');
    const speed = 200;

    counters.forEach(counter => {
      const updateCount = () => {
        const target = +(counter.getAttribute('data-target') || 0);
        const count = +(counter.innerHTML.replace(/\D/g, '') || 0);
        const inc = target / speed;

        if (count < target) {
          counter.innerHTML = Math.ceil(count + inc).toString();
          setTimeout(updateCount, 1);
        } else {
          counter.innerHTML = target.toLocaleString() + '+';
        }
      };

      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          updateCount();
          observer.unobserve(counter);
        }
      }, { threshold: 0.5 });

      observer.observe(counter);
    });
  }, []);


  return (
    <div className="bg-background text-on-background font-body-md overflow-x-hidden">

      <style dangerouslySetInnerHTML={{
        __html: `
        .ease-in-out-expo {
            transition-timing-function: cubic-bezier(0.19, 1, 0.22, 1);
        }

        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .animate-fade-in-up {
            animation: fadeInUp 0.8s cubic-bezier(0.19, 1, 0.22, 1) forwards;
        }

        .reveal {
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.8s cubic-bezier(0.19, 1, 0.22, 1);
        }

        .reveal.active {
            opacity: 1;
            transform: translateY(0);
        }

        .glass-card {
            background: rgba(255, 248, 246, 0.7);
            backdrop-filter: blur(20px);
            border: 1px solid #E5E0D8;
        }

        .ambient-shadow {
            box-shadow: 0 30px 60px -12px rgba(67, 42, 30, 0.08);
        }

        .nav-underline {
            position: relative;
        }
        .nav-underline::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 0;
            height: 2px;
            background-color: #432a1e;
            transition: width 0.3s ease;
        }
        .nav-underline:hover::after {
            width: 100%;
        }
      `}} />

      {/* TopNavBar */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-700 ease-in-out-expo ${scrolled ? 'bg-white/70 backdrop-blur-3xl shadow-lg py-3 border-b border-white/40' : 'bg-transparent py-6 border-b border-transparent'}`}>
        <div className="flex justify-between items-center max-w-7xl mx-auto px-6 md:px-16">
          <div className="font-headline-md text-headline-md font-extrabold text-[#111] tracking-tight">
            Hostelite
          </div>
          <div className="hidden md:flex items-center gap-10">
            <a className="font-label-md text-label-md font-semibold text-gray-800 hover:text-[#111] transition-colors hover:scale-105" href="#features">Features</a>
            <a className="font-label-md text-label-md font-semibold text-gray-800 hover:text-[#111] transition-colors hover:scale-105" href="#pricing">Pricing</a>
            <a className="font-label-md text-label-md font-semibold text-gray-800 hover:text-[#111] transition-colors hover:scale-105" href="#about">About</a>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login" className="bg-[#111] text-white px-8 py-3 rounded-full font-label-md text-label-md font-bold hover:scale-105 transition-transform duration-300 ease-in-out-expo hover:bg-black/80 shadow-xl border border-white/10">
              Login Portal
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#e5ddd5]">
        {/* Background Image */}
        <motion.div
          className="absolute inset-0 w-full h-full"
          initial={{ scale: 1.05, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
        >
          <img
            src="/hero.png"
            alt="Modern Architecture"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/10"></div>
        </motion.div>



        {/* Foreground Content */}
        <div className="relative z-10 w-full max-w-[95rem] mx-auto px-4 md:px-8 h-full pt-32 pb-12">
          {/* Main Content Area */}
          <div className="flex flex-col md:flex-row h-full justify-between items-start pt-10 md:pt-16">
            
            {/* Left Side Typography & Button */}
            <div className="max-w-3xl">
              <motion.h1 
                className="text-6xl md:text-[70px] lg:text-[95px] font-light text-[#111] leading-[0.95] tracking-tight"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5, ease: "easeOut" }}
              >
                YOUR VISION OF<br/>
                <span className="font-light tracking-tighter text-[#111]">SMART HOSTEL</span><br/>
                LIVING
              </motion.h1>
              
              <motion.button 
                className="mt-10 bg-black text-white px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5)] flex items-center gap-3 relative z-20"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
              >
                Launch Hostel <span className="material-symbols-outlined text-sm">rocket_launch</span>
              </motion.button>
            </div>
            

          </div>

          {/* Bottom Floating Cards */}
          <div className="absolute bottom-12 left-4 md:left-8 right-4 md:right-8 flex flex-col md:flex-row justify-between items-end gap-6 md:gap-0 pointer-events-none z-20">
            {/* Left Glass Card */}
            <motion.div 
              className="bg-white/40 backdrop-blur-2xl p-6 rounded-[32px] flex items-center gap-6 shadow-2xl w-full md:w-auto pointer-events-auto border border-white/60"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              <div className="flex -space-x-4">
                <img className="w-14 h-14 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop" alt="avatar" />
                <img className="w-14 h-14 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop" alt="avatar" />
                <img className="w-14 h-14 rounded-full border-2 border-white object-cover" src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop" alt="avatar" />
              </div>
              <div>
                <div className="text-3xl font-extrabold text-[#111]">500+</div>
                <div className="text-sm font-bold text-gray-800 leading-tight">Hostels managed<br/>worldwide</div>
              </div>
            </motion.div>


          </div>
        </div>
      </section>

      {/* Trusted By */}
      <section className="py-24 bg-[#fafafa] relative z-20 border-t border-[#eaeaea]">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <p className="text-[10px] font-bold text-[#999] mb-12 tracking-[0.3em] uppercase text-center">
            Trusted by the world's finest hospitality brands
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 border-t border-l border-[#eaeaea]">
            
            {/* Brand 1 */}
            <div className="p-8 md:p-12 border-r border-b border-[#eaeaea] flex items-center justify-center group cursor-pointer bg-white hover:bg-[#fcfcfc] transition-colors duration-500">
              <span className="text-lg md:text-xl font-light tracking-[0.2em] text-[#bbb] group-hover:text-[#111] transition-colors duration-500 uppercase">Elite</span>
            </div>

            {/* Brand 2 */}
            <div className="p-8 md:p-12 border-r border-b border-[#eaeaea] flex items-center justify-center group cursor-pointer bg-white hover:bg-[#fcfcfc] transition-colors duration-500">
              <div className="flex items-center gap-3 text-[#bbb] group-hover:text-[#111] transition-colors duration-500">
                <div className="w-2 h-2 bg-current rounded-full"></div>
                <span className="text-lg md:text-xl font-bold tracking-widest uppercase">Skyview</span>
              </div>
            </div>

            {/* Brand 3 */}
            <div className="p-8 md:p-12 border-r border-b border-[#eaeaea] flex items-center justify-center group cursor-pointer bg-white hover:bg-[#fcfcfc] transition-colors duration-500">
              <span className="text-xl md:text-2xl font-serif italic text-[#bbb] group-hover:text-[#111] transition-colors duration-500">Grand Living</span>
            </div>

            {/* Brand 4 */}
            <div className="p-8 md:p-12 border-r border-b border-[#eaeaea] flex items-center justify-center group cursor-pointer bg-white hover:bg-[#fcfcfc] transition-colors duration-500">
              <span className="text-lg md:text-xl font-black tracking-tighter text-[#bbb] group-hover:text-[#111] transition-colors duration-500 uppercase">Modern<span className="font-light">Stay</span></span>
            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-32 bg-white reveal" id="features">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-5xl md:text-6xl font-light text-[#111] mb-6 tracking-tight">
                Precision<br/>
                <span className="font-extrabold tracking-tighter">Management Tools</span>
              </h2>
            </div>
            <p className="text-lg text-gray-500 max-w-md font-light leading-relaxed">
              Elevate your administrative efficiency with features built for the modern warden and owner, blending luxury with operational perfection.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Room Management */}
            <div className="group border border-gray-200 p-10 rounded-[32px] hover:bg-[#fafafa] hover:border-gray-300 transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[320px] shadow-sm hover:shadow-md">
              <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-black group-hover:border-black transition-all duration-500">
                <span className="material-symbols-outlined text-2xl font-light">bedroom_parent</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#111] mb-4 tracking-tight">Room Management</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-light">Real-time floor maps, occupancy tracking, and intelligent room allocation at your fingertips.</p>
              </div>
            </div>

            {/* Student Management */}
            <div className="group border border-gray-200 p-10 rounded-[32px] hover:bg-[#fafafa] hover:border-gray-300 transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[320px] shadow-sm hover:shadow-md">
              <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-black group-hover:border-black transition-all duration-500">
                <span className="material-symbols-outlined text-2xl font-light">groups</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#111] mb-4 tracking-tight">Student Management</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-light">Detailed profiles, attendance logs, and automated communication for every resident.</p>
              </div>
            </div>

            {/* Online Payments - Highlighted */}
            <div className="group border border-gray-200 p-10 rounded-[32px] hover:bg-[#111] hover:border-[#111] transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[320px] shadow-sm hover:shadow-2xl">
              <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-white group-hover:border-white/30 transition-all duration-500">
                <span className="material-symbols-outlined text-2xl font-light">payments</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#111] group-hover:text-white mb-4 tracking-tight transition-colors duration-500">Online Payments</h3>
                <p className="text-gray-500 group-hover:text-gray-300 text-sm leading-relaxed font-light transition-colors duration-500">Secure fee collection, automated invoicing, and digital receipts for hassle-free accounting.</p>
              </div>
            </div>

            {/* Maintenance Desk */}
            <div className="group border border-gray-200 p-10 rounded-[32px] hover:bg-[#fafafa] hover:border-gray-300 transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[320px] shadow-sm hover:shadow-md">
              <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-black group-hover:border-black transition-all duration-500">
                <span className="material-symbols-outlined text-2xl font-light">build</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#111] mb-4 tracking-tight">Maintenance Desk</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-light">Streamlined ticketing system for repairs and housekeeping requests with status updates.</p>
              </div>
            </div>

            {/* Mess Management */}
            <div className="group border border-gray-200 p-10 rounded-[32px] hover:bg-[#fafafa] hover:border-gray-300 transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[320px] shadow-sm hover:shadow-md">
              <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-black group-hover:border-black transition-all duration-500">
                <span className="material-symbols-outlined text-2xl font-light">restaurant</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#111] mb-4 tracking-tight">Mess Management</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-light">Digitized meal coupons, menu planning, and waste tracking for optimized dining services.</p>
              </div>
            </div>

            {/* Advanced Reports */}
            <div className="group border border-gray-200 p-10 rounded-[32px] hover:bg-[#fafafa] hover:border-gray-300 transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[320px] shadow-sm hover:shadow-md">
              <div className="w-14 h-14 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:text-black group-hover:border-black transition-all duration-500">
                <span className="material-symbols-outlined text-2xl font-light">analytics</span>
              </div>
              <div>
                <h3 className="text-2xl font-bold text-[#111] mb-4 tracking-tight">Advanced Reports</h3>
                <p className="text-gray-500 text-sm leading-relaxed font-light">Insightful analytics on revenue, occupancy, and operational efficiency for data-driven growth.</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-32 bg-surface-container reveal">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <h2 className="text-4xl font-bold text-primary text-center mb-16">Seamless Implementation</h2>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-[2px] bg-outline-variant -translate-y-1/2"></div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
              <div className="text-center group">
                <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center mx-auto mb-6 transition-transform duration-500 group-hover:scale-110">
                  <span className="text-2xl font-bold">1</span>
                </div>
                <h4 className="font-bold text-primary mb-2 uppercase tracking-wider text-sm">Onboarding</h4>
                <p className="text-sm text-on-surface-variant">Import your current resident and room data seamlessly.</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center mx-auto mb-6 transition-transform duration-500 group-hover:scale-110">
                  <span className="text-2xl font-bold">2</span>
                </div>
                <h4 className="font-bold text-primary mb-2 uppercase tracking-wider text-sm">Configuration</h4>
                <p className="text-sm text-on-surface-variant">Define fee structures, rules, and admin permissions.</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center mx-auto mb-6 transition-transform duration-500 group-hover:scale-110">
                  <span className="text-2xl font-bold">3</span>
                </div>
                <h4 className="font-bold text-primary mb-2 uppercase tracking-wider text-sm">Automation</h4>
                <p className="text-sm text-on-surface-variant">Enable automated billing and notification workflows.</p>
              </div>
              <div className="text-center group">
                <div className="w-16 h-16 rounded-full bg-primary text-on-primary flex items-center justify-center mx-auto mb-6 transition-transform duration-500 group-hover:scale-110">
                  <span className="text-2xl font-bold">4</span>
                </div>
                <h4 className="font-bold text-primary mb-2 uppercase tracking-wider text-sm">Optimization</h4>
                <p className="text-sm text-on-surface-variant">Monitor live dashboards and optimize your operations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Showcase */}
      <section className="py-32 reveal">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-primary mb-4">Command Center Control</h2>
            <div className="flex justify-center gap-4 mt-8">
              <button
                className={`px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider border-2 transition-colors ${activeTab === 'analytics' ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant text-on-surface-variant'}`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </button>
              <button
                className={`px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider border-2 transition-colors ${activeTab === 'inventory' ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant text-on-surface-variant'}`}
                onClick={() => setActiveTab('inventory')}
              >
                Inventory
              </button>
              <button
                className={`px-6 py-2 rounded-full font-bold text-sm uppercase tracking-wider border-2 transition-colors ${activeTab === 'residents' ? 'border-primary bg-primary text-on-primary' : 'border-outline-variant text-on-surface-variant'}`}
                onClick={() => setActiveTab('residents')}
              >
                Residents
              </button>
            </div>
          </div>

          <div className="relative bg-surface-container-high rounded-[32px] p-8 md:p-12 min-h-[400px] md:min-h-[600px] ambient-shadow flex items-center justify-center">
            <div className={`transition-all duration-500 absolute w-[calc(100%-4rem)] md:w-[calc(100%-6rem)] ${activeTab === 'analytics' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
              <img className="w-full rounded-2xl shadow-xl object-cover h-[500px]" alt="Analytics Dashboard" src="/analytics.png" />
            </div>
            <div className={`transition-all duration-500 absolute w-[calc(100%-4rem)] md:w-[calc(100%-6rem)] ${activeTab === 'inventory' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
              <img className="w-full rounded-2xl shadow-xl object-cover h-[500px]" alt="Inventory Management" src="/inventory.png" />
            </div>
            <div className={`transition-all duration-500 absolute w-[calc(100%-4rem)] md:w-[calc(100%-6rem)] ${activeTab === 'residents' ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}>
              <img className="w-full rounded-2xl shadow-xl object-cover h-[500px]" alt="Resident Directory" src="/communications.png" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-24 bg-primary text-on-primary overflow-hidden relative">
        <div className="max-w-7xl mx-auto px-6 md:px-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-center relative z-10">
          <div>
            <div className="text-6xl font-extrabold mb-2 counter" data-target="500">0</div>
            <p className="font-bold text-sm uppercase tracking-widest opacity-80">Hostels Managed</p>
          </div>
          <div>
            <div className="text-6xl font-extrabold mb-2 counter" data-target="50000">0</div>
            <p className="font-bold text-sm uppercase tracking-widest opacity-80">Active Students</p>
          </div>
          <div>
            <div className="text-6xl font-extrabold mb-2">99.9%</div>
            <p className="font-bold text-sm uppercase tracking-widest opacity-80">Platform Uptime</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-32 bg-[#fafafa] reveal border-t border-gray-100" id="pricing">
        <div className="max-w-5xl mx-auto px-6 md:px-16">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-light text-[#111] mb-6 tracking-tight">
              Simple, <span className="font-extrabold tracking-tighter">Scalable Pricing</span>
            </h2>
            <p className="text-lg text-gray-500 max-w-2xl mx-auto font-light">Start for free, then pay a tiny fraction only for the value you get. No hidden fees.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <div className="bg-white border border-gray-200 p-12 rounded-[32px] flex flex-col justify-between hover:border-gray-300 hover:shadow-xl transition-all duration-500 group relative overflow-hidden">
              <div className="absolute top-0 right-0 bg-black text-white text-xs font-bold px-4 py-2 rounded-bl-2xl uppercase tracking-widest">
                Start Here
              </div>
              <div>
                <h3 className="font-bold text-xl text-[#111] mb-2 tracking-tight">Launch Offer</h3>
                <p className="text-gray-500 text-sm font-light mb-8">Perfect to experience the full power of Hostelite risk-free.</p>
                <div className="mb-8 flex items-baseline gap-2">
                  <span className="text-6xl font-light text-[#111] tracking-tighter">Free</span>
                  <span className="text-gray-500 font-light">for 2 months</span>
                </div>
                <ul className="space-y-4 mb-10 text-gray-700 text-sm font-light">
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-500 text-lg">check_circle</span> Unlimited Hostels</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-500 text-lg">check_circle</span> Unlimited Students</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-500 text-lg">check_circle</span> All Premium Features</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-500 text-lg">check_circle</span> 24/7 Priority Support</li>
                </ul>
              </div>
              <button className="w-full border border-black text-black py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-black hover:text-white transition-all duration-300">Start Free Trial</button>
            </div>

            {/* Paid Plan */}
            <div className="bg-[#111] border border-[#222] p-12 rounded-[32px] flex flex-col justify-between hover:shadow-2xl transition-all duration-500 group relative overflow-hidden text-white">
              <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <h3 className="font-bold text-xl text-white mb-2 tracking-tight">Growth Plan</h3>
                <p className="text-gray-400 text-sm font-light mb-8">Automatically applied after your 2-month free trial ends.</p>
                <div className="mb-8 flex items-baseline gap-2">
                  <span className="text-6xl font-light text-white tracking-tighter">100</span>
                  <span className="text-gray-400 font-light">PKR / student</span>
                </div>
                <ul className="space-y-4 mb-10 text-gray-300 text-sm font-light">
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-400 text-lg">check_circle</span> Only pay for registered students</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-400 text-lg">check_circle</span> Unlimited Hostels</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-400 text-lg">check_circle</span> All Premium Features</li>
                  <li className="flex items-center gap-3"><span className="material-symbols-outlined text-green-400 text-lg">check_circle</span> Cancel Anytime</li>
                </ul>
              </div>
              <button className="w-full bg-white text-black py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:scale-105 transition-all duration-300 relative z-10">Upgrade Later</button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-32 bg-surface-container-low reveal">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <h2 className="text-4xl font-bold text-primary text-center mb-16">Trusted by the Best</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="glass-card p-8 rounded-2xl italic text-lg leading-relaxed text-on-surface-variant">
              <p className="mb-8">"Hostelite has completely transformed how we manage our 300-room property. The automation features alone have saved our staff over 20 hours a week in paperwork."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img className="w-full h-full object-cover" alt="James Thornton" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAUzBlhYSeQ_vJXfR4J5buBh_m0tcyNIeP-3yx3ft9PAG97rRklDtvhVfc_1QnfGP-2x2vTlHEx1FOJAue5j2kOTFDpIB-2tfxGh0EUY3LvHBoQoVALHTdAGgR83oEduMTqK8FNGkBZRzZnQjQtjsuT53Hl-PJ-qrgIl05bv_QQHyLG6nw3VBTrgeb3Cu8VMBmzmWtXBMlK866oJSnu9BBMfzrSyaIABW_HdFautfY4RHwBN0HT1XTRbldyYkv0VUQF6RCntyG8UW8a" />
                </div>
                <div>
                  <div className="font-bold text-sm uppercase tracking-wider text-primary">James Thornton</div>
                  <div className="text-xs text-on-surface-variant mt-1">Owner, Elite Residency</div>
                </div>
              </div>
            </div>

            <div className="glass-card p-8 rounded-2xl italic text-lg leading-relaxed text-on-surface-variant">
              <p className="mb-8">"The student portal and payment automation were the biggest wins for us. We've seen a 40% reduction in late fee payments since switching to Hostelite HMS."</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full overflow-hidden">
                  <img className="w-full h-full object-cover" alt="Sarah Chen" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA_QZ4GL7ioyENCY39bXMJomlStcfbOABDzJcHryk5T2D7um1IW_1SbxMKLN1Bq5uBYU1VbXuth0-Y_7K20A6r56sX2UjI5Z541KYm2FazJBDO5N75J5Fcs7VU_JUxnGw0X646aPVwCrW9-SFUYOhihMecjlrRTdzk-as8ZsEmPHizQklJ1dylizJj8Tcj1Eu8Ii2gQGKbnYw8KlOF92Eo-N4s0fKCNLNDA0jLIklaBwhX6R-obW8zZNECuw53Ke5pgDhpLLEAd2rID" />
                </div>
                <div>
                  <div className="font-bold text-sm uppercase tracking-wider text-primary">Sarah Chen</div>
                  <div className="text-xs text-on-surface-variant mt-1">Operations Manager, Skyview</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32 reveal">
        <div className="max-w-7xl mx-auto px-6 md:px-16">
          <div className="bg-primary-container rounded-[40px] p-12 md:p-24 text-center text-on-primary-container relative overflow-hidden">
            <div className="relative z-10">
              <h2 className="text-4xl md:text-6xl font-bold mb-8 leading-tight text-white">Ready to Modernize Your Hostel?</h2>
              <p className="text-lg mb-12 max-w-2xl mx-auto opacity-90 text-white/90">Join 500+ properties managing thousands of students with precision and ease. No credit card required to start.</p>
              <Link href="/signup" className="bg-white text-primary px-10 py-5 rounded-full font-bold text-lg hover:scale-105 transition-all duration-300 shadow-2xl inline-block">Start Your 14-Day Free Trial</Link>
            </div>
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-primary blur-[120px] rounded-full opacity-30"></div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-low dark:bg-surface-dim w-full py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 max-w-7xl mx-auto px-6 md:px-16">
          <div className="col-span-1 md:col-span-1">
            <div className="text-2xl font-bold text-primary mb-6">Hostelite</div>
            <p className="text-on-surface-variant text-sm mb-6 max-w-xs">Elevating hospitality management through innovative digital solutions and human-centric design.</p>
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"><span className="material-symbols-outlined text-sm">share</span></div>
              <div className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"><span className="material-symbols-outlined text-sm">mail</span></div>
              <div className="w-10 h-10 rounded-full border border-outline-variant flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all cursor-pointer"><span className="material-symbols-outlined text-sm">call</span></div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-sm text-primary mb-6 uppercase tracking-widest">Product</h4>
            <ul className="space-y-4">
              <li><a className="text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Room Allocation</a></li>
              <li><a className="text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Fee Management</a></li>
              <li><a className="text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Mess System</a></li>
              <li><a className="text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Resident App</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm text-primary mb-6 uppercase tracking-widest">Company</h4>
            <ul className="space-y-4">
              <li><a className="text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">About Us</a></li>
              <li><a className="text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Success Stories</a></li>
              <li><a className="text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Partners</a></li>
              <li><a className="text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Contact</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-sm text-primary mb-6 uppercase tracking-widest">Resources</h4>
            <ul className="space-y-4">
              <li><a className="text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Documentation</a></li>
              <li><a className="text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Help Center</a></li>
              <li><a className="text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Security</a></li>
              <li><a className="text-on-surface-variant hover:text-primary hover:underline transition-all" href="#">Privacy Policy</a></li>
            </ul>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-6 md:px-16 mt-20 pt-8 border-t border-outline-variant text-center">
          <p className="text-on-surface-variant text-sm opacity-60">© 2024 Hostelite HMS. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
