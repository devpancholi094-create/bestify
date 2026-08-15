"use client";

import * as React from "react";
import { nanoid } from "nanoid";
import {
  Type,
  Sticker,
  Shapes,
  Image as ImageIcon,
  SquareDashedBottom,
  Ribbon,
  Minus,
  Palette,
  Upload,
  Search,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useEditorStore } from "@/lib/editor-store";
import {
  BACKGROUNDS,
  DOODLES,
  DOODLE_CATEGORIES,
  FRAMES,
  STICKERS,
  STICKER_CATEGORIES,
  WASHI_TAPES,
} from "@/lib/assets-data";
import { CanvasElement, ShapeKind } from "@/lib/types";
import { cn } from "@/lib/utils";

const SHAPE_LIST: { kind: ShapeKind; label: string }[] = [
  { kind: "rect", label: "Rectangle" },
  { kind: "circle", label: "Circle" },
  { kind: "triangle", label: "Triangle" },
  { kind: "hexagon", label: "Hexagon" },
  { kind: "star", label: "Star" },
  { kind: "heart", label: "Heart" },
  { kind: "cloud", label: "Cloud" },
  { kind: "blob", label: "Blob" },
  { kind: "arrow", label: "Arrow" },
];

const SIDEBAR_TABS = [
  { id: "text", label: "Text", icon: Type },
  { id: "elements", label: "Elements", icon: Shapes },
  { id: "stickers", label: "Stickers", icon: Sticker },
  { id: "uploads", label: "Uploads", icon: ImageIcon },
  { id: "frames", label: "Frames", icon: SquareDashedBottom },
  { id: "washi", label: "Washi", icon: Ribbon },
  { id: "lines", label: "Lines", icon: Minus },
  { id: "background", label: "Background", icon: Palette },
];

function centerPosition(width: number, height: number) {
  const page = useEditorStore.getState().project?.pages.find(
    (p) => p.id === useEditorStore.getState().activePageId
  );
  const pw = page?.width ?? 1080;
  const ph = page?.height ?? 1350;
  return { x: pw / 2 - width / 2, y: ph / 2 - height / 2 };
}

function baseNew(width: number, height: number) {
  return {
    id: nanoid(8),
    ...centerPosition(width, height),
    width,
    height,
    rotation: 0,
    opacity: 1,
    zIndex: 999,
    locked: false,
    visible: true,
    name: "Element",
  };
}

