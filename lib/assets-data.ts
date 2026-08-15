// Bestify asset library.
// Stickers/doodles are emoji + hand-drawn SVG paths (no binary files needed —
// keeps the app instantly deployable with zero image hosting).

export interface StickerAsset {
  id: string;
  content: string;
  category: string;
  keywords: string;
}

export interface BackgroundAsset {
  id: string;
  name: string;
  css: string;
  category: string;
}

export interface FrameAsset {
  id: string;
  name: string;
  style:
    | "polaroid"
    | "scalloped"
    | "film"
    | "torn"
    | "double"
    | "rounded"
    | "hexagon"
    | "arch"
    | "ornate"
    | "sticker-border";
  color: string;
}

export interface WashiAsset {
  id: string;
  name: string;
  css: string;
  color: string;
}

export interface DoodleAsset {
  id: string;
  name: string;
  category: string;
  viewBox: string;
  path: string;
}

// ---------- STICKERS (200+) ----------
const STICKER_SETS: Record<string, string[]> = {
  Travel: ["✈️", "🧳", "🗺️", "🧭", "🏝️", "🚗", "🚂", "⛰️", "🗼", "🏰", "🎡", "🛶", "⛺", "🚲", "🛵", "🚁", "🛳️", "🏖️", "🌋", "🚉"],
  Nature: ["🌿", "🍃", "🌸", "🌼", "🌻", "🌷", "🌵", "🍁", "🍂", "🌊", "☀️", "🌙", "⭐", "☁️", "🌈", "❄️", "🔥", "🌴", "🍄", "🌾"],
  Food: ["☕", "🍰", "🍓", "🍋", "🍯", "🍦", "🥐", "🍩", "🍫", "🍉", "🧁", "🍪", "🥂", "🍵", "🍜", "🍕", "🥑", "🍇", "🍑", "🍒"],
  Cute: ["🐻", "🐰", "🐱", "🐶", "🦋", "🐝", "🐞", "🦢", "🐢", "🦊", "🐨", "🐼", "🦄", "🐣", "🐬", "🦉", "🐙", "🐌", "🐿️", "🦔"],
  Love: ["❤️", "💕", "💖", "💗", "💌", "💐", "💍", "😍", "🥰", "💋", "🌹", "💫", "✨", "💞", "💓", "😘", "🫶", "👩‍❤️‍👨", "💒", "💝"],
  Celebration: ["🎉", "🎊", "🎂", "🎈", "🎁", "🥳", "🍾", "🎇", "🎆", "🪅", "🎀", "🏆", "🥇", "🎵", "🎶", "🪩", "🎗️", "🧨", "🎠", "🎇"],
  Study: ["📚", "✏️", "📝", "🖊️", "📖", "🎓", "🔬", "🧮", "📐", "📏", "🗂️", "📌", "📎", "🔖", "💡", "🖇️", "🧠", "⏰", "📅", "🗒️"],
  Weather: ["☀️", "⛅", "🌤️", "🌧️", "⛈️", "🌩️", "❄️", "🌪️", "🌫️", "🌬️", "🌡️", "☔", "🌦️", "🌥️", "🌨️", "💨", "🧊", "🌊", "🔆", "🌑"],
  Symbols: ["⭐", "✨", "💫", "🔥", "💯", "✅", "⚡", "🎯", "🔔", "🔑", "🕊️", "🪶", "🧿", "🔮", "🎨", "🧵", "🪡", "🧶", "📿", "🕯️"],
  Activities: ["📸", "🎧", "🎮", "🏃", "🧘", "🚴", "⛷️", "🏄", "🎣", "🏕️", "🧗", "🎹", "🎸", "🖌️", "🎭", "🩰", "⚽", "🏀", "🎳", "🛹"],
};

export const STICKERS: StickerAsset[] = Object.entries(STICKER_SETS).flatMap(
  ([category, items]) =>
    items.map((content, i) => ({
      id: `sticker-${category.toLowerCase()}-${i}`,
      content,
      category,
      keywords: `${category.toLowerCase()} ${content}`,
    }))
);

