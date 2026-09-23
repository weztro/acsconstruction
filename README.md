# Sthapati Homes & Architecture — Indian House Construction Website

A production-quality Indian house construction and architectural design website built with **Next.js 16 (App Router)**, **TypeScript**, **Tailwind CSS v4**, and customized **shadcn/ui**.

The website combines modern Indian architecture, traditional heritage craftsmanship (courtyards, verandas, jali latticework, Mangalore clay tiles, teak wood joinery, Sadahalli granite), warmth, trust, and structural engineering discipline.

---

## 1. Architectural Design Philosophy & Visual Language

- **Indian Architectural Identity**: Warm terracotta, sand, natural granite, exposed red bricks, and seasoned timber.
- **Dedicated Light & Dark Themes**:
  - **Light Mode**: Warm ivory (`#FAF7F2`), deep charcoal (`#1F1D1A`), terracotta (`#C2593F`), and sand beige (`#EFE8DC`).
  - **Dark Mode**: Deep charcoal/warm black (`#141312`), warm white (`#F5F2EB`), and muted terracotta (`#D96B50`).
- **No SaaS Clichés**: No generic blue gradients, no neon glassmorphism, no artificial floating blobs. Built with grounded architectural proportions, tactile borders, and thoughtful typography.

---

## 2. Project Architecture

```
src/
├── app/
│   ├── layout.tsx                # Root layout with ThemeProvider, fonts, metadata, sonner
│   ├── page.tsx                  # Homepage with 12 complete architectural sections
│   ├── globals.css               # Centralized CSS variables for light & dark themes
│   ├── about/page.tsx            # Origin, sthapati leadership, material standards
│   ├── services/page.tsx         # 6 core services + accordion FAQs
│   ├── projects/
│   │   ├── page.tsx              # Filterable architectural portfolio
│   │   └── [slug]/page.tsx       # Dynamic project case study (Courtyard, Kerala, etc.)
│   ├── process/page.tsx          # 7-step building journey & digital milestone tracking
│   ├── contact/page.tsx          # Studio coordinates, WhatsApp direct connect & form
│   └── api/contact/route.ts      # Server-side Zod validation & Nodemailer email dispatch
├── components/
│   ├── theme-provider.tsx        # next-themes provider wrapper
│   ├── layout/
│   │   ├── Navbar.tsx            # Sticky header with scroll blur, quote CTA & toggle
│   │   ├── Footer.tsx            # Comprehensive footer with Indian studio details
│   │   ├── MobileMenu.tsx        # shadcn Sheet mobile navigation drawer
│   │   └── ThemeToggle.tsx       # Accessible light/dark switcher
│   ├── home/
│   │   ├── Hero.tsx              # Imposing architectural hero with twilight visual
│   │   ├── TrustStats.tsx        # 15+ years, 250+ homes, 120+ families, 100% quality
│   │   ├── AboutPreview.tsx      # Split editorial layout ("More Than Construction")
│   │   ├── Services.tsx          # 6 primary residential capabilities
│   │   ├── ArchitectureShowcase.tsx # Indian Homes, Reimagined (6 vernacular styles)
│   │   ├── FeaturedProject.tsx   # The Courtyard Residence case study
│   │   ├── WorkmanshipSection.tsx # Dedicated Indian construction worker & craftsman
│   │   ├── IndianArchitecturePhilosophy.tsx # Courtyards, Verandahs, Jali, Mangalore tiles
│   │   ├── WhyChooseUs.tsx       # 6 trust pillars
│   │   ├── ConstructionProcess.tsx # 7-step timeline (horizontal on desktop, vertical on mobile)
│   │   ├── Testimonials.tsx      # Authentic replaceable homeowner reflections
│   │   └── FinalCTA.tsx          # Large architectural backdrop CTA
│   ├── projects/
│   │   ├── ProjectCard.tsx       # Architectural card with hover zoom & tags
│   │   └── ProjectGallery.tsx    # Filterable project category gallery
│   ├── contact/
│   │   └── ContactForm.tsx       # React Hook Form + Zod with Indian phone validation
│   └── ui/                       # Customized shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── textarea.tsx
│       ├── select.tsx
│       ├── label.tsx
│       ├── badge.tsx
│       ├── sheet.tsx
│       ├── dialog.tsx
│       ├── separator.tsx
│       ├── accordion.tsx
│       ├── dropdown-menu.tsx
│       ├── tooltip.tsx
│       └── sonner.tsx
├── lib/
│   ├── constants.ts              # Centralized brand, services, projects, styles, stats
│   ├── validations.ts            # Shared Zod validation schema for Indian phone numbers
│   ├── email.ts                  # Branded HTML email template & Nodemailer dispatcher
│   └── utils.ts                  # cn() class utility
public/
└── images/
    ├── hero/                     # Hero villa visuals
    ├── architecture/             # 6 Indian architectural styles
    ├── workers/                  # Indian residential construction craftsman
    ├── projects/                 # Realized residence galleries
    └── interiors/                # Living, dining, courtyard interior views
```

---

## 3. Environment Variables Configuration

Create a `.env.local` file based on `.env.example`:

| Variable | Description | Example |
|---|---|---|
| `NEXT_PUBLIC_BRAND_NAME` | Public company brand name | `"Sthapati Homes & Architecture"` |
| `NEXT_PUBLIC_BRAND_TAGLINE` | Company tagline | `"Building Homes. Creating Legacies."` |
| `NEXT_PUBLIC_SITE_URL` | Canonical website URL | `"http://localhost:3000"` |
| `COMPANY_PHONE` | Studio contact telephone | `"+91 98450 12890"` |
| `COMPANY_EMAIL` | General enquiry email address | `"contact@sthapatidesign.in"` |
| `COMPANY_ADDRESS` | Physical office address | `"Koramangala 4th Block, Bengaluru"` |
| `WHATSAPP_NUMBER` | WhatsApp number for direct chat | `"+919845012890"` |
| `CONTACT_TO_EMAIL` | Destination mailbox for enquiries | `"contact@sthapatidesign.in"` |
| `EMAIL_HOST` | SMTP server hostname | `"smtp.example.com"` |
| `EMAIL_PORT` | SMTP server port | `"587"` |
| `EMAIL_USER` | SMTP username | `"your-email@example.com"` |
| `EMAIL_PASSWORD` | SMTP password | `"your-smtp-password"` |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Instagram page link | `"https://instagram.com/sthapatidesign"` |
| `NEXT_PUBLIC_FACEBOOK_URL` | Facebook page link | `"https://facebook.com/sthapatidesign"` |
| `NEXT_PUBLIC_YOUTUBE_URL` | YouTube channel link | `"https://youtube.com/@sthapatidesign"` |
| `NEXT_PUBLIC_LINKEDIN_URL` | LinkedIn company link | `"https://linkedin.com/company/sthapatidesign"` |

> **Note**: In local development, if `EMAIL_HOST` is set to `smtp.example.com`, the API route activates **Simulation Mode**, logging the validated enquiry neatly to the terminal while returning a real success response to the user interface.

---

## 4. Development & Production Commands

```bash
# Install dependencies
npm install

# Run local development server (Turbopack)
npm run dev

# Run TypeScript typecheck and production build
npm run build

# Run linting
npm run lint

# Start production server
npm run start
```
