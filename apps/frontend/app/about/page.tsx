"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";

const values = [
  {
    title: "Innovation",
    description: "We don't just follow trends; we set them. Our tech stack is built for the future.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    colSpan: "md:col-span-2",
  },
  {
    title: "Simplicity",
    description: "Complex problems require simple solutions. We design for clarity.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
      </svg>
    ),
    colSpan: "md:col-span-1",
  },
  {
    title: "Community",
    description: "We build for people. Connecting students and managers seamlessly.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    colSpan: "md:col-span-1",
  },
  {
    title: "Security",
    description: "Your data is sacred. We use enterprise-grade encryption.",
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    colSpan: "md:col-span-2",
  },
];

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-[#0a0502] text-white font-sans selection:bg-white/20 selection:text-white">
            <Header />

            {/* HERO SECTION */}
            <section className="relative pt-40 pb-20 overflow-hidden">
                <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none opacity-40" />

                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold tracking-widest uppercase mb-8">
                            Genesis
                        </div>
                        <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8">
                            BUILDING THE <br />
                            <span className="text-brand-primary font-light italic lowercase tracking-tight">future.</span>
                        </h1>
                        <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-light">
                            We're on a mission to redefine the <span className="text-white/80 italic">student living</span> experience through intelligent engineering and design.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* VALUES SECTION */}
            <section className="py-24 relative bg-black">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mb-20 text-center md:text-left">
                        <motion.h2 
                           initial={{ opacity: 0, x: -20 }}
                           whileInView={{ opacity: 1, x: 0 }}
                           viewport={{ once: true }}
                           className="text-4xl md:text-6xl font-black tracking-tight text-white"
                        >
                            Core <span className="text-white/30 font-light italic">principles.</span>
                        </motion.h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {values.map((value, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                className={`${value.colSpan} group relative overflow-hidden rounded-[40px] bg-white/5 border border-white/5 p-10 transition-all hover:bg-white/10`}
                            >
                                <div className="w-16 h-16 rounded-2xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center text-brand-primary mb-8 group-hover:scale-110 transition-transform">
                                    {value.icon}
                                </div>
                                <h3 className="text-2xl font-bold mb-4 tracking-tight">{value.title}</h3>
                                <p className="text-white/40 text-lg leading-relaxed font-light">{value.description}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* FOUNDER SECTION */}
            <section className="py-32 relative overflow-hidden border-t border-white/5">
                <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />

                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-24">
                        <motion.div 
                           initial={{ opacity: 0, scale: 0.9 }}
                           whileInView={{ opacity: 1, scale: 1 }}
                           viewport={{ once: true }}
                           className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-brand-primary text-xs font-bold tracking-widest uppercase mb-6"
                        >
                            The Visionary
                        </motion.div>
                        <h2 className="text-5xl md:text-7xl font-black text-white">The Founder.</h2>
                    </div>

                    <div className="flex justify-center">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            className="group relative max-w-sm w-full"
                        >
                            <div className="aspect-[4/5] rounded-[60px] bg-white/5 border border-white/5 overflow-hidden relative mb-10 group-hover:-translate-y-4 transition-all duration-700 shadow-2xl">
                                <Image
                                    src="/founder.jpeg"
                                    alt="Hussain Jamal"
                                    fill
                                    className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 scale-110 group-hover:scale-100"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                                <div className="absolute bottom-8 left-0 w-full text-center">
                                     <span className="text-brand-primary text-[10px] font-black uppercase tracking-[0.5em] italic">Architect of Hostelite</span>
                                </div>
                            </div>
                            <div className="text-center group-hover:scale-110 transition-transform duration-500">
                                <h3 className="text-4xl font-black tracking-tight mb-2">Hussain Jamal</h3>
                                <p className="text-white/40 text-xs font-bold uppercase tracking-[0.4em]">Founder & CEO</p>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* CTA SECTION */}
            <section className="py-32 text-center border-t border-white/5">
                <div className="mx-auto max-w-4xl px-6">
                    <h2 className="text-4xl md:text-7xl font-black mb-10 leading-tight">
                        Ready to join the <br />
                        <span className="text-brand-primary font-light italic lowercase tracking-tight">revolution?</span>
                    </h2>
                    <p className="text-xl text-white/30 mb-12 font-light max-w-lg mx-auto leading-relaxed">
                        Experience the gold standard of hostel management today.
                    </p>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-12 py-6 bg-white text-black text-xs font-black uppercase tracking-widest rounded-full shadow-[0_20px_40px_rgba(255,255,255,0.1)] hover:bg-brand-primary hover:text-black transition-all"
                    >
                        Get Started Now
                    </motion.button>
                </div>
            </section>

            <Footer />
        </div>
    );
};

export default AboutPage;
