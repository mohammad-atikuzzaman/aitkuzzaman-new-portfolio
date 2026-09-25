import React from 'react';

export default function TechStack() {

  // Row 1: Frontend, Motion & UI Architecture
  const frontendStack = [
    {
      name: 'React 19',
      category: 'Frontend Core',
      tag: 'UI Library',
      desc: 'Component-driven architectures, hooks, and responsive state synchronization.',
      color: '#00D8FE',
      accentBg: 'from-cyan-500/20 to-blue-600/10',
      icon: (
        <svg viewBox="-11.5 -10.23174 23 20.46348" className="w-8 h-8 fill-none">
          <circle cx="0" cy="0" r="2.05" fill="#00D8FE" />
          <g stroke="#00D8FE" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      ),
    },
    {
      name: 'Next.js',
      category: 'Full Stack',
      tag: 'Framework',
      desc: 'Server Components, SSR/SSG caching, App Router, and Edge performance.',
      color: '#FFFFFF',
      accentBg: 'from-white/20 to-neutral-500/10',
      icon: (
        <svg viewBox="0 0 180 180" className="w-8 h-8 fill-white">
          <path d="M149.508 159.43L61.026 44.5H44.5v91h15V67.89l77.41 100.59a74.96 74.96 0 0012.598-9.05zM120.5 44.5v60h15v-60h-15z" />
          <path d="M90 0a90 90 0 100 180A90 90 0 0090 0zm0 165a75 75 0 110-150 75 75 0 010 150z" fillRule="evenodd" />
        </svg>
      ),
    },
    {
      name: 'TypeScript',
      category: 'Language',
      tag: 'Type Safety',
      desc: 'Strict type contracts, scalable codebases, and compile-time bug prevention.',
      color: '#3178C6',
      accentBg: 'from-blue-500/20 to-indigo-600/10',
      icon: (
        <svg viewBox="0 0 128 128" className="w-8 h-8">
          <path fill="#3178C6" d="M0 0h128v128H0z" rx="20" />
          <path fill="#fff" d="M72.7 101.4c2.8 1.8 6.4 3 10.4 3 10.8 0 17.4-5.4 17.4-15 0-8.8-5.3-12.7-14.7-16.7-6.5-2.8-9.2-5-9.2-9 0-3.6 2.8-6.1 7.7-6.1 4.1 0 7.2 1.4 9.1 2.8l3.1-8.5c-2.4-1.6-6.3-2.9-11.4-2.9-10.7 0-16.7 6.1-16.7 14.8 0 8.6 5.6 12.8 14.5 16.7 6.6 2.9 9.3 5.3 9.3 9.4 0 4.2-3.6 6.8-8.9 6.8-4.7 0-8.4-1.7-10.9-3.5l-3.7 8.2zM48 50.1H25.4V59h15.4v44.2h10.9V59h15.4v-8.9H48z" />
        </svg>
      ),
    },
    {
      name: 'Tailwind CSS',
      category: 'Styling & Design',
      tag: 'CSS System',
      desc: 'Utility-first architecture, responsive layouts, design tokens, and fluid typography.',
      color: '#38BDF8',
      accentBg: 'from-sky-400/20 to-teal-500/10',
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#38BDF8]">
          <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.337 6.182 14.976 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.337 13.382 8.976 12 6.001 12z" />
        </svg>
      ),
    },
    {
      name: 'Three.js & WebGL',
      category: '3D & Graphics',
      tag: 'Creative Tech',
      desc: 'Hardware-accelerated 3D meshes, custom lighting, shaders & canvas interactions.',
      color: '#ECEAE5',
      accentBg: 'from-neutral-400/20 to-stone-500/10',
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-white">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      ),
    },
    {
      name: 'GSAP Animation',
      category: 'Motion Design',
      tag: 'Choreography',
      desc: 'Silky smooth ScrollTrigger timelines, scrubbed parallax, and micro-interactions.',
      color: '#88CE02',
      accentBg: 'from-lime-500/20 to-emerald-600/10',
      icon: (
        <svg viewBox="0 0 100 100" className="w-8 h-8">
          <rect width="100" height="100" rx="20" fill="#141414" />
          <path d="M22 62c0-14 11-25 25-25s25 11 25 25-11 25-25 25H22V62z" fill="#88CE02" />
          <circle cx="50" cy="38" r="14" fill="#00E676" />
        </svg>
      ),
    },
  ];

  // Row 2: Backend, Database & Cloud Infrastructure
  const backendStack = [
    {
      name: 'Node.js',
      category: 'Runtime',
      tag: 'Server Core',
      desc: 'High-throughput event-driven backend microservices and streaming pipelines.',
      color: '#539E43',
      accentBg: 'from-emerald-500/20 to-green-600/10',
      icon: (
        <svg viewBox="0 0 32 32" className="w-8 h-8 fill-[#539E43]">
          <path d="M16 2.5L2.8 10.1v15.2L16 32.9l13.2-7.6V10.1L16 2.5zm10.7 21.2L16 30l-10.7-6.3v-12L16 5.4l10.7 6.3v12z" />
          <path d="M16 11.2l-6.8 3.9v7.8l6.8 3.9 6.8-3.9v-7.8l-6.8-3.9z" fill="#83CD29" />
        </svg>
      ),
    },
    {
      name: 'PostgreSQL',
      category: 'Database',
      tag: 'Relational DB',
      desc: 'ACID-compliant relational architecture, indexing, JSONB data, and complex querying.',
      color: '#336791',
      accentBg: 'from-blue-600/20 to-sky-500/10',
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#336791]">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" />
        </svg>
      ),
    },
    {
      name: 'MongoDB',
      category: 'Database',
      tag: 'NoSQL Storage',
      desc: 'Flexible document schemas, aggregation pipelines, and high-velocity data layers.',
      color: '#47A248',
      accentBg: 'from-green-500/20 to-emerald-700/10',
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#47A248]">
          <path d="M12 1.5C11.5 2 7 8 7 14c0 4 2.5 7 5 8.5 2.5-1.5 5-4.5 5-8.5 0-6-4.5-12-5-12.5zm0 18.5c-1.5-.9-3-3.1-3-6 0-3.6 2-7.5 3-9.5 1 2 3 5.9 3 9.5 0 2.9-1.5 5.1-3 6z" />
        </svg>
      ),
    },
    {
      name: 'Express & REST',
      category: 'API Architecture',
      tag: 'Web Services',
      desc: 'Modular routers, middleware security, rate limiting, and robust JSON contracts.',
      color: '#FFFFFF',
      accentBg: 'from-neutral-500/20 to-zinc-600/10',
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 stroke-white fill-none" strokeWidth="1.8">
          <rect x="2" y="2" width="20" height="8" rx="2" />
          <rect x="2" y="14" width="20" height="8" rx="2" />
          <line x1="6" y1="6" x2="6.01" y2="6" strokeWidth="2.5" />
          <line x1="6" y1="18" x2="6.01" y2="18" strokeWidth="2.5" />
        </svg>
      ),
    },
    {
      name: 'Docker',
      category: 'DevOps',
      tag: 'Containerization',
      desc: 'Hermetic containerized environments, multi-stage builds, and reliable CI deployments.',
      color: '#2496ED',
      accentBg: 'from-blue-500/20 to-cyan-600/10',
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#2496ED]">
          <path d="M13.983 11.078h2.119a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.119a.185.185 0 00-.185.185v1.888c0 .102.083.185.185.185m-2.954-5.43h2.118a.186.186 0 00.186-.186V3.574a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m0 2.716h2.118a.187.187 0 00.186-.186V6.29a.186.186 0 00-.186-.185h-2.118a.185.185 0 00-.185.185v1.887c0 .102.082.186.185.186m-2.93 0h2.12a.186.186 0 00.184-.186V6.29a.185.185 0 00-.185-.185H8.1a.185.185 0 00-.185.185v1.887c0 .102.083.186.185.186m-2.964 0h2.119a.186.186 0 00.185-.186V6.29a.185.185 0 00-.185-.185H5.136a.186.186 0 00-.186.185v1.887c0 .102.084.186.186.186m5.893 2.714h2.118a.186.186 0 00.186-.185V9.006a.186.186 0 00-.186-.186h-2.118a.185.185 0 00-.185.185v1.888c0 .102.082.185.185.185m-2.93 0h2.12a.185.185 0 00.184-.185V9.006a.185.185 0 00-.184-.186h-2.12a.185.185 0 00-.184.185v1.888c0 .102.083.185.185.185m-2.964 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H5.136a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185m-2.928 0h2.119a.185.185 0 00.185-.185V9.006a.185.185 0 00-.185-.186H2.208a.186.186 0 00-.186.185v1.888c0 .102.084.185.186.185" />
          <path d="M23.988 11.9a4.84 4.84 0 00-3.328-3.088c-.144-.04-.265.064-.288.208a3.17 3.17 0 01-1.391 2.216c-.097.072-.112.208-.032.304.536.632.744 1.344.608 2.056-.44 2.304-2.888 3.528-5.32 3.528H2.408c-.288 0-.448.24-.448.512 0 1.944.976 3.656 2.664 4.6 1.832 1.024 4.144 1.256 6.368.648 3.736-1.024 6.368-4.232 7.024-8.08.384.144.8.208 1.224.208 1.488 0 2.8-.752 3.584-1.92.088-.12.048-.288-.088-.352" />
        </svg>
      ),
    },
    {
      name: 'Git & GitHub',
      category: 'Workflow',
      tag: 'Version Control',
      desc: 'Feature branching, code review standards, release tags, and automated workflows.',
      color: '#F05032',
      accentBg: 'from-orange-500/20 to-red-600/10',
      icon: (
        <svg viewBox="0 0 24 24" className="w-8 h-8 fill-[#F05032]">
          <path d="M21.62 10.38L13.62 2.38a2.25 2.25 0 00-3.18 0L8.06 4.76l3.02 3.02a2.66 2.66 0 013.34 3.37l2.91 2.91a2.67 2.67 0 11-1.12 1.04l-2.73-2.73v5.18a2.67 2.67 0 11-1.5-.02v-5.31a2.66 2.66 0 01-1.44-3.48L7.52 5.8 2.38 10.94a2.25 2.25 0 000 3.18l8 8a2.25 2.25 0 003.18 0l8.06-8.06a2.25 2.25 0 000-3.18z" />
        </svg>
      ),
    },
  ];

  const renderCard = (tech, index) => {
    return (
      <div
        key={`${tech.name}-${index}`}
        style={{ perspective: '1000px' }}
        className="group relative shrink-0 cursor-pointer select-none mx-2 sm:mx-3 hover:z-50 transition-all duration-300"
      >
        {/* 3D Elevated Card Container */}
        <div
          className="relative w-[220px] sm:w-[260px] h-[100px] sm:h-[108px] rounded-[22px] sm:rounded-[24px] bg-[#141414] text-white border border-white/10 p-3.5 sm:p-4 flex items-center gap-3.5 shadow-xl transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:-translate-y-2.5 group-hover:scale-[1.03] group-hover:border-white/35 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.85)] group-hover:bg-[#1a1a1a]"
          style={{
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Subtle Ambient Radial Glow */}
          <div
            className={`absolute -inset-0.5 rounded-[24px] bg-gradient-to-r ${tech.accentBg} opacity-0 blur-lg transition-opacity duration-500 ease-out pointer-events-none group-hover:opacity-100`}
          />

          {/* 3D Embossed Metallic Badge Icon */}
          <div
            className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-[16px] bg-gradient-to-br from-[#2a2a2a] via-[#1a1a1a] to-[#0a0a0a] p-2 shadow-inner border border-white/15 flex items-center justify-center shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-105"
            style={{
              boxShadow: '0 8px 16px -4px rgba(0,0,0,0.8), inset 0 1px 1px rgba(255,255,255,0.25)',
            }}
          >
            {/* Specular Rim Light */}
            <div className="absolute inset-0 rounded-[16px] bg-gradient-to-tr from-white/15 via-transparent to-transparent pointer-events-none" />
            <div className="relative z-10 flex items-center justify-center">
              {tech.icon}
            </div>
          </div>

          {/* Core Info */}
          <div className="flex-1 min-w-0 z-10">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 px-2 py-0.5 rounded-full bg-white/5 border border-white/5">
                {tech.tag}
              </span>
            </div>
            <h4 className="text-sm sm:text-base font-bold tracking-tight text-white font-heading truncate group-hover:text-white transition-colors">
              {tech.name}
            </h4>
            <p className="text-[11px] sm:text-xs text-neutral-400 truncate mt-0.5">
              {tech.category}
            </p>
          </div>
        </div>

        {/* Silky Smooth Animated Glassmorphic Tooltip */}
        <div
          className="absolute bottom-[calc(100%+14px)] left-1/2 -translate-x-1/2 w-[260px] sm:w-[290px] z-50 pointer-events-none opacity-0 translate-y-3 scale-95 group-hover:opacity-100 group-hover:translate-y-0 group-hover:scale-100 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] will-change-transform"
        >
          <div className="relative bg-[#0c0c0c]/95 backdrop-blur-2xl border border-white/20 text-white rounded-[20px] p-3.5 sm:p-4 shadow-[0_25px_50px_-10px_rgba(0,0,0,0.9)]">
            {/* Top specular highlight line */}
            <div className="absolute inset-x-4 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />

            <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-white/10">
              <div className="flex items-center gap-2">
                <span 
                  className="w-2 h-2 rounded-full shadow-sm" 
                  style={{ backgroundColor: tech.color, boxShadow: `0 0 10px ${tech.color}` }} 
                />
                <span className="text-xs font-bold text-white font-heading tracking-wide">
                  {tech.name}
                </span>
              </div>
              <span className="text-[9px] font-mono uppercase tracking-widest px-2 py-0.5 rounded-full bg-white/10 text-neutral-300 border border-white/10">
                {tech.tag}
              </span>
            </div>

            <p className="text-[11.5px] sm:text-[12px] text-neutral-300 leading-relaxed font-normal">
              {tech.desc}
            </p>

            {/* Seamless Bottom Arrow Pointer */}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-[#0c0c0c] border-r border-b border-white/20 rotate-45" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <section id="skills" className="py-24 sm:py-32 relative overflow-hidden bg-transparent">
      {/* Section Header */}
      <div className="max-w-7xl mx-auto px-6 mb-12 sm:mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#111111] font-heading">
              Engineered With Modern Stack
            </h2>
          </div>
          <p className="text-neutral-600 text-sm sm:text-base max-w-md leading-relaxed">
            Battle-tested technologies and frameworks I use to build scalable full-stack products, fluid motion architectures, and robust APIs.
          </p>
        </div>
      </div>

      {/* Marquee Wrapper with Generous Tooltip Room and Reduced Gradient Masks */}
      <div className="relative w-full flex flex-col gap-10 sm:gap-14 pt-16 pb-8">
        {/* Left Fade Gradient Mask (Reduced spread) */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-[#ECEAE5] to-transparent z-30" />

        {/* Right Fade Gradient Mask (Reduced spread) */}
        <div className="pointer-events-none absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-[#ECEAE5] to-transparent z-30" />

        {/* Track 1: Frontend & Motion (Moving Left) */}
        <div className="flex">
          <div className="animate-marquee-left flex py-2">
            {frontendStack.map((tech, idx) => renderCard(tech, `f1-${idx}`))}
            {frontendStack.map((tech, idx) => renderCard(tech, `f2-${idx}`))}
          </div>
        </div>

        {/* Track 2: Backend, Database & Cloud (Moving Right) */}
        <div className="flex">
          <div className="animate-marquee-right flex py-2">
            {backendStack.map((tech, idx) => renderCard(tech, `b1-${idx}`))}
            {backendStack.map((tech, idx) => renderCard(tech, `b2-${idx}`))}
          </div>
        </div>
      </div>

      {/* Bottom Subtext */}
      <div className="max-w-7xl mx-auto px-6 mt-10 flex items-center justify-between text-xs text-neutral-500 font-mono">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>HOVER OR TAP ANY CARD TO INSPECT ARCHITECTURAL CAPABILITY</span>
        </div>
        <span className="hidden sm:inline-block">/FULL STACK ARSENAL</span>
      </div>
    </section>
  );
}
