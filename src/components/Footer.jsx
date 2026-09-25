import React from 'react';

export default function Footer({ onNavigate }) {
  const quickLinks = [
    { label: 'Home', href: '#hero-section', page: 'home' },
    { label: 'About Me', href: '#bio-section', page: 'home' },
    { label: 'Services', href: '#services', page: 'home' },
    { label: 'Works', href: '#projects', page: 'work' },
    { label: 'Contact', href: '#contact', page: 'home' },
    { label: 'Admin CMS', page: 'admin' },
  ];

  const handleLink = (link) => {
    if ((link.page === 'work' || link.page === 'admin') && onNavigate) {
      onNavigate(link.page);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    if (onNavigate) onNavigate('home');
    setTimeout(() => {
      const el = document.querySelector(link.href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <footer className="w-full bg-[#0d0d0d] text-white pt-20 pb-16 px-6 sm:px-12 mt-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 sm:gap-16">
        {/* Left Headline */}
        <div className="md:col-span-6 flex flex-col justify-between">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-tight font-heading">
            Scaling Start-ups for Growth.
          </h2>
          <p className="mt-8 text-neutral-500 text-sm font-mono">
            Designed &amp; Developed with precision. Inspired by Majd.
          </p>
        </div>

        {/* Middle: Quick links */}
        <div className="md:col-span-3 space-y-4">
          <span className="block text-xs uppercase tracking-widest text-neutral-500 font-mono">
            /Quick links
          </span>
          <div className="flex flex-col items-start gap-2.5">
            {quickLinks.map((link, idx) => (
              <button
                key={idx}
                onClick={() => handleLink(link)}
                className="px-4 py-2 rounded-full bg-neutral-900 hover:bg-white hover:text-black text-neutral-300 text-sm font-medium transition-all duration-300 cursor-pointer border border-white/5"
              >
                {link.label}
              </button>
            ))}
          </div>
        </div>

        {/* Right: Contact email */}
        <div className="md:col-span-3 space-y-4">
          <span className="block text-xs uppercase tracking-widest text-neutral-500 font-mono">
            /Contact
          </span>
          <div>
            <a
              href="mailto:Mejed@Templyo.io"
              className="text-lg sm:text-xl font-medium text-white hover:text-neutral-300 transition-colors underline underline-offset-4 decoration-neutral-700 hover:decoration-white"
            >
              Mejed@Templyo.io
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
