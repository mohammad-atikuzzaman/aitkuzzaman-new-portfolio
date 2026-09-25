import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function Services() {
  const [hoveredIdx, setHoveredIdx] = useState(null);

  const services = [
    {
      title: 'Web Experiences',
      tags: 'Websites • Landing Pages • E-commerce',
      desc: 'Designing and engineering fast, responsive web experiences that look great, feel intuitive, and turn visitors into customers.',
    },
    {
      title: 'Full-Stack Engineering',
      tags: 'React • Next.js • Node.js • MongoDB',
      desc: 'Building robust full-stack applications with scalable architecture, secure authentication, custom APIs, dashboards, and reliable data systems.',
    },
    {
      title: 'SaaS & AI Products',
      tags: 'SaaS • AI • Automation • Real-time',
      desc: 'Building production-ready digital products that combine thoughtful UX, powerful backend systems, AI capabilities, and business automation.',
    },
    {
      title: 'Optimization & Growth',
      tags: 'Performance • SEO • Security • Analytics',
      desc: 'Turning existing websites into faster, more discoverable, and more reliable products through performance engineering, technical SEO, and security improvements.',
    },
  ];

  return (
    <section id="services" className="py-24 px-6 max-w-7xl mx-auto">
      <div className="mb-14">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#111111] font-heading">
          Services
        </h2>
      </div>

      <div className="border-t border-black/15">
        {services.map((service, index) => (
          <div
            key={index}
            onMouseEnter={() => setHoveredIdx(index)}
            onMouseLeave={() => setHoveredIdx(null)}
            className="group relative border-b border-black/15 py-8 sm:py-10 px-4 transition-all duration-300 rounded-2xl hover:bg-black/[0.03] cursor-pointer"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <span className="text-xs font-mono text-neutral-400">0{index + 1}</span>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold tracking-tight text-[#111111] group-hover:translate-x-2 transition-transform duration-300 font-heading">
                  {service.title}
                </h3>
              </div>

              <div className="flex items-center gap-6">
                <p className="text-xs sm:text-sm md:text-base text-neutral-500 font-medium tracking-wide">
                  {service.tags}
                </p>
                <div className="w-9 h-9 rounded-full bg-white border border-black/5 flex items-center justify-center opacity-0 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all duration-300 shadow-sm shrink-0">
                  <ArrowUpRight size={16} className="text-black" />
                </div>
              </div>
            </div>

            {/* Accordion snippet on hover or active */}
            {hoveredIdx === index && (
              <p className="mt-3 text-sm text-neutral-600 max-w-xl animate-in fade-in duration-200 pl-8">
                {service.desc}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
