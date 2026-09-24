import React, { useState, useEffect } from 'react';
import { X, MoreHorizontal, ArrowUpRight } from 'lucide-react';

export default function Navbar({ onNavigate, activePage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'About Me', href: '#bio-section', page: 'home' },
    { label: 'Services', href: '#services', page: 'home' },
    { label: 'Projects', href: '#projects', page: 'work' },
    { label: 'Contact', href: '#contact', page: 'home' },
  ];

  const handleNavClick = (item) => {
    setIsOpen(false);
    if (item.page === 'work' && onNavigate) {
      onNavigate('work');
      return;
    }
    if (activePage !== 'home' && onNavigate) {
      onNavigate('home');
      setTimeout(() => {
        const el = document.querySelector(item.href);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.querySelector(item.href);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <header className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div 
        className={`pointer-events-auto bg-[#111111]/95 backdrop-blur-md text-white transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl border border-white/10 ${
          isOpen ? 'w-[320px] rounded-[24px] p-4' : 'w-[200px] h-[52px] rounded-full px-5 py-2'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between w-full h-[36px]">
          <button 
            onClick={() => {
              if (activePage !== 'home' && onNavigate) onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="font-bold text-[17px] tracking-tight hover:opacity-80 transition-opacity cursor-pointer font-heading"
          >
            Akash
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-sm"
          >
            {isOpen ? (
              <X size={16} strokeWidth={2.5} />
            ) : (
              <MoreHorizontal size={18} strokeWidth={2.5} />
            )}
          </button>
        </div>

        {/* Expanded Navigation Links */}
        {isOpen && (
          <div className="mt-4 pt-3 border-t border-white/10 flex flex-col gap-2 animate-in fade-in slide-in-from-top-2 duration-200">
            {navItems.map((item, idx) => (
              <button
                key={idx}
                onClick={() => handleNavClick(item)}
                className="w-full py-2.5 px-4 bg-white text-black font-medium text-[15px] rounded-xl hover:bg-neutral-200 transition-colors flex items-center justify-between cursor-pointer group shadow-sm text-left"
              >
                <span>{item.label}</span>
                <ArrowUpRight size={15} className="text-neutral-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
