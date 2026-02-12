"use client";

import React from "react";
import { motion, type Variants } from "framer-motion";
import Link from "next/link";

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.04 },
  },
};

const child: Variants = {
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
  hidden: {
    opacity: 0,
    y: 20,
    filter: "blur(10px)",
    transition: {
      type: "spring",
      damping: 12,
      stiffness: 100,
    },
  },
};

const Hero = () => {
  const sentence = "Manage Your Hostel Effortlessly.";
  const letters = sentence.split("");

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-brand-primary dark:bg-[#0a0502]">
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
            animate={{ 
                scale: [1, 1.2, 1],
                x: [0, 50, 0],
                y: [0, 30, 0],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-brand-bg/5 rounded-full blur-[120px]" 
        />
        <motion.div 
            animate={{ 
                scale: [1, 1.1, 1],
                x: [0, -30, 0],
                y: [0, -50, 0],
            }}
            transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-brand-card/5 rounded-full blur-[140px]" 
        />
      </div>

      <div className="container mx-auto px-6 relative z-10 text-center">
        
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 backdrop-blur-md border border-white/10 text-brand-bg/80 text-sm font-medium tracking-wide mb-8 hover:bg-white/10 transition-colors cursor-default"
        >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Beta Version
        </motion.div>

        <motion.div
            style={{ overflow: "hidden", display: "flex", justifyContent: "center", flexWrap: "wrap" }}
            variants={container}
            initial="hidden"
            animate="visible"
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight text-white mb-8 max-w-5xl mx-auto leading-[1.1]"
        >
          {letters.map((letter, index) => (
            <motion.span variants={child} key={index} className="inline-block relative">
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.div>

        <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5, duration: 1 }}
            className="text-lg md:text-xl text-brand-bg/60 max-w-2xl mx-auto mb-12 leading-relaxed"
        >
            The all-in-one platform to manage residents, billing, and operations. 
            Experience the future of hostel management today.
        </motion.p>

        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-24"
        >
            <Link 
                href="/auth/signup" 
                className="px-8 py-4 rounded-xl bg-brand-bg text-brand-primary font-bold text-lg hover:scale-105 transition-transform shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
            >
                Get Started Free
            </Link>
            
        </motion.div>

        <motion.div
            initial={{ opacity: 0, y: 100, rotateX: 20 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ delay: 3.5, duration: 1.5, type: "spring", stiffness: 50 }}
            style={{ perspective: "1000px" }}
            className="relative mx-auto max-w-5xl"
        >
            <motion.div
                animate={{ y: [0, -20, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-t-3xl border border-white/10 bg-[#0F0F0F]/80 backdrop-blur-xl shadow-2xl overflow-hidden"
            >
                <div className="flex items-center gap-4 px-6 py-4 border-b border-white/5 bg-white/5">
                    <div className="flex gap-2">
                        <div className="w-3 h-3 rounded-full bg-red-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-yellow-500/50"></div>
                        <div className="w-3 h-3 rounded-full bg-green-500/50"></div>
                    </div>
                    <div className="flex-1 text-center">
                        <div className="mx-auto w-64 h-2 rounded-full bg-white/10"></div>
                    </div>
                </div>
                
                <div className="p-8 grid grid-cols-12 gap-6 h-[400px] md:h-[600px]">
                    <div className="col-span-3 hidden md:block space-y-4">
                        <div className="h-8 w-2/3 bg-white/10 rounded-lg"></div>
                        <div className="h-4 w-full bg-white/5 rounded-lg"></div>
                        <div className="h-4 w-5/6 bg-white/5 rounded-lg"></div>
                        <div className="h-4 w-4/5 bg-white/5 rounded-lg"></div>
                    </div>
                    
                    <div className="col-span-12 md:col-span-9 space-y-6">
                        <div className="grid grid-cols-3 gap-6">
                            <div className="h-32 rounded-2xl bg-white/5 border border-white/5"></div>
                            <div className="h-32 rounded-2xl bg-gradient-to-br from-brand-primary/50 to-transparent border border-white/5"></div>
                            <div className="h-32 rounded-2xl bg-white/5 border border-white/5"></div>
                        </div>
                        <div className="h-64 rounded-2xl bg-white/5 border border-white/5 p-6 flex items-end gap-4">
                           <div className="w-1/12 h-[20%] bg-white/10 rounded-t-md"></div>
                           <div className="w-1/12 h-[40%] bg-white/10 rounded-t-md"></div>
                           <div className="w-1/12 h-[60%] bg-brand-bg/20 rounded-t-md"></div>
                           <div className="w-1/12 h-[30%] bg-white/10 rounded-t-md"></div>
                        </div>
                    </div>
                </div>

                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none"></div>
            </motion.div>
        </motion.div>

      </div>
    </section>
  );
};

export default Hero;
