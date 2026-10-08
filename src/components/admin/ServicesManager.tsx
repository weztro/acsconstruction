"use client";

import * as React from "react";
import {
  Plus,
  Trash2,
  Pencil,
  Check,
  RotateCcw,
  Compass,
  Hammer,
  KeyRound,
  Armchair,
  Sparkles,
  ShieldCheck,
  Home,
  Wrench,
  Ruler,
  Paintbrush,
  HardHat,
  Layers,
  ArrowRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { SERVICES, type ServiceItem } from "@/lib/constants";
import {
  fetchServicesFromFirestore,
  saveServiceToFirestore,
  updateServiceInFirestore,
  deleteServiceInFirestore,
  fetchHiddenDefaults,
  saveHiddenDefaults,
  type DynamicService,
  type HiddenDefaultsConfig,
} from "@/lib/firebase";

const AVAILABLE_ICONS = [
  { name: "Compass", label: "Compass (Design / Architecture)", icon: Compass },
  { name: "Hammer", label: "Hammer (Civil Construction)", icon: Hammer },
  { name: "KeyRound", label: "Key (Turnkey Execution)", icon: KeyRound },
  { name: "Armchair", label: "Armchair (Interior Design)", icon: Armchair },
  { name: "Sparkles", label: "Sparkles (Renovation / Luxury)", icon: Sparkles },
  { name: "ShieldCheck", label: "Shield (Structural / Quality)", icon: ShieldCheck },
  { name: "Home", label: "Home (Villa Construction)", icon: Home },
  { name: "Wrench", label: "Wrench (MEP / Plumbing)", icon: Wrench },
  { name: "Ruler", label: "Ruler (Blueprint Planning)", icon: Ruler },
  { name: "Paintbrush", label: "Paintbrush (Finishing / Decor)", icon: Paintbrush },
  { name: "HardHat", label: "Hard Hat (Engineering Supervision)", icon: HardHat },
  { name: "Layers", label: "Layers (Foundation & RCC)", icon: Layers },
];

const iconMap: Record<string, React.ElementType> = {
  Compass,
  Hammer,
  KeyRound,
  Armchair,
  Sparkles,
  ShieldCheck,
  Home,
  Wrench,
  Ruler,
  Paintbrush,
  HardHat,
  Layers,
};

export function ServicesManager() {
  const [services, setServices] = React.useState<ServiceItem[]>([]);
  const [hiddenDefaults, setHiddenDefaults] = React.useState<HiddenDefaultsConfig>({
    hiddenStyles: [],
    hiddenBudgets: [],
    hiddenEngineers: [],
    hiddenTestimonials: [],
    hiddenServices: [],
    hiddenPackages: [],
  });
  const [loading, setLoading] = React.useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingServiceId, setEditingServiceId] = React.useState<string | null>(null);
  const [isEditingDefault, setIsEditingDefault] = React.useState(false);

  // Form State
  const [formTitle, setFormTitle] = React.useState("");
  const [formIconName, setFormIconName] = React.useState("Compass");
  const [formShortDesc, setFormShortDesc] = React.useState("");
  const [formFullDesc, setFormFullDesc] = React.useState("");
  const [formFeaturesText, setFormFeaturesText] = React.useState("");
  const [formDeliverablesText, setFormDeliverablesText] = React.useState("");
  const [submitting, setSubmitting] = React.useState(false);

  const loadAll = React.useCallback(async () => {
    setLoading(true);
    try {
      const [custom, hidden] = await Promise.all([
        fetchServicesFromFirestore(),
        fetchHiddenDefaults(),
      ]);
      setHiddenDefaults(hidden);

      const hiddenIds = new Set(hidden.hiddenServices || []);
      const activeDefaults = SERVICES.filter((s) => !hiddenIds.has(s.id));
      const combined = [...activeDefaults, ...custom].filter(
        (s) => (s as DynamicService).isActive !== false
      );

      setServices(combined);
    } catch (err) {
      console.error("Error loading services in admin:", err);
      toast.error("Could not load services from Firestore");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleOpenAddModal = () => {
    setEditingServiceId(null);
    setIsEditingDefault(false);
    setFormTitle("");
    setFormIconName("Compass");
    setFormShortDesc("");
    setFormFullDesc("");
    setFormFeaturesText(
      [
        "Comprehensive structural calculations & load testing",
        "Vastu-compliant architectural space zoning",
        "Regular drone inspection and automated milestone logging",
        "10-Year engineering integrity guarantee",
      ].join("\n")
    );
    setFormDeliverablesText(
      ["CAD Floor Plans", "3D Photorealistic Renders", "Structural BOQ", "Completion Certificate"].join(", ")
    );
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (service: ServiceItem) => {
    const isDefault = SERVICES.some((d) => d.id === service.id);
    setEditingServiceId(service.id);
    setIsEditingDefault(isDefault);
    setFormTitle(service.title);
    setFormIconName(service.iconName || "Compass");
    setFormShortDesc(service.shortDesc);
    setFormFullDesc(service.fullDesc);
    setFormFeaturesText(service.features.join("\n"));
    setFormDeliverablesText(service.deliverables.join(", "));
    setIsModalOpen(true);
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim() || !formShortDesc.trim() || !formFullDesc.trim()) {
      toast.error("Title, Short Description, and Full Description are required");
      return;
    }

    const featuresArray = formFeaturesText
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const deliverablesArray = formDeliverablesText
      .split(",")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    setSubmitting(true);
    try {
      const slug = formTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const payload: Omit<DynamicService, "id" | "createdAt" | "updatedAt"> = {
        title: formTitle.trim(),
        iconName: formIconName,
        shortDesc: formShortDesc.trim(),
        fullDesc: formFullDesc.trim(),
        features: featuresArray,
        deliverables: deliverablesArray,
        isActive: true,
      };

      if (editingServiceId && !isEditingDefault) {
        const ok = await updateServiceInFirestore(editingServiceId, payload);
        if (ok) {
          toast.success(`Updated service: ${payload.title}`);
        } else {
          toast.error("Failed to update service in Firestore");
        }
      } else if (editingServiceId && isEditingDefault) {
        const currentHidden = hiddenDefaults.hiddenServices || [];
        if (!currentHidden.includes(editingServiceId)) {
          await saveHiddenDefaults({ hiddenServices: [...currentHidden, editingServiceId] });
        }
        const res = await saveServiceToFirestore(payload);
        if (res.success) {
          toast.success(`Saved customized copy of: ${payload.title}`);
        } else {
          toast.error("Failed to save service customization");
        }
      } else {
        const res = await saveServiceToFirestore(payload);
        if (res.success) {
          toast.success(`Created service: ${payload.title}`);
        } else {
          toast.error("Failed to create service in Firestore");
        }
      }

      setIsModalOpen(false);
      await loadAll();
    } catch (err) {
      console.error("Error saving service:", err);
      toast.error("Error saving service");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteService = async (service: ServiceItem) => {
    const confirmDelete = window.confirm(`Remove service "${service.title}"?`);
    if (!confirmDelete) return;

    try {
      const isDefault = SERVICES.some((d) => d.id === service.id);
      if (isDefault) {
        const currentHidden = hiddenDefaults.hiddenServices || [];
        if (!currentHidden.includes(service.id)) {
          await saveHiddenDefaults({ hiddenServices: [...currentHidden, service.id] });
          toast.success(`Hidden default service: ${service.title}`);
        }
      } else {
        const ok = await deleteServiceInFirestore(service.id);
        if (ok) {
          toast.success(`Deleted service: ${service.title}`);
        } else {
          toast.error("Failed to delete service from Firestore");
        }
      }
      await loadAll();
    } catch (err) {
      console.error("Error deleting service:", err);
      toast.error("Failed to remove service");
    }
  };

  const handleRestoreDefaults = async () => {
    const confirmRestore = window.confirm("Restore all 6 default construction services?");
    if (!confirmRestore) return;
    try {
      await saveHiddenDefaults({ hiddenServices: [] });
      toast.success("Restored all default services");
      await loadAll();
    } catch (err) {
      console.error("Error restoring defaults:", err);
      toast.error("Could not restore default services");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B86F55] font-mono">
              Live Capabilities
            </span>
            <Badge variant="outline" className="text-[10px]">
              {services.length} Active Services
            </Badge>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-foreground mt-1">
            Dynamic Construction Services &amp; Practices
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
            Manage the service offerings displayed on the Homepage grid and the full /services breakdown page. Fully dynamic with Firestore storage.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hiddenDefaults.hiddenServices && hiddenDefaults.hiddenServices.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRestoreDefaults}
              className="text-xs text-muted-foreground hover:text-foreground"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset Defaults
            </Button>
          )}

          <Button
            type="button"
            onClick={handleOpenAddModal}
            size="sm"
            className="bg-[#B86F55] hover:bg-[#A35F48] text-white text-xs uppercase tracking-wider"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add New Service
          </Button>
        </div>
      </div>

      {/* Services Cards Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-muted-foreground font-mono">
          Loading services from Firestore...
        </div>
      ) : services.length === 0 ? (
        <div className="p-12 text-center bg-card border border-border rounded-xl space-y-3">
          <p className="text-xs text-muted-foreground">No active services. Click Add New Service or Restore Defaults.</p>
          <Button onClick={handleRestoreDefaults} size="sm" variant="outline" className="text-xs">
            Restore Defaults
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {services.map((service, idx) => {
            const Icon = iconMap[service.iconName] || Compass;
            const isDefault = SERVICES.some((d) => d.id === service.id);

            return (
              <div
                key={service.id || idx}
                className="flex flex-col justify-between rounded-xl bg-card border border-border p-6 shadow-xs hover:border-primary/50 transition-all duration-200"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/80 flex items-center justify-center text-primary">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                      {isDefault ? "Preset" : "Custom"}
                    </span>
                  </div>

                  <h4 className="font-serif text-xl font-normal text-foreground">
                    {service.title}
                  </h4>

                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
                    {service.shortDesc}
                  </p>

                  <div className="space-y-1.5 pt-4 mt-4 border-t border-border">
                    <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                      Key Inclusions:
                    </span>
                    {service.features.slice(0, 3).map((feat, i) => (
                      <div key={i} className="flex items-start gap-2 text-[11px] text-foreground/80">
                        <Check className="w-3 h-3 text-primary shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {service.deliverables && service.deliverables.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-4 mt-3 border-t border-border/60">
                      {service.deliverables.slice(0, 3).map((del, i) => (
                        <span
                          key={i}
                          className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground"
                        >
                          {del}
                        </span>
                      ))}
                      {service.deliverables.length > 3 && (
                        <span className="text-[10px] font-mono text-muted-foreground">
                          +{service.deliverables.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-5 mt-5 border-t border-border flex items-center justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenEditModal(service)}
                    className="h-8 text-xs"
                  >
                    <Pencil className="w-3 h-3 mr-1" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteService(service)}
                    className="h-8 text-xs text-destructive hover:bg-destructive/10 px-2.5"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT SERVICE MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-normal text-foreground">
              {editingServiceId ? `Edit Service: ${formTitle}` : "Create New Construction Service"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Set title, icon, descriptions, features, and deliverables for the live site.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveService} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="srvTitle" className="text-xs">Service Title *</Label>
                <Input
                  id="srvTitle"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="e.g. Turnkey Villa Construction"
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="srvIcon" className="text-xs">Service Icon *</Label>
                <select
                  id="srvIcon"
                  value={formIconName}
                  onChange={(e) => setFormIconName(e.target.value)}
                  className="w-full h-9 px-3 text-xs bg-background border border-border rounded-md text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
                >
                  {AVAILABLE_ICONS.map((opt) => (
                    <option key={opt.name} value={opt.name}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="srvShort" className="text-xs">Short Summary (Homepage card) *</Label>
              <Input
                id="srvShort"
                value={formShortDesc}
                onChange={(e) => setFormShortDesc(e.target.value)}
                placeholder="One sentence summary for the homepage grid..."
                required
                className="h-9 text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="srvFull" className="text-xs">Full In-depth Scope (/services page) *</Label>
              <Textarea
                id="srvFull"
                value={formFullDesc}
                onChange={(e) => setFormFullDesc(e.target.value)}
                placeholder="Detailed architectural scope and methodology..."
                rows={3}
                required
                className="text-xs"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="srvFeats" className="text-xs">
                Key Technical Standards (One per line)
              </Label>
              <Textarea
                id="srvFeats"
                value={formFeaturesText}
                onChange={(e) => setFormFeaturesText(e.target.value)}
                placeholder="Tata Tiscon Fe 550D TMT Steel&#10;Automated curing system&#10;Seismic compliance..."
                rows={4}
                className="text-xs font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="srvDels" className="text-xs">
                Deliverables Included (Comma-separated)
              </Label>
              <Input
                id="srvDels"
                value={formDeliverablesText}
                onChange={(e) => setFormDeliverablesText(e.target.value)}
                placeholder="e.g. Architectural CAD Sets, 3D Renders, Quality Reports"
                className="h-9 text-xs font-mono"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="text-xs"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-[#B86F55] hover:bg-[#A35F48] text-white text-xs font-medium px-5"
              >
                {submitting ? "Saving..." : editingServiceId ? "Update Service" : "Publish Service"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
