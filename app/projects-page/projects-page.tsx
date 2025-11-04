"use client";
import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/header";
import { type Project } from "@/components/project/ProjectCard";
import CategoryFolder, { CATEGORY_COLORS } from "@/components/project/CategoryFolder";
import ProjectCard from "@/components/project/ProjectCard";
import LoadingAnimation from "@/components/LoadingAnimation";
import { ErrorFallback } from "@/components/ErrorBoundary";
import { apiClient } from "@/lib/utils/fetch-client";
import ParticleCanvas from "@/components/animations/ParticleCanvas";

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

  return (
    <div className="bg-black flex flex-col overflow-hidden h-screen">
      <Header />

      {/* Main area with fog/glow background */}
      <main
        className="relative flex-1 min-h-0 overflow-hidden px-4 sm:px-6 md:px-8 lg:px-12 py-6 md:py-8 flex flex-col"
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
        <div className="relative z-10 flex flex-col h-full max-w-[1800px] mx-auto w-full overflow-hidden">
        {/* Loading State */}
        {loading && <LoadingAnimation text="Loading projects..." />}

        {/* Error State */}
        {error && !loading && (
          <div className="flex items-center justify-center h-full">
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
          <div className="flex items-center justify-center h-full">
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

        {/* Category Folders */}
        {!loading && !error && projects.length > 0 && (
          <>
            {/* DESKTOP: Category Folders */}
            <div className="hidden md:flex flex-col items-center gap-8 sm:gap-10 lg:gap-12 px-2 sm:px-4 pt-6 sm:pt-8 lg:pt-10 h-full">
              {/* All categories in a single horizontal row - NO WRAP, responsive */}
              <div className="flex gap-2 sm:gap-3 lg:gap-4 justify-center pb-2 flex-shrink-0 flex-wrap sm:flex-nowrap">
                {Object.entries(projectsByCategory).map(([category, categoryProjects], index) => (
                  <CategoryFolder
                    key={category}
                    category={category}
                    projects={categoryProjects}
                    index={index}
                    isOpen={openCategory === category}
                    onToggle={() => setOpenCategory(category)}
                  />
                ))}
              </div>
              
              {/* Horizontal Projects Display - NO SCROLLING, Responsive scale */}
              {openCategory && projectsByCategory[openCategory] && (
                <div className="w-full flex justify-center items-center flex-1 min-h-0 overflow-hidden px-4">
                  <div 
                    className="flex gap-4 sm:gap-6 lg:gap-8 justify-center items-center flex-wrap"
                    style={{ 
                      maxWidth: '100%',
                      maxHeight: '100%',
                      transform: (() => {
                        const count = projectsByCategory[openCategory].length;
                        if (count <= 3) return 'scale(1)';
                        if (count <= 6) return 'scale(0.85)';
                        if (count <= 9) return 'scale(0.7)';
                        return 'scale(0.6)';
                      })(),
                      transformOrigin: 'center',
                      transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {projectsByCategory[openCategory].map((project, idx) => (
                      <ProjectCard 
                        key={project.id} 
                        project={project} 
                        index={idx}
                        categoryColor={CATEGORY_COLORS[openCategory]}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* MOBILE: Category Buttons + 3x2 Grid */}
            <div className="md:hidden flex flex-col h-full w-full px-3 py-3">
              {/* Category Buttons - Single Row */}
              <div className="flex gap-2 justify-center mb-4 flex-shrink-0">
                {Object.keys(projectsByCategory).map((category) => {
                  const isActive = openCategory === category;
                  const colors = CATEGORY_COLORS[category];
                  return (
                    <button
                      key={category}
                      onClick={() => setOpenCategory(category)}
                      className="relative px-3 py-1.5 rounded-lg font-medium text-xs transition-all duration-300 border"
                      style={{
                        backgroundColor: isActive ? `${colors?.accent || '#18a1fd'}30` : 'rgba(255,255,255,0.05)',
                        borderColor: isActive ? `${colors?.accent || '#18a1fd'}60` : 'rgba(255,255,255,0.1)',
                        color: isActive ? '#fff' : 'rgba(255,255,255,0.7)',
                        boxShadow: isActive ? `0 0 15px ${colors?.glow || 'rgba(24,161,253,0.4)'}` : 'none',
                      }}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>

              {/* 3x2 Grid of Projects */}
              {openCategory && projectsByCategory[openCategory] && (
                <div className="flex-1 flex items-center justify-center min-h-0 overflow-hidden">
                  <div className="grid grid-cols-3 gap-2 w-full auto-rows-fr" style={{ maxHeight: 'calc(100vh - 180px)' }}>
                    {projectsByCategory[openCategory].slice(0, 6).map((project, idx) => (
                      <ProjectCard 
                        key={project.id}
                        project={project} 
                        index={idx}
                        categoryColor={CATEGORY_COLORS[openCategory]}
                        isMobile
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        </div>
      </main>
    </div>
  );
};

export default ProjectsPageClient;
