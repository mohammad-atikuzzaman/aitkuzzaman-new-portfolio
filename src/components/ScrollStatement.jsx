import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ScrollStatement() {
  const containerRef = useRef(null);
  const wordsRef = useRef([]);

  const text = "From idea to launch. Clean, scalable digital products built to move fast, stay simple, and perform in real-world use, driven by clarity, structured systems, and intentional design.";
  const words = text.split(" ");

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const spans = wordsRef.current;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: el,
        start: 'top 80%',
        end: 'bottom 40%',
        scrub: 0.8,
      }
    });

    tl.fromTo(spans, 
      { opacity: 0.15, color: '#999999' },
      { opacity: 1, color: '#111111', stagger: 0.05, ease: 'power1.out' }
    );

    return () => {
      if (tl.scrollTrigger) tl.scrollTrigger.kill();
      tl.kill();
    };
  }, []);

  return (
    <section ref={containerRef} className="py-24 sm:py-36 px-6 max-w-5xl mx-auto flex items-center justify-center">
      <p className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-semibold tracking-tight leading-[1.25] text-center font-heading">
        {words.map((word, index) => (
          <span
            key={index}
            ref={(node) => (wordsRef.current[index] = node)}
            className="inline-block mr-[0.28em] transition-colors duration-150"
          >
            {word}
          </span>
        ))}
      </p>
    </section>
  );
}
