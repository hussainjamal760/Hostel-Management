"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

const plans = [
  {
    name: "Experience",
    price: "$0",
    description: "Full access to all features for your first 3 months.",
    features: ["Unlimited Residents", "Precision Billing", "Real-time Analytics", "Full Support", "No Credit Card Required"],
    highlight: true,
    cta: "Start 3 Months Free",
    subtext: "Experience the system before you pay",
  },
  {
    name: "Growth",
    price: "Custom",
    description: "Transparent, per-resident pricing after your free trial.",
    features: ["Scale with Resident Count", "Enterprise-grade Security", "Unlimited Staff Accounts", "Multi-property Support"],
    highlight: false,
    cta: "Contact for Quote",
    subtext: "Only pay for what you use",
  },
];

const PricingPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0502] text-white font-sans selection:bg-white/20 selection:text-white">
      <Header />
      
      <section className="relative pt-40 pb-24 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
            <motion.div
               initial={{ opacity: 0, scale: 0.95 }}
               animate={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8 }}
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold tracking-widest uppercase mb-8">
                    Investment
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8">
                    SCALE WITH <br />
                    <span className="text-brand-primary font-light italic lowercase tracking-tight">transparency.</span>
                </h1>
                <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-light mb-20">
                    Pricing designed to scale with your <span className="text-white/80 italic">ambition</span>. No hidden fees, just pure operational power.
                </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-5xl mx-auto items-start">
               {plans.map((plan, index) => (
                  <motion.div
                     key={index}
                     initial={{ opacity: 0, y: 30 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ delay: index * 0.1, duration: 0.8 }}
                     className={`p-12 rounded-[60px] border transition-all duration-500 relative overflow-hidden ${plan.highlight 
                        ? "bg-white/10 border-brand-primary/30 shadow-[0_40px_80px_rgba(255,107,0,0.15)] -translate-y-6" 
                        : "bg-white/5 border-white/5 hover:bg-white/10"}`}
                  >
                     {plan.highlight && (
                        <div className="absolute top-8 right-8 px-4 py-1 rounded-full bg-brand-primary text-black text-[10px] font-black uppercase tracking-widest italic animate-pulse">
                           Recommended
                        </div>
                     )}
                     <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-brand-primary mb-8">{plan.name}</h3>
                     <div className="flex items-baseline gap-2 mb-4">
                        <span className="text-6xl md:text-8xl font-black">{plan.price}</span>
                     </div>
                     <p className="text-brand-primary/60 text-xs font-black uppercase tracking-widest mb-10 italic">{plan.subtext}</p>
                     
                     <div className="h-px w-full bg-white/5 mb-10" />

                     <ul className="space-y-6 mb-12 text-left">
                        {plan.features.map((feature, i) => (
                           <li key={i} className="flex items-center gap-4">
                              <svg className="w-5 h-5 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                              <span className="text-white/70 text-sm font-medium">{feature}</span>
                           </li>
                        ))}
                     </ul>

                     <button className={`w-full py-6 rounded-full font-black text-xs uppercase tracking-widest transition-all ${plan.highlight 
                        ? "bg-brand-primary text-black hover:scale-105 shadow-[0_20px_40px_rgba(255,107,0,0.3)]" 
                        : "bg-white/10 border border-white/10 text-white hover:bg-white/20"}`}>
                        {plan.cta}
                     </button>
                  </motion.div>
               ))}
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PricingPage;
