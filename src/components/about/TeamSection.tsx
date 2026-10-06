"use client";

import * as React from "react";
import Image from "next/image";
import { Users, HardHat, Award, Phone } from "lucide-react";
import { fetchEngineersFromFirestore, type EngineerMesthri } from "@/lib/firebase";
import { Badge } from "@/components/ui/badge";

const DEFAULT_LEADERSHIP = [
  {
    name: "Ar. K. Ramanathan",
    role: "Principal Architect & Founder",
    experience: "30+ Years Experience",
    specialization: "Vernacular Physics, Vastu & Teak Joinery",
    bio: "Trained at CEPT Ahmedabad with deep expertise in traditional South Indian wooden joinery and courtyard thermal physics.",
    imageUrl: "",
  },
  {
    name: "Er. Rajeshwari Menon",
    role: "Head of Structural & Civil Engineering",
    experience: "22+ Years Experience",
    specialization: "Seismic Design & High-Grade Concrete Detailing",
    bio: "Former chief civil engineer with M.Tech from IIT Madras. Ensures every residential footing exceeds seismic and soil-bearing safety thresholds.",
    imageUrl: "",
  },
  {
    name: "Sthapati V. Murugesan",
    role: "Master of Traditional Indian Masonry",
    experience: "35+ Years Heritage Mastery",
    specialization: "Fine Stone Dressing & Athangudi Tiles",
    bio: "Fifth-generation temple and heritage sthapati from Thanjavur, supervising fine stone dressing, Athangudi tile casting, and classical wooden colonnades.",
    imageUrl: "",
  },
];

export function TeamSection() {
  const [customTeam, setCustomTeam] = React.useState<EngineerMesthri[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    fetchEngineersFromFirestore()
      .then((items) => {
        if (isMounted) {
          setCustomTeam(items);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.warn("Could not load dynamic engineers:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="space-y-12">
      <div className="max-w-2xl space-y-2">
        <span className="text-xs font-semibold uppercase tracking-widest text-[#B86F55] dark:text-[#B8735B] flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />
          <span>Studio Leadership &amp; Construction Masters</span>
        </span>
        <h2 className="font-serif text-2xl sm:text-3xl font-normal text-foreground">
          Led by Architects, Engineers &amp; Mesthris.
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          From structural soil testing to on-site stone dressing, our civil engineers and generational mesthris oversee every millimeter of your construction in Tenkasi and South India.
        </p>
      </div>

      {/* Leadership & Dynamic Engineers/Mesthris Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Dynamic Firestore Engineers & Mesthris First (if any) */}
        {customTeam.map((member) => (
          <div
            key={member.id}
            className="p-7 sm:p-8 bg-card border border-border rounded-xl space-y-4 shadow-xs hover:border-primary/50 transition-all flex flex-col justify-between"
          >
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-secondary text-primary flex items-center justify-center font-serif text-xl border border-border">
                  {member.imageUrl ? (
                    <Image
                      src={member.imageUrl}
                      alt={member.name}
                      fill
                      unoptimized
                      className="object-cover"
                    />
                  ) : (
                    <HardHat className="w-6 h-6 text-primary" />
                  )}
                </div>
                <Badge variant="outline" className="text-[10px] font-mono border-primary/30 text-primary">
                  {member.role.toLowerCase().includes("mesthri") ? "Master Mesthri" : "Site Engineer"}
                </Badge>
              </div>

              <div>
                <h3 className="font-serif text-lg font-normal text-foreground">
                  {member.name}
                </h3>
                <p className="text-xs font-semibold text-primary uppercase tracking-wider mt-0.5">
                  {member.role}
                </p>
                <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono mt-1">
                  <Award className="w-3 h-3 text-[#B86F55]" />
                  <span>{member.experience}</span>
                </div>
              </div>

              <div className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/50 space-y-1">
                <p className="font-medium text-foreground text-[11px]">Specialization:</p>
                <p>{member.specialization}</p>
                {member.bio && <p className="pt-1 text-[11px] italic">{member.bio}</p>}
              </div>
            </div>

            {member.phone && (
              <div className="pt-3 border-t border-border/40 flex items-center gap-1.5 text-xs text-muted-foreground">
                <Phone className="w-3 h-3 text-primary" />
                <span>Contact: {member.phone}</span>
              </div>
            )}
          </div>
        ))}

        {/* Default Founding Leadership */}
        {DEFAULT_LEADERSHIP.map((lead) => (
          <div
            key={lead.name}
            className="p-7 sm:p-8 bg-card border border-border rounded-xl space-y-4 shadow-xs"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-lg bg-secondary text-primary flex items-center justify-center font-serif text-xl border border-border">
                {lead.name[0]}
              </div>
              <Badge variant="outline" className="text-[10px] font-mono text-muted-foreground">
                Founding Atelier
              </Badge>
            </div>

            <div>
              <h3 className="font-serif text-lg font-normal text-foreground">
                {lead.name}
              </h3>
              <p className="text-xs font-semibold text-primary uppercase tracking-wider mt-0.5">
                {lead.role}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground font-mono mt-1">
                <Award className="w-3 h-3 text-[#B86F55]" />
                <span>{lead.experience}</span>
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed pt-2 border-t border-border/50">
              {lead.bio}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
