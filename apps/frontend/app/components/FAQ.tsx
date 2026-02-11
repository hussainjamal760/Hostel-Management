"use client";

import React, { useState } from "react";
import Link from "next/link";

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
    // Dark Mode BG: brand-primary (Brown)
    <section className="bg-brand-primary dark:bg-brand-primary transition-colors duration-500 py-32 border-t border-brand-primary/5 dark:border-white/5">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            
            {/* Left Column: Sticky Header */}
            <div className="lg:col-span-5 h-fit lg:sticky lg:top-32">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-brand-bg dark:text-brand-bg text-xs font-bold tracking-widest uppercase mb-6">
                    Support
                </div>
                {/* Light Text */}
                <h2 className="text-4xl font-bold tracking-tight text-white dark:text-brand-bg mb-6">
                    Frequently asked questions
                </h2>
                <p className="text-lg text-brand-bg/60 dark:text-brand-bg/60 mb-10 leading-relaxed">
                    Everything you need to know about the product and billing. Can’t find the answer you’re looking for? Please chat to our friendly team.
                </p>
                
                <Link 
                    href="/contact"
                    className="inline-flex items-center justify-center px-8 py-4 rounded-xl font-bold transition-all bg-brand-bg text-brand-primary dark:bg-brand-bg dark:text-brand-primary shadow-lg hover:shadow-xl hover:-translate-y-1"
                >
                    Contact Support
                </Link>
            </div>

            {/* Right Column: Accordion (Light Cards) */}
            <div className="lg:col-span-7 space-y-4">
                {faqs.map((faq, index) => (
                    <div 
                        key={index} 
                        // Dark Mode Card: bg-brand-bg (Cream)
                        className={`group rounded-2xl bg-brand-bg dark:bg-brand-bg border border-transparent dark:border-white/10 px-6 py-2 overflow-hidden transition-all duration-300 ${openIndex === index ? 'shadow-lg' : 'shadow-sm opacity-90 hover:opacity-100'}`}
                    >
                        <button 
                            onClick={() => toggleFAQ(index)}
                            className="flex w-full items-center justify-between py-4 text-left focus:outline-none"
                        >
                            {/* Dark Text */}
                            <span className={`text-lg transition-colors duration-300 font-semibold ${openIndex === index ? 'text-brand-primary dark:text-brand-primary' : 'text-brand-text dark:text-brand-text'}`}>
                                {faq.question}
                            </span>
                            <span className="ml-6 flex-shrink-0">
                                <div className={`relative h-6 w-6 transform transition-transform duration-300 ${openIndex === index ? 'rotate-180' : 'rotate-0'}`}>
                                    {/* Dark Icons */}
                                    <div className={`absolute top-1/2 left-0 h-[2px] w-full bg-brand-text dark:bg-brand-text transform -translate-y-1/2 transition-colors`}></div>
                                    <div className={`absolute top-0 left-1/2 h-full w-[2px] bg-brand-text dark:bg-brand-text transform -translate-x-1/2 transition-all ${openIndex === index ? 'scale-y-0 opacity-0' : 'scale-y-100 opacity-100'}`}></div>
                                </div>
                            </span>
                        </button>
                        
                        <div 
                            className={`grid transition-all duration-300 ease-in-out ${
                                openIndex === index ? 'grid-rows-[1fr] opacity-100 pb-4' : 'grid-rows-[0fr] opacity-0 pb-0'
                            }`}
                        >
                            <div className="overflow-hidden">
                                <p className="text-base leading-7 text-brand-text/70 dark:text-brand-text/70 border-t border-brand-text/10 pt-4 mt-2">
                                    {faq.answer}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

        </div>
      </div>
    </section>
  );
};

export default FAQ;
