import React, { useState, useEffect } from 'react';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import HeroBioSection from './components/HeroBioSection';
import ScrollStatement from './components/ScrollStatement';
import Services from './components/Services';
import FeaturedProjects from './components/FeaturedProjects';
import Testimonials from './components/Testimonials';
import Thoughts from './components/Thoughts';
import Contact from './components/Contact';
import Footer from './components/Footer';
import WorkPage from './components/WorkPage';
import BlogPage from './components/BlogPage';
import ProjectDetailModal from './components/ProjectDetailModal';
import ArticleDetailModal from './components/ArticleDetailModal';
import TechStack from './components/TechStack';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [currentPage, setCurrentPage] = useState(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/control-panel' || hash === '#control-panel') {
        return 'admin';
      }
    }
    return 'home';
  }); // 'home', 'work', 'blog', 'admin'
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // Sync with browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const hash = window.location.hash;
      if (path === '/control-panel' || hash === '#control-panel') {
        setCurrentPage('admin');
      } else {
        setCurrentPage('home');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const lenisRef = React.useRef(null);

  // Initialize smooth scrolling for desktop, preserve native 120Hz touch scrolling for mobile
  useEffect(() => {
    const isTouch =
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches;

    // Mobile devices handle native momentum touch scroll natively and flawlessly
    if (isTouch) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.1,
    });
    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Pause desktop smooth scrolling when modal is open so the modal can scroll naturally
  useEffect(() => {
    if (!lenisRef.current) return;
    if (selectedProject || selectedArticle) {
      lenisRef.current.stop();
    } else {
      lenisRef.current.start();
    }
  }, [selectedProject, selectedArticle]);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    if (page === 'admin') {
      window.history.pushState(null, '', '/control-panel');
    } else {
      if (window.location.pathname === '/control-panel' || window.location.hash === '#control-panel') {
        window.history.pushState(null, '', '/');
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (currentPage === 'admin') {
    return <AdminDashboard onBackToSite={() => handleNavigate('home')} />;
  }

  return (
    <div className="min-h-screen bg-[#ECEAE5] text-[#111111] relative selection:bg-neutral-900 selection:text-white">
      {/* Fixed Floating Navigation */}
      <Navbar onNavigate={handleNavigate} activePage={currentPage} />

      {/* Main Content Area */}
      <main>
        {currentPage === 'home' && (
          <>
            <HeroBioSection />
            <ScrollStatement />
            <Services />
            <FeaturedProjects 
              onSelectProject={setSelectedProject}
              onNavigate={handleNavigate}
            />
            <TechStack />
            <Testimonials />
            <Thoughts 
              onSelectArticle={setSelectedArticle}
              onNavigate={handleNavigate}
            />
            <Contact />
            <Footer onNavigate={handleNavigate} />
          </>
        )}

        {currentPage === 'work' && (
          <WorkPage
            onBack={() => handleNavigate('home')}
            onSelectProject={setSelectedProject}
          />
        )}

        {currentPage === 'blog' && (
          <BlogPage
            onBack={() => handleNavigate('home')}
            onSelectArticle={setSelectedArticle}
          />
        )}
      </main>

      {/* Interactive Modals */}
      {selectedProject && (
        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
      )}

      {selectedArticle && (
        <ArticleDetailModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
        />
      )}
    </div>
  );
}
