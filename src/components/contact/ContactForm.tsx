"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { contactFormSchema, type ContactFormData } from "@/lib/validations";
import { PROJECT_TYPES, BUDGET_RANGES } from "@/lib/constants";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Send, CheckCircle2, Loader2, MessageSquare, Phone } from "lucide-react";

function buildWhatsAppUrl(data: ContactFormData): string {
  const whatsappNumber = "916382995103";
  const message = [
    `*🏛️ New Construction Enquiry — ACS Construction*`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `👤 *Name:* ${data.name}`,
    `📞 *Phone:* ${data.phone}`,
    `✉️ *Email:* ${data.email}`,
    `📍 *Plot Location:* ${data.location || "Tenkasi, Tamil Nadu"}`,
    `🏡 *Project Type:* ${data.projectType || "Residential Villa"}`,
    `💰 *Budget Range:* ${data.budget || "Not Specified"}`,
    `💬 *Requirements & Notes:*`,
    `${data.message}`,
    `━━━━━━━━━━━━━━━━━━━━`,
    `_Sent via acsconstruction.vercel.app_`,
  ].join("\n");

  return `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
}

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [submittedData, setSubmittedData] = React.useState<ContactFormData | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      location: "",
      projectType: "",
      budget: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    try {
      // 1. Save lead to Firestore Database
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setSubmittedData(data);
        setIsSubmitted(true);
        toast.success("Enquiry Saved!", {
          description: "Forwarding details to WhatsApp for fastest response...",
        });

        // 2. Automatically open WhatsApp in new tab
        const waUrl = buildWhatsAppUrl(data);
        if (typeof window !== "undefined") {
          window.open(waUrl, "_blank");
        }

        reset();
      } else {
        toast.error("Submission Failed", {
          description:
            result.message || "Unable to send your message. Please try again or call us.",
        });
      }
    } catch {
      toast.error("Network Error", {
        description: "Please check your connection or contact us directly via phone.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    const waUrl = submittedData ? buildWhatsAppUrl(submittedData) : `https://wa.me/916382995103`;
    return (
      <div className="p-8 sm:p-12 bg-card border border-border rounded-xl text-center space-y-6 shadow-xs">
        <div className="w-14 h-14 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-[#B86F55]">
            Enquiry Received &amp; Logged
          </span>
          <h3 className="font-serif text-2xl sm:text-3xl font-normal text-foreground">
            Thank You for Reaching Out
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Your residential enquiry has been logged to our studio database. We have also pre-filled your enquiry on WhatsApp for direct instant chat.
          </p>
        </div>

        {/* WhatsApp Forwarding Card */}
        <div className="p-5 bg-emerald-500/5 border border-emerald-500/20 rounded-lg max-w-md mx-auto space-y-3 text-left">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
            <MessageSquare className="w-4 h-4 shrink-0" />
            <span>Direct WhatsApp Forwarding</span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Did WhatsApp not open automatically? Tap the button below to send your pre-filled inquiry to our WhatsApp number directly.
          </p>
          <Button
            asChild
            className="w-full bg-[#25D366] hover:bg-[#20ba59] text-white font-medium text-xs h-10 shadow-xs uppercase tracking-wider"
          >
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat on WhatsApp (+91 6382995103)</span>
            </a>
          </Button>
        </div>

        {/* Direct Call & Reset Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="text-xs h-9 border-border"
          >
            <a href="tel:+919486943652" className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-primary" />
              <span>Direct Call (+91 94869 43652)</span>
            </a>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsSubmitted(false)}
            className="text-xs h-9 text-muted-foreground hover:text-foreground"
          >
            Submit Another Enquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="p-8 sm:p-10 bg-card border border-border rounded-md shadow-xs space-y-6"
      noValidate
    >
      <div className="space-y-1.5">
        <h3 className="font-serif text-2xl font-normal text-foreground">
          Tell Us About Your Project
        </h3>
        <p className="text-xs sm:text-sm text-muted-foreground">
          Fill in your details below and we&rsquo;ll arrange a free architectural consultation.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Full Name <span className="text-[#B86F55] dark:text-[#B8735B]">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g. Arvind Sharma"
            {...register("name")}
            aria-invalid={!!errors.name}
            className="rounded-md"
          />
          {errors.name && (
            <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
          )}
        </div>

        {/* Phone Number */}
        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone Number <span className="text-[#B86F55] dark:text-[#B8735B]">*</span>
          </Label>
          <Input
            id="phone"
            type="tel"
            placeholder="e.g. 98765 43210 or +91 9876543210"
            {...register("phone")}
            aria-invalid={!!errors.phone}
            className="rounded-md"
          />
          {errors.phone && (
            <p className="text-xs text-red-500 mt-1">{errors.phone.message}</p>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Email Address */}
        <div className="space-y-2">
          <Label htmlFor="email">
            Email Address <span className="text-[#B86F55] dark:text-[#B8735B]">*</span>
          </Label>
          <Input
            id="email"
            type="email"
            placeholder="name@example.com"
            {...register("email")}
            aria-invalid={!!errors.email}
            className="rounded-md"
          />
          {errors.email && (
            <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        {/* Project Location */}
        <div className="space-y-2">
          <Label htmlFor="location">Project Location / City</Label>
          <Input
            id="location"
            placeholder="e.g. Whitefield, Bengaluru or Kochi"
            {...register("location")}
            className="rounded-md"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        {/* Project Type */}
        <div className="space-y-2">
          <Label htmlFor="projectType">Project Type</Label>
          <Select onValueChange={(val) => setValue("projectType", val)}>
            <SelectTrigger id="projectType" className="rounded-md">
              <SelectValue placeholder="Select Project Type" />
            </SelectTrigger>
            <SelectContent>
              {PROJECT_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Budget Range */}
        <div className="space-y-2">
          <Label htmlFor="budget">Estimated Budget</Label>
          <Select onValueChange={(val) => setValue("budget", val)}>
            <SelectTrigger id="budget" className="rounded-md">
              <SelectValue placeholder="Select Budget Range" />
            </SelectTrigger>
            <SelectContent>
              {BUDGET_RANGES.map((b) => (
                <SelectItem key={b} value={b}>
                  {b}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label htmlFor="message">
          Project Details & Aspirations <span className="text-[#B86F55] dark:text-[#B8735B]">*</span>
        </Label>
        <Textarea
          id="message"
          rows={4}
          placeholder="Describe your plot size, facing (East/North), preferred architecture style (Courtyard, Kerala, Modern Brick, etc.), family requirements, and target move-in timeline."
          {...register("message")}
          aria-invalid={!!errors.message}
          className="rounded-md"
        />
        {errors.message && (
          <p className="text-xs text-red-500 mt-1">{errors.message.message}</p>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        variant="default"
        className="w-full h-11 text-xs uppercase tracking-wider font-medium rounded-md"
      >
        {isSubmitting ? (
          <span className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            Saving &amp; Opening WhatsApp...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="w-3.5 h-3.5" />
            Submit Request &amp; Connect via WhatsApp
          </span>
        )}
      </Button>

      <p className="text-[11px] text-muted-foreground text-center">
        Enquiries are saved to our studio database and forwarded directly to WhatsApp (+91 6382995103) for the fastest response.
      </p>
    </form>
  );
}
