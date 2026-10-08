"use client";

import * as React from "react";
import {
  TrendingUp,
  Save,
  RotateCcw,
  Plus,
  Trash2,
  Sparkles,
  Eye,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import {
  DEFAULT_HERO_METRICS,
  type HeroMetricItem,
} from "@/lib/constants";
import {
  fetchHeroMetricsFromFirestore,
  saveHeroMetricsToFirestore,
} from "@/lib/firebase";

export function HeroMetricsManager() {
  const [metrics, setMetrics] = React.useState<HeroMetricItem[]>(DEFAULT_HERO_METRICS);
  const [loading, setLoading] = React.useState(true);
  const [saving, setSaving] = React.useState(false);

  React.useEffect(() => {
    let isMounted = true;
    fetchHeroMetricsFromFirestore()
      .then((data) => {
        if (isMounted && data && data.length > 0) {
          setMetrics(data);
        }
      })
      .catch((err) => {
        console.warn("Could not load hero metrics:", err);
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, []);

  const handleMetricChange = (index: number, field: "value" | "label", val: string) => {
    setMetrics((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: val };
      return copy;
    });
  };

  const handleAddMetric = () => {
    setMetrics((prev) => [
      ...prev,
      {
        id: `metric-${Date.now()}`,
        value: "100% On-Time",
        label: "Guaranteed Handover",
      },
    ]);
  };

  const handleRemoveMetric = (index: number) => {
    if (metrics.length <= 1) {
      toast.error("You must have at least one hero indicator");
      return;
    }
    setMetrics((prev) => prev.filter((_, i) => i !== index));
  };

  const handleResetDefaults = () => {
    const confirmReset = window.confirm("Reset hero trust indicators to default values?");
    if (!confirmReset) return;
    setMetrics(DEFAULT_HERO_METRICS);
    toast.info("Reset to default indicators. Click Save to persist.");
  };

  const handleSave = async () => {
    // Validate
    const invalid = metrics.some((m) => !m.value.trim() || !m.label.trim());
    if (invalid) {
      toast.error("All metric values and labels must be filled");
      return;
    }

    setSaving(true);
    try {
      const ok = await saveHeroMetricsToFirestore(metrics);
      if (ok) {
        toast.success("Hero trust indicators successfully updated on live homepage!");
      } else {
        toast.error("Could not save to Firestore. Check connection.");
      }
    } catch (err) {
      console.error("Error saving hero metrics:", err);
      toast.error("Failed to save hero indicators");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 bg-card border border-border rounded-xl shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#B86F55] font-mono">
              Homepage Hero Section
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-secondary text-muted-foreground border border-border">
              Image 2 Reference
            </span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-normal text-foreground mt-1">
            Hero Trust Indicators &amp; Key Metrics
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
            Edit the 3 trust indicators positioned below the consultation buttons in the homepage Hero section.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleResetDefaults}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            <RotateCcw className="w-3.5 h-3.5 mr-1.5" />
            Reset Defaults
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            size="sm"
            className="bg-[#B86F55] hover:bg-[#A35F48] text-white text-xs uppercase tracking-wider px-4"
          >
            <Save className="w-3.5 h-3.5 mr-1.5" />
            {saving ? "Saving..." : "Save to Live Homepage"}
          </Button>
        </div>
      </div>

      {/* LIVE PREVIEW BANNER (Replicates Image 2 Exactly) */}
      <div className="p-6 sm:p-8 bg-card border border-border rounded-xl shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-mono">
            <Eye className="w-3.5 h-3.5 text-primary" />
            <span>Live Section Preview (How it appears in the Hero)</span>
          </div>
          <span className="text-[10px] text-muted-foreground font-mono">
            Synchronized with live frontend
          </span>
        </div>

        <div className="p-6 bg-background rounded-lg border border-border/80">
          <div className="flex flex-wrap items-center gap-8 text-xs text-muted-foreground">
            {metrics.map((item, idx) => (
              <React.Fragment key={item.id || idx}>
                {idx > 0 && <div className="h-8 w-[1px] bg-border hidden sm:block" />}
                <div className="space-y-0.5 min-w-[120px]">
                  <p className="font-serif text-base sm:text-lg font-normal text-foreground tracking-tight">
                    {item.value || "₹2,350 / sq.ft"}
                  </p>
                  <p className="text-[11px] text-muted-foreground">
                    {item.label || "Turnkey Construction Base"}
                  </p>
                </div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* EDITORS FORM */}
      <div className="p-6 sm:p-8 bg-card border border-border rounded-xl shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="font-serif text-lg font-normal text-foreground">
            Configure Metrics ({metrics.length})
          </h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleAddMetric}
            className="text-xs"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            Add Indicator
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {metrics.map((item, idx) => (
            <div
              key={item.id || idx}
              className="p-5 rounded-lg bg-secondary/30 border border-border space-y-4 relative group"
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono font-semibold uppercase text-primary">
                  Indicator #{idx + 1}
                </span>
                {metrics.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveMetric(idx)}
                    className="text-muted-foreground hover:text-destructive transition-colors p-1"
                    title="Remove indicator"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`val-${idx}`} className="text-xs">
                  Highlighted Value / Stat *
                </Label>
                <Input
                  id={`val-${idx}`}
                  value={item.value}
                  onChange={(e) => handleMetricChange(idx, "value", e.target.value)}
                  placeholder="e.g. ₹2,350 / sq.ft or 45-Point Audit"
                  className="h-9 text-xs font-serif font-medium"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor={`lbl-${idx}`} className="text-xs">
                  Subtitle / Description *
                </Label>
                <Input
                  id={`lbl-${idx}`}
                  value={item.label}
                  onChange={(e) => handleMetricChange(idx, "label", e.target.value)}
                  placeholder="e.g. Turnkey Construction Base"
                  className="h-9 text-xs"
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-end pt-4 border-t border-border">
          <Button
            type="button"
            onClick={handleSave}
            disabled={saving || loading}
            className="bg-[#B86F55] hover:bg-[#A35F48] text-white text-xs font-medium px-6 h-10"
          >
            <Save className="w-3.5 h-3.5 mr-2" />
            {saving ? "Publishing to Live Site..." : "Save Changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}
