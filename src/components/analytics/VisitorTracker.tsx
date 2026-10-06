"use client";

import * as React from "react";
import { usePathname } from "next/navigation";
import { logSiteVisit } from "@/lib/firebase";

function getDeviceInfo(ua: string): "Mobile" | "Desktop" | "Tablet" {
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
    return "Tablet";
  }
  if (
    /Mobile|Android|iP(hone|od)|IEMobile|BlackBerry|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/i.test(
      ua
    )
  ) {
    return "Mobile";
  }
  return "Desktop";
}

function getBrowserName(ua: string): string {
  if (/edg/i.test(ua)) return "Microsoft Edge";
  if (/chrome|crios/i.test(ua) && !/opr|opera/i.test(ua)) return "Google Chrome";
  if (/safari/i.test(ua) && !/chrome|crios/i.test(ua)) return "Apple Safari";
  if (/firefox|fxios/i.test(ua)) return "Mozilla Firefox";
  if (/opr|opera/i.test(ua)) return "Opera";
  if (/samsungbrowser/i.test(ua)) return "Samsung Internet";
  return "Browser";
}

function getOSName(ua: string): string {
  if (/windows/i.test(ua)) return "Windows";
  if (/android/i.test(ua)) return "Android";
  if (/iphone|ipad|ipod/i.test(ua)) return "iOS";
  if (/macintosh|mac os x/i.test(ua)) return "macOS";
  if (/linux/i.test(ua)) return "Linux";
  return "Other OS";
}

function getReferrerSource(ref: string): string {
  if (!ref) return "Direct / Bookmark";
  const lower = ref.toLowerCase();
  if (lower.includes("whatsapp") || lower.includes("wa.me")) return "WhatsApp";
  if (lower.includes("instagram")) return "Instagram";
  if (lower.includes("facebook") || lower.includes("fb.com")) return "Facebook";
  if (lower.includes("google")) return "Google Search";
  if (lower.includes("linkedin")) return "LinkedIn";
  if (lower.includes("youtube")) return "YouTube";
  try {
    const url = new URL(ref);
    if (url.hostname === window.location.hostname) return "Internal Navigation";
    return url.hostname;
  } catch {
    return "External Link";
  }
}

export function VisitorTracker() {
  const pathname = usePathname();
  const lastLoggedPathRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (!pathname || pathname.startsWith("/admin") || pathname.startsWith("/api")) {
      return;
    }

    // Prevent immediate duplicate log on same path within current session
    if (lastLoggedPathRef.current === pathname) {
      return;
    }
    lastLoggedPathRef.current = pathname;

    // Get or initialize persistent session ID
    let sessionId = "";
    try {
      sessionId = sessionStorage.getItem("acs_visitor_session") || "";
      if (!sessionId) {
        sessionId =
          "s_" +
          Date.now().toString(36) +
          "_" +
          Math.random().toString(36).substring(2, 7);
        sessionStorage.setItem("acs_visitor_session", sessionId);
      }
    } catch {
      sessionId = "s_anonymous";
    }

    const ua = navigator.userAgent;
    const device = getDeviceInfo(ua);
    const browser = getBrowserName(ua);
    const os = getOSName(ua);
    const referrer = getReferrerSource(document.referrer);

    // Asynchronously log visit
    logSiteVisit({
      path: pathname,
      referrer,
      device,
      browser,
      os,
      sessionId,
    });
  }, [pathname]);

  return null;
}
