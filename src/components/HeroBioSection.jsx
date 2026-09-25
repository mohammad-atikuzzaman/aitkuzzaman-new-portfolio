import React, { useEffect, useRef } from 'react';
import ThreeStar from './ThreeStar';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function HeroBioSection() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const bioRef = useRef(null);
  const cardRef = useRef(null);
  const targetSlotRef = useRef(null);
  const title1Ref = useRef(null);
  const title2Ref = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Guaranteed entrance animation with fromTo
      gsap.fromTo(
        [title1Ref.current, title2Ref.current],
        { y: 60, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, stagger: 0.12, ease: 'power3.out' }
      );

      // 2. ScrollTrigger for 3D Flipping Card from Hero to Bio
      const card = cardRef.current;
      const targetSlot = targetSlotRef.current;
      const hero = heroRef.current;
      const bio = bioRef.current;

      if (!card || !targetSlot || !hero || !bio) return;

      const calculateAndAnimate = () => {
        const cardTop = card.getBoundingClientRect().top + window.scrollY;
        const targetTop = targetSlot.getBoundingClientRect().top + window.scrollY;
        const deltaY = targetTop - cardTop;

        gsap.fromTo(
          card,
          { y: 0, rotateY: 0 },
          {
            y: deltaY,
            rotateY: 180,
            ease: 'none',
            scrollTrigger: {
              trigger: hero,
              start: 'top top',
              endTrigger: bio,
              end: 'top 15%',
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          }
        );
      };

      // Slight delay to allow DOM calculations to settle
      const timer = setTimeout(calculateAndAnimate, 80);
      return () => clearTimeout(timer);
    }, containerRef);

    const handleResize = () => {
      ScrollTrigger.refresh();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full overflow-visible">
      {/* ================= HERO SECTION ================= */}
      <section
        id="hero-section"
        ref={heroRef}
        className="relative min-h-[92vh] md:min-h-screen flex flex-col justify-between items-center pt-20 sm:pt-24 pb-6 sm:pb-8 px-4 sm:px-6 max-w-7xl mx-auto overflow-visible touch-pan-y"
      >
        {/* Hero Headings with 3D Chrome Stars anchored directly to text */}
        <div className="w-full flex-1 flex flex-col items-center justify-center my-auto relative z-10 -mt-35 sm:mt-0">
          <div className="relative flex flex-col items-center justify-center leading-[0.80] sm:leading-[0.82] tracking-tighter text-center">
            {/* Top-left Star (anchored to text with responsive positioning) */}
            <div className="absolute -top-10 sm:-top-14 -left-10 sm:-left-16 md:-left-20 z-20 hover:scale-110 transition-transform pointer-events-auto">
              <ThreeStar size={1.05} className="w-16 h-16 sm:w-28 sm:h-28 md:w-36 md:h-36" />
            </div>

            <h1
              ref={title1Ref}
              className="text-[12.8vw] sm:text-[12vw] font-black uppercase text-[#0d0d0d] leading-[0.80] sm:leading-[0.82] tracking-tighter m-0 p-0 block font-heading whitespace-nowrap"
            >
              Full Stack
            </h1>
            <h1
              ref={title2Ref}
              className="text-[12.8vw] sm:text-[12vw] font-black uppercase text-[#0d0d0d] leading-[0.80] sm:leading-[0.82] tracking-tighter m-0 p-0 block font-heading whitespace-nowrap"
            >
              Developer
            </h1>

            {/* Bottom-right Star (anchored to Developer text with responsive positioning) */}
            <div className="absolute -bottom-10 sm:-bottom-12 -right-10 sm:-right-16 md:-right-20 z-20 hover:scale-110 transition-transform pointer-events-auto">
              <ThreeStar size={1.10} rotationSpeed={-0.01} className="w-18 h-18 sm:w-30 sm:h-30 md:w-38 md:h-38" />
            </div>
          </div>
        </div>

        {/* Bottom Hero Metadata Bar */}
        <div className="w-full flex items-end justify-between pt-4 sm:pt-6 border-t border-black/10 z-40 relative px-1">
          <div className="text-2xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#0d0d0d] font-heading">
            ©2026
          </div>
          <div className="text-[10px] sm:text-sm font-semibold tracking-wider text-neutral-600 uppercase mb-1 sm:mb-2">
            /CREATING SINCE 2020
          </div>
        </div>

        {/* ================= THE ANIMATED 3D FLIPPING CARD ================= */}
        {/* Overlaps subtly on top of text on mobile and sits at bottom-center */}
        <div
          className="absolute left-1/2 -translate-x-1/2 bottom-16 sm:bottom-8 md:bottom-10 z-30 pointer-events-none"
          style={{ perspective: '1200px' }}
        >
          <div
            ref={cardRef}
            style={{ transformStyle: 'preserve-3d', touchAction: 'pan-y' }}
            className="w-[210px] sm:w-[290px] md:w-[350px] aspect-[3/4] rounded-[22px] sm:rounded-[32px] shadow-2xl relative pointer-events-none sm:pointer-events-auto touch-pan-y"
          >
            {/* FRONT FACE (Hero state: Dark/Shadowy studio portrait of user) */}
            <div
              style={{ backfaceVisibility: 'hidden' }}
              className="absolute inset-0 w-full h-full rounded-[22px] sm:rounded-[32px] overflow-hidden bg-[#111111] shadow-2xl border border-black/20"
            >
              <img
                src="/profile_dark.jpg"
                alt="Full Stack Developer"
                className="w-full h-full object-cover"
                loading="eager"
              />
            </div>

            {/* BACK FACE (Bio state: Cinematic red moody portrait of user) */}
            <div
              style={{
                backfaceVisibility: 'hidden',
                transform: 'rotateY(180deg)',
              }}
              className="absolute inset-0 w-full h-full rounded-[22px] sm:rounded-[32px] overflow-hidden bg-[#111111] shadow-2xl border border-black/20"
            >
              <img
                src="/profile_red.jpg"
                alt="Full Stack Developer - About"
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ================= BIO / ABOUT SECTION ================= */}
      <section
        id="bio-section"
        ref={bioRef}
        className="pt-28 pb-20 sm:py-36 px-6 max-w-7xl mx-auto"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-3 flex flex-col justify-between h-full space-y-6">
            <h2 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-[#111111] font-heading">
              Hey!
            </h2>
            <p className="text-base sm:text-xl text-neutral-700 leading-relaxed font-normal">
              I’m Akash, a passionate builder crafting high-performance full-stack applications and premium digital products.
            </p>
          </div>

          {/* Middle Column: Target Slot for the Flipping Card */}
          <div className="lg:col-span-5 flex justify-center">
            <div
              ref={targetSlotRef}
              className="w-[210px] sm:w-[290px] md:w-[350px] aspect-[3/4] rounded-[22px] sm:rounded-[32px]"
            >
              {/* Invisible placeholder reserving exact physical space in the layout */}
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 flex flex-col justify-center space-y-6">
            <p className="text-base sm:text-lg text-neutral-800 leading-relaxed">
              I’m a full stack developer with a strong focus on building modern, scalable, and conversion-driven web experiences.
            </p>
            <p className="text-base sm:text-lg text-neutral-600 leading-relaxed">
              Over the years, I’ve architected and shipped multiple web products, full-stack applications, and performant design systems used by global customers.
            </p>
            <div className="pt-2">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-900 hover:text-white transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 group border border-black/5"
              >
                <span>Get Started</span>
                <div className="w-5 h-5 rounded-full bg-neutral-100 group-hover:bg-neutral-800 flex items-center justify-center transition-colors">
                  <ArrowUpRight
                    size={13}
                    className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform"
                  />
                </div>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
