"use client";

import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="bg-black py-24 border-t border-white/5 overflow-hidden relative">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                <div className="md:col-span-2">
                    <Link href="/" className="flex items-center gap-3 mb-8 group w-fit">
                        <div className="relative w-10 h-10 bg-brand-primary rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(255,107,0,0.4)] transition-transform group-hover:scale-110">
                            <span className="text-black font-black text-xl">H</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-white font-black text-2xl tracking-tighter leading-none">
                                HOSTELITE
                            </span>
                            <span className="text-brand-primary text-[11px] font-light italic tracking-[0.2em] mt-1">
                                BEYOND ORDINARY
                            </span>
                        </div>
                    </Link>
                    <p className="text-white/30 text-xl font-light max-w-md leading-relaxed">
                        Redefining the standards of <span className="text-white/60 font-medium italic">hostel living</span> through intelligent engineering and design excellence.
                    </p>
                </div>
                
                <div>
                    <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-8">Ecosystem</h3>
                    <ul className="space-y-4">
                        <li><Link href="#" className="text-white/30 hover:text-brand-primary transition-colors text-sm font-bold uppercase tracking-wider">Features</Link></li>
                        <li><Link href="#" className="text-white/30 hover:text-brand-primary transition-colors text-sm font-bold uppercase tracking-wider">Interface</Link></li>
                        <li><Link href="#" className="text-white/30 hover:text-brand-primary transition-colors text-sm font-bold uppercase tracking-wider">Support</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-8">Organization</h3>
                    <ul className="space-y-4">
                        <li><Link href="/about" className="text-white/30 hover:text-brand-primary transition-colors text-sm font-bold uppercase tracking-wider">History</Link></li>
                        <li><Link href="/contact" className="text-white/30 hover:text-brand-primary transition-colors text-sm font-bold uppercase tracking-wider">Contact</Link></li>
                    </ul>
                </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center gap-8 pt-12 border-t border-white/5">
                <p className="text-white/10 text-[10px] font-bold uppercase tracking-[0.3em]">
                  © {new Date().getFullYear()} Hostelite Inc. All rights reserved.
                </p>
                
                <div className="flex gap-8">
                    <a href="#" className="text-white/20 hover:text-brand-primary transition-colors">
                        <span className="sr-only">Twitter</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.095 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                    </a>
                    <a href="#" className="text-white/20 hover:text-brand-primary transition-colors">
                        <span className="sr-only">GitHub</span>
                        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                    </a>
                </div>
            </div>
            
            {/* Massive Parallax Text */}
            <div className="absolute bottom-[-10%] right-[-5%] select-none pointer-events-none opacity-[0.02]">
                <span className="text-[250px] font-black text-white leading-none tracking-tighter">HOSTELITE</span>
            </div>
        </div>
    </footer>
  );
};

export default Footer;
