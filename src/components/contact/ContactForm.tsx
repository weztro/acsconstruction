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
import { Send, CheckCircle2, Loader2 } from "lucide-react";

export function ContactForm() {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [isSubmitted, setIsSubmitted] = React.useState(false);

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
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        toast.success("Enquiry Received", {
          description:
            "Thank you! Our principal architect will contact you within 24 hours.",
        });
        setIsSubmitted(true);
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
    return (
      <div className="p-8 sm:p-12 bg-card border border-border rounded-md text-center space-y-6 shadow-xs">
        <div className="w-12 h-12 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <div className="space-y-2">
          <h3 className="font-serif text-2xl font-normal text-foreground">
            Thank You for Reaching Out
          </h3>
          <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
            Your residential enquiry has reached our design desk. An architect will review
            your location and requirements and call you for an initial exploratory discussion.
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => setIsSubmitted(false)}
          className="mt-4 text-xs tracking-wider uppercase font-medium border-border"
        >
          Send Another Enquiry
        </Button>
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
            Submitting Enquiry...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Send className="w-3.5 h-3.5" />
            Submit Consultation Request
          </span>
        )}
      </Button>

      <p className="text-[11px] text-muted-foreground text-center">
        We respect your privacy. Your contact details are never shared with third parties.
      </p>
    </form>
  );
}
