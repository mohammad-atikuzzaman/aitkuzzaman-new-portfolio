import React, { useState, useEffect, useRef } from 'react';
import { X, MoreHorizontal, ArrowUpRight } from 'lucide-react';

export default function Navbar({ onNavigate, activePage }) {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Smoothly close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('pointerdown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('pointerdown', handleClickOutside);
    };
  }, [isOpen]);

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
    <header className="fixed top-5 sm:top-6 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      <div 
        ref={navRef}
        className={`pointer-events-auto bg-[#111111]/95 backdrop-blur-xl text-white transition-all duration-400 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-2xl border border-white/10 overflow-hidden rounded-[28px] ${
          isOpen 
            ? 'w-[290px] sm:w-[320px] p-3.5 sm:p-4 shadow-black/50' 
            : 'w-[195px] sm:w-[205px] px-4 sm:px-5 py-2 shadow-black/20'
        }`}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between w-full h-[36px]">
          <button 
            onClick={() => {
              if (activePage !== 'home' && onNavigate) onNavigate('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setIsOpen(false);
            }}
            className="font-bold text-[17px] tracking-tight hover:opacity-80 transition-opacity cursor-pointer font-heading select-none"
          >
            Akash
          </button>

          <button
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
            className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-transform cursor-pointer shadow-sm relative overflow-hidden"
          >
            {/* Animated cross-fading and rotating icon */}
            <span
              className={`absolute flex items-center justify-center transition-all duration-300 ease-out ${
                isOpen
                  ? 'rotate-0 opacity-100 scale-100'
                  : 'rotate-90 opacity-0 scale-50'
              }`}
            >
              <X size={16} strokeWidth={2.5} />
            </span>
            <span
              className={`absolute flex items-center justify-center transition-all duration-300 ease-out ${
                isOpen
                  ? '-rotate-90 opacity-0 scale-50'
                  : 'rotate-0 opacity-100 scale-100'
              }`}
            >
              <MoreHorizontal size={18} strokeWidth={2.5} />
            </span>
          </button>
        </div>

        {/* Expandable Navigation Content using CSS Grid Rows */}
        <div
          className={`grid transition-[grid-template-rows] duration-350 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
          }`}
        >
          <div className="overflow-hidden">
            <div
              className={`pt-3 mt-1 border-t border-white/10 flex flex-col gap-2 transition-all duration-300 ease-out ${
                isOpen
                  ? 'opacity-100 translate-y-0 delay-75'
                  : 'opacity-0 -translate-y-2 pointer-events-none'
              }`}
            >
              {navItems.map((item, idx) => (
                <button
                  key={idx}
                  onClick={() => handleNavClick(item)}
                  className="w-full py-2.5 px-4 bg-white text-black font-medium text-[15px] rounded-[16px] hover:bg-neutral-200 active:scale-[0.98] transition-all flex items-center justify-between cursor-pointer group shadow-sm text-left"
                >
                  <span>{item.label}</span>
                  <ArrowUpRight
                    size={15}
                    className="text-neutral-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
