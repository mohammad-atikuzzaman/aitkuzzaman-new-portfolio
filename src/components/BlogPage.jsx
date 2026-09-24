import React from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { articlesData } from './Thoughts';
import Contact from './Contact';
import Footer from './Footer';

export default function BlogPage({ onBack, onSelectArticle }) {
  return (
    <div className="pt-24 min-h-screen flex flex-col justify-between animate-in fade-in duration-300">
      <div className="max-w-7xl mx-auto px-6 w-full">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 mb-8 text-sm font-semibold text-neutral-600 hover:text-black transition-colors cursor-pointer group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Home</span>
        </button>

        {/* Hero */}
        <div className="max-w-3xl mb-16 space-y-4">
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-[#111111] font-heading">
            Thoughts &amp; Insights
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed font-normal">
            Articles on modern product design, frontend architecture, and building sustainable web businesses.
          </p>
        </div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-20">
          {articlesData.map((article) => (
            <div
              key={article.id}
              onClick={() => onSelectArticle(article)}
              className="group cursor-pointer flex flex-col space-y-4"
            >
              <div className="relative aspect-[16/10] rounded-[24px] sm:rounded-[28px] overflow-hidden bg-neutral-200 border border-black/5 shadow-md group-hover:shadow-2xl transition-all duration-500">
                <img
                  src={article.image}
                  alt={article.title}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-[1.04] group-hover:grayscale-0 transition-all duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/0 transition-colors duration-300" />
                <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-black flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                  <ArrowUpRight size={18} />
                </div>
              </div>

              <div className="flex flex-col space-y-2 px-2">
                <span className="text-xs font-mono uppercase tracking-widest text-neutral-500">
                  {article.date} • {article.readTime}
                </span>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#111111] group-hover:text-neutral-600 transition-colors font-heading">
                  {article.title}
                </h3>
                <p className="text-sm text-neutral-600 line-clamp-2">
                  {article.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Contact />
      <Footer onNavigate={(page) => { if (page === 'home') onBack(); }} />
    </div>
  );
}
