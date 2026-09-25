import React from 'react';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { projectsData } from './FeaturedProjects';
import Contact from './Contact';
import Footer from './Footer';

export default function WorkPage({ onBack, onSelectProject }) {
  const [projects, setProjects] = React.useState(projectsData);

  React.useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data?.projects && data.projects.length > 0) {
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
            My Brightest Creations
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 leading-relaxed font-normal">
            A showcase of my latest projects, highlighting thoughtful design, clear strategy, and impactful results.
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mb-20">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => onSelectProject(project)}
              className="group cursor-pointer flex flex-col space-y-4"
            >
              <div className="relative aspect-[16/11] rounded-[24px] sm:rounded-[28px] overflow-hidden bg-neutral-200 border border-black/5 shadow-md group-hover:shadow-2xl transition-all duration-500">
                <img
                  src={project.image}
                  alt={project.title}
                  className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                <div className="absolute top-5 right-5 w-10 h-10 rounded-full bg-white/90 backdrop-blur-sm text-black flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-md">
                  <ArrowUpRight size={18} />
                </div>
              </div>

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
      </div>

      <Contact />
      <Footer onNavigate={(page) => { if (page === 'home') onBack(); }} />
    </div>
  );
}
