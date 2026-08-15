"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuthStore } from "@/lib/auth-store";
import { Sparkles, Mail, ArrowRight } from "lucide-react";

interface AuthDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const router = useRouter();
  const loginWithEmail = useAuthStore((s) => s.loginWithEmail);
  const continueAsGuest = useAuthStore((s) => s.continueAsGuest);
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast.error("Enter a valid email to continue");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      loginWithEmail(name, email);
      toast.success(`Welcome${name ? `, ${name}` : ""}!`);
      onOpenChange(false);
      router.push("/dashboard");
    }, 400);
  }

  function handleGuest() {
    continueAsGuest();
    toast.success("Continuing as guest — your work saves to this device.");
    onOpenChange(false);
    router.push("/dashboard");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-full bg-accent/15 text-accent">
            <Sparkles className="h-5 w-5" />
          </div>
          <DialogTitle>Welcome to Bestify</DialogTitle>
          <DialogDescription>
            Sign in to save your scrapbooks across sessions, or jump in as a guest.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleEmailLogin} className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="name">Name</Label>
            <Input id="name" placeholder="Dev Patel" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                required
                placeholder="you@example.com"
                className="pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <Button type="submit" variant="primary" className="w-full" disabled={loading}>
            {loading ? "Signing in…" : "Continue with email"}
            <ArrowRight className="h-4 w-4" />
          </Button>
        </form>

        <div className="relative py-1 text-center text-xs text-muted-foreground">
          <span className="relative bg-card px-2">or</span>
          <div className="absolute left-0 top-1/2 -z-10 h-px w-full bg-border" />
        </div>

        <Button variant="outline" className="w-full" onClick={handleGuest}>
          Continue as guest
        </Button>
        <p className="text-center text-[11px] text-muted-foreground">
          Guest work is saved locally on this device only.
        </p>
      </DialogContent>
    </Dialog>
  );
}
