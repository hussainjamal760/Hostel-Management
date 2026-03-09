"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What is Hostelite CMS?",
    answer: "Hostelite CMS is a premium hostel management ecosystem designed to streamline operations for owners, managers, and students. It handles everything from room allocation to precision billing.",
  },
  {
    question: "Who can use this platform?",
    answer: "Our platform supports three main roles: Hostel Owners (admin/oversight), Managers (day-to-day operations), and Students (residents who need to pay bills and log complaints).",
  },
  {
    question: "How do I register my hostel?",
    answer: "Simply sign up as an Owner, verify your email, and you'll be guided through our intuitive setup wizard to map your hostel architecture.",
  },
  {
    question: "How does billing work?",
    answer: "Managers can generate precision bills for rent or mess. Students receive instant notifications and can view their complete payment history through their private dashboard.",
  },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

  return (
    <section className="bg-black py-24 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-5">
                <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold tracking-widest uppercase mb-6"
                >
                    Support
                </motion.div>
                <motion.h2 
                   initial={{ opacity: 0, y: 10 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.1 }}
                   className="text-4xl md:text-6xl font-black tracking-tight text-white mb-8"
                >
                    Questions <br />
                    <span className="text-white/30 font-light italic tracking-tight">& answers.</span>
                </motion.h2>
                
                <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.3 }}
                >
                    <Link 
                        href="/contact"
                        className="inline-flex items-center justify-center px-8 py-4 rounded-full font-bold transition-all bg-white text-black hover:bg-brand-primary hover:scale-105"
                    >
                        Contact Support
                    </Link>
                </motion.div>
            </div>

            <div className="lg:col-span-7 space-y-4">
                {faqs.map((faq, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }} 
                        className={`group rounded-[32px] border border-white/5 px-8 transition-all duration-300 ${openIndex === index ? 'bg-white/5 border-white/10' : 'bg-transparent hover:bg-white/5'}`}
                    >
                        <button 
                            onClick={() => toggleFAQ(index)}
                            className="flex w-full items-center justify-between py-8 text-left focus:outline-none"
                        >
                            <span className={`text-xl transition-colors duration-300 font-bold tracking-tight ${openIndex === index ? 'text-brand-primary' : 'text-white/80'}`}>
                                {faq.question}
                            </span>
                            <span className={`ml-6 shrink-0 transition-transform duration-500 ${openIndex === index ? 'rotate-180' : ''}`}>
                                <svg className={`w-6 h-6 ${openIndex === index ? 'text-brand-primary' : 'text-white/20'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </span>
                        </button>
                        
                        <AnimatePresence>
                            {openIndex === index && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.4 }}
                                    className="overflow-hidden"
                                >
                                    <p className="text-lg leading-relaxed text-white/40 pb-8 font-light">
                                        {faq.answer}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>
        </div>
      </div>
    </section>
  );
};

export default FAQ;
