"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  fetchLeadsFromFirestore,
  updateLeadStatusInFirestore,
  fetchProjectsFromFirestore,
  saveProjectToFirestore,
  deleteProjectFromFirestore,
  fileToBase64,
  fetchSiteVisitsFromFirestore,
  logSiteVisit,
  type Lead,
  type ProjectItem,
  type SiteVisit,
} from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Phone,
  MessageSquare,
  Mail,
  MapPin,
  Calendar,
  Plus,
  Trash2,
  ExternalLink,
  LogOut,
  FolderKanban,
  Users,
  Search,
  CheckCircle,
  Clock,
  Upload,
  Image as ImageIcon,
  Activity,
  Eye,
  Globe,
  Smartphone,
  Monitor,
  Tablet,
  TrendingUp,
  RefreshCw,
  BarChart3,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

function formatVisitTime(ts: unknown): string {
  if (!ts) return "Just now";
  let date: Date;
  if (
    typeof ts === "object" &&
    ts !== null &&
    "toDate" in ts &&
    typeof (ts as { toDate: () => Date }).toDate === "function"
  ) {
    date = (ts as { toDate: () => Date }).toDate();
  } else if (typeof ts === "object" && ts !== null && "seconds" in ts) {
    date = new Date((ts as { seconds: number }).seconds * 1000);
  } else if (typeof ts === "string" || typeof ts === "number") {
    date = new Date(ts);
  } else {
    date = new Date();
  }

  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  return date.toLocaleDateString("en-IN", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout, isMock } = useAuth();

  const [activeTab, setActiveTab] = React.useState<"leads" | "projects" | "visitors">("leads");

  // Leads State
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = React.useState(true);
  const [leadFilter, setLeadFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Projects State
  const [projects, setProjects] = React.useState<ProjectItem[]>([]);
  const [projectsLoading, setProjectsLoading] = React.useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

  // Site Visitors State
  const [visits, setVisits] = React.useState<SiteVisit[]>([]);
  const [visitsLoading, setVisitsLoading] = React.useState(true);

  // New Project Form State
  const [newProject, setNewProject] = React.useState({
    title: "",
    tagline: "",
    category: "Residential Villa",
    location: "Pandiyapuram, Tenkasi",
    area: "2,800 sq.ft",
    timeline: "12 Months",
    description: "",
    imageUrl: "",
    keyFeatures: "Nadumuttam Courtyard, Teak Joinery, Clay Roof Tiles",
  });
  const [imageBase64, setImageBase64] = React.useState<string>("");
  const [imageFileSize, setImageFileSize] = React.useState<string>("");
  const [convertingImage, setConvertingImage] = React.useState(false);
  const [submittingProject, setSubmittingProject] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Protect Admin route
  React.useEffect(() => {
    if (!authLoading && !user) {
      router.push("/admin/login");
    }
  }, [user, authLoading, router]);

  // Load Leads
  const loadLeads = React.useCallback(async () => {
    setLeadsLoading(true);
    const data = await fetchLeadsFromFirestore();
    setLeads(data);
    setLeadsLoading(false);
  }, []);

  // Load Projects
  const loadProjects = React.useCallback(async () => {
    setProjectsLoading(true);
    const data = await fetchProjectsFromFirestore();
    setProjects(data);
    setProjectsLoading(false);
  }, []);

  // Load Site Visits
  const loadVisits = React.useCallback(async () => {
    setVisitsLoading(true);
    const data = await fetchSiteVisitsFromFirestore(200);
    setVisits(data);
    setVisitsLoading(false);
  }, []);

  React.useEffect(() => {
    if (user) {
      loadLeads();
      loadProjects();
      loadVisits();
    }
  }, [user, loadLeads, loadProjects, loadVisits]);

  // Simulate Sample Visits for testing
  const handleSimulateVisits = async () => {
    const samplePaths = ["/", "/projects", "/contact", "/services", "/about", "/process"];
    const sampleDevices: Array<"Mobile" | "Desktop" | "Tablet"> = [
      "Mobile",
      "Mobile",
      "Desktop",
      "Desktop",
      "Mobile",
      "Tablet",
    ];
    const sampleBrowsers = [
      "Google Chrome",
      "Apple Safari",
      "Samsung Internet",
      "Mozilla Firefox",
      "Microsoft Edge",
    ];
    const sampleReferrers = [
      "Direct / Bookmark",
      "WhatsApp",
      "Google Search",
      "Instagram",
      "Facebook",
    ];
    const sampleOS = ["Android", "iOS", "Windows", "macOS"];

    setVisitsLoading(true);
    for (let i = 0; i < 5; i++) {
      const p = samplePaths[Math.floor(Math.random() * samplePaths.length)];
      const dev = sampleDevices[Math.floor(Math.random() * sampleDevices.length)];
      const br = sampleBrowsers[Math.floor(Math.random() * sampleBrowsers.length)];
      const ref = sampleReferrers[Math.floor(Math.random() * sampleReferrers.length)];
      const os = sampleOS[Math.floor(Math.random() * sampleOS.length)];
      const sid = "sim_" + Math.random().toString(36).substring(2, 8);
      await logSiteVisit({
        path: p,
        referrer: ref,
        device: dev,
        browser: br,
        os,
        sessionId: sid,
      });
    }
    await loadVisits();
  };

  // Analytics Computations
  const totalVisits = visits.length;
  const uniqueSessions = React.useMemo(() => {
    return new Set(visits.map((v) => v.sessionId)).size;
  }, [visits]);

  const todayVisits = React.useMemo(() => {
    const todayStr = new Date().toDateString();
    return visits.filter((v) => {
      if (!v.createdAt) return true;
      let d: Date;
      if (
        typeof v.createdAt === "object" &&
        v.createdAt !== null &&
        "toDate" in v.createdAt &&
        typeof (v.createdAt as { toDate: () => Date }).toDate === "function"
      ) {
        d = (v.createdAt as { toDate: () => Date }).toDate();
      } else if (typeof v.createdAt === "object" && v.createdAt !== null && "seconds" in v.createdAt) {
        d = new Date((v.createdAt as { seconds: number }).seconds * 1000);
      } else {
        d = new Date(v.createdAt as string | number);
      }
      return d.toDateString() === todayStr;
    }).length;
  }, [visits]);

  const deviceDistribution = React.useMemo(() => {
    const mobile = visits.filter((v) => v.device === "Mobile").length;
    const desktop = visits.filter((v) => v.device === "Desktop").length;
    const tablet = visits.filter((v) => v.device === "Tablet").length;
    const total = totalVisits || 1;
    return {
      mobile,
      desktop,
      tablet,
      mobilePct: Math.round((mobile / total) * 100),
      desktopPct: Math.round((desktop / total) * 100),
      tabletPct: Math.round((tablet / total) * 100),
    };
  }, [visits, totalVisits]);

  const topPages = React.useMemo(() => {
    const pageMap: Record<string, number> = {};
    const friendlyNames: Record<string, string> = {
      "/": "Homepage (Hero & Intro)",
      "/projects": "Architectural Portfolio",
      "/contact": "Consultation & Contact",
      "/services": "Services & Estimates",
      "/about": "Atelier Story & Tenkasi Studio",
      "/process": "6-Phase Construction Process",
    };
    visits.forEach((v) => {
      const p = v.path || "/";
      pageMap[p] = (pageMap[p] || 0) + 1;
    });

    return Object.entries(pageMap)
      .map(([path, count]) => ({
        path,
        name: friendlyNames[path] || path,
        count,
        pct: totalVisits > 0 ? Math.round((count / totalVisits) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);
  }, [visits, totalVisits]);

  const topReferrers = React.useMemo(() => {
    const refMap: Record<string, number> = {};
    visits.forEach((v) => {
      const r = v.referrer || "Direct / Bookmark";
      refMap[r] = (refMap[r] || 0) + 1;
    });

    return Object.entries(refMap)
      .map(([source, count]) => ({
        source,
        count,
        pct: totalVisits > 0 ? Math.round((count / totalVisits) * 100) : 0,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [visits, totalVisits]);

  const trendDays = React.useMemo(() => {
    const days: { label: string; dateStr: string; count: number }[] = [];
    const now = new Date();

    for (let i = 6; i >= 0; i--) {
      const targetDate = new Date();
      targetDate.setDate(now.getDate() - i);
      const dateStr = targetDate.toDateString();
      const label =
        i === 0
          ? "Today"
          : targetDate.toLocaleDateString("en-IN", { weekday: "short" });

      const count = visits.filter((v) => {
        if (!v.createdAt) return i === 0;
        let d: Date;
        if (
          typeof v.createdAt === "object" &&
          v.createdAt !== null &&
          "toDate" in v.createdAt &&
          typeof (v.createdAt as { toDate: () => Date }).toDate === "function"
        ) {
          d = (v.createdAt as { toDate: () => Date }).toDate();
        } else if (typeof v.createdAt === "object" && v.createdAt !== null && "seconds" in v.createdAt) {
          d = new Date((v.createdAt as { seconds: number }).seconds * 1000);
        } else {
          d = new Date(v.createdAt as string | number);
        }
        return d.toDateString() === dateStr;
      }).length;

      days.push({ label, dateStr, count });
    }

    return days;
  }, [visits]);

  const maxDailyCount = Math.max(...trendDays.map((d) => d.count), 1);

  // Handle Image selection & Base64 conversion
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setConvertingImage(true);
      // Downsample to max 1200px width/height and compress to 82% quality JPEG
      const b64 = await fileToBase64(file, 1200, 0.82);
      setImageBase64(b64);
      const approxKb = Math.round((b64.length * 3) / 4 / 1024);
      setImageFileSize(`${approxKb} KB`);
      setNewProject((prev) => ({ ...prev, imageUrl: b64 }));
    } catch (err) {
      console.error("Failed to convert image to Base64:", err);
      alert("Could not process image file. Please try another image.");
    } finally {
      setConvertingImage(false);
    }
  };

  const handleClearImage = () => {
    setImageBase64("");
    setImageFileSize("");
    setNewProject((prev) => ({ ...prev, imageUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Handle Lead Status Change
  const handleStatusChange = async (leadId: string, newStatus: Lead["status"]) => {
    const success = await updateLeadStatusInFirestore(leadId, newStatus);
    if (success) {
      setLeads((prev) =>
        prev.map((l) => (l.id === leadId ? { ...l, status: newStatus } : l))
      );
    }
  };

  // Handle Project Creation
  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmittingProject(true);

    const finalImageUrl =
      imageBase64 ||
      newProject.imageUrl ||
      "/images/architecture/traditional-heritage.jpg";

    const featuresArray = newProject.keyFeatures
      .split(",")
      .map((f) => f.trim())
      .filter(Boolean);

    const res = await saveProjectToFirestore({
      title: newProject.title,
      tagline: newProject.tagline,
      category: newProject.category,
      location: newProject.location,
      area: newProject.area,
      timeline: newProject.timeline,
      description: newProject.description,
      imageUrl: finalImageUrl,
      keyFeatures: featuresArray,
    });

    setSubmittingProject(false);

    if (res.success) {
      setIsAddModalOpen(false);
      handleClearImage();
      setNewProject({
        title: "",
        tagline: "",
        category: "Residential Villa",
        location: "Pandiyapuram, Tenkasi",
        area: "2,800 sq.ft",
        timeline: "12 Months",
        description: "",
        imageUrl: "",
        keyFeatures: "Nadumuttam Courtyard, Teak Joinery, Clay Roof Tiles",
      });
      loadProjects();
    } else {
      alert("Failed to save project to Firestore. Please check your Firestore rules in Firebase Console.");
    }
  };

  // Handle Delete Project
  const handleDeleteProject = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this project?")) {
      const ok = await deleteProjectFromFirestore(id);
      if (ok) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      }
    }
  };

  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-xs text-muted-foreground font-mono animate-pulse">
          Verifying security authorization...
        </p>
      </div>
    );
  }

  // Filtered Leads
  const filteredLeads = leads.filter((lead) => {
    const matchesFilter = leadFilter === "all" || lead.status === leadFilter;
    const matchesSearch =
      !searchQuery ||
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery) ||
      (lead.location || lead.city || "").toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Top Admin Header */}
      <div className="border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3">
              <span className="text-[10px] uppercase font-semibold tracking-widest text-[#B86F55] dark:text-[#B8735B]">
                ACS Construction
              </span>
              {isMock && (
                <span className="text-[9px] px-2 py-0.5 rounded bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono">
                  Demo Session
                </span>
              )}
            </div>
            <h1 className="font-serif text-xl sm:text-2xl font-normal text-foreground">
              Atelier Management Portal
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild variant="outline" size="sm" className="h-8 text-xs">
              <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5">
                <span>View Live Site</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              className="h-8 text-xs text-muted-foreground hover:text-destructive"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex gap-8 border-t border-border/50 text-xs font-medium">
          <button
            onClick={() => setActiveTab("leads")}
            className={`py-3.5 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "leads"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Client Inquiries & Leads</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-secondary text-foreground font-mono">
              {leads.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("projects")}
            className={`py-3.5 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "projects"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <FolderKanban className="w-4 h-4" />
            <span>Projects & Gallery</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-secondary text-foreground font-mono">
              {projects.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("visitors")}
            className={`py-3.5 flex items-center gap-2 border-b-2 transition-colors ${
              activeTab === "visitors"
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            <Activity className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Site Visitors</span>
            <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-secondary text-foreground font-mono">
              {visits.length}
            </span>
            <span className="relative flex h-2 w-2 ml-0.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 py-8">
        {/* ==================================================== */}
        {/* LEADS TAB CONTENT */}
        {/* ==================================================== */}
        {activeTab === "leads" && (
          <div className="space-y-6">
            {/* Filter and Search Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2">
                {["all", "new", "contacted", "in_progress", "closed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setLeadFilter(status)}
                    className={`px-3 py-1.5 rounded-md text-xs uppercase tracking-wider font-medium transition-colors ${
                      leadFilter === status
                        ? "bg-primary text-primary-foreground"
                        : "bg-card border border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {status.replace("_", " ")}
                  </button>
                ))}
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-3.5 h-3.5 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search name, phone, city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-xs bg-card border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>

            {/* Leads List */}
            {leadsLoading ? (
              <div className="py-20 text-center text-xs text-muted-foreground font-mono animate-pulse">
                Loading client leads from Firestore...
              </div>
            ) : filteredLeads.length === 0 ? (
              <div className="py-20 text-center bg-card border border-border rounded-xl p-8 space-y-3">
                <Users className="w-8 h-8 text-muted-foreground mx-auto" />
                <h3 className="font-serif text-lg text-foreground">No Inquiries Found</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  When homeowners fill out the contact form on your site, their submissions will appear here with instant call and WhatsApp buttons.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredLeads.map((lead) => {
                  const cleanPhone = lead.phone.replace(/[^0-9]/g, "");
                  const whatsappUrl = `https://wa.me/${cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone}?text=Hello%20${encodeURIComponent(lead.name)},%20thank%20you%20for%20reaching%20out%20to%20ACS%20Construction.`;

                  return (
                    <div
                      key={lead.id}
                      className="bg-card border border-border rounded-xl p-5 space-y-4 shadow-xs flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h3 className="font-serif text-base font-normal text-foreground">
                              {lead.name}
                            </h3>
                            <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground mt-0.5">
                              <MapPin className="w-3 h-3 text-primary shrink-0" />
                              <span>{lead.location || lead.city || "Tamil Nadu"}</span>
                            </div>
                          </div>
                          <Badge
                            variant={
                              lead.status === "new"
                                ? "default"
                                : lead.status === "contacted"
                                ? "terracotta"
                                : "outline"
                            }
                            className="capitalize text-[10px]"
                          >
                            {lead.status.replace("_", " ")}
                          </Badge>
                        </div>

                        {/* Project Details */}
                        <div className="bg-secondary/40 p-3 rounded-md space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Type:</span>
                            <span className="font-medium text-foreground">{lead.projectType}</span>
                          </div>
                          {lead.budget && (
                            <div className="flex justify-between">
                              <span className="text-muted-foreground">Budget:</span>
                              <span className="font-medium text-foreground">{lead.budget}</span>
                            </div>
                          )}
                        </div>

                        {/* Client Message */}
                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed italic bg-card/60 p-2.5 rounded border border-border/60">
                          &ldquo;{lead.message}&rdquo;
                        </p>
                      </div>

                      {/* Action Bar: Call, WhatsApp, Email, Status */}
                      <div className="space-y-3 pt-3 border-t border-border">
                        <div className="grid grid-cols-2 gap-2">
                          <a
                            href={`tel:${lead.phone}`}
                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-secondary hover:bg-secondary/80 text-foreground text-xs font-medium transition-colors"
                          >
                            <Phone className="w-3.5 h-3.5 text-primary" />
                            <span>Call</span>
                          </a>

                          <a
                            href={whatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-1.5 py-2 px-3 rounded bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium transition-colors"
                          >
                            <MessageSquare className="w-3.5 h-3.5" />
                            <span>WhatsApp</span>
                          </a>
                        </div>

                        {/* Status Select */}
                        <div className="flex items-center justify-between text-xs pt-1">
                          <span className="text-[11px] text-muted-foreground">Update Status:</span>
                          <select
                            value={lead.status}
                            onChange={(e) =>
                              lead.id && handleStatusChange(lead.id, e.target.value as Lead["status"])
                            }
                            className="text-xs bg-background border border-border rounded px-2 py-1 text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                          >
                            <option value="new">New</option>
                            <option value="contacted">Contacted</option>
                            <option value="in_progress">In Progress</option>
                            <option value="closed">Closed</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* PROJECTS TAB CONTENT */}
        {/* ==================================================== */}
        {activeTab === "projects" && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-serif text-xl font-normal text-foreground">
                  Architectural Portfolio & Projects
                </h2>
                <p className="text-xs text-muted-foreground">
                  Add completed homes and villa projects to show on your website.
                </p>
              </div>

              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="text-xs tracking-wider uppercase font-medium flex items-center gap-1.5"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </Button>
            </div>

            {/* Projects Grid */}
            {projectsLoading ? (
              <div className="py-20 text-center text-xs text-muted-foreground font-mono animate-pulse">
                Loading projects from Firestore...
              </div>
            ) : projects.length === 0 ? (
              <div className="py-20 text-center bg-card border border-border rounded-xl p-8 space-y-3">
                <FolderKanban className="w-8 h-8 text-muted-foreground mx-auto" />
                <h3 className="font-serif text-lg text-foreground">No Projects Added Yet</h3>
                <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                  Click the &quot;Add Project&quot; button above to upload your first villa or home construction project with photos.
                </p>
                <Button
                  onClick={() => setIsAddModalOpen(true)}
                  size="sm"
                  className="text-xs uppercase tracking-wider"
                >
                  Create First Project
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="bg-card border border-border rounded-xl overflow-hidden shadow-xs flex flex-col justify-between group"
                  >
                    <div>
                      {/* Image Frame */}
                      <div className="relative aspect-[16/10] bg-secondary/50 overflow-hidden">
                        {proj.imageUrl ? (
                          <Image
                            src={proj.imageUrl}
                            alt={proj.title}
                            fill
                            unoptimized
                            className="object-cover transition-transform duration-500 group-hover:scale-103"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                            <ImageIcon className="w-8 h-8 opacity-40" />
                          </div>
                        )}
                        <span className="absolute top-3 left-3 bg-background/90 backdrop-blur-md px-2.5 py-1 rounded text-[10px] font-mono uppercase tracking-wider text-foreground">
                          {proj.category}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div>
                          <h3 className="font-serif text-lg font-normal text-foreground">
                            {proj.title}
                          </h3>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground mt-0.5">
                            <MapPin className="w-3 h-3 text-primary shrink-0" />
                            <span>{proj.location}</span>
                            <span className="mx-1">•</span>
                            <span>{proj.area}</span>
                          </div>
                        </div>

                        <p className="text-xs text-muted-foreground line-clamp-3 leading-relaxed">
                          {proj.description}
                        </p>

                        {proj.keyFeatures && proj.keyFeatures.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {proj.keyFeatures.map((feat, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 bg-secondary text-foreground rounded-sm font-mono"
                              >
                                {feat}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Delete Footer */}
                    <div className="p-4 border-t border-border flex items-center justify-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => proj.id && handleDeleteProject(proj.id)}
                        className="text-xs text-destructive hover:bg-destructive/10 h-8"
                      >
                        <Trash2 className="w-3.5 h-3.5 mr-1" />
                        <span>Remove Project</span>
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================================================== */}
        {/* SITE VISITORS & ANALYTICS TAB CONTENT */}
        {/* ==================================================== */}
        {activeTab === "visitors" && (
          <div className="space-y-8">
            {/* Action Bar & Live Status */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-xl shadow-xs">
              <div>
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 font-mono">
                    Real-Time Visitor Telemetry
                  </span>
                </div>
                <h2 className="font-serif text-xl sm:text-2xl font-normal text-foreground mt-0.5">
                  Site Traffic & Audience Analytics
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Live session telemetry from prospective homebuilders browsing your Tenkasi architecture studio website.
                </p>
              </div>

              <div className="flex items-center gap-2.5">
                <Button
                  onClick={handleSimulateVisits}
                  variant="outline"
                  size="sm"
                  disabled={visitsLoading}
                  className="text-xs h-8 text-primary border-primary/30 hover:bg-primary/5"
                >
                  <Sparkles className="w-3.5 h-3.5 mr-1 text-primary" />
                  <span>Simulate Traffic</span>
                </Button>

                <Button
                  onClick={loadVisits}
                  variant="outline"
                  size="sm"
                  disabled={visitsLoading}
                  className="text-xs h-8"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${visitsLoading ? "animate-spin" : ""}`} />
                  <span>Refresh</span>
                </Button>
              </div>
            </div>

            {/* KPI Stat Cards (4 cards) */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {/* Total Visits */}
              <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium">Total Pageviews</span>
                  <Eye className="w-4 h-4 text-primary" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl text-foreground font-normal">
                  {totalVisits}
                </div>
                <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-emerald-500" />
                  <span>Logged in Firestore</span>
                </div>
              </div>

              {/* Unique Visitors */}
              <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium">Unique Sessions</span>
                  <Users className="w-4 h-4 text-[#B86F55]" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl text-foreground font-normal">
                  {uniqueSessions}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  Distinct browsing sessions
                </div>
              </div>

              {/* Today's Visits */}
              <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium">Today&apos;s Traffic</span>
                  <Activity className="w-4 h-4 text-emerald-500" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl text-foreground font-normal">
                  {todayVisits}
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                  {todayVisits > 0 ? `${todayVisits} hits today` : "Waiting for today's visitors"}
                </div>
              </div>

              {/* Mobile Traffic Share */}
              <div className="bg-card border border-border rounded-xl p-5 shadow-xs space-y-2">
                <div className="flex items-center justify-between text-muted-foreground">
                  <span className="text-xs font-medium">Mobile Traffic</span>
                  <Smartphone className="w-4 h-4 text-primary" />
                </div>
                <div className="font-serif text-2xl sm:text-3xl text-foreground font-normal">
                  {totalVisits > 0 ? `${deviceDistribution.mobilePct}%` : "0%"}
                </div>
                <div className="text-[11px] text-muted-foreground">
                  {deviceDistribution.mobile} mobile vs {deviceDistribution.desktop} desktop
                </div>
              </div>
            </div>

            {/* 7-Day Traffic Trend Bar Chart */}
            <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-serif text-base font-normal text-foreground">
                    Last 7 Days Traffic Trend
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Daily distribution of visitor activity
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs font-mono text-muted-foreground">
                  <BarChart3 className="w-3.5 h-3.5 text-primary" />
                  <span>Peak: {maxDailyCount} visits</span>
                </div>
              </div>

              <div className="pt-6 pb-2">
                <div className="grid grid-cols-7 gap-2 sm:gap-4 h-40 items-end border-b border-border/60 pb-2">
                  {trendDays.map((day, idx) => {
                    const heightPct = Math.max(8, Math.round((day.count / maxDailyCount) * 100));
                    const isTodayBar = idx === 6;
                    return (
                      <div key={idx} className="flex flex-col items-center h-full justify-end group">
                        {/* Hover Count Badge */}
                        <span className="text-[10px] font-mono mb-1.5 transition-opacity opacity-70 group-hover:opacity-100 font-semibold text-foreground">
                          {day.count}
                        </span>

                        {/* Bar */}
                        <div
                          className={`w-full max-w-[44px] rounded-t-md transition-all duration-500 ${
                            isTodayBar
                              ? "bg-primary shadow-xs"
                              : day.count > 0
                              ? "bg-primary/50 hover:bg-primary/70"
                              : "bg-secondary/60"
                          }`}
                          style={{ height: `${heightPct}%` }}
                        />

                        {/* Day Label */}
                        <span
                          className={`text-[11px] font-mono mt-2 ${
                            isTodayBar ? "text-primary font-bold" : "text-muted-foreground"
                          }`}
                        >
                          {day.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Middle Section: Top Pages & Device/Sources */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Top Visited Pages */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-4">
                <div>
                  <h3 className="font-serif text-base font-normal text-foreground">
                    Most Visited Pages
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Where visitors spend the most time on your website
                  </p>
                </div>

                {topPages.length === 0 ? (
                  <p className="text-xs text-muted-foreground py-6 text-center">
                    No pageview data recorded yet.
                  </p>
                ) : (
                  <div className="space-y-3 pt-1">
                    {topPages.map((page, idx) => (
                      <div key={idx} className="space-y-1.5">
                        <div className="flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2 truncate pr-2">
                            <span className="font-mono text-[10px] text-muted-foreground w-4">
                              #{idx + 1}
                            </span>
                            <span className="font-medium text-foreground truncate">
                              {page.name}
                            </span>
                            <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                              {page.path}
                            </span>
                          </div>
                          <span className="font-mono text-[11px] font-semibold text-foreground shrink-0">
                            {page.count} views ({page.pct}%)
                          </span>
                        </div>
                        {/* Progress Bar */}
                        <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full transition-all duration-500"
                            style={{ width: `${page.pct}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Devices & Acquisition Sources */}
              <div className="bg-card border border-border rounded-xl p-6 shadow-xs space-y-6">
                {/* Devices */}
                <div className="space-y-3">
                  <div>
                    <h3 className="font-serif text-base font-normal text-foreground">
                      Device Platforms
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Mobile vs Desktop visitor distribution
                    </p>
                  </div>

                  <div className="space-y-2.5">
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-foreground">
                          <Smartphone className="w-3.5 h-3.5 text-primary" />
                          <span>Mobile Phones</span>
                        </span>
                        <span className="font-mono text-muted-foreground">
                          {deviceDistribution.mobile} ({deviceDistribution.mobilePct}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${deviceDistribution.mobilePct}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-foreground">
                          <Monitor className="w-3.5 h-3.5 text-blue-500" />
                          <span>Desktop Computers</span>
                        </span>
                        <span className="font-mono text-muted-foreground">
                          {deviceDistribution.desktop} ({deviceDistribution.desktopPct}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full"
                          style={{ width: `${deviceDistribution.desktopPct}%` }}
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="flex items-center gap-1.5 text-foreground">
                          <Tablet className="w-3.5 h-3.5 text-amber-500" />
                          <span>Tablets / iPads</span>
                        </span>
                        <span className="font-mono text-muted-foreground">
                          {deviceDistribution.tablet} ({deviceDistribution.tabletPct}%)
                        </span>
                      </div>
                      <div className="w-full h-1.5 bg-secondary rounded-full overflow-hidden">
                        <div
                          className="h-full bg-amber-500 rounded-full"
                          style={{ width: `${deviceDistribution.tabletPct}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Traffic Acquisition Sources */}
                <div className="space-y-3 pt-3 border-t border-border">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Traffic Sources & Referrers
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {topReferrers.map((ref, idx) => (
                      <div
                        key={idx}
                        className="px-2.5 py-1.5 rounded-md bg-secondary/50 border border-border text-xs flex items-center gap-2"
                      >
                        <Globe className="w-3 h-3 text-primary" />
                        <span className="text-foreground font-medium">{ref.source}</span>
                        <span className="text-[10px] font-mono text-muted-foreground px-1.5 py-0.2 bg-background rounded">
                          {ref.count}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Row: Live Real-Time Activity Log */}
            <div className="bg-card border border-border rounded-xl overflow-hidden shadow-xs space-y-0">
              <div className="p-6 border-b border-border flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    <h3 className="font-serif text-base font-normal text-foreground">
                      Live Real-Time Activity Feed
                    </h3>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Chronological stream of incoming pageviews across devices
                  </p>
                </div>
                <Badge variant="outline" className="text-[11px] font-mono w-fit">
                  Showing latest {visits.slice(0, 30).length} hits
                </Badge>
              </div>

              {visitsLoading ? (
                <div className="py-16 text-center text-xs text-muted-foreground font-mono animate-pulse">
                  Loading telemetry records from Firestore...
                </div>
              ) : visits.length === 0 ? (
                <div className="py-16 text-center space-y-3 p-6">
                  <Activity className="w-8 h-8 text-muted-foreground mx-auto" />
                  <h4 className="font-serif text-base text-foreground">No Visitor Hits Recorded Yet</h4>
                  <p className="text-xs text-muted-foreground max-w-md mx-auto">
                    The tracker is active on all public pages. Once prospective clients visit your site, their activity will stream in here live. You can also click &quot;Simulate Traffic&quot; above to generate test hits.
                  </p>
                  <Button
                    onClick={handleSimulateVisits}
                    size="sm"
                    className="text-xs uppercase tracking-wider"
                  >
                    Simulate Sample Traffic
                  </Button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-secondary/40 text-[10px] uppercase font-mono tracking-wider text-muted-foreground border-b border-border">
                      <tr>
                        <th className="py-3 px-5">Time</th>
                        <th className="py-3 px-5">Page Visited</th>
                        <th className="py-3 px-5">Device</th>
                        <th className="py-3 px-5">Browser & OS</th>
                        <th className="py-3 px-5">Source</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border/60">
                      {visits.slice(0, 30).map((v, i) => (
                        <tr key={v.id || i} className="hover:bg-secondary/20 transition-colors">
                          <td className="py-3.5 px-5 font-mono text-[11px] text-muted-foreground whitespace-nowrap">
                            {formatVisitTime(v.createdAt)}
                          </td>
                          <td className="py-3.5 px-5">
                            <span className="font-mono px-2 py-0.5 rounded bg-secondary text-foreground text-[11px]">
                              {v.path}
                            </span>
                          </td>
                          <td className="py-3.5 px-5">
                            <span className="flex items-center gap-1.5 text-foreground">
                              {v.device === "Mobile" ? (
                                <Smartphone className="w-3.5 h-3.5 text-primary" />
                              ) : v.device === "Tablet" ? (
                                <Tablet className="w-3.5 h-3.5 text-amber-500" />
                              ) : (
                                <Monitor className="w-3.5 h-3.5 text-blue-500" />
                              )}
                              <span>{v.device}</span>
                            </span>
                          </td>
                          <td className="py-3.5 px-5 text-muted-foreground whitespace-nowrap">
                            <span className="text-foreground font-medium">{v.browser}</span>
                            <span className="mx-1">•</span>
                            <span>{v.os}</span>
                          </td>
                          <td className="py-3.5 px-5">
                            <span className="px-2 py-0.5 rounded text-[10px] bg-secondary/80 text-foreground font-mono">
                              {v.referrer}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* ADD PROJECT MODAL */}
      {/* ==================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-xl w-full max-w-xl p-6 sm:p-8 space-y-6 shadow-xl my-8">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#B86F55]">
                  Portfolio Upload
                </span>
                <h3 className="font-serif text-xl font-normal text-foreground">
                  Add New Architectural Project
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProject} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Project Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Tenkasi Courtyard Villa"
                  value={newProject.title}
                  onChange={(e) => setNewProject({ ...newProject, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Category</label>
                  <select
                    value={newProject.category}
                    onChange={(e) => setNewProject({ ...newProject, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value="Residential Villa">Residential Villa</option>
                    <option value="Courtyard Sanctuary">Courtyard Sanctuary</option>
                    <option value="Contemporary Indian">Contemporary Indian</option>
                    <option value="Turnkey Construction">Turnkey Construction</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Location</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Pandiyapuram, Tenkasi"
                    value={newProject.location}
                    onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Built-up Area</label>
                  <input
                    type="text"
                    placeholder="e.g. 3,200 sq.ft"
                    value={newProject.area}
                    onChange={(e) => setNewProject({ ...newProject, area: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Timeline</label>
                  <input
                    type="text"
                    placeholder="e.g. 12 Months"
                    value={newProject.timeline}
                    onChange={(e) => setNewProject({ ...newProject, timeline: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              {/* Image Upload via Base64 or URL */}
              <div className="space-y-3 p-4 bg-secondary/30 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-primary" />
                    <span>Project Image (Upload directly as Base64)</span>
                  </label>
                  {imageBase64 && (
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                      Base64 Ready • {imageFileSize}
                    </Badge>
                  )}
                </div>

                {/* Live Preview if an image is selected */}
                {(imageBase64 || newProject.imageUrl) && (
                  <div className="relative aspect-[16/9] w-full rounded-md overflow-hidden border border-border bg-black/20 group">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={imageBase64 || newProject.imageUrl}
                      alt="Project Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleClearImage}
                        className="h-7 px-2 text-[11px] bg-background/80 text-destructive border-destructive/40 hover:bg-destructive/10"
                      >
                        <Trash2 className="w-3 h-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    disabled={convertingImage}
                    onChange={handleImageFileChange}
                    className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                  />
                  {convertingImage && (
                    <p className="text-[11px] text-primary animate-pulse">
                      Optimizing and converting image to Base64...
                    </p>
                  )}
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2 pt-1 border-t border-border/50">
                    <span className="shrink-0">or Image URL:</span>
                    <input
                      type="text"
                      placeholder="https://... or /images/hero/hero-villa.jpg"
                      value={newProject.imageUrl.startsWith("data:") ? "" : newProject.imageUrl}
                      onChange={(e) => {
                        setImageBase64("");
                        setImageFileSize("");
                        setNewProject({ ...newProject, imageUrl: e.target.value });
                      }}
                      className="flex-1 px-2.5 py-1 text-xs bg-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Short Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Describe the architectural design, spatial planning, and vernacular elements..."
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Key Features (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nadumuttam Courtyard, Teak Joinery, Athangudi Tiles"
                  value={newProject.keyFeatures}
                  onChange={(e) => setNewProject({ ...newProject, keyFeatures: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submittingProject || convertingImage}
                  className="text-xs h-9 uppercase tracking-wider"
                >
                  {convertingImage
                    ? "Converting Image..."
                    : submittingProject
                    ? "Saving Project..."
                    : "Publish Project"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
