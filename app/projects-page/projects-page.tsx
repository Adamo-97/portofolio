"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header";
import { type Project } from "@/components/project/ProjectCard";
import { CATEGORY_COLORS } from "@/components/project/CategoryFolder";
import ProjectCard from "@/components/project/ProjectCard";
import LoadingAnimation from "@/components/LoadingAnimation";
import { apiClient } from "@/lib/utils/fetch-client";
import ParticleCanvas from "@/components/animations/ParticleCanvas";
import { motion, AnimatePresence } from "framer-motion";

const ProjectsPageClient: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCategory, setOpenCategory] = useState<string | null>(null);
  const [showParticles, setShowParticles] = useState(false);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await apiClient.getProjects();
        setProjects(data);
        
        // Set first category as open by default
        if (data.length > 0) {
          const firstCategory = data[0].category;
          setOpenCategory(firstCategory);
        }
        
        // Show particles after content loads
        setTimeout(() => setShowParticles(true), 300);
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects. Please try again later.");
        setTimeout(() => setShowParticles(true), 300);
      } finally {
        setLoading(false);
      }
    };

    fetchProjects();
  }, []);

  // Group projects by category
  const projectsByCategory = projects.reduce((acc, project) => {
    if (!acc[project.category]) {
      acc[project.category] = [];
    }
    acc[project.category].push(project);
    return acc;
  }, {} as Record<string, Project[]>);

  const categories = Object.keys(projectsByCategory);

  return (
    <div className="bg-black flex flex-col overflow-hidden h-screen">
      <Header />

      {/* Main area with fog/glow background */}
      <main
        className="relative flex-1 min-h-0 overflow-hidden"
        style={{
          backgroundImage: `
            radial-gradient(95% 90% at 10% 100%, rgba(24,161,253,0.38) 0%, rgba(24,161,253,0.22) 32%, rgba(24,161,253,0.10) 58%, rgba(0,0,0,0) 82%),
            radial-gradient(95% 90% at 90% 100%, rgba(24,161,253,0.38) 0%, rgba(24,161,253,0.22) 32%, rgba(24,161,253,0.10) 58%, rgba(0,0,0,0) 82%),
            radial-gradient(70% 65% at 18% 100%, rgba(24,161,253,0.18) 0%, rgba(24,161,253,0.10) 45%, rgba(0,0,0,0) 78%),
            radial-gradient(70% 65% at 82% 100%, rgba(24,161,253,0.18) 0%, rgba(24,161,253,0.10) 45%, rgba(0,0,0,0) 78%),
            linear-gradient(#000, #000)
          `,
          backgroundRepeat: "no-repeat, no-repeat, no-repeat, no-repeat, no-repeat",
          backgroundSize: "110vw 90vh, 110vw 90vh, 80vw 65vh, 80vw 65vh, 100% 100%",
          backgroundPosition:
            "left -20vw bottom -16vh, right -20vw bottom -16vh, left -8vw bottom -8vh, right -8vw bottom -8vh, center",
        }}
      >
        {/* Particle canvas with fade-in */}
        {showParticles && (
          <ParticleCanvas 
            particlesDesktop={220}
            particlesMobile={120}
            speedMultiplier={1.6}
            twinkleRate={1.4}
            maxFps={45}
            className="fixed inset-0 z-0 transition-opacity duration-[800ms] ease-out" 
          />
        )}

        {/* Content above particles - NO SCROLLING */}
        <div className="relative z-10 flex flex-col h-full w-full overflow-hidden">
          {/* Loading State */}
          {loading && <LoadingAnimation text="Loading projects..." />}

          {/* Error State */}
          {error && !loading && (
            <div className="flex items-center justify-center h-full px-4">
              <div className="text-center">
                <p className="text-red-400 text-lg mb-4">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-6 py-3 bg-cornflowerblue-100 hover:bg-cornflowerblue-200 text-white font-medium rounded-full transition-colors"
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && projects.length === 0 && (
            <div className="flex items-center justify-center h-full px-4">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-cornflowerblue-100 mb-2">
                  No projects found
                </h3>
                <p className="text-white/70">
                  No projects available at the moment.
                </p>
              </div>
            </div>
          )}

          {/* Main Content - Responsive Grid Layout */}
          {!loading && !error && projects.length > 0 && (
            <div className="h-full flex flex-col px-3 sm:px-4 md:px-6 lg:px-8 xl:px-12 py-3 sm:py-4 md:py-6 gap-3 sm:gap-4 md:gap-5">
              {/* Category Selector */}
              <div className="flex-shrink-0">
                <div className="flex gap-2 sm:gap-2.5 md:gap-3 justify-center flex-wrap max-w-5xl mx-auto">
                  {categories.map((category) => {
                    const isActive = openCategory === category;
                    const colors = CATEGORY_COLORS[category];
                    const projectCount = projectsByCategory[category].length;
                    
                    return (
                      <motion.button
                        key={category}
                        onClick={() => setOpenCategory(category)}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="relative px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 sm:py-2 md:py-2.5 rounded-lg sm:rounded-xl font-semibold text-xs sm:text-sm md:text-base transition-all duration-300 border-2"
                        style={{
                          backgroundColor: isActive ? `${colors?.accent || '#18a1fd'}25` : 'rgba(255,255,255,0.03)',
                          borderColor: isActive ? `${colors?.accent || '#18a1fd'}` : 'rgba(255,255,255,0.1)',
                          color: isActive ? '#fff' : 'rgba(255,255,255,0.6)',
                          boxShadow: isActive ? `0 0 20px ${colors?.glow || 'rgba(24,161,253,0.5)'}` : 'none',
                        }}
                      >
                        <span className="flex items-center gap-1.5 sm:gap-2">
                          {category}
                          <span 
                            className="text-[10px] sm:text-xs px-1 sm:px-1.5 py-0.5 rounded-full font-bold"
                            style={{
                              backgroundColor: isActive ? `${colors?.accent || '#18a1fd'}40` : 'rgba(255,255,255,0.1)',
                            }}
                          >
                            {projectCount}
                          </span>
                        </span>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Projects Grid */}
              <div className="flex-1 min-h-0 flex items-center justify-center overflow-hidden">
                <AnimatePresence mode="wait">
                  {openCategory && projectsByCategory[openCategory] && (
                    <motion.div
                      key={openCategory}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      className="w-full h-full max-w-[1800px] mx-auto"
                    >
                      {/* Responsive Grid - Auto-fits cards based on count and screen size */}
                      <div 
                        className="h-full w-full grid gap-2 sm:gap-3 md:gap-4 lg:gap-5 xl:gap-6 p-1 sm:p-2 md:p-3"
                        style={{
                          gridTemplateColumns: (() => {
                            const count = projectsByCategory[openCategory].length;
                            // Mobile: Max 2 columns
                            // Tablet: Max 3 columns  
                            // Desktop: Max 4 columns
                            if (count === 1) return '1fr';
                            if (count === 2) return 'repeat(2, 1fr)';
                            if (count === 3) return 'repeat(auto-fit, minmax(min(280px, 100%), 1fr))';
                            if (count === 4) return 'repeat(auto-fit, minmax(min(260px, 100%), 1fr))';
                            if (count <= 6) return 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))';
                            if (count <= 9) return 'repeat(auto-fit, minmax(min(220px, 100%), 1fr))';
                            return 'repeat(auto-fit, minmax(min(200px, 100%), 1fr))';
                          })(),
                          gridAutoRows: 'minmax(0, 1fr)',
                          alignContent: 'center',
                        }}
                      >
                        {projectsByCategory[openCategory].map((project, idx) => (
                          <div 
                            key={project.id}
                            className="flex items-center justify-center"
                          >
                            <ProjectCard 
                              project={project} 
                              index={idx}
                              categoryColor={CATEGORY_COLORS[openCategory]}
                            />
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default ProjectsPageClient;
