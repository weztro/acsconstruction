"use client";

import * as React from "react";
import { PROJECTS, Project } from "@/lib/constants";
import { ProjectCard } from "./ProjectCard";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  "All Projects",
  "Courtyard Homes",
  "Kerala Traditional",
  "Modern Brick",
  "South Indian",
  "Minimalist",
];

export function ProjectGallery() {
  const [activeCategory, setActiveCategory] = React.useState("All Projects");

  const filteredProjects: Project[] = React.useMemo(() => {
    if (activeCategory === "All Projects") {
      return PROJECTS;
    }
    return PROJECTS.filter((p) => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <div className="space-y-12">
      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3">
        {CATEGORIES.map((cat) => (
          <Button
            key={cat}
            variant={activeCategory === cat ? "default" : "outline"}
            size="sm"
            onClick={() => setActiveCategory(cat)}
            className={`text-xs uppercase tracking-wider h-9 font-medium ${
              activeCategory !== cat ? "border-border text-muted-foreground hover:text-foreground" : ""
            }`}
          >
            {cat}
          </Button>
        ))}
      </div>

      {/* Grid of Projects */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        {filteredProjects.map((project) => (
          <ProjectCard key={project.slug} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="py-20 text-center text-muted-foreground text-sm">
          No projects found in this category.
        </div>
      )}
    </div>
  );
}
