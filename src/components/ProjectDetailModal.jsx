import React, { useEffect } from 'react';
import { X, ArrowUpRight, Calendar, Tag, ExternalLink } from 'lucide-react';

export default function ProjectDetailModal({ project, onClose }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [onClose]);

  if (!project) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/70 backdrop-blur-md animate-in fade-in duration-300">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#ECEAE5] rounded-[32px] overflow-y-auto no-scrollbar shadow-2xl border border-black/10 text-[#111111] animate-in zoom-in-95 duration-300">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="sticky top-6 right-6 ml-auto mr-6 z-20 w-11 h-11 rounded-full bg-black text-white flex items-center justify-center hover:scale-110 active:scale-95 transition-transform shadow-lg cursor-pointer"
        >
          <X size={20} />
        </button>

        {/* Modal Content */}
        <div className="p-6 sm:p-12 -mt-10">
          {/* Header Metadata */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/5 text-xs font-semibold text-neutral-600 mb-3">
                <Tag size={12} /> {project.category}
              </span>
              <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-[#111111] font-heading">
                {project.title}
              </h2>
            </div>

            <a
              href={project.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-black text-white font-semibold text-sm hover:bg-neutral-800 transition-colors shadow-md group"
            >
              <span>Live Preview</span>
              <ExternalLink size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Project Preview Image */}
          <div className="rounded-[24px] overflow-hidden border border-black/10 shadow-lg mb-8 bg-neutral-900">
            <img
              src={project.fullImage || project.image}
              alt={project.title}
              className="w-full h-auto object-cover"
            />
          </div>

          {/* Detailed Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4 border-t border-black/10">
            <div className="space-y-4">
              <div>
                <span className="block text-xs uppercase font-mono text-neutral-500">Year</span>
                <span className="text-lg font-semibold">{project.year}</span>
              </div>
              <div>
                <span className="block text-xs uppercase font-mono text-neutral-500">Platform</span>
                <span className="text-lg font-semibold">Framer / React</span>
              </div>
            </div>

            <div className="md:col-span-2 space-y-4">
              <span className="block text-xs uppercase font-mono text-neutral-500">Overview</span>
              <p className="text-base sm:text-lg text-neutral-700 leading-relaxed font-normal">
                {project.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
