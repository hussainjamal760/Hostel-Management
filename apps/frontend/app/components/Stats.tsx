"use client";

import React, { useEffect, useState, useRef } from "react";

const stats = [
  { 
    id: 1, 
    name: "Active Hostels", 
    value: 500, 
    suffix: "+",
    icon: "🏢"
  },
  { 
    id: 2, 
    name: "Happy Residents", 
    value: 50000, 
    suffix: "+",
    icon: "users"
  },
  { 
    id: 3, 
    name: "Uptime", 
    value: 99.9, 
    suffix: "%",
    icon: "server"
  },
  { 
    id: 4, 
    name: "Support", 
    value: 24, 
    suffix: "/7",
    icon: "headset"
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
    // Dark Mode BG: brand-primary (Brown)
    <div 
      ref={sectionRef} 
      className="py-20 relative bg-brand-primary dark:bg-brand-primary transition-colors duration-500"
    >
        {/* Decorative pattern */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>

        <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat) => (
                <div 
                    key={stat.id} 
                    // Dark Mode Card: bg-brand-bg (Cream)
                    className="relative overflow-hidden rounded-3xl bg-brand-bg dark:bg-brand-bg border border-white/10 p-8 hover:transform hover:-translate-y-1 transition-all duration-300 group shadow-lg"
                >   
                    <dt className="text-sm font-medium leading-6 text-brand-text/60 dark:text-brand-text/60 uppercase tracking-wider mb-2">
                        {stat.name}
                    </dt>
                    <dd className="text-4xl font-bold tracking-tight text-brand-primary dark:text-brand-primary">
                        {isVisible ? (
                            <Counter value={stat.value} duration={2000} suffix={stat.suffix} />
                        ) : (
                            <span>0{stat.suffix}</span>
                        )}
                    </dd>
                </div>
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
