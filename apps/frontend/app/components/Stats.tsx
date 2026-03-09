"use client";

import React from "react";
import { motion } from "framer-motion";

const stats = [
  { id: 1, name: "Active Hostels", value: "500+" },
  { id: 2, name: "Happy Residents", value: "50k+" },
  { id: 3, name: "Platform Uptime", value: "99.9%" },
  { id: 4, name: "Global Support", value: "24/7" },
];

const Stats = () => {
  return (
    <section className="py-24 bg-black relative border-y border-white/5">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {stats.map((stat, index) => (
                <motion.div 
                    key={stat.id} 
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="flex flex-col items-center lg:items-start"
                >   
                    <span className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-4">
                        {stat.value}
                    </span>
                    <span className="text-brand-primary/50 text-xs md:text-sm uppercase tracking-[0.3em] font-light italic">
                        {stat.name}
                    </span>
                </motion.div>
            ))}
            </div>
        </div>
    </section>
  );
};

export default Stats;
