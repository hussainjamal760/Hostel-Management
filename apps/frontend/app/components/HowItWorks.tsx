import React from "react";

const steps = [
  {
    number: "01",
    title: "Create Account",
    description: "Sign up as an Owner, Manager, or Student. Verification is instant and secure.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
  },
  {
    number: "02",
    title: "Setup Hostel",
    description: "Configure your rooms, floors, and amenities. Add managers to help you run things.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    number: "03",
    title: "Automate",
    description: "Let the system handle billing, complaints, and attendance while you relax.",
    icon: (
      <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
];

const HowItWorks = () => {
  return (
    // Dark Mode BG: brand-primary (Brown)
    <section className="py-24 relative overflow-hidden bg-brand-bg dark:bg-brand-primary transition-colors duration-500">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-brand-primary/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-brand-card/20 dark:bg-brand-bg/20 rounded-full blur-[120px]" />
      </div>

      <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">
        <div className="mx-auto max-w-2xl text-center mb-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-primary text-brand-bg dark:bg-brand-bg dark:text-brand-primary text-xs font-bold tracking-widest uppercase mb-4">
            Simple Process
          </div>
          <h2 className="text-4xl font-bold tracking-tight text-brand-text dark:text-brand-bg sm:text-5xl mb-6">
            Get started in minutes
          </h2>
          <p className="text-lg leading-relaxed text-brand-text/60 dark:text-brand-bg/60">
            We've simplified hostel management into a streamlined process so you can focus on what matters most.
          </p>
        </div>

        <div className="relative">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-brand-primary/20 dark:via-brand-bg/20 to-transparent -translate-y-1/2 z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative z-10 group perspective-1000">
                {/* Dark Mode Card: bg-brand-bg (Cream) */}
                <div className="relative p-8 rounded-3xl bg-brand-primary dark:bg-brand-bg border border-white/10 shadow-xl hover:transform hover:-translate-y-2 transition-all duration-300">
                  {/* Number Watermark */}
                  <span className="absolute -top-6 -right-4 text-9xl font-bold text-white/5 dark:text-brand-primary/5 select-none pointer-events-none group-hover:scale-110 transition-transform duration-500">
                    {step.number}
                  </span>

                  <div className="relative flex flex-col items-center text-center">
                    <div className="w-16 h-16 rounded-2xl bg-brand-bg dark:bg-brand-primary flex items-center justify-center text-brand-primary dark:text-brand-bg shadow-lg mb-6 group-hover:rotate-6 transition-transform duration-300">
                      {step.icon}
                    </div>
                    
                    {/* Text: Light (on dark card) / Dark (on light card) */}
                    <h3 className="text-xl font-bold text-white dark:text-brand-text mb-3">
                      {step.title}
                    </h3>
                    
                    <p className="text-brand-bg/70 dark:text-brand-text/70 leading-relaxed text-sm">
                      {step.description}
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

export default HowItWorks;