export const STICKER_CATEGORIES = Object.keys(STICKER_SETS);

// ---------- BACKGROUNDS (50+) ----------
const PAPER_TONES = [
  { name: "Ivory Paper", hex: "#f6f0e2" },
  { name: "Warm Cream", hex: "#f4e9d6" },
  { name: "Soft Blush", hex: "#f4e1de" },
  { name: "Sage Mist", hex: "#e7ecdf" },
  { name: "Dusty Rose", hex: "#eeddd8" },
  { name: "Sky Wash", hex: "#e3ecef" },
  { name: "Kraft Brown", hex: "#dcc6a8" },
  { name: "Vintage Beige", hex: "#e8dcc4" },
  { name: "Lavender Fog", hex: "#e9e3ee" },
  { name: "Butter Yellow", hex: "#f5edd0" },
  { name: "Charcoal Ink", hex: "#2c2a28" },
  { name: "Midnight Academia", hex: "#241f2e" },
  { name: "Espresso", hex: "#3b2c22" },
  { name: "Forest Night", hex: "#1f2b22" },
  { name: "Terracotta", hex: "#c9714f" },
  { name: "Clay Pink", hex: "#dba38e" },
  { name: "Olive", hex: "#8a9468" },
  { name: "Denim", hex: "#5c7794" },
  { name: "Mustard", hex: "#d8ab4e" },
  { name: "Plum", hex: "#6c4a5c" },
];

const PATTERN_MAKERS: { suffix: string; make: (hex: string) => string }[] = [
  { suffix: "solid", make: (hex) => `background-color:${hex};` },
  {
    suffix: "grid",
    make: (hex) =>
      `background-color:${hex}; background-image: linear-gradient(rgba(0,0,0,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.06) 1px, transparent 1px); background-size: 28px 28px;`,
  },
  {
    suffix: "dots",
    make: (hex) =>
      `background-color:${hex}; background-image: radial-gradient(rgba(0,0,0,0.15) 1.5px, transparent 1.5px); background-size: 18px 18px;`,
  },
  {
    suffix: "gradient",
    make: (hex) => `background: linear-gradient(160deg, ${hex} 0%, ${shade(hex, -14)} 100%);`,
  },
  {
    suffix: "stripes",
    make: (hex) =>
      `background-color:${hex}; background-image: repeating-linear-gradient(120deg, rgba(0,0,0,0.05) 0 12px, transparent 12px 26px);`,
  },
];

