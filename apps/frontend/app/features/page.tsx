"use client";

import React from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Features from "../components/Features";

const FeaturesPage = () => {
  return (
    <div className="min-h-screen bg-[#0a0502] text-white font-sans selection:bg-white/20 selection:text-white">
      <Header />
      
      <section className="relative pt-40 pb-20 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none opacity-40" />
        
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 text-center">
            <motion.div
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.8 }}
            >
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold tracking-widest uppercase mb-8">
                    Capabilities
                </div>
                <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8">
                    UNCOMPROMISED <br />
                    <span className="text-brand-primary font-light italic lowercase tracking-tight">performance.</span>
                </h1>
                <p className="text-xl text-white/50 max-w-2xl mx-auto leading-relaxed font-light">
                    Every feature of <span className="text-white/80 italic">Hostelite</span> is engineered to provide maximum efficiency for high-scale hostel environments.
                </p>
            </motion.div>
        </div>
      </section>

      <Features />

      <section className="py-24 border-t border-white/5">
         <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
               <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
               >
                  <h2 className="text-4xl font-black mb-6">Real-time Analytics</h2>
                  <p className="text-lg text-white/40 leading-relaxed font-light mb-8">
                     Monitor occupancy, revenue, and maintenance requests in real-time. Our dashboard provides 
                     <span className="text-white/80 italic"> surgical precision</span> into every aspect of your property.
                  </p>
                  <div className="space-y-4">
                     {[
                        "Dynamic Revenue Tracking",
                        "Resident Behavioral Insights",
                        "Maintenance Heatmaps",
                        "Automated Financial Audits"
                     ].map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                           <div className="w-5 h-5 rounded-full bg-brand-primary/20 flex items-center justify-center">
                              <div className="w-2 h-2 rounded-full bg-brand-primary" />
                           </div>
                           <span className="text-white/70 font-bold uppercase tracking-widest text-[10px]">{item}</span>
                        </div>
                     ))}
                  </div>
               </motion.div>
               <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="aspect-square rounded-[60px] bg-gradient-to-br from-brand-primary/20 to-transparent border border-white/5 p-1 relative overflow-hidden"
               >
                  <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
                  <div className="w-full h-full rounded-[58px] bg-black/40 backdrop-blur-3xl flex items-center justify-center p-12">
                     <div className="w-full space-y-4">
                        <div className="h-4 w-full bg-white/10 rounded-full animate-pulse" />
                        <div className="h-4 w-5/6 bg-white/10 rounded-full animate-pulse delay-75" />
                        <div className="h-4 w-4/6 bg-brand-primary/20 rounded-full animate-pulse delay-150" />
                        <div className="pt-8 grid grid-cols-2 gap-4">
                           <div className="h-24 bg-white/5 rounded-3xl" />
                           <div className="h-24 bg-brand-primary/10 rounded-3xl border border-brand-primary/20" />
                        </div>
                     </div>
                  </div>
               </motion.div>
            </div>
         </div>
      </section>

      <Footer />
    </div>
  );
};

export default FeaturesPage;
