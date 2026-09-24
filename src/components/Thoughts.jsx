import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const articlesData = [
  {
    id: 'building-trust-through-clear-design',
    date: 'May 5, 2025',
    readTime: '6 min read',
    title: 'Building Trust Through Clear Design',
    description: 'How thoughtful visual choices create a stronger sense of reliability for modern brands.',
    image: 'https://framerusercontent.com/images/kAftuUN9iRKwIt9M6RqZo9NS314.jpg?scale-down-to=1024&width=3840&height=5275',
    content: `
      Design is rarely just about decoration—it is about establishing a direct bridge of confidence between a brand and its audience. When visitors land on a page, they make subconscious judgments within milliseconds.
      
      Clarity stems from deliberate constraints: disciplined typographic scales, purposeful hierarchy, ample breathing room, and predictable interaction models.
      
      When users do not have to struggle to decipher where to look, what to do, or what a product accomplishes, friction dissolves. Trust is the compounding dividend of continuous cognitive ease.
    `
  },
  {
    id: 'the-role-of-art-direction-in-branding',
    date: 'Jun 16, 2025',
    readTime: '5 min read',
    title: 'The Role of Art Direction in Branding',
    description: 'Why visual direction helps brands create emotion and a distinct point of view.',
    image: 'https://framerusercontent.com/images/Y9KmJAQ4w53hsc4jJojfokLZ7D8.jpg?scale-down-to=1024&width=2662&height=3993',
    content: `
      In an era where digital products look increasingly standardized through identical UI kits, art direction is what rescues a brand from the sea of sameness.
      
      Art direction governs tone, texture, photography mood, and movement. It is the intangible layer that translates business ambition into felt human emotion.
      
      By aligning aesthetic choices with a company's authentic mission, you create an indelible signature that competitors cannot easily copy.
    `
  },
];

export default function Thoughts({ onSelectArticle, onNavigate }) {
  return (
    <section className="py-24 px-6 max-w-7xl mx-auto">
      <div className="mb-14">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#111111] font-heading">
          Thoughts
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {articlesData.map((article) => (
          <div
            key={article.id}
            onClick={() => onSelectArticle(article)}
            className="group cursor-pointer flex flex-col space-y-4"
          >
            {/* Image Card */}
            <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden bg-neutral-200 border border-black/5 shadow-md group-hover:shadow-xl transition-all duration-500">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-700"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 text-white">
                <span className="text-xs uppercase font-mono tracking-widest text-neutral-300 mb-2">
                  {article.date}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold leading-snug tracking-tight mb-2 group-hover:text-white transition-colors font-heading">
                  {article.title}
                </h3>
                <p className="text-xs sm:text-sm text-neutral-300 line-clamp-2">
                  {article.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Promo / CTA Card */}
        <div className="bg-[#141414] rounded-[24px] p-8 sm:p-10 flex flex-col justify-between text-white shadow-xl border border-white/5 relative overflow-hidden group">
          <div className="relative z-10 space-y-4">
            <span className="text-xs uppercase tracking-widest text-neutral-400 font-mono">/Journal</span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug font-heading">
              See how we shape brands with clarity and craft— explore our blog
            </h3>
          </div>

          <div className="relative z-10 pt-8">
            <button
              onClick={() => {
                if (onNavigate) onNavigate('blog');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-colors shadow-sm group cursor-pointer"
            >
              <span>Explore All</span>
              <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
