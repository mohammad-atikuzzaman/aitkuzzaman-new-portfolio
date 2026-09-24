import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Bio() {
  return (
    <section id="bio-section" className="py-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
        {/* Left Column */}
        <div className="lg:col-span-3 flex flex-col justify-between h-full space-y-6">
          <h2 className="text-5xl sm:text-6xl font-bold tracking-tight text-[#111111] font-heading">
            Hey!
          </h2>
          <p className="text-lg sm:text-xl text-neutral-700 leading-relaxed font-normal">
            I’m Majd, a builder based in Syria, currently working on Templyo, a platform for high-quality Framer templates.
          </p>
        </div>

        {/* Center Column - Featured Moody Photo */}
        <div className="lg:col-span-5 flex justify-center">
          <div className="relative w-full max-w-[420px] aspect-[3/4] rounded-[28px] overflow-hidden shadow-xl group border border-black/5">
            <img 
              src="https://framerusercontent.com/images/haSjyjpt7FyCjJUBvXtmzCMSEQg.png?scale-down-to=1024&width=800&height=1072" 
              alt="Majd Portrait"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
              loading="lazy"
            />
            {/* Subtle red overlay glow on hover */}
            <div className="absolute inset-0 bg-red-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
          </div>
        </div>

        {/* Right Column */}
        <div className="lg:col-span-4 flex flex-col justify-center space-y-6">
          <p className="text-base sm:text-lg text-neutral-800 leading-relaxed">
            I’m a software engineer and Framer creator with a strong focus on building modern, scalable, and conversion-driven web experiences.
          </p>
          <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
            Over the years, I’ve created and shipped multiple SaaS products and Framer templates used by global customers, helping them launch faster.
          </p>
          <div className="pt-2">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-900 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 group border border-black/5"
            >
              <span>Get Started</span>
              <div className="w-5 h-5 rounded-full bg-neutral-100 group-hover:bg-neutral-800 flex items-center justify-center transition-colors">
                <ArrowUpRight size={13} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
