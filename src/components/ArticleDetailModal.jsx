import React, { useEffect } from 'react';
import { X, Calendar, Clock, ArrowLeft } from 'lucide-react';

export default function ArticleDetailModal({ article, onClose }) {
  useEffect(() => {
    if (!article) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [article, onClose]);

  if (!article) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-3xl max-h-[90vh] bg-[#ECEAE5] rounded-[32px] overflow-y-auto no-scrollbar shadow-2xl border border-black/10 text-[#111111] animate-in zoom-in-95 duration-300">
        {/* Sticky Top Bar */}
        <div className="sticky top-0 z-20 flex items-center justify-between p-6 bg-[#ECEAE5]/90 backdrop-blur-sm border-b border-black/5">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm font-semibold text-neutral-600 hover:text-black transition-colors cursor-pointer"
          >
            <ArrowLeft size={16} /> Back to articles
          </button>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-transform shadow-md cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Article Body */}
        <div className="p-6 sm:p-12 space-y-8">
          {/* Metadata */}
          <div className="flex items-center gap-4 text-xs font-mono text-neutral-500 uppercase tracking-widest">
            <span className="flex items-center gap-1.5"><Calendar size={13} /> {article.date}</span>
            <span>•</span>
            <span className="flex items-center gap-1.5"><Clock size={13} /> {article.readTime || '5 min read'}</span>
          </div>

          {/* Heading */}
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-[#111111] leading-tight font-heading">
            {article.title}
          </h1>

          {/* Featured Image */}
          <div className="rounded-[24px] overflow-hidden border border-black/10 shadow-md">
            <img
              src={article.image}
              alt={article.title}
              className="w-full h-[320px] sm:h-[420px] object-cover"
            />
          </div>

          {/* Text Content */}
          <div className="space-y-6 text-base sm:text-lg text-neutral-800 leading-relaxed font-normal whitespace-pre-line">
            {article.content}
          </div>

          {/* Author Callout */}
          <div className="p-6 rounded-2xl bg-black/5 border border-black/5 flex items-center gap-4 mt-8">
            <img
              src="/profile_dark.jpg"
              alt="Akash"
              className="w-12 h-12 rounded-full object-cover bg-neutral-900 border border-black/10"
            />
            <div>
              <h4 className="font-bold text-sm text-[#111111]">Written by Akash</h4>
              <p className="text-xs text-neutral-600">Full Stack Developer</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
