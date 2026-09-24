import React, { useEffect, useRef } from 'react';
import ThreeStar from './ThreeStar';
import gsap from 'gsap';

export default function Hero() {
  const heroRef = useRef(null);
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);
  const imgRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entrance animation
      gsap.from([title1Ref.current, title2Ref.current], {
        y: 80,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out'
      });

      gsap.from(imgRef.current, {
        scale: 0.85,
        opacity: 0,
        duration: 1.4,
        delay: 0.2,
        ease: 'power3.out'
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <section 
      id="hero-section" 
      ref={heroRef}
      className="relative min-h-[90vh] md:min-h-screen flex flex-col justify-between items-center pt-28 pb-10 px-6 max-w-7xl mx-auto overflow-hidden select-none"
    >
      {/* 3D Decorative Chrome Star - Top Left */}
      <div className="absolute top-24 left-6 md:left-16 z-20 hover:scale-110 transition-transform">
        <ThreeStar size={1.1} className="w-24 h-24 md:w-32 md:h-32" />
      </div>

      {/* 3D Decorative Chrome Star - Bottom Right */}
      <div className="absolute bottom-20 right-6 md:right-16 z-20 hover:scale-110 transition-transform">
        <ThreeStar size={1.2} rotationSpeed={-0.01} className="w-28 h-28 md:w-36 md:h-36" />
      </div>

      {/* Center Hero Heading & Imagery */}
      <div className="relative w-full flex-1 flex flex-col items-center justify-center my-auto">
        {/* Title 1: SOFTWARE */}
        <h1 
          ref={title1Ref}
          className="text-[14vw] sm:text-[13vw] md:text-[12vw] font-black uppercase tracking-tighter leading-[0.85] text-[#111111] text-center w-full"
        >
          Software
        </h1>

        {/* Center Portrait Image Card */}
        <div 
          ref={imgRef}
          className="relative z-10 -my-6 sm:-my-10 md:-my-16 group"
        >
          <div className="w-[190px] h-[240px] sm:w-[240px] sm:h-[300px] md:w-[290px] md:h-[360px] rounded-[24px] sm:rounded-[32px] overflow-hidden shadow-2xl border-4 border-[#ECEAE5] group-hover:scale-[1.03] transition-transform duration-500 bg-neutral-200">
            <img 
              src="https://framerusercontent.com/images/rR6HYXBrMmX4cRpXfXUOvpvpB0.png" 
              alt="Majd - Software Engineer"
              className="w-full h-full object-cover grayscale contrast-110 group-hover:grayscale-0 transition-all duration-700"
              loading="eager"
            />
          </div>
        </div>

        {/* Title 2: ENGINEER */}
        <h1 
          ref={title2Ref}
          className="text-[14vw] sm:text-[13vw] md:text-[12vw] font-black uppercase tracking-tighter leading-[0.85] text-[#111111] text-center w-full"
        >
          Engineer
        </h1>
      </div>

      {/* Bottom Metadata Info */}
      <div className="w-full flex items-center justify-between text-xs sm:text-sm font-semibold tracking-wider text-neutral-600 uppercase pt-6 border-t border-neutral-300/40">
        <div>©2026</div>
        <div className="tracking-widest">/CREATING SINCE 2020</div>
      </div>
    </section>
  );
}
