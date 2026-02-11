"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
    bg: "bg-blue-500/10 text-blue-400"
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
    bg: "bg-purple-500/10 text-purple-400"
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
    bg: "bg-green-500/10 text-green-400"
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
    bg: "bg-orange-500/10 text-orange-400"
  },
];

const team = [
  {
    name: "Hussain Jamal",
    role: "Founder & CEO",
    color: "from-blue-500 to-cyan-500",
  },
  {
    name: "Haseeb Ahmed",
    role: "Co-Founder",
    color: "from-purple-500 to-pink-500",
  },
];

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0502] text-white font-sans selection:bg-white/20 selection:text-white">
      <Header />

      {/* HERO SECTION */}
      <section className="relative pt-40 pb-20 overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-brand-primary/20 rounded-full blur-[120px] pointer-events-none opacity-40 animate-pulse-slow" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8, ease: "easeOut" }}
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-bold tracking-widest uppercase mb-8">
                    Our Story
                </div>
                <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
                    Building the future <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/40">
                         of student living.
                    </span>
                </h1>
                <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
                    We believe hostel management shouldn't be a headache. It should be intuitive, secure, and smart. We're here to change the game.
                </p>
            </motion.div>
        </div>
      </section>

      {/* VALUES SECTION (Bento Grid) */}
      <section className="py-24 relative bg-white/[0.02]">
         <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mb-16">
               <h2 className="text-3xl font-bold mb-4">Core Principles</h2>
               <div className="w-20 h-1 bg-white/20 rounded-full" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               {values.map((value, index) => (
                  <motion.div
                     key={index}
                     initial={{ opacity: 0, y: 20 }}
                     whileInView={{ opacity: 1, y: 0 }}
                     viewport={{ once: true }}
                     transition={{ delay: index * 0.1 }}
                     whileHover={{ y: -5 }}
                     className={`${value.colSpan} group relative overflow-hidden rounded-3xl bg-[#0F0F0F] border border-white/5 p-8 transition-all hover:bg-white/5`}
                  >
                     <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${value.bg}`}>
                        {value.icon}
                     </div>
                     <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                     <p className="text-white/50 text-lg leading-relaxed">{value.description}</p>
                     
                     <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-10 transition-opacity">
                        <div className="scale-150">{value.icon}</div>
                     </div>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* TEAM SECTION */}
      <section className="py-32 relative overflow-hidden">
         <div className="absolute right-0 bottom-0 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[100px] pointer-events-none" />

         <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
               <h2 className="text-4xl font-bold mb-6">The Visionaries</h2>
               <p className="text-white/50 text-lg">The minds behind the magic.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
               {team.map((member, index) => (
                  <motion.div
                     key={index}
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     viewport={{ once: true }}
                     transition={{ delay: index * 0.1 }}
                     className="group relative"
                  >
                     <div className="aspect-square rounded-3xl bg-white/5 border border-white/5 overflow-hidden relative mb-6">
                        {/* Placeholder Avatar Gradient */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${member.color} opacity-80 group-hover:scale-110 transition-transform duration-500`} />
                        <div className="absolute inset-0 flex items-center justify-center text-4xl font-bold opacity-30 mix-blend-overlay">
                           {member.name.charAt(0)}
                        </div>
                     </div>
                     <h3 className="text-xl font-bold">{member.name}</h3>
                     <p className="text-brand-primary mt-1 font-medium">{member.role}</p>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* CTA SECTION */}
      <section className="py-24 text-center">
         <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-4xl md:text-5xl font-black mb-8">Ready to join the revolution?</h2>
            <p className="text-xl text-white/50 mb-10">Experience the future of hostel management today.</p>
            <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="px-8 py-4 bg-white text-black text-lg font-bold rounded-xl shadow-xl hover:shadow-2xl hover:shadow-white/20 transition-all"
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
