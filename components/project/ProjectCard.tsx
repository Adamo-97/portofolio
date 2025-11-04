"use client";
import React from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  github_url: string;
  languages: string[];
  cover_image_url?: string;
}

interface ProjectCardProps {
  project: Project;
  index?: number;
  categoryColor?: { accent: string; glow: string; cardBg: string };
  isMobile?: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index = 0, categoryColor, isMobile = false }) => {
  // Take first 4 languages (3 for mobile)
  const displayLanguages = project.languages.slice(0, isMobile ? 3 : 4);

  // Random delay for flicker animation (between 0 and 1.5 seconds)
  const randomDelay = index * 0.08;
  
  const cardBg = categoryColor?.cardBg || "linear-gradient(to bottom right, #2d3748, #4a5568)";
  const accentColor = categoryColor?.accent || "#18a1fd";
  const glowColor = categoryColor?.glow || "rgba(24, 161, 253, 0.6)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: randomDelay }}
      className="w-full h-full max-w-[380px] max-h-[550px]"
    >
      <a
        href={project.github_url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-[#1b233d] overflow-hidden flex flex-col cursor-pointer w-full h-full rounded-[16px] sm:rounded-[20px] p-[4px] sm:p-[5px] transition-all duration-500 ease-[cubic-bezier(0.175,0.885,0.32,1.275)] hover:scale-105"
        style={{
          border: `2px solid ${accentColor}60`,
          boxShadow: `0 4px 20px rgba(0,0,0,0.3)`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = `0 0 40px ${glowColor}`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = `0 4px 20px rgba(0,0,0,0.3)`;
        }}
      >
        {/* Top Section - Colored gradient with skewed corner */}
        <div 
          className="flex-shrink-0 flex flex-col relative overflow-hidden h-[40%] sm:h-[45%] rounded-[12px] sm:rounded-[15px]"
          style={{
            background: cardBg,
          }}
        >
          {/* Skewed corner decoration */}
          <div className="absolute top-0 left-0 h-[20px] sm:h-[25px] md:h-[30px] w-[80px] sm:w-[100px] md:w-[130px] bg-[#1b233d] transform skew-x-[-40deg] shadow-[-10px_-10px_0_0_#1b233d] rounded-br-[8px] sm:rounded-br-[10px] before:content-[''] before:absolute before:w-[10px] sm:before:w-[12px] md:before:w-[15px] before:h-[10px] sm:before:h-[12px] md:before:h-[15px] before:top-0 before:right-[-10px] sm:before:right-[-12px] md:before:right-[-15px] before:bg-transparent before:rounded-tl-[10px] before:shadow-[-5px_-5px_0_2px_#1b233d]" />
          <div className="absolute top-[20px] sm:top-[25px] md:top-[30px] left-0 bg-transparent h-[10px] sm:h-[12px] md:h-[15px] w-[10px] sm:w-[12px] md:w-[15px] rounded-tl-[15px] shadow-[-5px_-5px_0_2px_#1b233d]" />

          {/* Top section header */}
          <div className="flex-shrink-0 w-full flex items-center justify-between z-10 h-[20px] sm:h-[25px] md:h-[30px] px-2 sm:px-2.5 md:px-3">
            {/* Category - left */}
            <div 
              className="text-white/90 font-bold uppercase tracking-wider text-[8px] sm:text-[9px] md:text-[10px] lg:text-[11px]"
              style={{ textShadow: `0 0 10px ${glowColor}` }}
            >
              {project.category}
            </div>

            {/* GitHub icon - top right */}
            <div
              className="flex items-center justify-center p-1 sm:p-1.5 md:p-2 bg-[#1b233d]/80 hover:bg-[#1b233d] backdrop-blur-sm rounded-md transition-all"
              title="Click card to view code on GitHub"
              onClick={(e) => e.stopPropagation()}
            >
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 fill-current text-white"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </div>
          </div>

          {/* Image placeholder - centered transparent rectangle */}
          <div className="flex-1 flex items-end justify-center pb-2 sm:pb-2.5 md:pb-3 px-2 sm:px-3 md:px-4">
            <div className="w-full h-[70%] sm:h-[75%] bg-white/10 backdrop-blur-sm rounded-md sm:rounded-lg border-2 border-white/20 flex items-center justify-center overflow-hidden p-1.5 sm:p-2 md:p-2.5 lg:p-3">
              {project.cover_image_url ? (
                <Image
                  src={project.cover_image_url}
                  alt={project.title}
                  width={400}
                  height={300}
                  className="max-w-full max-h-full object-contain"
                  unoptimized
                />
              ) : (
                <div className="text-white/30 text-[9px] sm:text-[10px] md:text-xs">No image</div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex-1 flex flex-col min-h-0 mt-2 sm:mt-2.5 md:mt-3 px-2 sm:px-2.5 md:px-3 pb-2 sm:pb-2.5 md:pb-3">
          {/* Title */}
          <h3 className="font-bold text-white text-center flex-shrink-0 text-[11px] sm:text-[13px] md:text-[15px] lg:text-[17px] mb-1 sm:mb-1.5 md:mb-2 tracking-[1.5px] leading-tight">
            {project.title.toUpperCase()}
          </h3>

          {/* Programming Languages */}
          {displayLanguages.length > 0 && (
            <div className="flex flex-wrap justify-center items-center flex-shrink-0 gap-0.5 sm:gap-1 md:gap-1.5 mb-1 sm:mb-1.5 md:mb-2">
              {displayLanguages.map((lang) => (
                <div
                  key={lang}
                  className="border backdrop-blur-sm flex items-center justify-center px-1 sm:px-1.5 md:px-2 py-0.5 rounded-md sm:rounded-lg"
                  style={{
                    backgroundColor: `${accentColor}20`,
                    borderColor: `${accentColor}30`,
                  }}
                >
                  <span className="font-medium text-white/90 text-[7px] sm:text-[8px] md:text-[9px] lg:text-[10px]">
                    {lang}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Description */}
          <p className="text-white/70 text-center flex-1 overflow-hidden text-[9px] sm:text-[10px] md:text-[12px] lg:text-[13px] line-clamp-3 leading-relaxed mb-1 sm:mb-1.5 md:mb-2">
            {project.description}
          </p>

          {/* Click to view code hint with GitHub icon */}
          <div className="text-white/40 text-center font-medium flex items-center justify-center flex-shrink-0 text-[8px] sm:text-[9px] md:text-[10px] gap-0.5 sm:gap-1">
            <span>Click card to view code</span>
            {isMobile ? (
              // Mobile: GitHub icon instead of arrow
              <svg className="w-2 h-2 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            ) : (
              // Desktop: Arrow icon
              <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            )}
          </div>
        </div>
      </a>
    </motion.div>
  );
};

export default ProjectCard;
