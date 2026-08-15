"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Sparkles,
  Layers,
  Palette,
  Download,
  MousePointer2,
  ArrowRight,
  Plane,
  Coffee,
  Heart,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { useAuthStore } from "@/lib/auth-store";
import { TEMPLATES } from "@/lib/templates-data";
import { MiniCanvasPreview } from "@/components/shared/mini-canvas-preview";

const FEATURES = [
  {
    icon: MousePointer2,
    title: "Drag, drop, done",
    body: "An infinite canvas with resize handles, rotation, and layer controls that feel instant — no tutorial required.",
  },
  {
    icon: Layers,
    title: "200+ stickers & doodles",
    body: "Washi tape, polaroid frames, hand-drawn lines and a full sticker library sorted by mood.",
  },
  {
    icon: Palette,
    title: "12 curated templates",
    body: "From Dark Academia to Coffee Aesthetic — start from a composed layout, not a blank page.",
  },
  {
    icon: Download,
    title: "Export in one click",
    body: "PNG, JPG or a print-ready PDF at high resolution, straight from your browser.",
  },
];

const COLLAGE_TAGS = [
  { label: "Hạ Long Bay", icon: Plane, rotate: -8, top: "6%", left: "4%", tone: "bg-rosewood-400" },
  { label: "slow mornings", icon: Coffee, rotate: 5, top: "58%", left: "2%", tone: "bg-mustard-400" },
  { label: "us, always", icon: Heart, rotate: -4, top: "72%", left: "58%", tone: "bg-clover-400" },
];

