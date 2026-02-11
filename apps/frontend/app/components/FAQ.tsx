"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const faqs = [
  {
    question: "What is Hostelite CMS?",
    answer: "Hostelite CMS is a comprehensive hostel management system designed to streamline operations for owners, managers, and students. It handles everything from room allocation to billing and complaints.",
  },
  {
    question: "Who can use this platform?",
    answer: "Our platform supports three main roles: Hostel Owners (admin/oversight), Managers (day-to-day operations), and Students (residents who need to pay bills and log complaints).",
  },
  {
    question: "How do I register my hostel?",
    answer: "Simply sign up as an Owner, verify your email, and you'll be guided through a setup wizard to add your hostel details, configure rooms/floors, and invite managers.",
  },
  {
    question: "Is there a mobile app?",
    answer: "Currently, Hostelite is a fully responsive web application that works perfectly on all mobile browsers. A dedicated mobile app is on our roadmap.",
  },
  {
    question: "How does billing work?",
    answer: "Managers can generate monthly rent or mess bills. Students receive invoices in their dashboard and can view payment history. (Online payment integration coming soon).",
  },
  {
    question: "Is my data secure?",
    answer: "Yes, we use industry-standard encryption for all data and secure authentication protocols to ensure your hostel's sensitive detailed are protected.",
  },
];

const FAQ = () => {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

  return (
    <section className="bg-brand-primary dark:bg-[#0a0502] py-32 relative">
      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Column: Sticky Header */}
            <div className="lg:col-span-5 h-fit lg:sticky lg:top-32">
                <motion.div 
                   initial={{ opacity: 0, x: -20 }}
                   whileInView={{ opacity: 1, x: 0 }}
                   viewport={{ once: true }}
                   className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-bold tracking-widest uppercase mb-6"
                >
                    Support
                </motion.div>
                <motion.h2 
                   initial={{ opacity: 0, y: 10 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.1 }}
                   className="text-4xl font-black tracking-tight text-white mb-6"
                >
                    Frequently asked questions
                </motion.h2>
                <motion.p 
                   initial={{ opacity: 0, y: 10 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.2 }}
                   className="text-lg text-white/50 mb-10 leading-relaxed"
                >
                    Everything you need to know about the product and billing. Can’t find the answer you’re looking for? Please chat to our friendly team.
                </motion.p>
                
                <motion.div
                   initial={{ opacity: 0, y: 10 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   transition={{ delay: 0.3 }}
                >
                    <Link 
                        href="/contact"
                        className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold transition-all bg-white text-black hover:bg-white/90 hover:scale-105"
                    >
                        Contact Support
                    </Link>
                </motion.div>
            </div>

            {/* Right Column: Accordion */}
            <div className="lg:col-span-7 space-y-4">
                {faqs.map((faq, index) => (
                    <motion.div 
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: index * 0.1 }} 
                        className={`group rounded-2xl border border-white/5 px-6 transition-all duration-300 ${openIndex === index ? 'bg-white/10' : 'bg-transparent hover:bg-white/5'}`}
                    >
                        <button 
                            onClick={() => toggleFAQ(index)}
                            className="flex w-full items-center justify-between py-6 text-left focus:outline-none"
                        >
                            <span className={`text-lg transition-colors duration-300 font-bold ${openIndex === index ? 'text-white' : 'text-white/80'}`}>
                                {faq.question}
                            </span>
                            <span className="ml-6 flex-shrink-0">
                                <div className={`relative h-6 w-6 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : 'rotate-0'}`}>
                                    <div className="absolute top-1/2 left-0 h-[2px] w-full bg-white transform -translate-y-1/2"></div>
                                    <div className={`absolute top-0 left-1/2 h-full w-[2px] bg-white transform -translate-x-1/2 transition-all ${openIndex === index ? 'scale-y-0 opacity-0' : 'scale-y-100 opacity-100'}`}></div>
                                </div>
                            </span>
                        </button>
                        
                        <AnimatePresence>
                            {openIndex === index && (
                                <motion.div 
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: "auto", opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.3, ease: "easeInOut" }}
                                    className="overflow-hidden"
                                >
                                    <p className="text-base leading-7 text-white/60 pb-6">
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
