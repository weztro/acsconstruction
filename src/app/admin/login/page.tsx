"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/layout/Logo";
import { Lock, Mail, ArrowRight, ShieldCheck, AlertCircle } from "lucide-react";

export default function AdminLoginPage() {
  const router = useRouter();
  const { user, login, isMock } = useAuth();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    if (user) {
      router.push("/admin");
    }
  }, [user, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      router.push("/admin");
    } else {
      setError(res.error || "Unable to sign in. Please verify your credentials.");
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-16 bg-background">
      <div className="w-full max-w-md space-y-8 bg-card p-8 sm:p-10 rounded-xl border border-border shadow-sm">
        <div className="text-center space-y-3">
          <div className="flex justify-center mb-2">
            <Logo size="md" asLink={false} />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-[#B86F55] dark:text-[#B8735B]">
            Management Portal
          </span>
          <h1 className="font-serif text-2xl font-normal text-foreground">
            Sign In to Atelier Dashboard
          </h1>
          <p className="text-xs text-muted-foreground">
            Access client leads, project uploads, and construction inquiries.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-md bg-destructive/10 border border-destructive/20 text-destructive text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@acsconstruction.in"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-foreground">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-xs bg-background border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 text-xs tracking-wider uppercase font-medium mt-2"
          >
            {loading ? (
              <span>Signing In...</span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <span>Enter Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            )}
          </Button>
        </form>

        {isMock && (
          <div className="p-4 rounded-md bg-secondary/50 border border-border text-xs text-muted-foreground space-y-1">
            <div className="flex items-center gap-1.5 font-medium text-foreground">
              <ShieldCheck className="w-3.5 h-3.5 text-primary" />
              <span>Demo / Setup Credentials:</span>
            </div>
            <p className="font-mono text-[11px]">
              Email: <span className="text-foreground">admin@acsconstruction.in</span>
            </p>
            <p className="font-mono text-[11px]">
              Password: <span className="text-foreground">admin123</span>
            </p>
            <p className="text-[10px] text-muted-foreground pt-1">
              Add your Firebase Auth keys to <code className="text-primary">.env.local</code> to connect your live Firebase project.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
