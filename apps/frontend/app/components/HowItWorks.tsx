"use client";

import React from "react";
import { motion } from "framer-motion";

const steps = [
  {
    number: "01",
    title: "Create Account",
    description: "Sign up as an Owner, Manager, or Student. Verification is instant and secure.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Setup Hostel",
    description: "Configure your rooms, floors, and amenities. Add managers to help you run things.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Automate",
    description: "Let the system handle billing, complaints, and attendance while you relax.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

const HowItWorks = () => {
  return (
    <section className="py-32 relative bg-brand-primary dark:bg-[#0a0502] overflow-hidden">
      
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center mb-24">
            <motion.div 
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               viewport={{ once: true }}
               className="inline-flex items-center justify-center w-16 h-1 bg-white/10 rounded-full mb-8" 
            />
            <motion.h2 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-4xl md:text-5xl font-black text-white mb-6"
            >
              Seamless onboarding.
            </motion.h2>
            <motion.p 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="text-lg text-white/60"
            >
               From sign up to automation in three simple steps.
            </motion.p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2 }}
                  className="relative z-10 group"
              >
                <div className="relative p-8 rounded-3xl bg-[#0F0F0F] border border-white/5 shadow-2xl transition-transform duration-500 hover:-translate-y-4">
                  {/* Glowing Number */}
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-8xl font-black text-white/5 pointer-events-none group-hover:text-white/10 transition-colors">
                    {step.number}
                  </div>

                  <div className="relative flex flex-col items-center text-center mt-4">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white mb-6 shadow-[0_0_30px_-10px_rgba(255,255,255,0.2)] group-hover:scale-110 transition-transform">
                      {step.icon}
                    </div>
                    
                    <h3 className="text-xl font-bold text-white mb-4">
                      {step.title}
                    </h3>
                    
                    <p className="text-white/60 leading-relaxed text-sm">
                      {step.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