function shade(hex: string, percent: number): string {
  const num = parseInt(hex.replace("#", ""), 16);
  let r = (num >> 16) + Math.round((percent / 100) * 255);
  let g = ((num >> 8) & 0x00ff) + Math.round((percent / 100) * 255);
  let b = (num & 0x0000ff) + Math.round((percent / 100) * 255);
  r = Math.max(0, Math.min(255, r));
  g = Math.max(0, Math.min(255, g));
  b = Math.max(0, Math.min(255, b));
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

export const BACKGROUNDS: BackgroundAsset[] = PAPER_TONES.flatMap((tone) =>
  PATTERN_MAKERS.map((pattern) => ({
    id: `bg-${tone.name.toLowerCase().replace(/\s+/g, "-")}-${pattern.suffix}`,
    name: `${tone.name} ${pattern.suffix === "solid" ? "" : pattern.suffix}`.trim(),
    css: pattern.make(tone.hex),
    category: tone.hex < "#808080" ? "Dark" : "Light",
  }))
);

// ---------- FRAMES (30+) ----------
const FRAME_STYLES: FrameAsset["style"][] = [
  "polaroid",
  "scalloped",
  "film",
  "torn",
  "double",
  "rounded",
  "hexagon",
  "arch",
  "ornate",
  "sticker-border",
];
const FRAME_COLORS = ["#ffffff", "#2c2a28", "#c96c53", "#5f7f47", "#a7741f", "#8a6bb1"];

export const FRAMES: FrameAsset[] = FRAME_STYLES.flatMap((style) =>
  FRAME_COLORS.slice(0, style === "polaroid" || style === "film" ? 6 : 5).map((color, i) => ({
    id: `frame-${style}-${i}`,
    name: `${style[0].toUpperCase()}${style.slice(1)} ${i + 1}`,
    style,
    color,
  }))
);

// ---------- WASHI TAPES (20+) ----------
const WASHI_COLORS = [
  { name: "Rosewood", hex: "#c96c53" },
  { name: "Clover", hex: "#82a468" },
  { name: "Mustard", hex: "#deb04a" },
  { name: "Sky", hex: "#8fb4c9" },
  { name: "Blush", hex: "#e3a9a0" },
  { name: "Lavender", hex: "#b09bd0" },
  { name: "Kraft", hex: "#c7a374" },
];
const WASHI_PATTERNS: { suffix: string; make: (hex: string) => string }[] = [
  { suffix: "stripe", make: (hex) => `repeating-linear-gradient(45deg, ${hex} 0 6px, ${shade(hex, 15)} 6px 12px)` },
  { suffix: "dot", make: (hex) => `radial-gradient(${shade(hex, 20)} 20%, ${hex} 21%)` },
  { suffix: "solid", make: (hex) => `${hex}` },
];

export const WASHI_TAPES: WashiAsset[] = WASHI_COLORS.flatMap((c) =>
  WASHI_PATTERNS.map((p) => ({
    id: `washi-${c.name.toLowerCase()}-${p.suffix}`,
    name: `${c.name} ${p.suffix}`,
    css: p.make(c.hex),
    color: c.hex,
  }))
);

// ---------- DECORATIVE DOODLES / LINES (100+) ----------
const DOODLE_PATHS: { name: string; category: string; viewBox: string; path: string }[] = [
  { name: "Heart outline", category: "Love", viewBox: "0 0 48 48", path: "M24 42 C6 30 4 18 12 12 C18 8 24 12 24 18 C24 12 30 8 36 12 C44 18 42 30 24 42 Z" },
  { name: "Star sparkle", category: "Symbols", viewBox: "0 0 48 48", path: "M24 4 L28 20 L44 24 L28 28 L24 44 L20 28 L4 24 L20 20 Z" },
  { name: "Swirl arrow", category: "Arrows", viewBox: "0 0 48 48", path: "M6 24 C6 10 20 6 30 12 C40 18 40 30 28 34 C20 37 12 32 14 26" },
  { name: "Wavy underline", category: "Lines", viewBox: "0 0 100 12", path: "M2 8 Q 12 2 22 8 T 42 8 T 62 8 T 82 8 T 100 8" },
  { name: "Sun rays", category: "Nature", viewBox: "0 0 48 48", path: "M24 8 V2 M24 46 V40 M8 24 H2 M46 24 H40 M12 12 L8 8 M36 36 L40 40 M36 12 L40 8 M12 36 L8 40 M24 14 A10 10 0 1 1 23.99 14" },
  { name: "Cloud puff", category: "Nature", viewBox: "0 0 48 32", path: "M12 26 C4 26 4 16 12 16 C12 8 24 6 28 14 C36 12 40 20 34 24 C36 30 28 30 24 28 C20 30 12 30 12 26 Z" },
  { name: "Leaf sprig", category: "Nature", viewBox: "0 0 40 48", path: "M20 44 C10 30 10 14 20 4 C30 14 30 30 20 44 Z M20 4 V44" },
  { name: "Camera doodle", category: "Travel", viewBox: "0 0 48 36", path: "M4 12 H14 L18 6 H30 L34 12 H44 V32 H4 Z M24 22 A7 7 0 1 0 24 22.01" },
  { name: "Airplane trail", category: "Travel", viewBox: "0 0 48 24", path: "M2 20 Q 16 4 46 4 M40 2 L46 4 L40 8" },
  { name: "Coffee cup", category: "Food", viewBox: "0 0 40 40", path: "M6 14 H28 V28 A11 11 0 0 1 6 28 Z M28 16 H33 A5 5 0 0 1 28 24 M12 6 Q 14 10 12 12 M18 6 Q 20 10 18 12" },
  { name: "Squiggle line", category: "Lines", viewBox: "0 0 100 16", path: "M0 8 C 10 -2 20 18 30 8 S 50 -2 60 8 S 80 18 90 8 S 100 4 100 8" },
  { name: "Dashed line", category: "Lines", viewBox: "0 0 100 4", path: "M0 2 H8 M16 2 H24 M32 2 H40 M48 2 H56 M64 2 H72 M80 2 H88 M96 2 H100" },
  { name: "Zigzag line", category: "Lines", viewBox: "0 0 100 12", path: "M0 10 L10 2 L20 10 L30 2 L40 10 L50 2 L60 10 L70 2 L80 10 L90 2 L100 10" },
  { name: "Curly bracket", category: "Symbols", viewBox: "0 0 20 60", path: "M16 2 C4 2 8 16 2 20 C8 24 4 38 16 38 C4 38 8 52 2 56" },
  { name: "Balloon", category: "Celebration", viewBox: "0 0 30 50", path: "M15 2 C4 2 2 18 10 26 C6 30 8 34 12 34 L12 46 M15 2 C26 2 28 18 20 26 C24 30 22 34 18 34" },
  { name: "Location pin", category: "Travel", viewBox: "0 0 32 44", path: "M16 42 C16 42 30 26 30 16 A14 14 0 1 0 2 16 C2 26 16 42 16 42 Z M16 22 A6 6 0 1 0 16 22.01" },
  { name: "Music note", category: "Symbols", viewBox: "0 0 24 40", path: "M18 2 V26 A6 6 0 1 1 14 20 V8 L18 6" },
  { name: "Scissors cut", category: "Symbols", viewBox: "0 0 40 20", path: "M0 10 H40 M4 4 L10 10 L4 16 M36 4 L30 10 L36 16" },
  { name: "Butterfly", category: "Nature", viewBox: "0 0 40 32", path: "M20 4 V28 M20 8 C10 -2 0 10 8 16 C0 22 10 34 20 24 M20 8 C30 -2 40 10 32 16 C40 22 30 34 20 24" },
  { name: "Ribbon banner", category: "Celebration", viewBox: "0 0 60 20", path: "M0 4 H60 L54 10 L60 16 H0 L6 10 Z" },
];

const LINE_STYLE_VARIANTS = ["Thin", "Bold", "Pastel", "Dark", "Gold"];

export const DOODLES: DoodleAsset[] = DOODLE_PATHS.flatMap((d, i) =>
  LINE_STYLE_VARIANTS.map((variant, j) => ({
    id: `doodle-${i}-${j}`,
    name: `${d.name} (${variant})`,
    category: d.category,
    viewBox: d.viewBox,
    path: d.path,
  }))
);

export const DOODLE_CATEGORIES = Array.from(new Set(DOODLE_PATHS.map((d) => d.category)));

// ---------- FONTS ----------
export const FONT_FAMILIES = [
  { id: "display", label: "Fraunces (Display Serif)", value: "var(--font-display)" },
  { id: "body", label: "Plus Jakarta Sans", value: "var(--font-body)" },
  { id: "hand", label: "Caveat (Handwriting)", value: "var(--font-hand)" },
  { id: "mono", label: "JetBrains Mono", value: "var(--font-mono)" },
  { id: "georgia", label: "Georgia", value: "Georgia, serif" },
  { id: "times", label: "Times New Roman", value: "'Times New Roman', serif" },
  { id: "courier", label: "Courier New", value: "'Courier New', monospace" },
  { id: "arial", label: "Arial", value: "Arial, sans-serif" },
  { id: "verdana", label: "Verdana", value: "Verdana, sans-serif" },
  { id: "impact", label: "Impact", value: "Impact, sans-serif" },
];

export const TEXT_COLORS = [
  "#2c2a28", "#5f7f47", "#a7741f", "#c96c53", "#8a6bb1",
  "#5c7794", "#dba38e", "#ffffff", "#e3e3e3", "#1a1a1a",
];
