"use client";

import * as React from "react";
import { PROJECTS, Project } from "@/lib/constants";
import { fetchProjectsFromFirestore } from "@/lib/firebase";
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
  const [dynamicProjects, setDynamicProjects] = React.useState<Project[]>([]);

  React.useEffect(() => {
    let isMounted = true;
    fetchProjectsFromFirestore()
      .then((items) => {
        if (!isMounted || !items || items.length === 0) return;
        const mapped: Project[] = items.map((fp) => ({
          slug: `p-${fp.id || fp.title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
          name: fp.title,
          style: fp.category || "Residential Villa",
          category: fp.category || "Courtyard Homes",
          location: fp.location,
          builtUpArea: fp.area,
          plotSize: "Custom Plot",
          year: "2025",
          timeline: fp.timeline || "Completed",
          headline: fp.tagline || fp.title,
          description: fp.description,
          featured: false,
          heroImage: fp.imageUrl || "/images/hero/hero-villa.jpg",
          gallery: [fp.imageUrl || "/images/hero/hero-villa.jpg"],
          clientBrief: fp.description,
          materials: ["Natural Stone", "Teak Wood"],
          highlights: fp.keyFeatures || [],
          floorPlanConcept: "Bespoke vernacular layout optimized for cross-ventilation.",
        }));
        setDynamicProjects(mapped);
      })
      .catch((err) => {
        console.warn("Could not load dynamic projects from Firestore:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const allProjects = React.useMemo(() => {
    return [...dynamicProjects, ...PROJECTS];
  }, [dynamicProjects]);

  const filteredProjects: Project[] = React.useMemo(() => {
    if (activeCategory === "All Projects") {
      return allProjects;
    }
    return allProjects.filter((p) => p.category === activeCategory);
  }, [activeCategory, allProjects]);

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
