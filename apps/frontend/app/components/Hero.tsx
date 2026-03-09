"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="relative pt-15 pb-20 md:pt-25 md:pb-25 overflow-hidden bg-black">
      {/* Background Accents */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[1400px] h-full pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col items-center text-center">
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-6"
          >
            <span className="text-brand-primary font-bold tracking-[0.3em] uppercase text-xs md:text-sm">
              The Evolution of Living
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1 }}
            className="text-5xl md:text-8xl lg:text-[120px] font-black text-white leading-[0.9] tracking-tighter mb-8"
          >
            MANAGE WITH <br />
            <span className="text-brand-primary font-light italic lowercase tracking-tight">elegance.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 1 }}
            className="text-white/40 text-lg md:text-2xl max-w-3xl font-light leading-relaxed mb-12"
          >
            Hostelite is a premium <span className="text-white/80 font-medium italic">management ecosystem</span> designed for the modern hostel owner. 
            Automate billing, track residents, and scale your operations with unmatched precision.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}
            className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto"
          >
            <Link
              href="/signup"
              className="px-10 py-5 rounded-full bg-brand-primary text-black font-bold text-lg transition-all hover:scale-110 hover:shadow-[0_0_40px_rgba(255,107,0,0.5)] active:scale-95"
            >
              Start Free Trial
            </Link>
            <Link
              href="/demo"
              className="px-10 py-5 rounded-full bg-white/5 border border-white/10 text-white font-bold text-lg backdrop-blur-sm transition-all hover:bg-white/10 active:scale-95"
            >
              Book a Demo
            </Link>
          </motion.div>

          {/* Abstract visual element */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 1.5, type: "spring", stiffness: 40 }}
            className="mt-20 w-full max-w-5xl relative aspect-video rounded-[40px] overflow-hidden border border-white/10 bg-gradient-to-br from-white/5 to-transparent shadow-2xl"
          >
            <Image src="/hero-preview-isolated.png" alt="Hero Dashboard Preview" fill className="object-cover" priority />
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default Hero;
