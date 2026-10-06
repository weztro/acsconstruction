import type { Metadata, Viewport } from "next";
import { Syne, Manrope } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "@/components/ui/sonner";
import { FloatingWhatsApp } from "@/components/ui/floating-whatsapp";
import { VisitorTracker } from "@/components/analytics/VisitorTracker";
import { AuthProvider } from "@/context/AuthContext";
import { BRAND } from "@/lib/constants";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: `${BRAND.name} — Indian House Construction & Architectural Design`,
    template: `%s | ${BRAND.name}`,
  },
  description:
    "We design and build authentic, enduring homes for Indian families. Modern Indian villas, traditional courtyard sanctuaries, and turnkey residential construction crafted with natural stone, wood, and concrete.",
  keywords: [
    "Indian house construction",
    "Modern Indian villa",
    "Courtyard house architecture",
    "Kerala traditional home builders",
    "Turnkey residential construction Bangalore",
    "Architectural design studio India",
    "Vastu compliant villa construction",
    "Terracotta brick house design",
  ],
  authors: [{ name: BRAND.name }],
  metadataBase: new URL(BRAND.siteUrl),
  openGraph: {
    title: `${BRAND.name} — Indian House Construction & Architectural Design`,
    description:
      "From timeless traditional homes to contemporary Indian villas, we design and build spaces made for the way Indian families live.",
    url: BRAND.siteUrl,
    siteName: BRAND.name,
    locale: "en_IN",
    type: "website",
    images: [
      {
        url: "/images/hero/hero-villa.jpg",
        width: 1600,
        height: 1000,
        alt: `${BRAND.name} Modern Indian Villa Architecture`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — Indian House Construction & Architectural Design`,
    description:
      "Crafting bespoke residential sanctuaries across India. Turnkey construction, architectural plans, and structural excellence.",
    images: ["/images/hero/hero-villa.jpg"],
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#F5F2EA" },
    { media: "(prefers-color-scheme: dark)", color: "#191A18" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${syne.variable} ${manrope.variable}`}>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col selection:bg-primary/20 selection:text-primary">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <VisitorTracker />
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <FloatingWhatsApp />
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