export function LeftSidebar() {
  const addElement = useEditorStore((s) => s.addElement);
  const updatePageBackground = useEditorStore((s) => s.updatePageBackground);
  const [stickerQuery, setStickerQuery] = React.useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const filteredStickers = React.useMemo(() => {
    if (!stickerQuery.trim()) return STICKERS;
    const q = stickerQuery.toLowerCase();
    return STICKERS.filter((s) => s.keywords.includes(q));
  }, [stickerQuery]);

  function addText(preset: "heading" | "subheading" | "body" | "hand") {
    const presets = {
      heading: { text: "Add a heading", fontSize: 48, fontWeight: 700, fontFamily: "var(--font-display)" },
      subheading: { text: "Add a subheading", fontSize: 30, fontWeight: 600, fontFamily: "var(--font-display)" },
      body: { text: "Add a little body text", fontSize: 18, fontWeight: 400, fontFamily: "var(--font-body)" },
      hand: { text: "add a handwritten note", fontSize: 34, fontWeight: 500, fontFamily: "var(--font-hand)" },
    }[preset];
    const el: CanvasElement = {
      ...baseNew(420, 90),
      type: "text",
      text: presets.text,
      fontFamily: presets.fontFamily,
      fontSize: presets.fontSize,
      fontWeight: presets.fontWeight,
      fontStyle: "normal",
      fill: "#2c2a28",
      align: "left",
      letterSpacing: 0,
      lineHeight: 1.25,
      curved: false,
      curveRadius: 200,
      shadow: false,
      shadowColor: "#000000",
      shadowBlur: 6,
      shadowOffsetX: 2,
      shadowOffsetY: 2,
    } as CanvasElement;
    addElement(el);
  }

  function addShape(kind: ShapeKind) {
    const el: CanvasElement = {
      ...baseNew(160, 160),
      type: "shape",
      shape: kind,
      fill: "#c96c53",
      stroke: "transparent",
      strokeWidth: 0,
      cornerRadius: 12,
    } as CanvasElement;
    addElement(el);
  }

  function addSticker(content: string, category: string) {
    const el: CanvasElement = {
      ...baseNew(72, 72),
      type: "sticker",
      content,
      category,
      flipX: false,
    } as CanvasElement;
    addElement(el);
  }

  function addFrame(frame: (typeof FRAMES)[number]) {
    const el: CanvasElement = {
      ...baseNew(320, 400),
      type: "frame",
      frameId: frame.id,
      style: frame.style,
      color: frame.color,
    } as CanvasElement;
    addElement(el);
  }

  function addWashiTape(washi: (typeof WASHI_TAPES)[number]) {
    const el: CanvasElement = {
      ...baseNew(180, 34),
      type: "washi",
      pattern: washi.id,
      color: washi.color,
      rotation: -6,
    } as CanvasElement;
    addElement(el);
  }

  function addDoodle(doodle: (typeof DOODLES)[number]) {
    const el: CanvasElement = {
      ...baseNew(80, 80),
      type: "doodle",
      path: doodle.path,
      viewBox: doodle.viewBox,
      stroke: "#2c2a28",
      strokeWidth: 2.5,
    } as CanvasElement;
    addElement(el);
  }

  function addLine(style: "solid" | "dashed" | "dotted" | "wavy" | "zigzag") {
    const el: CanvasElement = {
      ...baseNew(300, 24),
      type: "line",
      points: [0, 0, 300, 0],
      stroke: "#2c2a28",
      strokeWidth: 3,
      dash: [],
      lineStyle: style,
    } as CanvasElement;
    addElement(el);
  }

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const src = reader.result as string;
      const img = new Image();
      img.onload = () => {
        const maxDim = 420;
        const ratio = Math.min(maxDim / img.width, maxDim / img.height, 1);
        const width = img.width * ratio;
        const height = img.height * ratio;
        const el: CanvasElement = {
          ...baseNew(width, height),
          type: "image",
          src,
          filter: "none",
          borderRadius: 4,
          borderWidth: 0,
          borderColor: "#ffffff",
        } as CanvasElement;
        addElement(el);
      };
      img.src = src;
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  return (
    <div className="flex h-full w-[300px] shrink-0 flex-col border-r border-border bg-card">
      <Tabs defaultValue="text" className="flex h-full flex-col">
        <ScrollArea className="border-b border-border">
          <TabsList className="m-2 flex w-max gap-1">
            {SIDEBAR_TABS.map((t) => (
              <TabsTrigger key={t.id} value={t.id} className="gap-1.5">
                <t.icon className="h-3.5 w-3.5" /> {t.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </ScrollArea>

        <ScrollArea className="flex-1 p-4">
          <TabsContent value="text" className="mt-0 space-y-3">
            <SectionTitle>Add text</SectionTitle>
            <button
              onClick={() => addText("heading")}
              className="w-full rounded-xl border border-border p-3 text-left font-display text-2xl font-bold hover:border-primary/50 hover:bg-primary/5"
            >
              Add a heading
            </button>
            <button
              onClick={() => addText("subheading")}
              className="w-full rounded-xl border border-border p-3 text-left font-display text-lg font-semibold hover:border-primary/50 hover:bg-primary/5"
            >
              Add a subheading
            </button>
            <button
              onClick={() => addText("body")}
              className="w-full rounded-xl border border-border p-3 text-left text-sm hover:border-primary/50 hover:bg-primary/5"
            >
              Add a little body text
            </button>
            <button
              onClick={() => addText("hand")}
              className="w-full rounded-xl border border-border p-3 text-left font-hand text-2xl hover:border-primary/50 hover:bg-primary/5"
            >
              add a handwritten note
            </button>
          </TabsContent>

          <TabsContent value="elements" className="mt-0 space-y-4">
            <SectionTitle>Shapes</SectionTitle>
            <div className="grid grid-cols-3 gap-2">
              {SHAPE_LIST.map((s) => (
                <button
                  key={s.kind}
                  onClick={() => addShape(s.kind)}
                  className="flex flex-col items-center gap-1.5 rounded-xl border border-border p-3 hover:border-primary/50 hover:bg-primary/5"
                  title={s.label}
                >
                  <ShapePreview kind={s.kind} />
                </button>
              ))}
            </div>
            <SectionTitle>Doodles &amp; decorations ({DOODLES.length})</SectionTitle>
            {DOODLE_CATEGORIES.map((cat) => (
              <div key={cat}>
                <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">{cat}</p>
                <div className="grid grid-cols-5 gap-2">
                  {DOODLES.filter((d) => d.category === cat)
                    .slice(0, 5)
                    .map((d) => (
                      <button
                        key={d.id}
                        onClick={() => addDoodle(d)}
                        className="flex items-center justify-center rounded-lg border border-border p-2 hover:border-primary/50 hover:bg-primary/5"
                        title={d.name}
                      >
                        <svg viewBox={d.viewBox} className="h-6 w-6" fill="none" stroke="#2c2a28" strokeWidth={3}>
                          <path d={d.path} />
                        </svg>
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </TabsContent>

          <TabsContent value="stickers" className="mt-0 space-y-3">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search 200+ stickers…"
                className="pl-9"
                value={stickerQuery}
                onChange={(e) => setStickerQuery(e.target.value)}
              />
            </div>
            {STICKER_CATEGORIES.map((cat) => {
              const items = filteredStickers.filter((s) => s.category === cat);
              if (!items.length) return null;
              return (
                <div key={cat}>
                  <p className="mb-1.5 text-[11px] font-medium text-muted-foreground">{cat}</p>
                  <div className="grid grid-cols-6 gap-1.5">
                    {items.map((s) => (
                      <button
                        key={s.id}
                        onClick={() => addSticker(s.content, s.category)}
                        className="flex aspect-square items-center justify-center rounded-lg text-2xl transition-transform hover:scale-110 hover:bg-primary/10"
                      >
                        {s.content}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </TabsContent>

          <TabsContent value="uploads" className="mt-0 space-y-3">
            <SectionTitle>Your images</SectionTitle>
            <input ref={fileInputRef} type="file" accept="image/*" hidden onChange={handleUpload} />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed border-border p-8 text-center hover:border-primary/50 hover:bg-primary/5"
            >
              <Upload className="h-6 w-6 text-muted-foreground" />
              <span className="text-sm font-medium text-ink">Upload a photo</span>
              <span className="text-xs text-muted-foreground">PNG, JPG up to 10MB</span>
            </button>
          </TabsContent>

          <TabsContent value="frames" className="mt-0 space-y-3">
            <SectionTitle>Frames ({FRAMES.length})</SectionTitle>
            <div className="grid grid-cols-3 gap-2">
              {FRAMES.map((f) => (
                <button
                  key={f.id}
                  onClick={() => addFrame(f)}
                  className="flex flex-col items-center gap-1 rounded-xl border border-border p-2 hover:border-primary/50 hover:bg-primary/5"
                  title={f.name}
                >
                  <div
                    className="flex h-16 w-14 items-center justify-center rounded-sm"
                    style={{
                      backgroundColor: f.style === "sticker-border" ? "transparent" : f.color,
                      border: f.style === "sticker-border" ? `3px solid ${f.color}` : "none",
                    }}
                  >
                    <div className="h-10 w-10 rounded-[2px] bg-[repeating-linear-gradient(45deg,#0000,#0000_4px,#0001_4px,#0001_8px)]" />
                  </div>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="washi" className="mt-0 space-y-3">
            <SectionTitle>Washi tape ({WASHI_TAPES.length})</SectionTitle>
            <div className="grid grid-cols-3 gap-2">
              {WASHI_TAPES.map((w) => (
                <button
                  key={w.id}
                  onClick={() => addWashiTape(w)}
                  className="h-12 rounded-md shadow-tape transition-transform hover:scale-105"
                  style={{ background: w.css }}
                  title={w.name}
                />
              ))}
            </div>

            <SectionTitle>Decorative lines</SectionTitle>
            <div className="space-y-2">
              {(["solid", "dashed", "dotted", "wavy", "zigzag"] as const).map((style) => (
                <button
                  key={style}
                  onClick={() => addLine(style)}
                  className="flex w-full items-center gap-3 rounded-xl border border-border p-3 hover:border-primary/50 hover:bg-primary/5"
                >
                  <LinePreview style={style} />
                  <span className="text-xs capitalize text-ink-soft">{style}</span>
                </button>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="lines" className="mt-0 space-y-2">
            <SectionTitle>Decorative lines</SectionTitle>
            {(["solid", "dashed", "dotted", "wavy", "zigzag"] as const).map((style) => (
              <button
                key={style}
                onClick={() => addLine(style)}
                className="flex w-full items-center gap-3 rounded-xl border border-border p-3 hover:border-primary/50 hover:bg-primary/5"
              >
                <LinePreview style={style} />
                <span className="text-xs capitalize text-ink-soft">{style}</span>
              </button>
            ))}
          </TabsContent>

          <TabsContent value="background" className="mt-0 space-y-3">
            <SectionTitle>Backgrounds ({BACKGROUNDS.length})</SectionTitle>
            <div className="grid grid-cols-3 gap-2">
              {BACKGROUNDS.map((bg) => (
                <button
                  key={bg.id}
                  onClick={() => updatePageBackground(bg.css.match(/#[0-9a-f]{6}/i)?.[0] ?? "#f6f0e2")}
                  className="h-14 rounded-lg border border-border transition-transform hover:scale-105"
                  style={{ background: bg.css.replace("background-color:", "").replace("background:", "") }}
                  title={bg.name}
                />
              ))}
            </div>
          </TabsContent>
        </ScrollArea>
      </Tabs>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{children}</p>;
}

function ShapePreview({ kind }: { kind: ShapeKind }) {
  const cls = "h-8 w-8 bg-rosewood-400";
  switch (kind) {
    case "circle":
      return <div className={cn(cls, "rounded-full")} />;
    case "triangle":
      return <div className="h-0 w-0 border-x-[16px] border-b-[28px] border-x-transparent border-b-rosewood-400" />;
    case "star":
      return <span className="text-2xl text-rosewood-400">★</span>;
    case "heart":
      return <span className="text-2xl text-rosewood-400">♥</span>;
    case "hexagon":
      return <div className={cn(cls)} style={{ clipPath: "polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)" }} />;
    case "cloud":
      return <span className="text-2xl">☁️</span>;
    case "blob":
      return <div className={cn(cls, "rounded-[40%_60%_60%_40%/60%_40%_60%_40%]")} />;
    case "arrow":
      return <span className="text-2xl text-rosewood-400">➜</span>;
    default:
      return <div className={cn(cls, "rounded-md")} />;
  }
}

function LinePreview({ style }: { style: "solid" | "dashed" | "dotted" | "wavy" | "zigzag" }) {
  if (style === "wavy") {
    return (
      <svg width="48" height="12" viewBox="0 0 48 12">
        <path d="M0 6 Q 6 0 12 6 T 24 6 T 36 6 T 48 6" stroke="#2c2a28" strokeWidth="2" fill="none" />
      </svg>
    );
  }
  if (style === "zigzag") {
    return (
      <svg width="48" height="12" viewBox="0 0 48 12">
        <path d="M0 10 L8 2 L16 10 L24 2 L32 10 L40 2 L48 10" stroke="#2c2a28" strokeWidth="2" fill="none" />
      </svg>
    );
  }
  return (
    <svg width="48" height="12" viewBox="0 0 48 12">
      <line
        x1="0"
        y1="6"
        x2="48"
        y2="6"
        stroke="#2c2a28"
        strokeWidth="2"
        strokeDasharray={style === "dashed" ? "6 4" : style === "dotted" ? "1 4" : undefined}
        strokeLinecap="round"
      />
    </svg>
  );
}
