import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export const projectsData = [
  {
    id: 'damas',
    title: 'Damas',
    category: 'Agency Framer Template',
    image: 'https://framerusercontent.com/images/VNXQLcPHw9VbVzy6BDpZ8pUsaU.png?scale-down-to=1024&width=1160&height=800',
    fullImage: 'https://framerusercontent.com/images/VNXQLcPHw9VbVzy6BDpZ8pUsaU.png?width=1160&height=800',
    color: '#0e0f12',
    year: '2025',
    link: 'https://damas.framer.website/',
    description: 'A modern, high-converting agency template built for creative studios and digital agencies seeking a distinct, authoritative brand presence. Features bespoke animations, CMS-driven case studies, and responsive design systems.'
  },
  {
    id: 'najm',
    title: 'Najm',
    category: 'SaaS Framer Template',
    image: 'https://framerusercontent.com/images/WgEHVRrQs62rgxlzrnXJJ8rr4.png?scale-down-to=1024&width=1160&height=800',
    fullImage: 'https://framerusercontent.com/images/WgEHVRrQs62rgxlzrnXJJ8rr4.png?width=1160&height=800',
    color: '#1a102f',
    year: '2025',
    link: 'https://najm.framer.website/',
    description: 'Engineered specifically for SaaS startups to showcase product features, metrics, interactive bento grids, and tiered pricing with unmatched clarity and fluid interaction.'
  },
  {
    id: 'kavi',
    title: 'Kavi',
    category: 'AI Framer Template',
    image: 'https://framerusercontent.com/images/I3azeVtkvdKBGl9TX38tUdXEb0.png?scale-down-to=1024&width=1160&height=800',
    fullImage: 'https://framerusercontent.com/images/I3azeVtkvdKBGl9TX38tUdXEb0.png?width=1160&height=800',
    color: '#24121a',
    year: '2025',
    link: 'https://kavi.framer.website/',
    description: 'Futuristic and clean AI web template crafted for generative AI applications and tech innovators. Built with sleek glassmorphism, prompt simulator widgets, and smooth micro-interactions.'
  },
  {
    id: 'sham',
    title: 'Sham',
    category: 'Studio Framer Template',
    image: 'https://framerusercontent.com/images/e3DxUGJWqt7CIVVQIA0VZoy09FQ.png?scale-down-to=1024&width=1160&height=800',
    fullImage: 'https://framerusercontent.com/images/e3DxUGJWqt7CIVVQIA0VZoy09FQ.png?width=1160&height=800',
    color: '#121212',
    year: '2024',
    link: 'https://sham.framer.website/',
    description: 'Minimalist architecture and design studio showcase focusing on high-contrast typography, generous negative space, and refined editorial layouts.'
  },
];

export default function FeaturedProjects({ onSelectProject, onNavigate }) {
  const [projects, setProjects] = React.useState(projectsData);

  React.useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data?.projects && data.projects.length > 0) {
          // Normalize _id to id if needed
          const normalized = data.projects.map((p) => ({
            ...p,
            id: p.id || p._id || p.slug,
          }));
          setProjects(normalized);
        }
      })
      .catch((err) => {
        console.warn('Using local fallback projects:', err.message);
      });
  }, []);

  return (
    <section id="projects" className="py-24 px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-14 gap-6">
        <div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-[#111111] font-heading">
            Featured Projects
          </h2>
        </div>
        <button
          onClick={() => {
            if (onNavigate) onNavigate('work');
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-900 hover:text-white transition-all duration-300 shadow-sm hover:shadow-md group border border-black/5 self-start sm:self-auto cursor-pointer"
        >
          <span>View All Work</span>
          <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
        </button>
      </div>

      {/* 2x2 Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => onSelectProject(project)}
            className="group cursor-pointer flex flex-col space-y-4"
          >
            {/* Card Media Preview */}
            <div className="relative aspect-[16/11] rounded-[24px] sm:rounded-[28px] overflow-hidden bg-neutral-200 border border-black/5 shadow-md group-hover:shadow-2xl transition-all duration-500">
              <img
                src={project.image}
                alt={project.title}
                className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
              
              {/* Floating Pill Icon on Hover */}
              <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-black flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                <ArrowUpRight size={18} />
              </div>
            </div>

            {/* Title & Category */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between px-2 gap-1 sm:gap-4">
              <h3 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-[#111111] group-hover:text-neutral-600 transition-colors font-heading">
                {project.title}
              </h3>
              <span className="text-xs sm:text-sm font-medium text-neutral-500 tracking-wide">
                {project.category}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
