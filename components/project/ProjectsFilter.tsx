"use client";
import React from "react";
import { motion } from "framer-motion";

export type CategoryOption = {
  id: string;
  label: string;
  icon?: string;
};

export const DEFAULT_CATEGORIES: CategoryOption[] = [
  { id: "all", label: "All" },
  { id: "Systems", label: "Systems" },
  { id: "Build", label: "Build" },
  { id: "Tools", label: "Tools" },
];

interface ProjectsFilterProps {
  categories?: CategoryOption[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
}

const ProjectsFilter: React.FC<ProjectsFilterProps> = ({
  categories = DEFAULT_CATEGORIES,
  activeCategory,
  onCategoryChange,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3">
      {categories.map((category) => {
        const isActive = activeCategory === category.id;
        return (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`relative px-6 py-2.5 rounded-full font-medium text-[15px] tracking-[-0.01em] transition-all duration-300 border border-lightgray/50 ${
              isActive
                ? "bg-cornflowerblue-100 text-white shadow-[0_4px_20px_rgba(24,161,253,0.4)] scale-105"
                : "bg-cornflowerblue-400/20 text-white/80 hover:bg-cornflowerblue-400/40 hover:text-white hover:border-cornflowerblue-100/30"
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="activeCategory"
                className="absolute inset-0 bg-cornflowerblue-100 rounded-full -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <span className="relative z-10">{category.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default ProjectsFilter;
