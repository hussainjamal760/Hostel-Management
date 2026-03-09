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
        console.log("Form submitted:", formState);
    };

    return (
        <div className="min-h-screen bg-[#0a0502] text-white font-sans selection:bg-white/20 selection:text-white">
            <Header />

            <section className="relative pt-40 pb-24 min-h-screen flex items-center overflow-hidden">
                {/* Background Gradients */}
                <div className="absolute top-0 right-[-10%] w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[150px] pointer-events-none opacity-30" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-brand-primary/5 rounded-full blur-[150px] pointer-events-none opacity-20" />

                <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10 w-full">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        
                        {/* Left Column: Contact Info */}
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary/10 border border-brand-primary/20 text-brand-primary text-xs font-bold tracking-widest uppercase mb-10">
                                Communication
                            </div>
                            <h1 className="text-6xl md:text-8xl font-black tracking-tight mb-8 leading-[0.9]">
                                LET'S <br />
                                <span className="text-brand-primary font-light italic lowercase tracking-tight">connect.</span>
                            </h1>
                            <p className="text-xl text-white/40 mb-16 max-w-lg leading-relaxed font-light">
                                Have a vision for your hostel? Interested in a partnership? Our <span className="text-white/80 font-medium italic">engineering group</span> is ready to assist.
                            </p>

                            <div className="space-y-10">
                                <div className="flex items-center gap-8 group cursor-pointer w-fit">
                                    <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/5 flex items-center justify-center text-white group-hover:bg-brand-primary group-hover:text-black transition-all duration-500 shadow-xl group-hover:scale-110">
                                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] mb-1">Electronic Mail</p>
                                        <p className="text-2xl font-black text-white group-hover:text-brand-primary transition-colors">hjamal9865@gmail.com</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-8 group cursor-pointer w-fit">
                                    <div className="w-16 h-16 rounded-[24px] bg-white/5 border border-white/5 flex items-center justify-center text-white group-hover:bg-brand-primary group-hover:text-black transition-all duration-500 shadow-xl group-hover:scale-110">
                                        <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-white/20 font-black uppercase tracking-[0.3em] mb-1">Physical Presence</p>
                                        <p className="text-2xl font-black text-white group-hover:text-brand-primary transition-colors">Lahore City, Pakistan</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Column: Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-white/5 backdrop-blur-[100px] border border-white/5 rounded-[60px] p-10 md:p-14 relative overflow-hidden group hover:bg-white/[0.07] transition-all"
                        >
                            <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/20 blur-[80px] pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                            
                            <h3 className="text-4xl font-black mb-10 tracking-tight">Inquiry.</h3>
                            
                            <form onSubmit={handleSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Identity</label>
                                        <input 
                                            type="text" 
                                            name="name"
                                            value={formState.name}
                                            onChange={handleChange}
                                            className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-brand-primary transition-all placeholder:text-white/10 font-bold"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Electronic Post</label>
                                        <input 
                                            type="email" 
                                            name="email"
                                            value={formState.email}
                                            onChange={handleChange}
                                            className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-brand-primary transition-all placeholder:text-white/10 font-bold"
                                            placeholder="john@example.com"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Intent</label>
                                    <input 
                                        type="text" 
                                        name="subject"
                                        value={formState.subject}
                                        onChange={handleChange}
                                        className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-brand-primary transition-all placeholder:text-white/10 font-bold"
                                        placeholder="Partnership Inquiry"
                                    />
                                </div>

                                <div className="space-y-4">
                                    <label className="text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">Communication</label>
                                    <textarea 
                                        name="message"
                                        value={formState.message}
                                        onChange={handleChange}
                                        rows={4}
                                        className="w-full bg-transparent border-b border-white/10 py-4 text-white focus:outline-none focus:border-brand-primary transition-all placeholder:text-white/10 resize-none font-bold"
                                        placeholder="Tell us about your project..."
                                    />
                                </div>

                                <button 
                                    type="submit"
                                    className="w-full py-6 mt-8 bg-brand-primary text-black font-black uppercase tracking-[0.3em] text-[10px] rounded-full hover:scale-105 transition-all shadow-[0_20px_40px_rgba(255,107,0,0.1)] active:scale-95"
                                >
                                    Transmit Message
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
