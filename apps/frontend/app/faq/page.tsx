"use client";

import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import FAQ from "../components/FAQ";
import { motion } from "framer-motion";

const FAQPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0502] text-white font-sans selection:bg-white/20 selection:text-white">
      <Header />
      
      <section className="relative pt-40 pb-12 overflow-hidden">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold tracking-widest uppercase mb-8">
                    Knowledge Base
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8">
                    WE HAVE THE <br />
                    <span className="text-brand-primary font-light italic lowercase tracking-tight">solutions.</span>
                </h1>
                <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-light">
                    Common questions regarding the implementation and daily operations of the <span className="text-white/80 italic">Hostelite</span> ecosystem.
                </p>
            </motion.div>
        </div>
      </section>

      <FAQ />

      <section className="py-24 text-center border-t border-white/5">
         <div className="mx-auto max-w-3xl px-6">
            <h2 className="text-3xl font-black mb-8">Still have questions?</h2>
            <p className="text-lg text-white/40 mb-12 font-light italic">
               Our engineering and support teams are available 24/7 to provide precision guidance.
            </p>
            <motion.a
               href="/contact"
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               className="px-10 py-5 bg-white text-black text-sm font-black uppercase tracking-widest rounded-full shadow-xl transition-all"
            >
               Open Support Ticket
            </motion.a>
         </div>
      </section>

      <Footer />
    </div>
  );
};

export default FAQPage;
