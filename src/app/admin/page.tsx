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
  type Lead,
  type ProjectItem,
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
} from "lucide-react";
import Image from "next/image";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logout, isMock } = useAuth();

  const [activeTab, setActiveTab] = React.useState<"leads" | "projects">("leads");

  // Leads State
  const [leads, setLeads] = React.useState<Lead[]>([]);
  const [leadsLoading, setLeadsLoading] = React.useState(true);
  const [leadFilter, setLeadFilter] = React.useState<string>("all");
  const [searchQuery, setSearchQuery] = React.useState("");

  // Projects State
  const [projects, setProjects] = React.useState<ProjectItem[]>([]);
  const [projectsLoading, setProjectsLoading] = React.useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);

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

  React.useEffect(() => {
    if (user) {
      loadLeads();
      loadProjects();
    }
  }, [user, loadLeads, loadProjects]);

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