export default function LandingPage() {
  const router = useRouter();
  const [authOpen, setAuthOpen] = React.useState(false);
  const user = useAuthStore((s) => s.user);
  const hydrate = useAuthStore((s) => s.hydrate);
  const hydrated = useAuthStore((s) => s.hydrated);

  React.useEffect(() => {
    hydrate();
  }, [hydrate]);

  function handleStart() {
    if (hydrated && user) {
      router.push("/dashboard");
    } else {
      setAuthOpen(true);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/70 bg-background/80 backdrop-blur-md">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ink text-paper font-display text-sm font-bold">
              B
            </div>
            <span className="font-display text-lg font-semibold tracking-tight">Bestify</span>
          </div>
          <nav className="hidden items-center gap-8 text-sm text-ink-soft md:flex">
            <a href="#features" className="hover:text-ink transition-colors">Features</a>
            <a href="#templates" className="hover:text-ink transition-colors">Templates</a>
          </nav>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setAuthOpen(true)}>
              Log in
            </Button>
            <Button variant="primary" size="sm" onClick={handleStart}>
              Start creating
            </Button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="container grid grid-cols-1 items-center gap-12 py-16 md:py-24 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-medium text-ink-soft shadow-sm">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Your memories, beautifully arranged
            </span>
            <h1 className="mt-5 font-display text-5xl font-semibold leading-[1.05] tracking-tight text-ink md:text-6xl">
              Turn your trips into
              <span className="block italic text-accent">keepsakes worth keeping.</span>
            </h1>
            <p className="mt-5 max-w-md text-balance text-lg text-ink-soft">
              Bestify is a scrapbook studio for the internet — drag in photos, tear in washi
              tape, curve a caption, and export a page that actually looks handmade.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Button variant="primary" size="lg" onClick={handleStart}>
                Start creating free <ArrowRight className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="lg" onClick={() => setAuthOpen(true)}>
                Continue as guest
              </Button>
            </div>
            <p className="mt-4 text-xs text-muted-foreground">
              No credit card. No install. Your drafts autosave to this device.
            </p>
          </motion.div>

          {/* Signature collage */}
          <motion.div
            initial={{ opacity: 0, scale: 0.94 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
            className="relative mx-auto h-[440px] w-full max-w-md md:h-[500px]"
          >
            <div className="absolute inset-0 rounded-[28px] bg-paper-dark/60 grain-overlay" />
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="polaroid absolute left-[8%] top-[8%] w-[52%] -rotate-6"
            >
              <div className="aspect-[4/5] w-full rounded-[1px] bg-gradient-to-br from-rosewood-200 to-mustard-200" />
              <p className="mt-2 text-center font-hand text-lg text-ink">Hội An, dusk</p>
            </motion.div>
            <motion.div
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 0.4 }}
              className="polaroid absolute right-[6%] top-[28%] w-[46%] rotate-3"
            >
              <div className="aspect-[4/5] w-full rounded-[1px] bg-gradient-to-br from-clover-200 to-clover-300" />
              <p className="mt-2 text-center font-hand text-lg text-ink">day one ✿</p>
            </motion.div>
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}
              className="polaroid absolute bottom-[6%] left-[18%] w-[48%] rotate-2"
            >
              <div className="aspect-[4/5] w-full rounded-[1px] bg-gradient-to-br from-mustard-200 to-rosewood-200" />
              <p className="mt-2 text-center font-hand text-lg text-ink">sea salt & sun</p>
            </motion.div>
            <div className="washi-strip absolute left-[2%] top-[2%] h-8 w-24 -rotate-12 rounded-[1px]" />
            <div className="washi-strip absolute bottom-[24%] right-[2%] h-8 w-24 rotate-12 rounded-[1px]" />
            {COLLAGE_TAGS.map((tag) => (
              <span
                key={tag.label}
                style={{ top: tag.top, left: tag.left, transform: `rotate(${tag.rotate}deg)` }}
                className={`absolute hidden items-center gap-1.5 rounded-full ${tag.tone} px-3 py-1.5 text-xs font-medium text-white shadow-sticker lg:flex`}
              >
                <tag.icon className="h-3.5 w-3.5" /> {tag.label}
              </span>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border/70 bg-card/40 py-20">
        <div className="container">
          <div className="max-w-lg">
            <h2 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
              Everything a scrapbook needs, none of the scissors.
            </h2>
            <p className="mt-3 text-ink-soft">
              Bestify packs the tactile feel of paper craft into a canvas that undoes your mistakes.
            </p>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: i * 0.06 }}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-display text-lg font-semibold text-ink">{f.title}</h3>
                <p className="mt-1.5 text-sm text-ink-soft">{f.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Templates */}
      <section id="templates" className="py-20">
        <div className="container">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-tight text-ink md:text-4xl">
                Twelve moods to start from.
              </h2>
              <p className="mt-3 text-ink-soft">Pick a template, then make it yours.</p>
            </div>
            <Button variant="outline" onClick={handleStart} className="hidden md:inline-flex">
              Browse all <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {TEMPLATES.map((t, i) => (
              <motion.button
                key={t.id}
                onClick={handleStart}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.4, delay: (i % 6) * 0.05 }}
                className="group text-left"
              >
                <div
                  className="relative aspect-[4/5] w-full overflow-hidden rounded-xl border border-border shadow-sm transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-paper"
                  style={{ backgroundColor: t.thumbnail.background }}
                >
                  <MiniCanvasPreview page={t.pages[0]} className="h-full w-full" />
                  <span
                    className="pointer-events-none absolute bottom-2 left-2 rounded-full px-2 py-1 text-[10px] font-medium text-white shadow"
                    style={{ backgroundColor: t.thumbnail.accent }}
                  >
                    {t.category}
                  </span>
                </div>
                <p className="mt-2 text-xs font-medium text-ink-soft group-hover:text-ink">{t.name}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-border/70 py-20">
        <div className="container">
          <div className="relative overflow-hidden rounded-[28px] bg-ink px-8 py-16 text-center text-paper md:py-20">
            <div className="absolute inset-0 bg-grain opacity-40" />
            <h2 className="relative font-display text-3xl font-semibold tracking-tight md:text-4xl">
              Your next scrapbook is one click away.
            </h2>
            <p className="relative mx-auto mt-3 max-w-md text-paper/70">
              Free to start. No installs. Works right in your browser.
            </p>
            <Button variant="accent" size="lg" className="relative mt-8" onClick={handleStart}>
              Start creating free <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/70 py-8">
        <div className="container flex flex-col items-center justify-between gap-3 text-xs text-muted-foreground sm:flex-row">
          <span>© {new Date().getFullYear()} Bestify. Made for memory-keepers.</span>
          <span>Built with Next.js · Canvas by Konva</span>
        </div>
      </footer>

      <AuthDialog open={authOpen} onOpenChange={setAuthOpen} />
    </div>
  );
}
