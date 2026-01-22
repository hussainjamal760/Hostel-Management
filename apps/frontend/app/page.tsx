"use client";

import Header from "./components/Header";
import Hero from "./components/Hero";

export default function Home() {
  return (
    <div className="min-h-screen bg-brand-bg dark:bg-dark-bg transition-colors duration-500">
      <Header />
      <Hero />
      
      {/* Features Section */}
      <section id="features" className="py-24 sm:py-32 bg-brand-card/30 dark:bg-dark-card/30">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:text-center">
            <h2 className="text-base font-semibold leading-7 text-brand-primary dark:text-dark-primary">Everything you need</h2>
            <p className="mt-2 text-3xl font-bold tracking-tight text-brand-text dark:text-dark-text sm:text-4xl">
              Powerful features for every role
            </p>
          </div>
          <div className="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-none">
            <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-16 lg:max-w-none lg:grid-cols-3">
              <div className="flex flex-col p-6 rounded-2xl bg-brand-bg dark:bg-dark-bg shadow-lg">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-brand-text dark:text-dark-text">
                  <div className="h-10 w-10 rounded-xl bg-brand-primary dark:bg-dark-primary flex items-center justify-center text-white dark:text-dark-bg font-bold">
                    1
                  </div>
                  Resident Management
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-brand-text/70 dark:text-dark-text/70">
                  <p className="flex-auto">Easily onboard students, track documents, and manage room allocations with our intuitive interface.</p>
                </dd>
              </div>
              <div className="flex flex-col p-6 rounded-2xl bg-brand-bg dark:bg-dark-bg shadow-lg">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-brand-text dark:text-dark-text">
                  <div className="h-10 w-10 rounded-xl bg-brand-primary dark:bg-dark-primary flex items-center justify-center text-white dark:text-dark-bg font-bold">
                    2
                  </div>
                  Automated Billing
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-brand-text/70 dark:text-dark-text/70">
                  <p className="flex-auto">Generate receipts, track payments, and send automatic reminders to ensure your finances stay healthy.</p>
                </dd>
              </div>
              <div className="flex flex-col p-6 rounded-2xl bg-brand-bg dark:bg-dark-bg shadow-lg">
                <dt className="flex items-center gap-x-3 text-base font-semibold leading-7 text-brand-text dark:text-dark-text">
                  <div className="h-10 w-10 rounded-xl bg-brand-primary dark:bg-dark-primary flex items-center justify-center text-white dark:text-dark-bg font-bold">
                    3
                  </div>
                  Smart Operations
                </dt>
                <dd className="mt-4 flex flex-auto flex-col text-base leading-7 text-brand-text/70 dark:text-dark-text/70">
                  <p className="flex-auto">Handle complaints, track attendance, and manage inventory all in one place accessible from any device.</p>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-brand-bg dark:bg-dark-bg border-t border-brand-card dark:border-dark-card">
        <div className="mx-auto max-w-7xl px-6 py-12 md:flex md:items-center md:justify-between lg:px-8">
          <div className="flex justify-center space-x-6 md:order-2">
            <span className="text-brand-text/60 dark:text-dark-text/60 text-sm">© 2024 Hostelite HMS. All rights reserved.</span>
          </div>
          <div className="mt-8 md:order-1 md:mt-0">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-xl bg-brand-primary dark:bg-dark-primary flex items-center justify-center text-white dark:text-dark-bg text-sm font-bold">H</div>
              <p className="text-center text-sm leading-5 text-brand-text/60 dark:text-dark-text/60">
                Hostelite - Seamless Hostel Living.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
