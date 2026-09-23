import { z } from "zod";

// Validates Indian mobile number formats with optional country code, spaces, or hyphens:
// Examples: 9876543210, +91 98765 43210, +919876543210, 09876543210, +91-98765-43210
const indianPhoneRegex = /^(?:(?:\+|0{0,2})91[\s-]?)?[6-9](?:[\s-]?\d){9}$/;

export const contactFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, { message: "Please enter your full name (at least 2 characters)." })
    .max(100, { message: "Name must be less than 100 characters." }),
  phone: z
    .string()
    .trim()
    .min(10, { message: "Please enter a valid 10-digit mobile number." })
    .regex(indianPhoneRegex, {
      message: "Please enter a valid Indian mobile number (e.g., 98765 43210 or +91 9876543210).",
    }),
  email: z
    .string()
    .trim()
    .email({ message: "Please enter a valid email address." })
    .max(120, { message: "Email is too long." }),
  location: z
    .string()
    .trim()
    .max(150, { message: "Location must be less than 150 characters." })
    .optional()
    .or(z.literal("")),
  projectType: z
    .string()
    .max(100)
    .optional()
    .or(z.literal("")),
  budget: z
    .string()
    .max(100)
    .optional()
    .or(z.literal("")),
  message: z
    .string()
    .trim()
    .min(10, {
      message: "Please share a few details about your project (at least 10 characters).",
    })
    .max(2000, { message: "Message cannot exceed 2000 characters." }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
