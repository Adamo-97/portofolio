"use client";
import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard, { type Project } from "./ProjectCard";

interface CategoryFolderProps {
  category: string;
  projects: Project[];
  index: number;
  isOpen: boolean;
  onToggle: () => void;
}

const CATEGORY_COLORS: Record<string, { accent: string; glow: string; cardBg: string }> = {
  Applications: { 
    accent: "#06b6d4", 
    glow: "rgba(6, 182, 212, 0.2)", 
    cardBg: "linear-gradient(135deg, rgba(6, 182, 212, 0.15) 0%, rgba(8, 145, 178, 0.08) 100%)"
  },
  Infrastructure: { 
    accent: "#ec4899", 
    glow: "rgba(236, 72, 153, 0.2)", 
    cardBg: "linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(219, 39, 119, 0.08) 100%)"
  },
  Utilities: { 
    accent: "#8b5cf6", 
    glow: "rgba(139, 92, 246, 0.2)", 
    cardBg: "linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(124, 58, 237, 0.08) 100%)"
  },
};

const CategoryFolder: React.FC<CategoryFolderProps> = ({ category, projects, index, isOpen, onToggle }) => {
  const randomDelay = index * 0.1;
  const colors = CATEGORY_COLORS[category] || CATEGORY_COLORS.Build;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay: randomDelay }}
      className="flex-shrink-0 w-full max-w-[200px] sm:max-w-[260px] lg:max-w-[320px]"
    >
      {/* Folder-style Category Button */}
      <motion.button
        onClick={onToggle}
        className="relative w-full cursor-pointer group"
        whileTap={{ scale: 0.98 }}
      >
        {/* Folder Tab */}
        <div 
          className="relative h-[8px] sm:h-[10px] lg:h-[12px] w-[45%] rounded-t-md transition-all duration-300"
          style={{
            background: isOpen 
              ? `linear-gradient(180deg, ${colors.accent} 0%, ${colors.accent}dd 100%)`
              : 'rgba(255,255,255,0.15)',
            boxShadow: isOpen ? `0 -2px 8px ${colors.glow}` : 'none',
          }}
        />
        
        {/* Folder Body */}
        <div
          className="relative rounded-lg rounded-tl-none border border-white/10 backdrop-blur-sm overflow-hidden transition-all duration-300"
          style={{
            background: isOpen 
              ? `linear-gradient(180deg, ${colors.accent}25 0%, ${colors.accent}10 100%)`
              : 'rgba(255,255,255,0.04)',
            borderColor: isOpen ? `${colors.accent}60` : 'rgba(255,255,255,0.1)',
            boxShadow: isOpen 
              ? `0 4px 20px ${colors.glow}, 0 0 40px ${colors.glow}` 
              : '0 2px 8px rgba(0,0,0,0.2)',
          }}
        >
          {/* Subtle glow on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
            style={{
              background: `radial-gradient(circle at center, ${colors.glow} 0%, transparent 70%)`,
            }}
          />

          {/* Content */}
          <div className="relative flex flex-col items-center px-3 py-4 sm:px-4 sm:py-5 lg:px-5 lg:py-6 gap-1 sm:gap-1.5">
            {/* Folder Icon - changes based on open/closed state */}
            <div 
              className="text-[28px] sm:text-[36px] lg:text-[44px] mb-1 transition-all duration-300"
              style={{
                filter: isOpen ? `drop-shadow(0 0 8px ${colors.accent})` : 'none',
              }}
            >
              {isOpen ? '📂' : '📁'}
            </div>
            
            {/* Category Name & Count */}
            <div className="flex flex-col items-center gap-0.5 sm:gap-1">
              <h3 
                className="text-[13px] sm:text-[15px] lg:text-[17px] font-semibold tracking-tight text-center transition-colors duration-300"
                style={{
                  color: isOpen ? colors.accent : '#fff',
                }}
              >
                {category}
              </h3>
              <span className="text-[10px] sm:text-[11px] lg:text-[12px] text-white/50">
                {projects.length} {projects.length === 1 ? "project" : "projects"}
              </span>
            </div>
          </div>
        </div>
      </motion.button>
    </motion.div>
  );
};

export default CategoryFolder;

export { CATEGORY_COLORS };
