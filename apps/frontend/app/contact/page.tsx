"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import Header from "../components/Header";
import Footer from "../components/Footer";

const ContactPage = () => {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormState({
            ...formState,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle form submission logic here
        console.log("Form submitted:", formState);
    };

  return (
    <div className="min-h-screen bg-[#0a0502] text-white font-sans selection:bg-white/20 selection:text-white">
      <Header />

      <section className="relative pt-40 pb-24 min-h-screen flex items-center">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[120px] pointer-events-none" />

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                
                {/* Left Column: Contact Info */}
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/70 text-xs font-bold tracking-widest uppercase mb-8">
                        Get in touch
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-8 leading-tight">
                        Let's start a <br/>
                        <span className="text-white/40">conversation.</span>
                    </h1>
                    <p className="text-xl text-white/50 mb-12 max-w-lg leading-relaxed">
                        Have a question about Hostelite? Interested in a partnership? Or just want to say hi? We're all ears.
                    </p>

                    <div className="space-y-8">
                        <div className="flex items-center gap-6 group cursor-pointer">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-white/40 font-bold uppercase tracking-wider mb-1">Email us</p>
                                <p className="text-xl font-bold">hjamal9865@gmail.com</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-6 group cursor-pointer">
                            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-white group-hover:bg-white group-hover:text-black transition-all duration-300">
                                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <div>
                                <p className="text-sm text-white/40 font-bold uppercase tracking-wider mb-1">Visit us</p>
                                <p className="text-xl font-bold">123 Innovation Dr, Lahore City</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-16 flex gap-4">
                        {['twitter', 'github', 'linkedin', 'instagram'].map((social) => (
                            <a key={social} href="#" className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-white transition-all">
                                <span className="sr-only">{social}</span>
                                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                                    <circle cx="12" cy="12" r="2" />
                                </svg>
                            </a>
                        ))}
                    </div>
                </motion.div>

                {/* Right Column: Contact Form */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/20 blur-[50px] pointer-events-none" />
                    
                    <h3 className="text-2xl font-bold mb-8">Send a message</h3>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Name</label>
                                <input 
                                    type="text" 
                                    name="name"
                                    value={formState.name}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/20"
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Email</label>
                                <input 
                                    type="email" 
                                    name="email"
                                    value={formState.email}
                                    onChange={handleChange}
                                    className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/20"
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Subject</label>
                            <input 
                                type="text" 
                                name="subject"
                                value={formState.subject}
                                onChange={handleChange}
                                className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/20"
                                placeholder="Partnership Inquiry"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-white/40 uppercase tracking-wider">Message</label>
                            <textarea 
                                name="message"
                                value={formState.message}
                                onChange={handleChange}
                                rows={4}
                                className="w-full bg-transparent border-b border-white/10 py-3 text-white focus:outline-none focus:border-white transition-colors placeholder:text-white/20 resize-none"
                                placeholder="Tell us about your project..."
                            />
                        </div>

                        <button 
                            type="submit"
                            className="w-full py-4 mt-4 bg-white text-black font-bold rounded-xl hover:bg-white/90 hover:scale-[1.02] transition-all active:scale-[0.98]"
                        >
                            Send Message
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ContactPage;
