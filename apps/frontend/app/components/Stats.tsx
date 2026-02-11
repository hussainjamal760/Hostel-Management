"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";

const stats = [
  { 
    id: 1, 
    name: "Active Hostels", 
    value: 500, 
    suffix: "+",
  },
  { 
    id: 2, 
    name: "Happy Residents", 
    value: 50000, 
    suffix: "+",
  },
  { 
    id: 3, 
    name: "Uptime", 
    value: 99.9, 
    suffix: "%",
  },
  { 
    id: 4, 
    name: "Support", 
    value: 24, 
    suffix: "/7",
  },
];

const Stats = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  return (
    <div 
      ref={sectionRef} 
      className="py-32 relative bg-brand-primary dark:bg-[#0a0502] overflow-hidden"
    >
        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => (
                <motion.div 
                    key={stat.id} 
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative text-center p-8 rounded-2xl border border-white/5 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors cursor-default"
                >   
                    <dt className="text-xs font-bold leading-6 text-white/50 uppercase tracking-[0.2em] mb-4">
                        {stat.name}
                    </dt>
                    <dd className="text-5xl font-black tracking-tight text-white mb-2">
                        {isVisible ? (
                            <Counter value={stat.value} duration={2000} suffix={stat.suffix} />
                        ) : (
                            <span>0{stat.suffix}</span>
                        )}
                    </dd>
                    <div className="w-12 h-1 bg-white/10 mx-auto rounded-full mt-4" />
                </motion.div>
            ))}
            </div>
        </div>
    </div>
  );
};

const Counter = ({ value, duration, suffix }: { value: number, duration: number, suffix: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    const incrementTime = (duration / end) * 10;

    const timer = setInterval(() => {
      start += (end / 50);
      if (start >= end) {
        setCount(end);
        clearInterval(timer);
      } else {
        setCount(Math.ceil(start));
      }
    }, 20);

    return () => clearInterval(timer);
  }, [value, duration]);

  const displayValue = value % 1 !== 0 ? value : count;

  return <span>{displayValue}{suffix}</span>;
};

export default Stats;
