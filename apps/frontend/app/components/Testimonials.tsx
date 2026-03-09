"use client";

import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

const testimonials = [
  {
    name: "Hassan Ali",
    role: "Hostel Owner",
    content: "The precision in billing and ease of resident tracking is unmatched. Truly a premium experience.",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Zainab Khan",
    role: "Property Manager",
    content: "Mapping our floors and rooms was effortless. The interface is intuitive and incredibly fast.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Osman Sheikh",
    role: "Student Resident",
    content: "Paying bills and tracking my history has never been easier. The dashboard is clean and helpful.",
    image: "https://randomuser.me/api/portraits/men/85.jpg",
  },
];

const Testimonials = () => {
  return (
    <section className="py-24 bg-black relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="text-center mb-20">
                <motion.div 
                   initial={{ opacity: 0, scale: 0.9 }}
                   whileInView={{ opacity: 1, scale: 1 }}
                   viewport={{ once: true }}
                   className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold tracking-widest uppercase mb-6"
                >
                    Recognition
                </motion.div>
                <motion.h2 
                   initial={{ opacity: 0, y: 20 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   className="text-4xl md:text-6xl font-black text-white"
                >
                    Trusted by <br />
                    <span className="text-white/30 font-light italic tracking-tight">industry leaders.</span>
                </motion.h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {testimonials.map((item, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }}
                        className="p-8 rounded-[40px] bg-white/5 border border-white/5 relative group hover:bg-white/10 transition-all"
                    >
                        <div className="relative mb-8">
                            <Image 
                                src={item.image} 
                                alt={item.name} 
                                width={60} 
                                height={60} 
                                className="rounded-full grayscale group-hover:grayscale-0 transition-all duration-500 border-2 border-white/10"
                            />
                            <div className="absolute -bottom-2 -right-2 w-6 h-6 bg-brand-primary rounded-full flex items-center justify-center">
                                <span className="text-black text-[10px] font-black italic">H</span>
                            </div>
                        </div>
                        
                        <p className="text-white/60 text-lg leading-relaxed mb-8 font-light italic">
                           "{item.content}"
                        </p>
                        
                        <div>
                            <h4 className="text-white font-bold tracking-tight">{item.name}</h4>
                            <p className="text-brand-primary/50 text-[10px] font-bold uppercase tracking-[0.2em] mt-1">{item.role}</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    </section>
  );
};

export default Testimonials;
