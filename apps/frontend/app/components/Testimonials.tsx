"use client";

import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    body: "Hostelite transformed how I manage my property. I used to track everything in mismatched spreadsheets, but now expenses and rent collection are fully automated.",
    author: {
      name: "Ahmed Khan",
      handle: "Hostel Owner",
      initial: "A",
      gradient: "from-orange-400 to-red-500"
    },
  },
  {
    body: "The room allocation system is a lifesaver. I can see vacant beds instantly and assign new students in seconds. It saves me hours every week.",
    author: {
      name: "Sarah Jenkins",
      handle: "Manager",
      initial: "S",
      gradient: "from-blue-400 to-indigo-500"
    },
  },
  {
    body: "Finally, I can pay my hostel fees online and download receipts without chasing the manager. The complaint tracking is also super responsive.",
    author: {
      name: "Rahul Verma",
      handle: "Student",
      initial: "R",
      gradient: "from-green-400 to-emerald-500"
    },
  },
];

const Testimonials = () => {
  return (
    <section className="py-32 bg-brand-primary dark:bg-[#0a0502] overflow-hidden">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center mb-20">
          <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             className="inline-flex items-center justify-center px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/60 text-xs font-bold uppercase tracking-widest mb-6"
          >
            Review
          </motion.div>
          <motion.h2 
             initial={{ opacity: 0, y: 20 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="text-4xl font-black tracking-tight text-white sm:text-5xl mb-4"
          >
            Trusted by the best.
          </motion.h2>
        </div>
        
        <div className="mx-auto grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <motion.div 
                key={index} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                whileHover={{ y: -5 }}
                className="relative flex flex-col justify-between rounded-3xl bg-white/5 backdrop-blur-md border border-white/5 p-8 transition-all duration-300 hover:bg-white/10"
              >
                  {/* Quote Icon */}
                  <div className="text-6xl text-white/5 font-serif font-black absolute top-4 right-6 pointer-events-none">"</div>

                <div className="relative z-10">
                  <div className="flex gap-x-1 text-white/20 mb-6">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <svg key={star} className="h-5 w-5 flex-none fill-current text-yellow-500" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  <blockquote className="text-white/80 text-lg leading-relaxed font-medium">
                    "{testimonial.body}"
                  </blockquote>
                </div>
                
                <div className="mt-8 flex items-center gap-x-4 pt-6 border-t border-white/10">
                  <div className={`h-12 w-12 flex-none rounded-full bg-gradient-to-br ${testimonial.author.gradient} flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-white/10`}>
                    {testimonial.author.initial}
                  </div>
                  <div className="text-sm leading-6">
                    <div className="font-bold text-white text-base">{testimonial.author.name}</div>
                    <div className="text-white/40">{testimonial.author.handle}</div>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
