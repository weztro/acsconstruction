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
  fetchProjectTypesFromFirestore,
  saveProjectTypeToFirestore,
  updateProjectTypeInFirestore,
  deleteProjectTypeFromFirestore,
  fetchBudgetRangesFromFirestore,
  saveBudgetRangeToFirestore,
  updateBudgetRangeInFirestore,
  deleteBudgetRangeFromFirestore,
  fetchEngineersFromFirestore,
  saveEngineerToFirestore,
  updateEngineerInFirestore,
  deleteEngineerFromFirestore,
  fetchTestimonialsFromFirestore,
  saveTestimonialToFirestore,
  updateTestimonialInFirestore,
  deleteTestimonialFromFirestore,
  fetchHiddenDefaults,
  saveHiddenDefaults,
  type HiddenDefaultsConfig,
  type Lead,
  type ProjectItem,
  type SiteVisit,
  type DynamicProjectType,
  type DynamicBudgetRange,
  type EngineerMesthri,
  type DynamicTestimonial,
} from "@/lib/firebase";
import { INDIAN_DESIGN_STYLES, BUDGET_RANGES, TESTIMONIALS } from "@/lib/constants";
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
  HardHat,
  Settings,
  DollarSign,
  Palette,
  Award,
  Layers,
  Pencil,
  RotateCcw,
  Check,
  X,
  Quote,
  Star,
  MessageSquareQuote,
} from "lucide-react";
import Image from "next/image";
import { PackagesManager } from "@/components/admin/PackagesManager";
import { HeroMetricsManager } from "@/components/admin/HeroMetricsManager";
import { ServicesManager } from "@/components/admin/ServicesManager";

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

  const [activeTab, setActiveTab] = React.useState<"leads" | "projects" | "visitors" | "config">("leads");

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

  // Studio Master Config State (Packages, Hero Metrics, Services, Budgets, Project Types, Mesthris & Testimonials)
  const [configSubTab, setConfigSubTab] = React.useState<
    "packages" | "hero_metrics" | "services" | "styles" | "budgets" | "engineers" | "testimonials"
  >("packages");
  const [dynamicProjectTypes, setDynamicProjectTypes] = React.useState<DynamicProjectType[]>([]);
  const [dynamicBudgets, setDynamicBudgets] = React.useState<DynamicBudgetRange[]>([]);
  const [dynamicEngineers, setDynamicEngineers] = React.useState<EngineerMesthri[]>([]);
  const [dynamicTestimonials, setDynamicTestimonials] = React.useState<DynamicTestimonial[]>([]);
  const [configLoading, setConfigLoading] = React.useState(false);

  // New Project Type Modal & Form
  const [isAddTypeModalOpen, setIsAddTypeModalOpen] = React.useState(false);
  const [newType, setNewType] = React.useState({
    title: "",
    tagline: "",
    description: "",
    imageUrl: "",
    keyElements: "Nadumuttam Courtyard, Clay Roof Tiles, Timber Posts",
  });
  const [typeImageBase64, setTypeImageBase64] = React.useState("");
  const [convertingTypeImage, setConvertingTypeImage] = React.useState(false);
  const [typeImageSize, setTypeImageSize] = React.useState("");
  const [submittingType, setSubmittingType] = React.useState(false);
  const typeFileInputRef = React.useRef<HTMLInputElement | null>(null);

  // New Budget Form
  const [newBudgetInput, setNewBudgetInput] = React.useState("");
  const [submittingBudget, setSubmittingBudget] = React.useState(false);

  // New Engineer / Mesthri Modal & Form
  const [isAddEngModalOpen, setIsAddEngModalOpen] = React.useState(false);
  const [newEngineer, setNewEngineer] = React.useState({
    name: "",
    role: "Senior Head Mesthri (Masonry)",
    experience: "20+ Years in Tenkasi",
    specialization: "Traditional Brick Bonding, Courtyard Roof Framing",
    bio: "Generational craftsmanship supervisor ensuring structural perfection.",
    phone: "+91 94869 43652",
    imageUrl: "",
  });
  const [engImageBase64, setEngImageBase64] = React.useState("");
  const [convertingEngImage, setConvertingEngImage] = React.useState(false);
  const [engImageSize, setEngImageSize] = React.useState("");
  const [submittingEng, setSubmittingEng] = React.useState(false);
  const engFileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Studio Settings: Hidden Defaults State
  const [hiddenDefaults, setHiddenDefaults] = React.useState<HiddenDefaultsConfig>({
    hiddenStyles: [],
    hiddenBudgets: [],
    hiddenEngineers: [],
    hiddenTestimonials: [],
  });

  // Edit Project Type Modal State
  const [isEditTypeModalOpen, setIsEditTypeModalOpen] = React.useState(false);
  const [editingType, setEditingType] = React.useState<{
    id?: string;
    title: string;
    tagline: string;
    description: string;
    imageUrl: string;
    keyElements: string;
    isDefault?: boolean;
    defaultId?: string;
  } | null>(null);
  const [editTypeImageBase64, setEditTypeImageBase64] = React.useState("");
  const [convertingEditTypeImage, setConvertingEditTypeImage] = React.useState(false);
  const [editTypeImageSize, setEditTypeImageSize] = React.useState("");
  const [submittingEditType, setSubmittingEditType] = React.useState(false);
  const editTypeFileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Edit Budget Modal State
  const [isEditBudgetModalOpen, setIsEditBudgetModalOpen] = React.useState(false);
  const [editingBudget, setEditingBudget] = React.useState<{
    id?: string;
    range: string;
    isDefault?: boolean;
    defaultRange?: string;
  } | null>(null);
  const [submittingEditBudget, setSubmittingEditBudget] = React.useState(false);

  // Edit Engineer / Mesthri Modal State
  const [isEditEngModalOpen, setIsEditEngModalOpen] = React.useState(false);
  const [editingEngineer, setEditingEngineer] = React.useState<{
    id?: string;
    name: string;
    role: string;
    experience: string;
    specialization: string;
    bio: string;
    phone: string;
    imageUrl: string;
    isDefault?: boolean;
    defaultName?: string;
  } | null>(null);
  const [editEngImageBase64, setEditEngImageBase64] = React.useState("");
  const [convertingEditEngImage, setConvertingEditEngImage] = React.useState(false);
  const [editEngImageSize, setEditEngImageSize] = React.useState("");
  const [submittingEditEng, setSubmittingEditEng] = React.useState(false);
  const editEngFileInputRef = React.useRef<HTMLInputElement | null>(null);

  // New Customer Feedback / Testimonial Modal & Form
  const [isAddTestModalOpen, setIsAddTestModalOpen] = React.useState(false);
  const [newTestimonial, setNewTestimonial] = React.useState({
    clientName: "",
    homeType: "Courtyard Heritage Villa (5,400 sq.ft.)",
    city: "Tenkasi, Tamil Nadu",
    year: "2025",
    quote: "",
    rating: 5,
    avatarUrl: "",
  });
  const [testImageBase64, setTestImageBase64] = React.useState("");
  const [convertingTestImage, setConvertingTestImage] = React.useState(false);
  const [testImageSize, setTestImageSize] = React.useState("");
  const [submittingTestimonial, setSubmittingTestimonial] = React.useState(false);
  const testFileInputRef = React.useRef<HTMLInputElement | null>(null);

  // Edit Testimonial Modal State
  const [isEditTestModalOpen, setIsEditTestModalOpen] = React.useState(false);
  const [editingTestimonial, setEditingTestimonial] = React.useState<{
    id?: string;
    clientName: string;
    homeType: string;
    city: string;
    year: string;
    quote: string;
    rating: number;
    avatarUrl: string;
    isDefault?: boolean;
    defaultId?: string;
  } | null>(null);
  const [editTestImageBase64, setEditTestImageBase64] = React.useState("");
  const [convertingEditTestImage, setConvertingEditTestImage] = React.useState(false);
  const [editTestImageSize, setEditTestImageSize] = React.useState("");
  const [submittingEditTest, setSubmittingEditTest] = React.useState(false);
  const editTestFileInputRef = React.useRef<HTMLInputElement | null>(null);

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

  // Load Studio Master Configuration (Types, Budgets, Engineers & Testimonials)
  const loadConfigData = React.useCallback(async () => {
    setConfigLoading(true);
    try {
      const [types, budgets, engs, tests, hidden] = await Promise.all([
        fetchProjectTypesFromFirestore(),
        fetchBudgetRangesFromFirestore(),
        fetchEngineersFromFirestore(),
        fetchTestimonialsFromFirestore(),
        fetchHiddenDefaults(),
      ]);
      setDynamicProjectTypes(types);
      setDynamicBudgets(budgets);
      setDynamicEngineers(engs);
      setDynamicTestimonials(tests);
      setHiddenDefaults(hidden);
    } catch (err) {
      console.warn("Error loading config data:", err);
    } finally {
      setConfigLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (user) {
      loadLeads();
      loadProjects();
      loadVisits();
      loadConfigData();
    }
  }, [user, loadLeads, loadProjects, loadVisits, loadConfigData]);

  // Handlers for Project Types
  const handleCreateProjectType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newType.title.trim()) return;
    setSubmittingType(true);
    const elements = newType.keyElements
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const res = await saveProjectTypeToFirestore({
      title: newType.title.trim(),
      tagline: newType.tagline.trim() || "Vernacular Architectural Style",
      description: newType.description.trim(),
      imageUrl: typeImageBase64 || newType.imageUrl || "/images/architecture/traditional-heritage.jpg",
      keyElements: elements,
    });
    setSubmittingType(false);
    if (res.success) {
      setIsAddTypeModalOpen(false);
      setNewType({
        title: "",
        tagline: "",
        description: "",
        imageUrl: "",
        keyElements: "Nadumuttam Courtyard, Clay Roof Tiles, Timber Posts",
      });
      setTypeImageBase64("");
      setTypeImageSize("");
      if (typeFileInputRef.current) {
        typeFileInputRef.current.value = "";
      }
      loadConfigData();
    } else {
      alert("Failed to save architectural style. Check Firestore connection.");
    }
  };

  const handleDeleteProjectType = async (id: string) => {
    if (window.confirm("Remove this custom architectural style?")) {
      await deleteProjectTypeFromFirestore(id);
      loadConfigData();
    }
  };

  // Handlers for Budgets
  const handleCreateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBudgetInput.trim()) return;
    setSubmittingBudget(true);
    const res = await saveBudgetRangeToFirestore(newBudgetInput.trim());
    setSubmittingBudget(false);
    if (res.success) {
      setNewBudgetInput("");
      loadConfigData();
    } else {
      alert("Failed to save budget range.");
    }
  };

  const handleDeleteBudget = async (id: string) => {
    if (window.confirm("Remove this budget range?")) {
      await deleteBudgetRangeFromFirestore(id);
      loadConfigData();
    }
  };

  // Handlers for Engineers / Mesthris
  const handleCreateEngineer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEngineer.name.trim()) return;
    setSubmittingEng(true);
    const res = await saveEngineerToFirestore({
      name: newEngineer.name.trim(),
      role: newEngineer.role.trim(),
      experience: newEngineer.experience.trim(),
      specialization: newEngineer.specialization.trim(),
      bio: newEngineer.bio.trim(),
      phone: newEngineer.phone.trim(),
      imageUrl: engImageBase64 || newEngineer.imageUrl || "",
    });
    setSubmittingEng(false);
    if (res.success) {
      setIsAddEngModalOpen(false);
      setNewEngineer({
        name: "",
        role: "Senior Head Mesthri (Masonry)",
        experience: "20+ Years in Tenkasi",
        specialization: "Traditional Brick Bonding, Courtyard Roof Framing",
        bio: "Generational craftsmanship supervisor ensuring structural perfection.",
        phone: "+91 94869 43652",
        imageUrl: "",
      });
      setEngImageBase64("");
      setEngImageSize("");
      if (engFileInputRef.current) {
        engFileInputRef.current.value = "";
      }
      loadConfigData();
    } else {
      alert("Failed to save engineer / mesthri.");
    }
  };

  const handleDeleteEngineer = async (id: string) => {
    if (window.confirm("Remove this engineer / mesthri?")) {
      await deleteEngineerFromFirestore(id);
      loadConfigData();
    }
  };

  // Style Image File Handler (PNG, JPEG, WebP, etc. -> Base64)
  const handleTypeImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setConvertingTypeImage(true);
      const b64 = await fileToBase64(file, 1200, 0.82);
      setTypeImageBase64(b64);
      const fmt = file.type ? file.type.replace("image/", "").toUpperCase() : "PHOTO";
      const approxKb = Math.round((b64.length * 3) / 4 / 1024);
      setTypeImageSize(`${fmt} • ${approxKb} KB Base64`);
      setNewType((prev) => ({ ...prev, imageUrl: b64 }));
    } catch (err) {
      console.error("Failed to convert style image to Base64:", err);
      alert("Could not process image file. Please try another image.");
    } finally {
      setConvertingTypeImage(false);
    }
  };

  const handleClearTypeImage = () => {
    setTypeImageBase64("");
    setTypeImageSize("");
    setNewType((prev) => ({ ...prev, imageUrl: "" }));
    if (typeFileInputRef.current) {
      typeFileInputRef.current.value = "";
    }
  };

  // Engineer Photo File Handler (PNG, JPEG, WebP, etc. -> Base64)
  const handleEngImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setConvertingEngImage(true);
      const b64 = await fileToBase64(file, 800, 0.82);
      setEngImageBase64(b64);
      const fmt = file.type ? file.type.replace("image/", "").toUpperCase() : "PHOTO";
      const approxKb = Math.round((b64.length * 3) / 4 / 1024);
      setEngImageSize(`${fmt} • ${approxKb} KB Base64`);
      setNewEngineer((prev) => ({ ...prev, imageUrl: b64 }));
    } catch (err) {
      console.error("Failed to convert photo to Base64:", err);
      alert("Could not process photo file.");
    } finally {
      setConvertingEngImage(false);
    }
  };

  const handleClearEngImage = () => {
    setEngImageBase64("");
    setEngImageSize("");
    setNewEngineer((prev) => ({ ...prev, imageUrl: "" }));
    if (engFileInputRef.current) {
      engFileInputRef.current.value = "";
    }
  };

  // ==========================================
  // EDIT & REMOVE HANDLERS FOR STUDIO CONFIG
  // ==========================================

  // --- Project Types / Architectural Styles ---
  const handleOpenEditType = (item: DynamicProjectType) => {
    setEditingType({
      id: item.id,
      title: item.title,
      tagline: item.tagline || "",
      description: item.description || "",
      imageUrl: item.imageUrl || "",
      keyElements: (item.keyElements || []).join(", "),
      isDefault: false,
    });
    setEditTypeImageBase64(item.imageUrl || "");
    setEditTypeImageSize("");
    setIsEditTypeModalOpen(true);
  };

  const handleOpenEditDefaultStyle = (style: (typeof INDIAN_DESIGN_STYLES)[number]) => {
    setEditingType({
      defaultId: style.id,
      title: style.title,
      tagline: style.tagline,
      description: style.description,
      imageUrl: style.imageUrl,
      keyElements: style.keyElements.join(", "),
      isDefault: true,
    });
    setEditTypeImageBase64(style.imageUrl);
    setEditTypeImageSize("");
    setIsEditTypeModalOpen(true);
  };

  const handleUpdateProjectType = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingType || !editingType.title.trim()) return;
    setSubmittingEditType(true);

    const elements = editingType.keyElements
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      title: editingType.title.trim(),
      tagline: editingType.tagline.trim() || "Vernacular Architectural Style",
      description: editingType.description.trim(),
      imageUrl: editTypeImageBase64 || editingType.imageUrl || "/images/architecture/traditional-heritage.jpg",
      keyElements: elements,
    };

    if (editingType.isDefault && editingType.defaultId) {
      const res = await saveProjectTypeToFirestore(payload);
      if (res.success) {
        const newHidden = Array.from(new Set([...hiddenDefaults.hiddenStyles, editingType.defaultId]));
        await saveHiddenDefaults({ hiddenStyles: newHidden });
        setIsEditTypeModalOpen(false);
        setEditingType(null);
        setEditTypeImageBase64("");
        loadConfigData();
      } else {
        alert("Failed to save customized style.");
      }
    } else if (editingType.id) {
      const ok = await updateProjectTypeInFirestore(editingType.id, payload);
      if (ok) {
        setIsEditTypeModalOpen(false);
        setEditingType(null);
        setEditTypeImageBase64("");
        loadConfigData();
      } else {
        alert("Failed to update style.");
      }
    }
    setSubmittingEditType(false);
  };

  const handleRemoveDefaultStyle = async (styleId: string) => {
    if (window.confirm("Remove this default architectural style from public view? You can restore it anytime.")) {
      const newHidden = Array.from(new Set([...hiddenDefaults.hiddenStyles, styleId]));
      await saveHiddenDefaults({ hiddenStyles: newHidden });
      loadConfigData();
    }
  };

  const handleRestoreDefaultStyles = async () => {
    if (window.confirm("Restore all default architectural styles?")) {
      await saveHiddenDefaults({ hiddenStyles: [] });
      loadConfigData();
    }
  };

  const handleEditTypeImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setConvertingEditTypeImage(true);
      const b64 = await fileToBase64(file, 1200, 0.82);
      setEditTypeImageBase64(b64);
      const fmt = file.type ? file.type.replace("image/", "").toUpperCase() : "PHOTO";
      const approxKb = Math.round((b64.length * 3) / 4 / 1024);
      setEditTypeImageSize(`${fmt} • ${approxKb} KB Base64`);
      setEditingType((prev) => (prev ? { ...prev, imageUrl: b64 } : prev));
    } catch (err) {
      console.error("Failed to convert style image to Base64:", err);
      alert("Could not process image file. Please try another image.");
    } finally {
      setConvertingEditTypeImage(false);
    }
  };

  const handleClearEditTypeImage = () => {
    setEditTypeImageBase64("");
    setEditTypeImageSize("");
    setEditingType((prev) => (prev ? { ...prev, imageUrl: "" } : prev));
    if (editTypeFileInputRef.current) {
      editTypeFileInputRef.current.value = "";
    }
  };

  // --- Budget Ranges ---
  const handleOpenEditBudget = (b: DynamicBudgetRange) => {
    setEditingBudget({
      id: b.id,
      range: b.range,
      isDefault: false,
    });
    setIsEditBudgetModalOpen(true);
  };

  const handleOpenEditDefaultBudget = (range: string) => {
    setEditingBudget({
      range,
      defaultRange: range,
      isDefault: true,
    });
    setIsEditBudgetModalOpen(true);
  };

  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBudget || !editingBudget.range.trim()) return;
    setSubmittingEditBudget(true);

    if (editingBudget.isDefault && editingBudget.defaultRange) {
      const res = await saveBudgetRangeToFirestore(editingBudget.range.trim());
      if (res.success) {
        const newHidden = Array.from(new Set([...hiddenDefaults.hiddenBudgets, editingBudget.defaultRange]));
        await saveHiddenDefaults({ hiddenBudgets: newHidden });
        setIsEditBudgetModalOpen(false);
        setEditingBudget(null);
        loadConfigData();
      } else {
        alert("Failed to save customized budget.");
      }
    } else if (editingBudget.id) {
      const ok = await updateBudgetRangeInFirestore(editingBudget.id, editingBudget.range.trim());
      if (ok) {
        setIsEditBudgetModalOpen(false);
        setEditingBudget(null);
        loadConfigData();
      } else {
        alert("Failed to update budget range.");
      }
    }
    setSubmittingEditBudget(false);
  };

  const handleRemoveDefaultBudget = async (range: string) => {
    if (window.confirm(`Remove budget bracket "${range}" from the consultation dropdown? You can restore it anytime.`)) {
      const newHidden = Array.from(new Set([...hiddenDefaults.hiddenBudgets, range]));
      await saveHiddenDefaults({ hiddenBudgets: newHidden });
      loadConfigData();
    }
  };

  const handleRestoreDefaultBudgets = async () => {
    if (window.confirm("Restore all default budget brackets?")) {
      await saveHiddenDefaults({ hiddenBudgets: [] });
      loadConfigData();
    }
  };

  // --- Engineers & Chief Mesthris ---
  const handleOpenEditEngineer = (eng: EngineerMesthri) => {
    setEditingEngineer({
      id: eng.id,
      name: eng.name,
      role: eng.role,
      experience: eng.experience,
      specialization: eng.specialization,
      bio: eng.bio || "",
      phone: eng.phone || "",
      imageUrl: eng.imageUrl || "",
      isDefault: false,
    });
    setEditEngImageBase64(eng.imageUrl || "");
    setEditEngImageSize("");
    setIsEditEngModalOpen(true);
  };

  const handleOpenEditDefaultLeader = (leader: {
    name: string;
    role: string;
    experience: string;
    specialization: string;
    bio: string;
    phone?: string;
    imageUrl?: string;
  }) => {
    setEditingEngineer({
      defaultName: leader.name,
      name: leader.name,
      role: leader.role,
      experience: leader.experience,
      specialization: leader.specialization,
      bio: leader.bio,
      phone: leader.phone || "+91 94869 43652",
      imageUrl: leader.imageUrl || "",
      isDefault: true,
    });
    setEditEngImageBase64(leader.imageUrl || "");
    setEditEngImageSize("");
    setIsEditEngModalOpen(true);
  };

  const handleUpdateEngineer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEngineer || !editingEngineer.name.trim()) return;
    setSubmittingEditEng(true);

    const payload = {
      name: editingEngineer.name.trim(),
      role: editingEngineer.role.trim(),
      experience: editingEngineer.experience.trim(),
      specialization: editingEngineer.specialization.trim(),
      bio: editingEngineer.bio.trim(),
      phone: editingEngineer.phone.trim(),
      imageUrl: editEngImageBase64 || editingEngineer.imageUrl || "",
    };

    if (editingEngineer.isDefault && editingEngineer.defaultName) {
      const res = await saveEngineerToFirestore(payload);
      if (res.success) {
        const newHidden = Array.from(new Set([...hiddenDefaults.hiddenEngineers, editingEngineer.defaultName]));
        await saveHiddenDefaults({ hiddenEngineers: newHidden });
        setIsEditEngModalOpen(false);
        setEditingEngineer(null);
        setEditEngImageBase64("");
        loadConfigData();
      } else {
        alert("Failed to save customized profile.");
      }
    } else if (editingEngineer.id) {
      const ok = await updateEngineerInFirestore(editingEngineer.id, payload);
      if (ok) {
        setIsEditEngModalOpen(false);
        setEditingEngineer(null);
        setEditEngImageBase64("");
        loadConfigData();
      } else {
        alert("Failed to update engineer / mesthri.");
      }
    }
    setSubmittingEditEng(false);
  };

  const handleRemoveDefaultEngineer = async (leaderName: string) => {
    if (window.confirm(`Remove "${leaderName}" from the team showcase? You can restore them anytime.`)) {
      const newHidden = Array.from(new Set([...hiddenDefaults.hiddenEngineers, leaderName]));
      await saveHiddenDefaults({ hiddenEngineers: newHidden });
      loadConfigData();
    }
  };

  const handleRestoreDefaultEngineers = async () => {
    if (window.confirm("Restore all default team leadership members?")) {
      await saveHiddenDefaults({ hiddenEngineers: [] });
      loadConfigData();
    }
  };

  const handleEditEngImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setConvertingEditEngImage(true);
      const b64 = await fileToBase64(file, 800, 0.82);
      setEditEngImageBase64(b64);
      const fmt = file.type ? file.type.replace("image/", "").toUpperCase() : "PHOTO";
      const approxKb = Math.round((b64.length * 3) / 4 / 1024);
      setEditEngImageSize(`${fmt} • ${approxKb} KB Base64`);
      setEditingEngineer((prev) => (prev ? { ...prev, imageUrl: b64 } : prev));
    } catch (err) {
      console.error("Failed to convert engineer photo to Base64:", err);
      alert("Could not process photo file.");
    } finally {
      setConvertingEditEngImage(false);
    }
  };

  const handleClearEditEngImage = () => {
    setEditEngImageBase64("");
    setEditEngImageSize("");
    setEditingEngineer((prev) => (prev ? { ...prev, imageUrl: "" } : prev));
    if (editEngFileInputRef.current) {
      editEngFileInputRef.current.value = "";
    }
  };

  // ----------------------------------------------------
  // Handlers for Customer Feedback / Testimonials ("What Families Say")
  // ----------------------------------------------------
  const handleCreateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTestimonial.clientName.trim() || !newTestimonial.quote.trim()) return;
    setSubmittingTestimonial(true);

    const res = await saveTestimonialToFirestore({
      clientName: newTestimonial.clientName.trim(),
      homeType: newTestimonial.homeType.trim() || "Residential Villa",
      city: newTestimonial.city.trim() || "Tenkasi, Tamil Nadu",
      year: newTestimonial.year.trim() || new Date().getFullYear().toString(),
      quote: newTestimonial.quote.trim(),
      rating: newTestimonial.rating || 5,
      avatarUrl: testImageBase64 || newTestimonial.avatarUrl || "",
    });

    setSubmittingTestimonial(false);
    if (res.success) {
      setIsAddTestModalOpen(false);
      setNewTestimonial({
        clientName: "",
        homeType: "Courtyard Heritage Villa (5,400 sq.ft.)",
        city: "Tenkasi, Tamil Nadu",
        year: new Date().getFullYear().toString(),
        quote: "",
        rating: 5,
        avatarUrl: "",
      });
      setTestImageBase64("");
      setTestImageSize("");
      if (testFileInputRef.current) {
        testFileInputRef.current.value = "";
      }
      loadConfigData();
    } else {
      alert("Failed to save customer review to Firestore.");
    }
  };

  const handleDeleteTestimonial = async (id: string) => {
    if (window.confirm("Permanently delete this customer review from Firebase?")) {
      const ok = await deleteTestimonialFromFirestore(id);
      if (ok) {
        loadConfigData();
      } else {
        alert("Failed to delete review.");
      }
    }
  };

  const handleRemoveDefaultTestimonial = async (clientNameOrKey: string) => {
    if (window.confirm(`Remove review by "${clientNameOrKey}" from public view? You can restore it anytime.`)) {
      const current = hiddenDefaults.hiddenTestimonials || [];
      const newHidden = Array.from(new Set([...current, clientNameOrKey]));
      await saveHiddenDefaults({ hiddenTestimonials: newHidden });
      loadConfigData();
    }
  };

  const handleRestoreDefaultTestimonials = async () => {
    if (window.confirm("Restore all default homeowner reviews?")) {
      await saveHiddenDefaults({ hiddenTestimonials: [] });
      loadConfigData();
    }
  };

  const handleOpenEditTestimonial = (item: DynamicTestimonial) => {
    setEditingTestimonial({
      id: item.id,
      clientName: item.clientName,
      homeType: item.homeType,
      city: item.city,
      year: item.year,
      quote: item.quote,
      rating: item.rating ?? 5,
      avatarUrl: item.avatarUrl || "",
      isDefault: false,
    });
    setEditTestImageBase64(item.avatarUrl || "");
    setEditTestImageSize("");
    setIsEditTestModalOpen(true);
  };

  const handleOpenEditDefaultTestimonial = (item: {
    clientName: string;
    homeType: string;
    city: string;
    year: string;
    quote: string;
  }) => {
    setEditingTestimonial({
      defaultId: item.clientName,
      clientName: item.clientName,
      homeType: item.homeType,
      city: item.city,
      year: item.year,
      quote: item.quote,
      rating: 5,
      avatarUrl: "",
      isDefault: true,
    });
    setEditTestImageBase64("");
    setEditTestImageSize("");
    setIsEditTestModalOpen(true);
  };

  const handleUpdateTestimonial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTestimonial || !editingTestimonial.clientName.trim() || !editingTestimonial.quote.trim()) return;
    setSubmittingEditTest(true);

    const payload = {
      clientName: editingTestimonial.clientName.trim(),
      homeType: editingTestimonial.homeType.trim(),
      city: editingTestimonial.city.trim(),
      year: editingTestimonial.year.trim() || new Date().getFullYear().toString(),
      quote: editingTestimonial.quote.trim(),
      rating: editingTestimonial.rating || 5,
      avatarUrl: editTestImageBase64 || editingTestimonial.avatarUrl || "",
    };

    if (editingTestimonial.isDefault && editingTestimonial.defaultId) {
      const res = await saveTestimonialToFirestore(payload);
      if (res.success) {
        const current = hiddenDefaults.hiddenTestimonials || [];
        const newHidden = Array.from(new Set([...current, editingTestimonial.defaultId]));
        await saveHiddenDefaults({ hiddenTestimonials: newHidden });
        setIsEditTestModalOpen(false);
        setEditingTestimonial(null);
        setEditTestImageBase64("");
        loadConfigData();
      } else {
        alert("Failed to save customized review.");
      }
    } else if (editingTestimonial.id) {
      const ok = await updateTestimonialInFirestore(editingTestimonial.id, payload);
      if (ok) {
        setIsEditTestModalOpen(false);
        setEditingTestimonial(null);
        setEditTestImageBase64("");
        loadConfigData();
      } else {
        alert("Failed to update review.");
      }
    }
    setSubmittingEditTest(false);
  };

  // Image Upload Handlers for Testimonials (Base64)
  const handleTestImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setConvertingTestImage(true);
      const b64 = await fileToBase64(file, 600, 0.85);
      setTestImageBase64(b64);
      const fmt = file.type ? file.type.replace("image/", "").toUpperCase() : "PHOTO";
      const approxKb = Math.round((b64.length * 3) / 4 / 1024);
      setTestImageSize(`${fmt} • ${approxKb} KB Base64`);
      setNewTestimonial((prev) => ({ ...prev, avatarUrl: b64 }));
    } catch (err) {
      console.error("Failed to convert image to Base64:", err);
      alert("Could not process photo file.");
    } finally {
      setConvertingTestImage(false);
    }
  };

  const handleClearTestImage = () => {
    setTestImageBase64("");
    setTestImageSize("");
    setNewTestimonial((prev) => ({ ...prev, avatarUrl: "" }));
    if (testFileInputRef.current) {
      testFileInputRef.current.value = "";
    }
  };

  const handleEditTestImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      setConvertingEditTestImage(true);
      const b64 = await fileToBase64(file, 600, 0.85);
      setEditTestImageBase64(b64);
      const fmt = file.type ? file.type.replace("image/", "").toUpperCase() : "PHOTO";
      const approxKb = Math.round((b64.length * 3) / 4 / 1024);
      setEditTestImageSize(`${fmt} • ${approxKb} KB Base64`);
      setEditingTestimonial((prev) => (prev ? { ...prev, avatarUrl: b64 } : prev));
    } catch (err) {
      console.error("Failed to convert photo to Base64:", err);
      alert("Could not process photo file.");
    } finally {
      setConvertingEditTestImage(false);
    }
  };

  const handleClearEditTestImage = () => {
    setEditTestImageBase64("");
    setEditTestImageSize("");
    setEditingTestimonial((prev) => (prev ? { ...prev, avatarUrl: "" } : prev));
    if (editTestFileInputRef.current) {
      editTestFileInputRef.current.value = "";
    }
  };

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

  // Handle Image selection & Base64 conversion (PNG, JPEG, WebP, etc. -> Base64)
  const handleImageFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setConvertingImage(true);
      const b64 = await fileToBase64(file, 1200, 0.82);
      setImageBase64(b64);
      const fmt = file.type ? file.type.replace("image/", "").toUpperCase() : "PHOTO";
      const approxKb = Math.round((b64.length * 3) / 4 / 1024);
      setImageFileSize(`${fmt} • ${approxKb} KB Base64`);
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
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
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

          <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-between sm:justify-start">
            <Button asChild variant="outline" size="sm" className="h-8 text-xs flex-1 sm:flex-none">
              <a href="/" target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5">
                <span>View Live Site</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => logout()}
              className="h-8 text-xs text-muted-foreground hover:text-destructive flex-1 sm:flex-none justify-center"
            >
              <LogOut className="w-3.5 h-3.5 mr-1" />
              <span>Sign Out</span>
            </Button>
          </div>
        </div>

        {/* Navigation Tabs (Mobile Responsive & Swipeable) */}
        <div className="border-t border-border/50 overflow-x-auto scrollbar-none">
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex gap-3 sm:gap-8 text-xs font-medium whitespace-nowrap min-w-max">
            <button
              onClick={() => setActiveTab("leads")}
              className={`py-3 sm:py-3.5 flex items-center gap-1.5 sm:gap-2 border-b-2 transition-colors shrink-0 ${
                activeTab === "leads"
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Users className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Client Inquiries &amp; Leads</span>
              <span className="ml-0.5 sm:ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-secondary text-foreground font-mono">
                {leads.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("projects")}
              className={`py-3 sm:py-3.5 flex items-center gap-1.5 sm:gap-2 border-b-2 transition-colors shrink-0 ${
                activeTab === "projects"
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <FolderKanban className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>Projects &amp; Gallery</span>
              <span className="ml-0.5 sm:ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-secondary text-foreground font-mono">
                {projects.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab("visitors")}
              className={`py-3 sm:py-3.5 flex items-center gap-1.5 sm:gap-2 border-b-2 transition-colors shrink-0 ${
                activeTab === "visitors"
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Activity className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Site Visitors</span>
              <span className="ml-0.5 sm:ml-1 px-1.5 py-0.2 rounded-full text-[10px] bg-secondary text-foreground font-mono">
                {visits.length}
              </span>
              <span className="relative flex h-2 w-2 ml-0.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </button>

            <button
              onClick={() => setActiveTab("config")}
              className={`py-3 sm:py-3.5 flex items-center gap-1.5 sm:gap-2 border-b-2 transition-colors shrink-0 ${
                activeTab === "config"
                  ? "border-primary text-primary font-semibold"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Settings className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#B86F55]" />
              <span>Studio Dynamic Config</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-5 sm:py-8">
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="font-serif text-xl font-normal text-foreground">
                  Architectural Portfolio &amp; Projects
                </h2>
                <p className="text-xs text-muted-foreground">
                  Add completed homes and villa projects to show on your website.
                </p>
              </div>

              <Button
                onClick={() => setIsAddModalOpen(true)}
                className="text-xs tracking-wider uppercase font-medium flex items-center justify-center gap-1.5 w-full sm:w-auto"
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

        {/* ==================================================== */}
        {/* STUDIO CONFIGURATION TAB CONTENT */}
        {/* ==================================================== */}
        {activeTab === "config" && (
          <div className="space-y-8">
            {/* Header */}
            <div className="p-4 sm:p-6 bg-card border border-border rounded-xl shadow-xs space-y-4">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B86F55] font-mono">
                  Master Data &amp; Dynamic Settings
                </span>
                <h2 className="font-serif text-xl sm:text-2xl font-normal text-foreground mt-0.5">
                  Studio Dynamic Configuration
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Configure packages &amp; pricing, hero trust metrics, services, architectural styles, budget brackets, team, and homeowner reviews. Stored in Firebase Firestore and reflected across the live frontend.
                </p>
              </div>

              {/* Sub-Tabs Selector (Horizontally Swipeable on Mobile) */}
              <div className="w-full overflow-x-auto scrollbar-none pb-1">
                <div className="flex items-center gap-1.5 p-1 bg-secondary/60 border border-border rounded-lg w-max min-w-full">
                  <button
                    type="button"
                    onClick={() => setConfigSubTab("packages")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                      configSubTab === "packages"
                        ? "bg-card text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Layers className="w-3.5 h-3.5 inline mr-1 text-[#B86F55]" />
                    Packages &amp; Pricing
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfigSubTab("hero_metrics")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                      configSubTab === "hero_metrics"
                        ? "bg-card text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <TrendingUp className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
                    Hero Trust Metrics
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfigSubTab("services")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                      configSubTab === "services"
                        ? "bg-card text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <HardHat className="w-3.5 h-3.5 inline mr-1 text-primary" />
                    Services &amp; Practices
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfigSubTab("styles")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                      configSubTab === "styles"
                        ? "bg-card text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Palette className="w-3.5 h-3.5 inline mr-1 text-[#B86F55]" />
                    Project Types ({dynamicProjectTypes.length + INDIAN_DESIGN_STYLES.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfigSubTab("budgets")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                      configSubTab === "budgets"
                        ? "bg-card text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <DollarSign className="w-3.5 h-3.5 inline mr-1 text-emerald-600" />
                    Budgets ({dynamicBudgets.length + BUDGET_RANGES.length})
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfigSubTab("engineers")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                      configSubTab === "engineers"
                        ? "bg-card text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <HardHat className="w-3.5 h-3.5 inline mr-1 text-primary" />
                    Engineers &amp; Mesthris ({dynamicEngineers.length + 3})
                  </button>

                  <button
                    type="button"
                    onClick={() => setConfigSubTab("testimonials")}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium whitespace-nowrap shrink-0 transition-all ${
                      configSubTab === "testimonials"
                        ? "bg-card text-foreground shadow-xs font-semibold"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <MessageSquareQuote className="w-3.5 h-3.5 inline mr-1 text-amber-600" />
                    What Families Say ({dynamicTestimonials.length + TESTIMONIALS.length})
                  </button>
                </div>
              </div>
            </div>

            {/* SUBTAB 0A: PACKAGES & PRICING PLANS (IMAGE 1 REFERENCE) */}
            {configSubTab === "packages" && <PackagesManager />}

            {/* SUBTAB 0B: HERO TRUST INDICATORS & METRICS (IMAGE 2 REFERENCE) */}
            {configSubTab === "hero_metrics" && <HeroMetricsManager />}

            {/* SUBTAB 0C: DYNAMIC SERVICES & PRACTICES */}
            {configSubTab === "services" && <ServicesManager />}

            {/* SUBTAB 1: PROJECT TYPES / ARCHITECTURAL STYLES */}
            {configSubTab === "styles" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg font-normal text-foreground">
                      Architectural Styles &amp; Project Types
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Styles shown on the Homepage Aesthetic Heritage section and in the Contact Form enquiry dropdown.
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsAddTypeModalOpen(true)}
                    size="sm"
                    className="text-xs uppercase tracking-wider w-full sm:w-auto"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    <span>Add Project Type</span>
                  </Button>
                </div>

                {hiddenDefaults.hiddenStyles.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 bg-secondary/50 border border-border rounded-lg text-xs">
                    <span className="text-muted-foreground">
                      {hiddenDefaults.hiddenStyles.length} default architectural style(s) currently hidden.
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRestoreDefaultStyles}
                      className="text-xs h-7 w-full sm:w-auto"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Restore Default Styles
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Dynamic Types from Firestore */}
                  {dynamicProjectTypes.map((item) => (
                    <div
                      key={item.id}
                      className="bg-card border border-primary/40 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between"
                    >
                      <div>
                        <div className="relative aspect-[16/10] bg-secondary/50 overflow-hidden">
                          {item.imageUrl ? (
                            <Image
                              src={item.imageUrl}
                              alt={item.title}
                              fill
                              unoptimized
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <ImageIcon className="w-8 h-8 opacity-40" />
                            </div>
                          )}
                          <Badge className="absolute top-3 left-3 text-[10px] bg-primary text-primary-foreground font-mono">
                            Custom Type (Firestore)
                          </Badge>
                        </div>

                        <div className="p-5 space-y-2">
                          <h4 className="font-serif text-lg font-normal text-foreground">
                            {item.title}
                          </h4>
                          {item.tagline && (
                            <p className="text-xs text-primary font-medium">{item.tagline}</p>
                          )}
                          {item.description && (
                            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
                              {item.description}
                            </p>
                          )}
                          {item.keyElements && item.keyElements.length > 0 && (
                            <div className="flex flex-wrap gap-1 pt-1">
                              {item.keyElements.map((el, i) => (
                                <span
                                  key={i}
                                  className="text-[10px] px-2 py-0.5 bg-secondary text-foreground rounded-sm font-mono"
                                >
                                  {el}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="p-4 border-t border-border flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditType(item)}
                          className="text-xs h-8 text-foreground hover:bg-secondary/80"
                        >
                          <Pencil className="w-3.5 h-3.5 mr-1 text-primary" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => item.id && handleDeleteProjectType(item.id)}
                          className="text-xs text-destructive hover:bg-destructive/10 h-8"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          <span>Remove</span>
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Built-in Default Architectural Styles (Preserved & Editable) */}
                  {INDIAN_DESIGN_STYLES.filter(
                    (style) => !hiddenDefaults.hiddenStyles.includes(style.id)
                  ).map((style) => (
                    <div
                      key={style.id}
                      className="bg-card border border-border rounded-xl overflow-hidden shadow-xs flex flex-col justify-between opacity-95"
                    >
                      <div>
                        <div className="relative aspect-[16/10] bg-secondary/50 overflow-hidden">
                          <Image
                            src={style.imageUrl}
                            alt={style.title}
                            fill
                            className="object-cover"
                          />
                          <span className="absolute top-3 left-3 bg-background/90 px-2 py-0.5 rounded text-[10px] font-mono text-muted-foreground">
                            Default Standard
                          </span>
                        </div>

                        <div className="p-5 space-y-2">
                          <h4 className="font-serif text-lg font-normal text-foreground">
                            {style.title}
                          </h4>
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {style.description}
                          </p>
                          <div className="flex flex-wrap gap-1 pt-1">
                            {style.keyElements.map((el, i) => (
                              <span
                                key={i}
                                className="text-[10px] px-2 py-0.5 bg-secondary/60 text-muted-foreground rounded-sm font-mono"
                              >
                                {el}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      <div className="p-4 border-t border-border/60 flex items-center justify-between">
                        <span className="text-[11px] text-muted-foreground font-mono">
                          Core Atelier Style
                        </span>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEditDefaultStyle(style)}
                            className="text-xs h-8 text-foreground hover:bg-secondary/80"
                            title="Edit and customize this style"
                          >
                            <Pencil className="w-3.5 h-3.5 mr-1 text-primary" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveDefaultStyle(style.id)}
                            className="text-xs text-destructive hover:bg-destructive/10 h-8"
                            title="Remove this style from public view"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            <span>Remove</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBTAB 2: ESTIMATED BUDGET RANGES */}
            {configSubTab === "budgets" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-normal text-foreground">
                    Estimated Budget Brackets
                  </h3>
                  <p className="text-xs text-muted-foreground">
                    Budget options selectable by prospective clients in the Contact &amp; Consultation form.
                  </p>
                </div>

                {/* Add Budget Input */}
                <form
                  onSubmit={handleCreateBudget}
                  className="p-5 bg-card border border-border rounded-xl flex flex-col sm:flex-row items-stretch sm:items-center gap-3 max-w-xl shadow-xs"
                >
                  <input
                    type="text"
                    required
                    placeholder="e.g. ₹35 Lakhs – ₹60 Lakhs"
                    value={newBudgetInput}
                    onChange={(e) => setNewBudgetInput(e.target.value)}
                    className="flex-1 px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                  />
                  <Button
                    type="submit"
                    disabled={submittingBudget}
                    size="sm"
                    className="text-xs uppercase tracking-wider h-9"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    <span>Add Budget Bracket</span>
                  </Button>
                </form>

                {hiddenDefaults.hiddenBudgets.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 bg-secondary/50 border border-border rounded-lg text-xs">
                    <span className="text-muted-foreground">
                      {hiddenDefaults.hiddenBudgets.length} default budget bracket(s) currently hidden.
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRestoreDefaultBudgets}
                      className="text-xs h-7 w-full sm:w-auto"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Restore Default Budgets
                    </Button>
                  </div>
                )}

                {/* Budgets List Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Dynamic Firestore Budgets */}
                  {dynamicBudgets.map((b) => (
                    <div
                      key={b.id}
                      className="p-4 bg-card border border-primary/40 rounded-lg flex items-center justify-between shadow-xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <DollarSign className="w-4 h-4 text-emerald-600" />
                        <span className="text-xs font-semibold text-foreground font-mono">
                          {b.range}
                        </span>
                        <Badge variant="outline" className="text-[9px] text-primary border-primary/30">
                          Custom
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditBudget(b)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          title="Edit Budget Bracket"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => b.id && handleDeleteBudget(b.id)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                          title="Remove Budget Bracket"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Default Budgets (Editable & Removable) */}
                  {BUDGET_RANGES.filter(
                    (range) => !hiddenDefaults.hiddenBudgets.includes(range)
                  ).map((range, i) => (
                    <div
                      key={i}
                      className="p-4 bg-card border border-border rounded-lg flex items-center justify-between shadow-xs opacity-90"
                    >
                      <div className="flex items-center gap-2.5">
                        <DollarSign className="w-4 h-4 text-muted-foreground" />
                        <span className="text-xs font-medium text-foreground font-mono">
                          {range}
                        </span>
                        <span className="text-[10px] text-muted-foreground font-mono">Default</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleOpenEditDefaultBudget(range)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground"
                          title="Edit / Customize Default Budget Bracket"
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveDefaultBudget(range)}
                          className="h-7 w-7 p-0 text-muted-foreground hover:text-destructive"
                          title="Remove Default Budget Bracket"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* SUBTAB 3: ENGINEERS & MESTHRIS */}
            {configSubTab === "engineers" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg font-normal text-foreground">
                      Site Engineers, Chief Mesthris &amp; Master Masons
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Site supervisory team, senior civil engineers, and master craftsmen displayed on the About page.
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsAddEngModalOpen(true)}
                    size="sm"
                    className="text-xs uppercase tracking-wider w-full sm:w-auto"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    <span>Add Engineer / Mesthri</span>
                  </Button>
                </div>

                {hiddenDefaults.hiddenEngineers.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 bg-secondary/50 border border-border rounded-lg text-xs">
                    <span className="text-muted-foreground">
                      {hiddenDefaults.hiddenEngineers.length} default leadership profile(s) currently hidden.
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRestoreDefaultEngineers}
                      className="text-xs h-7 w-full sm:w-auto"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Restore Default Leadership
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Dynamic Firestore Engineers & Mesthris */}
                  {dynamicEngineers.map((eng) => (
                    <div
                      key={eng.id}
                      className="p-6 bg-card border border-primary/40 rounded-xl space-y-4 shadow-xs flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-secondary text-primary flex items-center justify-center font-serif text-lg border border-border">
                            {eng.imageUrl ? (
                              <Image
                                src={eng.imageUrl}
                                alt={eng.name}
                                fill
                                unoptimized
                                className="object-cover"
                              />
                            ) : (
                              <HardHat className="w-6 h-6 text-primary" />
                            )}
                          </div>
                          <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                            Custom Master
                          </Badge>
                        </div>

                        <div>
                          <h4 className="font-serif text-base font-normal text-foreground">
                            {eng.name}
                          </h4>
                          <p className="text-xs font-semibold text-primary uppercase tracking-wider mt-0.5">
                            {eng.role}
                          </p>
                          <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                            {eng.experience}
                          </p>
                        </div>

                        <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border/50">
                          <p className="font-medium text-foreground text-[11px]">Specialization:</p>
                          <p>{eng.specialization}</p>
                          {eng.phone && <p className="text-[11px] pt-1">Phone: {eng.phone}</p>}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditEngineer(eng)}
                          className="text-xs h-8 text-foreground hover:bg-secondary/80"
                        >
                          <Pencil className="w-3.5 h-3.5 mr-1 text-primary" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => eng.id && handleDeleteEngineer(eng.id)}
                          className="text-xs text-destructive hover:bg-destructive/10 h-8"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          <span>Remove</span>
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Core Founding Leadership (Editable & Removable) */}
                  {[
                    {
                      name: "Ar. K. Ramanathan",
                      role: "Principal Architect & Founder",
                      experience: "30+ Years Experience",
                      specialization: "Vernacular thermal physics, traditional Chettinad timber joinery",
                      bio: "Vernacular thermal physics, traditional Chettinad timber joinery.",
                      phone: "+91 94869 43652",
                      letter: "K",
                    },
                    {
                      name: "Er. Rajeshwari Menon",
                      role: "Head of Structural Engineering",
                      experience: "22+ Years Experience",
                      specialization: "M.Tech IIT Madras. Seismic foundation safety and concrete curing audits",
                      bio: "M.Tech IIT Madras. Seismic foundation safety and concrete curing audits.",
                      phone: "+91 94869 43652",
                      letter: "R",
                    },
                    {
                      name: "Sthapati V. Murugesan",
                      role: "Master Sthapati & Head Mesthri",
                      experience: "35+ Years Heritage Mastery",
                      specialization: "Generational stone carving, temple masonry, Athangudi tile casting",
                      bio: "Generational stone carving, temple masonry, Athangudi tile casting.",
                      phone: "+91 94869 43652",
                      letter: "M",
                    },
                  ]
                    .filter((leader) => !hiddenDefaults.hiddenEngineers.includes(leader.name))
                    .map((leader, i) => (
                      <div
                        key={i}
                        className="p-6 bg-card border border-border rounded-xl space-y-4 shadow-xs flex flex-col justify-between opacity-95"
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="w-10 h-10 rounded-lg bg-secondary text-primary flex items-center justify-center font-serif text-lg">
                              {leader.letter}
                            </div>
                            <span className="text-[10px] text-muted-foreground font-mono">
                              Default Leader
                            </span>
                          </div>

                          <div>
                            <h4 className="font-serif text-base font-normal text-foreground">
                              {leader.name}
                            </h4>
                            <p className="text-xs font-semibold text-primary uppercase tracking-wider mt-0.5">
                              {leader.role}
                            </p>
                            <p className="text-[11px] text-muted-foreground font-mono mt-0.5">
                              {leader.experience}
                            </p>
                          </div>

                          <div className="text-xs text-muted-foreground space-y-1 pt-2 border-t border-border/50">
                            <p className="font-medium text-foreground text-[11px]">Specialization:</p>
                            <p>{leader.specialization}</p>
                            {leader.phone && <p className="text-[11px] pt-1">Phone: {leader.phone}</p>}
                          </div>
                        </div>

                        <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpenEditDefaultLeader(leader)}
                            className="text-xs h-8 text-foreground hover:bg-secondary/80"
                            title="Edit / Customize this leadership profile"
                          >
                            <Pencil className="w-3.5 h-3.5 mr-1 text-primary" />
                            <span>Edit</span>
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveDefaultEngineer(leader.name)}
                            className="text-xs text-destructive hover:bg-destructive/10 h-8"
                            title="Remove this profile from public view"
                          >
                            <Trash2 className="w-3.5 h-3.5 mr-1" />
                            <span>Remove</span>
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* SUBTAB 4: CUSTOMER FEEDBACK & FAMILY TESTIMONIALS */}
            {configSubTab === "testimonials" && (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-serif text-lg font-normal text-foreground">
                      Customer Feedback &amp; Reviews (&ldquo;What Families Say&rdquo;)
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Homeowner feedback, family reflections, and quotes displayed in the homepage &ldquo;What Families Say&rdquo; section.
                    </p>
                  </div>
                  <Button
                    onClick={() => setIsAddTestModalOpen(true)}
                    size="sm"
                    className="text-xs uppercase tracking-wider w-full sm:w-auto"
                  >
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    <span>Add Review / Feedback</span>
                  </Button>
                </div>

                {hiddenDefaults.hiddenTestimonials && hiddenDefaults.hiddenTestimonials.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 p-3 bg-secondary/50 border border-border rounded-lg text-xs">
                    <span className="text-muted-foreground">
                      {hiddenDefaults.hiddenTestimonials.length} default homeowner review(s) currently hidden from public view.
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleRestoreDefaultTestimonials}
                      className="text-xs h-7 w-full sm:w-auto"
                    >
                      <RotateCcw className="w-3 h-3 mr-1" />
                      Restore Default Reviews
                    </Button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Dynamic Firestore Customer Feedback */}
                  {dynamicTestimonials.map((t) => (
                    <div
                      key={t.id}
                      className="p-6 bg-card border border-primary/40 rounded-xl space-y-4 shadow-xs flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-secondary text-primary flex items-center justify-center font-serif text-sm border border-border shrink-0">
                              {t.avatarUrl ? (
                                <Image
                                  src={t.avatarUrl}
                                  alt={t.clientName}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                />
                              ) : (
                                <span>
                                  {t.clientName
                                    .split(" ")
                                    .filter(Boolean)
                                    .slice(0, 2)
                                    .map((w) => w[0]?.toUpperCase())
                                    .join("") || "CR"}
                                </span>
                              )}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-serif text-base font-normal text-foreground truncate">
                                {t.clientName}
                              </h4>
                              <p className="text-xs font-semibold text-primary truncate">
                                {t.homeType}
                              </p>
                            </div>
                          </div>
                          <Badge variant="outline" className="text-[10px] text-primary border-primary/30 shrink-0">
                            Custom Review
                          </Badge>
                        </div>

                        {/* Star Rating */}
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: t.rating || 5 }).map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>

                        {/* Quote excerpt */}
                        <p className="text-xs italic text-foreground/85 leading-relaxed bg-secondary/30 p-3 rounded-lg border border-border/40">
                          &ldquo;{t.quote}&rdquo;
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 font-mono">
                          <span>{t.city}</span>
                          <span>{t.year}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditTestimonial(t)}
                          className="text-xs h-8 text-foreground hover:bg-secondary/80"
                        >
                          <Pencil className="w-3.5 h-3.5 mr-1 text-primary" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => t.id && handleDeleteTestimonial(t.id)}
                          className="text-xs text-destructive hover:bg-destructive/10 h-8"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          <span>Remove</span>
                        </Button>
                      </div>
                    </div>
                  ))}

                  {/* Built-in Default Reviews (Editable & Removable) */}
                  {TESTIMONIALS.filter(
                    (t) => !(hiddenDefaults.hiddenTestimonials || []).includes(t.clientName)
                  ).map((t, i) => (
                    <div
                      key={i}
                      className="p-6 bg-card border border-border rounded-xl space-y-4 shadow-xs flex flex-col justify-between opacity-95"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-secondary text-primary flex items-center justify-center font-serif text-sm border border-border shrink-0">
                              {t.clientName
                                .split(" ")
                                .filter(Boolean)
                                .slice(0, 2)
                                .map((w) => w[0]?.toUpperCase())
                                .join("") || "FB"}
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-serif text-base font-normal text-foreground truncate">
                                {t.clientName}
                              </h4>
                              <p className="text-xs font-semibold text-primary truncate">
                                {t.homeType}
                              </p>
                            </div>
                          </div>
                          <span className="text-[10px] text-muted-foreground font-mono shrink-0">
                            Default
                          </span>
                        </div>

                        {/* 5 Stars */}
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: 5 }).map((_, idx) => (
                            <Star key={idx} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>

                        {/* Quote excerpt */}
                        <p className="text-xs italic text-foreground/80 leading-relaxed bg-secondary/30 p-3 rounded-lg border border-border/40">
                          &ldquo;{t.quote}&rdquo;
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-muted-foreground pt-1 font-mono">
                          <span>{t.city}</span>
                          <span>{t.year}</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border/60 flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOpenEditDefaultTestimonial(t)}
                          className="text-xs h-8 text-foreground hover:bg-secondary/80"
                          title="Edit / Customize this review"
                        >
                          <Pencil className="w-3.5 h-3.5 mr-1 text-primary" />
                          <span>Edit</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveDefaultTestimonial(t.clientName)}
                          className="text-xs text-destructive hover:bg-destructive/10 h-8"
                          title="Remove this review from public view"
                        >
                          <Trash2 className="w-3.5 h-3.5 mr-1" />
                          <span>Remove</span>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ==================================================== */}
      {/* ADD PROJECT MODAL */}
      {/* ==================================================== */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-xl w-full max-w-xl p-4 sm:p-6 sm:p-8 space-y-4 sm:space-y-6 shadow-xl my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
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
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/gif, image/*"
                    disabled={convertingImage}
                    onChange={handleImageFileChange}
                    className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Upload any photo (PNG, JPEG, WebP, etc.) — converted directly into Base64 for Firebase.
                  </p>
                  {convertingImage && (
                    <p className="text-[11px] text-primary animate-pulse">
                      Converting photo to Base64 and optimizing for Firebase...
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

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-border">
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

      {/* ==================================================== */}
      {/* ADD PROJECT TYPE / ARCHITECTURAL STYLE MODAL */}
      {/* ==================================================== */}
      {isAddTypeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-xl w-full max-w-xl p-4 sm:p-6 sm:p-8 space-y-4 sm:space-y-6 shadow-xl my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#B86F55]">
                  Studio Master Architecture
                </span>
                <h3 className="font-serif text-xl font-normal text-foreground">
                  Add Architectural Style / Project Type
                </h3>
              </div>
              <button
                onClick={() => setIsAddTypeModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateProjectType} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Style / Project Type Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kerala Nalukettu Heritage or Modern Vernacular Villa"
                  value={newType.title}
                  onChange={(e) => setNewType({ ...newType, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Tagline / Subheading</label>
                <input
                  type="text"
                  placeholder="e.g. Sloped Mangalore Clay Roofs & Nadumuttam Courtyards"
                  value={newType.tagline}
                  onChange={(e) => setNewType({ ...newType, tagline: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Architectural Narrative / Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain the vernacular design philosophy, materials used, natural ventilation, and regional aesthetics..."
                  value={newType.description}
                  onChange={(e) => setNewType({ ...newType, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Key Design Elements (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nadumuttam Courtyard, Clay Roof Tiles, Teakwood Pillars, Athangudi Tiles"
                  value={newType.keyElements}
                  onChange={(e) => setNewType({ ...newType, keyElements: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Style Image Upload via Base64 or URL */}
              <div className="space-y-3 p-4 bg-secondary/30 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-primary" />
                    <span>Style Cover Image (Upload as Base64)</span>
                  </label>
                  {typeImageBase64 && (
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                      Base64 Ready • {typeImageSize}
                    </Badge>
                  )}
                </div>

                {/* Preview */}
                {(typeImageBase64 || newType.imageUrl) && (
                  <div className="relative aspect-[16/9] w-full rounded-md overflow-hidden border border-border bg-black/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={typeImageBase64 || newType.imageUrl}
                      alt="Style Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleClearTypeImage}
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
                    ref={typeFileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/gif, image/*"
                    disabled={convertingTypeImage}
                    onChange={handleTypeImageFileChange}
                    className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Upload any photo (PNG, JPEG, WebP, etc.) — converted directly into Base64 for Firebase.
                  </p>
                  {convertingTypeImage && (
                    <p className="text-[11px] text-primary animate-pulse">
                      Converting photo to Base64 and optimizing for Firebase...
                    </p>
                  )}
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2 pt-1 border-t border-border/50">
                    <span className="shrink-0">or Image URL:</span>
                    <input
                      type="text"
                      placeholder="https://... or /images/architecture/traditional-heritage.jpg"
                      value={newType.imageUrl.startsWith("data:") ? "" : newType.imageUrl}
                      onChange={(e) => {
                        setTypeImageBase64("");
                        setTypeImageSize("");
                        setNewType({ ...newType, imageUrl: e.target.value });
                      }}
                      className="flex-1 px-2.5 py-1 text-xs bg-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddTypeModalOpen(false)}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submittingType || convertingTypeImage}
                  className="text-xs h-9 uppercase tracking-wider"
                >
                  {convertingTypeImage
                    ? "Converting Image..."
                    : submittingType
                    ? "Saving Style..."
                    : "Save Architectural Style"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* ADD ENGINEER / CHIEF MESTHRI MODAL */}
      {/* ==================================================== */}
      {isAddEngModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-xl w-full max-w-xl p-4 sm:p-6 sm:p-8 space-y-4 sm:space-y-6 shadow-xl my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#B86F55]">
                  Site Execution Team
                </span>
                <h3 className="font-serif text-xl font-normal text-foreground">
                  Add Site Engineer / Chief Mesthri
                </h3>
              </div>
              <button
                onClick={() => setIsAddEngModalOpen(false)}
                className="text-muted-foreground hover:text-foreground text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateEngineer} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Master Craftsman / Engineer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mesthri P. Murugesan or Er. S. Vignesh, B.E."
                  value={newEngineer.name}
                  onChange={(e) => setNewEngineer({ ...newEngineer, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Designation / Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Head Mesthri (Masonry & Timber)"
                    value={newEngineer.role}
                    onChange={(e) => setNewEngineer({ ...newEngineer, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Experience Record</label>
                  <input
                    type="text"
                    placeholder="e.g. 25+ Years in Tenkasi & Tirunelveli"
                    value={newEngineer.experience}
                    onChange={(e) => setNewEngineer({ ...newEngineer, experience: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Craft Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Traditional Brick Bonding, Courtyard Roof Framing"
                    value={newEngineer.specialization}
                    onChange={(e) =>
                      setNewEngineer({ ...newEngineer, specialization: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Phone / WhatsApp Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 94869 43652"
                    value={newEngineer.phone}
                    onChange={(e) => setNewEngineer({ ...newEngineer, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Craft Profile / Experience Bio</label>
                <textarea
                  rows={3}
                  placeholder="Describe craftsmanship heritage, on-site quality adherence, structural supervision, etc."
                  value={newEngineer.bio}
                  onChange={(e) => setNewEngineer({ ...newEngineer, bio: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Photo Upload via Base64 or URL */}
              <div className="space-y-3 p-4 bg-secondary/30 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-primary" />
                    <span>Profile Photo (Upload as Base64)</span>
                  </label>
                  {engImageBase64 && (
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                      Base64 Ready • {engImageSize}
                    </Badge>
                  )}
                </div>

                {/* Live Preview */}
                {(engImageBase64 || newEngineer.imageUrl) && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border bg-black/20 mx-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={engImageBase64 || newEngineer.imageUrl}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleClearEngImage}
                        className="h-6 w-6 p-0 bg-background/80 text-destructive border-destructive/40 hover:bg-destructive/10"
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <input
                    ref={engFileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/gif, image/*"
                    disabled={convertingEngImage}
                    onChange={handleEngImageFileChange}
                    className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Upload any photo (PNG, JPEG, WebP, etc.) — converted directly into Base64 for Firebase.
                  </p>
                  {convertingEngImage && (
                    <p className="text-[11px] text-primary animate-pulse">
                      Converting photo to Base64 and optimizing for Firebase...
                    </p>
                  )}
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2 pt-1 border-t border-border/50">
                    <span className="shrink-0">or Photo URL:</span>
                    <input
                      type="text"
                      placeholder="https://... or /images/team/mesthri.jpg"
                      value={newEngineer.imageUrl.startsWith("data:") ? "" : newEngineer.imageUrl}
                      onChange={(e) => {
                        setEngImageBase64("");
                        setEngImageSize("");
                        setNewEngineer({ ...newEngineer, imageUrl: e.target.value });
                      }}
                      className="flex-1 px-2.5 py-1 text-xs bg-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddEngModalOpen(false)}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submittingEng || convertingEngImage}
                  className="text-xs h-9 uppercase tracking-wider"
                >
                  {convertingEngImage
                    ? "Converting Photo..."
                    : submittingEng
                    ? "Saving Profile..."
                    : "Save Engineer / Mesthri"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* EDIT PROJECT TYPE / ARCHITECTURAL STYLE MODAL */}
      {/* ==================================================== */}
      {isEditTypeModalOpen && editingType && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-xl w-full max-w-xl p-4 sm:p-6 sm:p-8 space-y-4 sm:space-y-6 shadow-xl my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#B86F55]">
                  {editingType.isDefault ? "Customize Standard Style" : "Edit Architectural Style"}
                </span>
                <h3 className="font-serif text-xl font-normal text-foreground">
                  {editingType.title || "Edit Project Type"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsEditTypeModalOpen(false);
                  setEditingType(null);
                }}
                className="text-muted-foreground hover:text-foreground text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateProjectType} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Style / Project Type Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Kerala Nalukettu Heritage"
                  value={editingType.title}
                  onChange={(e) => setEditingType({ ...editingType, title: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Tagline / Subheading</label>
                <input
                  type="text"
                  placeholder="e.g. Sloped Mangalore Clay Roofs & Nadumuttam Courtyards"
                  value={editingType.tagline}
                  onChange={(e) => setEditingType({ ...editingType, tagline: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Architectural Narrative / Description</label>
                <textarea
                  required
                  rows={3}
                  placeholder="Explain vernacular design philosophy..."
                  value={editingType.description}
                  onChange={(e) => setEditingType({ ...editingType, description: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">
                  Key Design Elements (comma-separated)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nadumuttam Courtyard, Clay Roof Tiles, Timber Posts"
                  value={editingType.keyElements}
                  onChange={(e) => setEditingType({ ...editingType, keyElements: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Style Image Upload via Base64 or URL */}
              <div className="space-y-3 p-4 bg-secondary/30 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-primary" />
                    <span>Style Cover Image (Upload as Base64)</span>
                  </label>
                  {editTypeImageBase64 && editTypeImageSize && (
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                      Base64 Ready • {editTypeImageSize}
                    </Badge>
                  )}
                </div>

                {/* Preview */}
                {(editTypeImageBase64 || editingType.imageUrl) && (
                  <div className="relative aspect-[16/9] w-full rounded-md overflow-hidden border border-border bg-black/20">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editTypeImageBase64 || editingType.imageUrl}
                      alt="Style Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 right-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleClearEditTypeImage}
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
                    ref={editTypeFileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/gif, image/*"
                    disabled={convertingEditTypeImage}
                    onChange={handleEditTypeImageFileChange}
                    className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Upload any photo (PNG, JPEG, WebP, etc.) — converted directly into Base64 for Firebase.
                  </p>
                  {convertingEditTypeImage && (
                    <p className="text-[11px] text-primary animate-pulse">
                      Converting photo to Base64 and optimizing for Firebase...
                    </p>
                  )}
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2 pt-1 border-t border-border/50">
                    <span className="shrink-0">or Image URL:</span>
                    <input
                      type="text"
                      placeholder="https://... or /images/architecture/traditional-heritage.jpg"
                      value={editingType.imageUrl.startsWith("data:") ? "" : editingType.imageUrl}
                      onChange={(e) => {
                        setEditTypeImageBase64("");
                        setEditTypeImageSize("");
                        setEditingType({ ...editingType, imageUrl: e.target.value });
                      }}
                      className="flex-1 px-2.5 py-1 text-xs bg-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditTypeModalOpen(false);
                    setEditingType(null);
                  }}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submittingEditType || convertingEditTypeImage}
                  className="text-xs h-9 uppercase tracking-wider"
                >
                  {convertingEditTypeImage
                    ? "Converting..."
                    : submittingEditType
                    ? "Saving Changes..."
                    : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* EDIT BUDGET MODAL */}
      {/* ==================================================== */}
      {isEditBudgetModalOpen && editingBudget && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-xl w-full max-w-md p-4 sm:p-6 sm:p-8 space-y-4 sm:space-y-6 shadow-xl my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-emerald-600 font-mono">
                  {editingBudget.isDefault ? "Customize Default Budget" : "Edit Budget Bracket"}
                </span>
                <h3 className="font-serif text-lg font-normal text-foreground">
                  Budget Range Option
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsEditBudgetModalOpen(false);
                  setEditingBudget(null);
                }}
                className="text-muted-foreground hover:text-foreground text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateBudget} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Budget Bracket Label</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. ₹35 Lakhs – ₹60 Lakhs"
                  value={editingBudget.range}
                  onChange={(e) => setEditingBudget({ ...editingBudget, range: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                />
                <p className="text-[11px] text-muted-foreground">
                  Appears in client enquiry dropdowns on the Contact page.
                </p>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditBudgetModalOpen(false);
                    setEditingBudget(null);
                  }}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submittingEditBudget}
                  className="text-xs h-9 uppercase tracking-wider"
                >
                  {submittingEditBudget ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* EDIT ENGINEER / CHIEF MESTHRI MODAL */}
      {/* ==================================================== */}
      {isEditEngModalOpen && editingEngineer && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-xl w-full max-w-xl p-4 sm:p-6 sm:p-8 space-y-4 sm:space-y-6 shadow-xl my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#B86F55]">
                  {editingEngineer.isDefault ? "Customize Team Profile" : "Edit Engineer / Mesthri"}
                </span>
                <h3 className="font-serif text-xl font-normal text-foreground">
                  {editingEngineer.name || "Edit Profile"}
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsEditEngModalOpen(false);
                  setEditingEngineer(null);
                }}
                className="text-muted-foreground hover:text-foreground text-sm font-mono"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateEngineer} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Master Craftsman / Engineer Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Mesthri P. Murugesan or Er. S. Vignesh, B.E."
                  value={editingEngineer.name}
                  onChange={(e) => setEditingEngineer({ ...editingEngineer, name: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Designation / Role</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Senior Head Mesthri (Masonry & Timber)"
                    value={editingEngineer.role}
                    onChange={(e) => setEditingEngineer({ ...editingEngineer, role: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Experience Record</label>
                  <input
                    type="text"
                    placeholder="e.g. 25+ Years in Tenkasi & Tirunelveli"
                    value={editingEngineer.experience}
                    onChange={(e) => setEditingEngineer({ ...editingEngineer, experience: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Craft Specialization</label>
                  <input
                    type="text"
                    placeholder="e.g. Traditional Brick Bonding, Courtyard Roof Framing"
                    value={editingEngineer.specialization}
                    onChange={(e) =>
                      setEditingEngineer({ ...editingEngineer, specialization: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-foreground">Phone / WhatsApp Number</label>
                  <input
                    type="text"
                    placeholder="e.g. +91 94869 43652"
                    value={editingEngineer.phone}
                    onChange={(e) => setEditingEngineer({ ...editingEngineer, phone: e.target.value })}
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-foreground">Craft Profile / Experience Bio</label>
                <textarea
                  rows={3}
                  placeholder="Describe craftsmanship heritage, on-site quality adherence..."
                  value={editingEngineer.bio}
                  onChange={(e) => setEditingEngineer({ ...editingEngineer, bio: e.target.value })}
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                />
              </div>

              {/* Photo Upload via Base64 or URL */}
              <div className="space-y-3 p-4 bg-secondary/30 rounded-lg border border-border">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-primary" />
                    <span>Profile Photo (Upload as Base64)</span>
                  </label>
                  {editEngImageBase64 && editEngImageSize && (
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/30">
                      Base64 Ready • {editEngImageSize}
                    </Badge>
                  )}
                </div>

                {/* Live Preview */}
                {(editEngImageBase64 || editingEngineer.imageUrl) && (
                  <div className="relative w-24 h-24 rounded-lg overflow-hidden border border-border bg-black/20 mx-auto">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={editEngImageBase64 || editingEngineer.imageUrl}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-1 right-1">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={handleClearEditEngImage}
                        className="h-6 w-6 p-0 bg-background/80 text-destructive border-destructive/40 hover:bg-destructive/10"
                      >
                        ✕
                      </Button>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <input
                    ref={editEngFileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/gif, image/*"
                    disabled={convertingEditEngImage}
                    onChange={handleEditEngImageFileChange}
                    className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Upload any photo (PNG, JPEG, WebP, etc.) — converted directly into Base64 for Firebase.
                  </p>
                  {convertingEditEngImage && (
                    <p className="text-[11px] text-primary animate-pulse">
                      Converting photo to Base64 and optimizing for Firebase...
                    </p>
                  )}
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2 pt-1 border-t border-border/50">
                    <span className="shrink-0">or Photo URL:</span>
                    <input
                      type="text"
                      placeholder="https://... or /images/team/mesthri.jpg"
                      value={editingEngineer.imageUrl.startsWith("data:") ? "" : editingEngineer.imageUrl}
                      onChange={(e) => {
                        setEditEngImageBase64("");
                        setEditEngImageSize("");
                        setEditingEngineer({ ...editingEngineer, imageUrl: e.target.value });
                      }}
                      className="flex-1 px-2.5 py-1 text-xs bg-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditEngModalOpen(false);
                    setEditingEngineer(null);
                  }}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submittingEditEng || convertingEditEngImage}
                  className="text-xs h-9 uppercase tracking-wider"
                >
                  {convertingEditEngImage
                    ? "Converting..."
                    : submittingEditEng
                    ? "Saving Changes..."
                    : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* ADD CUSTOMER TESTIMONIAL MODAL */}
      {/* ==================================================== */}
      {isAddTestModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-xl w-full max-w-xl p-4 sm:p-6 sm:p-8 space-y-4 sm:space-y-6 shadow-xl my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#B86F55]">
                  Customer Voice &amp; Social Proof
                </span>
                <h3 className="font-serif text-xl font-normal text-foreground">
                  Add Homeowner Feedback (&ldquo;What Families Say&rdquo;)
                </h3>
              </div>
              <button
                onClick={() => setIsAddTestModalOpen(false)}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTestimonial} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Client / Family Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dr. Arvind & Maya Nambiar"
                    value={newTestimonial.clientName}
                    onChange={(e) =>
                      setNewTestimonial({ ...newTestimonial, clientName: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Home / Project Type *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Courtyard Heritage Villa (5,400 sq.ft.)"
                    value={newTestimonial.homeType}
                    onChange={(e) =>
                      setNewTestimonial({ ...newTestimonial, homeType: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    City &amp; State *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Tenkasi, Tamil Nadu"
                    value={newTestimonial.city}
                    onChange={(e) =>
                      setNewTestimonial({ ...newTestimonial, city: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Completion Year *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2025"
                    value={newTestimonial.year}
                    onChange={(e) =>
                      setNewTestimonial({ ...newTestimonial, year: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Star Rating (1 - 5)
                  </label>
                  <select
                    value={newTestimonial.rating}
                    onChange={(e) =>
                      setNewTestimonial({ ...newTestimonial, rating: Number(e.target.value) })
                    }
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Homeowner Quote / Feedback *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Share their experience working with ACS Construction, craftsmanship quality, transparency, timeline, and lifestyle after moving in..."
                  value={newTestimonial.quote}
                  onChange={(e) =>
                    setNewTestimonial({ ...newTestimonial, quote: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                />
              </div>

              {/* Photo Upload via Base64 or URL */}
              <div className="space-y-3 p-4 bg-secondary/30 border border-border rounded-lg">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-primary" />
                    <span>Homeowner / Family Photo (Upload as Base64)</span>
                  </label>
                  {testImageBase64 && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                      Base64 Ready • {testImageSize}
                    </span>
                  )}
                </div>

                {(testImageBase64 || newTestimonial.avatarUrl) && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/40 mx-auto shadow-sm group">
                    <Image
                      src={testImageBase64 || newTestimonial.avatarUrl}
                      alt="Avatar Preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleClearTestImage}
                      className="absolute inset-0 bg-black/60 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Clear
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  <input
                    ref={testFileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/gif, image/*"
                    disabled={convertingTestImage}
                    onChange={handleTestImageFileChange}
                    className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Upload any photo (PNG, JPEG, WebP, etc.) — converted directly into Base64 for Firebase.
                  </p>
                  {convertingTestImage && (
                    <p className="text-[11px] text-primary animate-pulse">
                      Converting photo to Base64 and optimizing for Firebase...
                    </p>
                  )}
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2 pt-1 border-t border-border/50">
                    <span className="shrink-0">or Photo URL:</span>
                    <input
                      type="text"
                      placeholder="https://... or /images/clients/family.jpg"
                      value={newTestimonial.avatarUrl.startsWith("data:") ? "" : newTestimonial.avatarUrl}
                      onChange={(e) => {
                        setTestImageBase64("");
                        setTestImageSize("");
                        setNewTestimonial({ ...newTestimonial, avatarUrl: e.target.value });
                      }}
                      className="flex-1 px-2.5 py-1 text-xs bg-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddTestModalOpen(false)}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submittingTestimonial || convertingTestImage}
                  className="text-xs h-9 uppercase tracking-wider"
                >
                  {convertingTestImage
                    ? "Converting..."
                    : submittingTestimonial
                    ? "Saving Review..."
                    : "Publish Review to Live Site"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* EDIT CUSTOMER TESTIMONIAL MODAL */}
      {/* ==================================================== */}
      {isEditTestModalOpen && editingTestimonial && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-card border border-border rounded-xl w-full max-w-xl p-4 sm:p-6 sm:p-8 space-y-4 sm:space-y-6 shadow-xl my-4 sm:my-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div>
                <span className="text-[10px] font-semibold uppercase tracking-widest text-[#B86F55]">
                  {editingTestimonial.isDefault ? "Customize Built-in Review" : "Edit Customer Review"}
                </span>
                <h3 className="font-serif text-xl font-normal text-foreground">
                  Update Homeowner Feedback
                </h3>
              </div>
              <button
                onClick={() => {
                  setIsEditTestModalOpen(false);
                  setEditingTestimonial(null);
                }}
                className="text-muted-foreground hover:text-foreground p-1 rounded-md"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUpdateTestimonial} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Client / Family Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.clientName}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, clientName: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Home / Project Type *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.homeType}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, homeType: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    City &amp; State *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.city}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, city: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Completion Year *
                  </label>
                  <input
                    type="text"
                    required
                    value={editingTestimonial.year}
                    onChange={(e) =>
                      setEditingTestimonial({ ...editingTestimonial, year: e.target.value })
                    }
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-foreground mb-1">
                    Star Rating (1 - 5)
                  </label>
                  <select
                    value={editingTestimonial.rating || 5}
                    onChange={(e) =>
                      setEditingTestimonial({
                        ...editingTestimonial,
                        rating: Number(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ (5 Stars)</option>
                    <option value={4}>⭐⭐⭐⭐ (4 Stars)</option>
                    <option value={3}>⭐⭐⭐ (3 Stars)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1">
                  Homeowner Quote / Feedback *
                </label>
                <textarea
                  required
                  rows={4}
                  value={editingTestimonial.quote}
                  onChange={(e) =>
                    setEditingTestimonial({ ...editingTestimonial, quote: e.target.value })
                  }
                  className="w-full px-3 py-2 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary leading-relaxed"
                />
              </div>

              {/* Photo Upload via Base64 or URL */}
              <div className="space-y-3 p-4 bg-secondary/30 border border-border rounded-lg">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-foreground flex items-center gap-1.5">
                    <Upload className="w-3.5 h-3.5 text-primary" />
                    <span>Homeowner / Family Photo (Upload as Base64)</span>
                  </label>
                  {editTestImageBase64 && editTestImageSize && (
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono font-medium">
                      Base64 Ready • {editTestImageSize}
                    </span>
                  )}
                </div>

                {(editTestImageBase64 || editingTestimonial.avatarUrl) && (
                  <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/40 mx-auto shadow-sm group">
                    <Image
                      src={editTestImageBase64 || editingTestimonial.avatarUrl}
                      alt="Avatar Preview"
                      fill
                      unoptimized
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={handleClearEditTestImage}
                      className="absolute inset-0 bg-black/60 text-white text-[10px] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      Clear
                    </button>
                  </div>
                )}

                <div className="space-y-2">
                  <input
                    ref={editTestFileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/jpg, image/webp, image/avif, image/gif, image/*"
                    disabled={convertingEditTestImage}
                    onChange={handleEditTestImageFileChange}
                    className="w-full text-xs text-muted-foreground file:mr-3 file:py-1.5 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-medium file:bg-primary file:text-primary-foreground hover:file:opacity-90 cursor-pointer"
                  />
                  <p className="text-[10px] text-muted-foreground">
                    Upload any photo (PNG, JPEG, WebP, etc.) — converted directly into Base64 for Firebase.
                  </p>
                  {convertingEditTestImage && (
                    <p className="text-[11px] text-primary animate-pulse">
                      Converting photo to Base64 and optimizing for Firebase...
                    </p>
                  )}
                  <div className="text-[11px] text-muted-foreground flex items-center gap-2 pt-1 border-t border-border/50">
                    <span className="shrink-0">or Photo URL:</span>
                    <input
                      type="text"
                      placeholder="https://... or /images/clients/family.jpg"
                      value={
                        editingTestimonial.avatarUrl.startsWith("data:")
                          ? ""
                          : editingTestimonial.avatarUrl
                      }
                      onChange={(e) => {
                        setEditTestImageBase64("");
                        setEditTestImageSize("");
                        setEditingTestimonial({
                          ...editingTestimonial,
                          avatarUrl: e.target.value,
                        });
                      }}
                      className="flex-1 px-2.5 py-1 text-xs bg-background border border-border rounded text-foreground focus:outline-none focus:ring-1 focus:ring-primary font-mono"
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-3 border-t border-border">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditTestModalOpen(false);
                    setEditingTestimonial(null);
                  }}
                  className="text-xs h-9"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={submittingEditTest || convertingEditTestImage}
                  className="text-xs h-9 uppercase tracking-wider"
                >
                  {convertingEditTestImage
                    ? "Converting..."
                    : submittingEditTest
                    ? "Saving Changes..."
                    : "Save Changes"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
