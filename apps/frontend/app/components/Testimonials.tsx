import React from "react";

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
    // Dark Mode BG: brand-primary (Brown)
    <div className="py-32 bg-brand-bg dark:bg-brand-primary transition-colors duration-500">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-xl text-center mb-16">
          <h2 className="text-4xl font-bold tracking-tight text-brand-text dark:text-brand-bg sm:text-5xl mb-4">
            Loved by everyone
          </h2>
          <p className="text-lg leading-8 text-brand-text/60 dark:text-brand-bg/60">
            See what our community has to say about their experience.
          </p>
        </div>
        
        <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-20 lg:mx-0 lg:max-w-none">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial, index) => (
              <div 
                key={index} 
                // Dark Mode Card: bg-brand-bg (Cream)
                className={`relative flex flex-col justify-between rounded-3xl bg-brand-primary dark:bg-brand-bg p-8 shadow-xl shadow-brand-primary/10 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 ring-1 ring-black/5 ${index === 1 ? 'lg:-mt-8 lg:mb-8' : ''}`}
              >
                  {/* Decorative Quote Icon - Light Color */}
                  <div className="absolute top-6 right-8 text-6xl text-white/10 dark:text-brand-primary/10 font-serif font-black select-none">
                      "
                  </div>

                <div className="relative z-10">
                  <div className="flex gap-x-1 text-yellow-400 mb-6">
                    {[0, 1, 2, 3, 4].map((star) => (
                      <svg key={star} className="h-5 w-5 flex-none fill-current" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10.868 2.884c-.321-.772-1.415-.772-1.736 0l-1.83 4.401-4.753.381c-.833.067-1.171 1.107-.536 1.651l3.62 3.102-1.106 4.637c-.194.813.691 1.456 1.405 1.02L10 15.591l4.069 2.485c.713.436 1.598-.207 1.404-1.02l-1.106-4.637 3.62-3.102c.635-.544.297-1.584-.536-1.65l-4.752-.382-1.831-4.401z" clipRule="evenodd" />
                      </svg>
                    ))}
                  </div>
                  {/* Text: Light (on dark card) / Dark (on light card) */}
                  <blockquote className="text-brand-bg/90 dark:text-brand-text/90 text-lg leading-relaxed font-medium">
                    "{testimonial.body}"
                  </blockquote>
                </div>
                
                <div className="mt-8 flex items-center gap-x-4 border-t border-white/10 dark:border-brand-primary/10 pt-6">
                  <div className={`h-12 w-12 flex-none rounded-full bg-gradient-to-br ${testimonial.author.gradient} flex items-center justify-center text-white font-bold text-xl shadow-md`}>
                    {testimonial.author.initial}
                  </div>
                  <div className="text-sm leading-6">
                    <div className="font-bold text-white dark:text-brand-text text-base">{testimonial.author.name}</div>
                    <div className="text-white/50 dark:text-brand-text/50">{testimonial.author.handle}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonials;
