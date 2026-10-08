"use client";

import * as React from "react";
import {
  Plus,
  Trash2,
  Pencil,
  Star,
  Check,
  Sparkles,
  Package,
  RotateCcw,
  Layers,
  ArrowRight,
  Info,
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
import {
  DEFAULT_PACKAGES,
  type DynamicPackage,
  type DetailedCategorySpec,
} from "@/lib/constants";
import {
  fetchPackagesFromFirestore,
  savePackageToFirestore,
  updatePackageInFirestore,
  deletePackageFromFirestore,
  fetchHiddenDefaults,
  saveHiddenDefaults,
  type HiddenDefaultsConfig,
} from "@/lib/firebase";

export function PackagesManager() {
  const [packages, setPackages] = React.useState<DynamicPackage[]>([]);
  const [firestorePackages, setFirestorePackages] = React.useState<DynamicPackage[]>([]);
  const [hiddenDefaults, setHiddenDefaults] = React.useState<HiddenDefaultsConfig>({
    hiddenStyles: [],
    hiddenBudgets: [],
    hiddenEngineers: [],
    hiddenTestimonials: [],
    hiddenServices: [],
    hiddenPackages: [],
  });
  const [loading, setLoading] = React.useState(true);

  // Modal State for Add / Edit
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingPackageId, setEditingPackageId] = React.useState<string | null>(null);
  const [isEditingDefault, setIsEditingDefault] = React.useState(false);

  // Form State
  const [formName, setFormName] = React.useState("");
  const [formPrice, setFormPrice] = React.useState("");
  const [formUnit, setFormUnit] = React.useState("");
  const [formBadge, setFormBadge] = React.useState("");
  const [formIsPopular, setFormIsPopular] = React.useState(false);
  const [formOrder, setFormOrder] = React.useState<number>(1);
  const [formDescription, setFormDescription] = React.useState("");
  const [formFeaturesText, setFormFeaturesText] = React.useState("");
  const [formDetailedSpecs, setFormDetailedSpecs] = React.useState<DetailedCategorySpec[]>([]);
  const [submitting, setSubmitting] = React.useState(false);

  const loadAll = React.useCallback(async () => {
    setLoading(true);
    try {
      const [custom, hidden] = await Promise.all([
        fetchPackagesFromFirestore(),
        fetchHiddenDefaults(),
      ]);

      setFirestorePackages(custom);
      setHiddenDefaults(hidden);

      const hiddenIds = new Set(hidden.hiddenPackages || []);
      const activeDefaults = DEFAULT_PACKAGES.filter((p) => p.id && !hiddenIds.has(p.id));
      const combined = [...activeDefaults, ...custom].filter((p) => p.isActive !== false);
      combined.sort((a, b) => (a.order || 99) - (b.order || 99));

      setPackages(combined);
    } catch (err) {
      console.error("Error loading packages in admin:", err);
      toast.error("Could not load packages from Firestore");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadAll();
  }, [loadAll]);

  const handleOpenAddModal = () => {
    setEditingPackageId(null);
    setIsEditingDefault(false);
    setFormName("");
    setFormPrice("₹2,200 / sq.ft");
    setFormUnit("Turnkey Construction Base");
    setFormBadge("");
    setFormIsPopular(false);
    setFormOrder(packages.length + 1);
    setFormDescription("Comprehensive turnkey construction package covering civil, electrical, plumbing, and finishing.");
    setFormFeaturesText(
      [
        "Tata Tiscon Fe 550D TMT Steel & Ultratech Cement",
        "Solid Block / Brick Masonry with Curing Protocol",
        "Premium Vitrified Tile Flooring (4x2 ft)",
        "Jaquar / Kohler Concealed Plumbing Fixtures",
        "Modular Kitchen Setup with Soft-Close Hardware",
        "10-Year Comprehensive Structural Warranty",
      ].join("\n")
    );
    setFormDetailedSpecs([
      {
        category: "Structure & Civil",
        items: [
          "Tata Tiscon Fe 550D TMT Steel",
          "Ultratech 53-Grade Cement",
          "M25 Ready Mix / Site Mix Concrete",
        ],
      },
      {
        category: "Finishes & Warranty",
        items: [
          "Vitrified Tiles (₹80/sq.ft allowance)",
          "Asian Paints Apex Ultima Exterior",
          "10-Year Structural Guarantee",
        ],
      },
    ]);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (pkg: DynamicPackage) => {
    const isDefault = DEFAULT_PACKAGES.some((d) => d.id === pkg.id);
    setEditingPackageId(pkg.id || null);
    setIsEditingDefault(isDefault);
    setFormName(pkg.name);
    setFormPrice(pkg.price);
    setFormUnit(pkg.unit || "");
    setFormBadge(pkg.badge || "");
    setFormIsPopular(Boolean(pkg.isPopular));
    setFormOrder(pkg.order || 1);
    setFormDescription(pkg.description || "");
    setFormFeaturesText(pkg.features.join("\n"));
    setFormDetailedSpecs(pkg.detailedSpecs || []);
    setIsModalOpen(true);
  };

  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice.trim()) {
      toast.error("Package Name and Price are required");
      return;
    }

    const featuresArray = formFeaturesText
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    if (featuresArray.length === 0) {
      toast.error("Please add at least one feature item");
      return;
    }

    setSubmitting(true);
    try {
      const payload: Omit<DynamicPackage, "id" | "createdAt" | "updatedAt"> = {
        name: formName.trim(),
        price: formPrice.trim(),
        unit: formUnit.trim() || "Turnkey Construction Base",
        badge: formBadge.trim() || undefined,
        isPopular: formIsPopular,
        order: Number(formOrder) || 1,
        description: formDescription.trim(),
        features: featuresArray,
        detailedSpecs: formDetailedSpecs,
        isActive: true,
      };

      if (editingPackageId && !isEditingDefault) {
        // Update existing Firestore custom package
        const success = await updatePackageInFirestore(editingPackageId, payload);
        if (success) {
          toast.success(`Updated package: ${payload.name}`);
        } else {
          toast.error("Failed to update package in Firestore");
        }
      } else if (editingPackageId && isEditingDefault) {
        // To edit a default package: hide the default ID and create a Firestore document copy
        const currentHidden = hiddenDefaults.hiddenPackages || [];
        if (!currentHidden.includes(editingPackageId)) {
          const newHidden = [...currentHidden, editingPackageId];
          await saveHiddenDefaults({ hiddenPackages: newHidden });
        }
        const res = await savePackageToFirestore(payload);
        if (res.success) {
          toast.success(`Saved customized copy of ${payload.name}`);
        } else {
          toast.error("Failed to save package customization");
        }
      } else {
        // Create new package in Firestore
        const res = await savePackageToFirestore(payload);
        if (res.success) {
          toast.success(`Created new package: ${payload.name}`);
        } else {
          toast.error("Failed to create package in Firestore");
        }
      }

      setIsModalOpen(false);
      await loadAll();
    } catch (err) {
      console.error("Error saving package:", err);
      toast.error("Error saving package");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeletePackage = async (pkg: DynamicPackage) => {
    if (!pkg.id) return;
    const confirmDelete = window.confirm(`Are you sure you want to remove the "${pkg.name}" plan?`);
    if (!confirmDelete) return;

    try {
      const isDefault = DEFAULT_PACKAGES.some((d) => d.id === pkg.id);
      if (isDefault) {
        const currentHidden = hiddenDefaults.hiddenPackages || [];
        if (!currentHidden.includes(pkg.id)) {
          const newHidden = [...currentHidden, pkg.id];
          await saveHiddenDefaults({ hiddenPackages: newHidden });
          toast.success(`Hidden default plan: ${pkg.name}`);
        }
      } else {
        const success = await deletePackageFromFirestore(pkg.id);
        if (success) {
          toast.success(`Deleted plan: ${pkg.name}`);
        } else {
          toast.error("Could not delete from Firestore");
        }
      }
      await loadAll();
    } catch (err) {
      console.error("Error deleting package:", err);
      toast.error("Failed to delete package");
    }
  };

  const handleTogglePopular = async (pkg: DynamicPackage) => {
    if (!pkg.id) return;
    const newPopularState = !pkg.isPopular;
    const isDefault = DEFAULT_PACKAGES.some((d) => d.id === pkg.id);

    try {
      if (isDefault) {
        // Hide default, create custom clone with new isPopular
        const currentHidden = hiddenDefaults.hiddenPackages || [];
        if (!currentHidden.includes(pkg.id)) {
          await saveHiddenDefaults({ hiddenPackages: [...currentHidden, pkg.id] });
        }
        await savePackageToFirestore({
          name: pkg.name,
          price: pkg.price,
          unit: pkg.unit,
          badge: newPopularState ? "MOST POPULAR" : undefined,
          isPopular: newPopularState,
          order: pkg.order || 1,
          description: pkg.description,
          features: pkg.features,
          detailedSpecs: pkg.detailedSpecs,
          isActive: true,
        });
      } else {
        await updatePackageInFirestore(pkg.id, {
          isPopular: newPopularState,
          badge: newPopularState ? "MOST POPULAR" : pkg.badge,
        });
      }
      toast.success(`${pkg.name} is now ${newPopularState ? "marked as Most Popular" : "unmarked"}`);
      await loadAll();
    } catch (err) {
      console.error("Error toggling popular:", err);
      toast.error("Failed to update status");
    }
  };

  const handleRestoreDefaults = async () => {
    const confirmRestore = window.confirm("Restore all default construction packages to active view?");
    if (!confirmRestore) return;
    try {
      await saveHiddenDefaults({ hiddenPackages: [] });
      toast.success("Restored all default packages");
      await loadAll();
    } catch (err) {
      console.error("Error restoring defaults:", err);
      toast.error("Could not restore default packages");
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 bg-card border border-border rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B86F55] font-mono">
              Live Homepage &amp; Services
            </span>
            <Badge variant="outline" className="text-[10px]">
              {packages.length} Active Plans
            </Badge>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-foreground mt-1">
            Turnkey Construction Packages (Image 1 Reference)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
            Manage the 3-card pricing layout with green checkmarks, per-sq.ft rates, and the interactive consultation modal. Changes instantly reflect on the live site.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          {hiddenDefaults.hiddenPackages && hiddenDefaults.hiddenPackages.length > 0 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleRestoreDefaults}
              className="text-xs text-muted-foreground hover:text-foreground flex-1 sm:flex-none"
            >
              <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
              Reset Defaults
            </Button>
          )}

          <Button
            type="button"
            onClick={handleOpenAddModal}
            size="sm"
            className="bg-[#B86F55] hover:bg-[#A35F48] text-white text-xs uppercase tracking-wider flex-1 sm:flex-none"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add New Package
          </Button>
        </div>
      </div>

      {/* Visual Live Grid (Matches Image 1 Reference) */}
      {loading ? (
        <div className="p-12 text-center text-xs text-muted-foreground font-mono">
          Loading package cards from Firestore...
        </div>
      ) : packages.length === 0 ? (
        <div className="p-12 text-center bg-card border border-border rounded-xl space-y-3">
          <Package className="w-10 h-10 text-muted-foreground mx-auto" />
          <h4 className="font-serif text-lg font-normal text-foreground">No Packages Configured</h4>
          <p className="text-xs text-muted-foreground max-w-md mx-auto">
            You currently have no active construction plans. Click below to add a new plan or restore defaults.
          </p>
          <Button onClick={handleRestoreDefaults} size="sm" variant="outline" className="text-xs">
            Restore Defaults
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {packages.map((pkg) => {
            const isPopular = Boolean(pkg.isPopular);
            const isDefault = DEFAULT_PACKAGES.some((d) => d.id === pkg.id);

            return (
              <div
                key={pkg.id || pkg.name}
                className={`relative flex flex-col justify-between rounded-xl transition-all duration-200 bg-card p-4 sm:p-6 border ${
                  isPopular
                    ? "border-2 border-[#B86F55] shadow-md ring-1 ring-[#B86F55]/20"
                    : "border-border shadow-xs hover:border-primary/50"
                }`}
              >
                {/* Popular Pill */}
                {isPopular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                    <span className="bg-[#B86F55] text-white text-[10px] font-bold tracking-widest uppercase px-3 py-0.5 rounded-full shadow-xs">
                      {pkg.badge || "MOST POPULAR"}
                    </span>
                  </div>
                )}

                <div>
                  {/* Top Bar with Badge & Origin */}
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
                      {isDefault ? "Default Preset" : "Custom Firestore"}
                    </span>

                    <span className="text-[10px] font-mono text-muted-foreground">
                      Order: #{pkg.order || 1}
                    </span>
                  </div>

                  {/* Title & Price */}
                  <h4 className="font-serif text-xl font-normal text-foreground mt-1">
                    {pkg.name}
                  </h4>

                  <div className="mt-2 mb-4">
                    <span
                      className={`font-serif text-2xl sm:text-3xl font-semibold tracking-tight ${
                        isPopular ? "text-[#B86F55]" : "text-foreground"
                      }`}
                    >
                      {pkg.price}
                    </span>
                    {pkg.unit && (
                      <p className="text-[11px] text-muted-foreground mt-0.5">{pkg.unit}</p>
                    )}
                  </div>

                  {/* Features List with checkmarks */}
                  <div className="space-y-2 pt-4 border-t border-border">
                    {pkg.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-foreground/90">
                        <div className="w-4 h-4 rounded-full bg-emerald-500/10 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-2.5 h-2.5 stroke-[3]" />
                        </div>
                        <span className="leading-snug">{feat}</span>
                      </div>
                    ))}
                  </div>

                  {pkg.description && (
                    <p className="text-[11px] text-muted-foreground mt-4 pt-3 border-t border-border/60 italic">
                      {pkg.description}
                    </p>
                  )}
                </div>

                {/* Card Admin Actions */}
                <div className="pt-4 sm:pt-6 mt-4 sm:mt-6 border-t border-border flex flex-wrap items-center justify-between gap-2">
                  <Button
                    type="button"
                    variant={isPopular ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleTogglePopular(pkg)}
                    className={`h-8 text-[11px] px-2.5 ${
                      isPopular
                        ? "bg-[#B86F55] hover:bg-[#A35F48] text-white"
                        : "text-muted-foreground"
                    }`}
                    title={isPopular ? "Remove popular badge" : "Make this plan Most Popular"}
                  >
                    <Star className="w-3 h-3 mr-1 fill-current" />
                    {isPopular ? "Popular" : "Set Popular"}
                  </Button>

                  <div className="flex items-center gap-1.5">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => handleOpenEditModal(pkg)}
                      className="h-8 text-[11px] px-2.5"
                    >
                      <Pencil className="w-3 h-3 mr-1" />
                      Edit
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePackage(pkg)}
                      className="h-8 text-[11px] px-2 text-destructive hover:bg-destructive/10"
                      title="Delete / Hide this package"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT PACKAGE MODAL */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-[95vw] sm:max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6 sm:p-8">
          <DialogHeader>
            <DialogTitle className="font-serif text-2xl font-normal text-foreground">
              {editingPackageId ? `Edit Package: ${formName}` : "Create New Construction Package"}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Configure name, pricing, unit rate, and checkmark inclusions for the live card and interactive popup modal.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSavePackage} className="space-y-4 pt-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="pkgName" className="text-xs">Package Title *</Label>
                <Input
                  id="pkgName"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Gold Radiance / Premium Plan"
                  required
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pkgPrice" className="text-xs">Price / Rate *</Label>
                <Input
                  id="pkgPrice"
                  value={formPrice}
                  onChange={(e) => setFormPrice(e.target.value)}
                  placeholder="e.g. ₹2,350 / sq.ft or ₹18,000"
                  required
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="pkgUnit" className="text-xs">Unit / Scope Subtitle</Label>
                <Input
                  id="pkgUnit"
                  value={formUnit}
                  onChange={(e) => setFormUnit(e.target.value)}
                  placeholder="e.g. Turnkey Construction Base"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pkgBadge" className="text-xs">Badge Tag (Optional)</Label>
                <Input
                  id="pkgBadge"
                  value={formBadge}
                  onChange={(e) => setFormBadge(e.target.value)}
                  placeholder="e.g. MOST POPULAR, ROYAL"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="pkgOrder" className="text-xs">Display Order</Label>
                <Input
                  id="pkgOrder"
                  type="number"
                  min={1}
                  max={20}
                  value={formOrder}
                  onChange={(e) => setFormOrder(Number(e.target.value))}
                  className="h-9 text-xs font-mono"
                />
              </div>
            </div>

            {/* Popular Toggle Checkbox */}
            <div className="p-3 bg-secondary/40 border border-border rounded-lg flex items-center justify-between">
              <div>
                <Label htmlFor="pkgPopular" className="text-xs font-medium cursor-pointer">
                  Feature as &quot;Most Popular&quot; Card
                </Label>
                <p className="text-[11px] text-muted-foreground">
                  Gives the card a highlighted border, slight elevation, and top pill ribbon (as in Image 1).
                </p>
              </div>
              <input
                id="pkgPopular"
                type="checkbox"
                checked={formIsPopular}
                onChange={(e) => setFormIsPopular(e.target.checked)}
                className="w-4 h-4 rounded text-primary focus:ring-primary cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="pkgDesc" className="text-xs">Short Overview / Pitch</Label>
              <Textarea
                id="pkgDesc"
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                placeholder="Brief description shown inside the consultation modal..."
                rows={2}
                className="text-xs resize-none"
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="pkgFeatures" className="text-xs">
                  Card Inclusions (One feature per line, green checkmark) *
                </Label>
                <span className="text-[10px] text-muted-foreground font-mono">
                  {formFeaturesText.split("\n").filter((t) => t.trim().length > 0).length} items
                </span>
              </div>
              <Textarea
                id="pkgFeatures"
                value={formFeaturesText}
                onChange={(e) => setFormFeaturesText(e.target.value)}
                placeholder="Airbrush Makeup&#10;Advanced Hair Styling&#10;Premium Draping&#10;Premium Lashes..."
                rows={5}
                className="text-xs font-mono leading-relaxed"
                required
              />
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2 sm:gap-3 pt-4 border-t border-border">
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
                {submitting ? "Saving..." : editingPackageId ? "Update Package" : "Publish Package"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
