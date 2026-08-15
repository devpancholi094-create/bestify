import { nanoid } from "nanoid";
import {
  CanvasElement,
  CanvasPage,
  DoodleElement,
  ShapeElement,
  StickerElement,
  Template,
  TextElement,
  WashiElement,
} from "./types";

const CANVAS_W = 1080;
const CANVAS_H = 1350;

function baseDefaults(overrides: Partial<CanvasElement>) {
  return {
    id: nanoid(8),
    rotation: 0,
    opacity: 1,
    zIndex: 0,
    locked: false,
    visible: true,
    ...overrides,
  };
}

function text(
  content: string,
  x: number,
  y: number,
  opts: Partial<TextElement> = {}
): TextElement {
  return {
    ...baseDefaults({}),
    type: "text",
    text: content,
    x,
    y,
    width: opts.width ?? 500,
    height: opts.height ?? 80,
    fontFamily: opts.fontFamily ?? "var(--font-display)",
    fontSize: opts.fontSize ?? 48,
    fontWeight: opts.fontWeight ?? 600,
    fontStyle: opts.fontStyle ?? "normal",
    fill: opts.fill ?? "#2c2a28",
    align: opts.align ?? "left",
    letterSpacing: opts.letterSpacing ?? 0,
    lineHeight: opts.lineHeight ?? 1.2,
    curved: opts.curved ?? false,
    curveRadius: opts.curveRadius ?? 200,
    shadow: opts.shadow ?? false,
    shadowColor: opts.shadowColor ?? "#000000",
    shadowBlur: opts.shadowBlur ?? 6,
    shadowOffsetX: opts.shadowOffsetX ?? 2,
    shadowOffsetY: opts.shadowOffsetY ?? 2,
    ...opts,
  } as TextElement;
}

function washi(
  x: number,
  y: number,
  width: number,
  color: string,
  rotation = -6
): WashiElement {
  return {
    ...baseDefaults({}),
    type: "washi",
    x,
    y,
    width,
    height: 34,
    rotation,
    pattern: "stripe",
    color,
  } as WashiElement;
}

function shape(
  kind: ShapeElement["shape"],
  x: number,
  y: number,
  width: number,
  height: number,
  fill: string,
  opts: Partial<ShapeElement> = {}
): ShapeElement {
  return {
    ...baseDefaults({}),
    type: "shape",
    shape: kind,
    x,
    y,
    width,
    height,
    fill,
    stroke: opts.stroke ?? "transparent",
    strokeWidth: opts.strokeWidth ?? 0,
    cornerRadius: opts.cornerRadius ?? 12,
    ...opts,
  } as ShapeElement;
}

function sticker(content: string, category: string, x: number, y: number, size = 64): StickerElement {
  return {
    ...baseDefaults({}),
    type: "sticker",
    content,
    category,
    x,
    y,
    width: size,
    height: size,
    flipX: false,
  } as StickerElement;
}

function doodle(
  path: string,
  viewBox: string,
  x: number,
  y: number,
  width: number,
  height: number,
  stroke: string
): DoodleElement {
  return {
    ...baseDefaults({}),
    type: "doodle",
    path,
    viewBox,
    x,
    y,
    width,
    height,
    stroke,
    strokeWidth: 2.5,
  } as DoodleElement;
}

function page(name: string, background: string, elements: CanvasElement[]): CanvasPage {
  return {
    id: nanoid(8),
    name,
    width: CANVAS_W,
    height: CANVAS_H,
    background,
    elements: elements.map((el, i) => ({ ...el, zIndex: i })),
  };
}

export const TEMPLATES: Template[] = [
  {
    id: "travel-scrapbook",
    name: "Travel Scrapbook",
    category: "Travel",
    description: "Passport stamps, polaroids and washi tape for your next adventure.",
    thumbnail: { background: "#e9dcc3", accent: "#c96c53", pattern: "polaroid" },
    pages: [
      page("Travel Scrapbook", "#f2e6cd", [
        text("wanderlust", 80, 100, { fontSize: 72, fill: "#8d3f2c", fontFamily: "var(--font-hand)" }),
        text("Da Nang \u2014 Hoi An \u2014 Hanoi", 84, 190, { fontSize: 22, fill: "#5c2c20", fontFamily: "var(--font-body)", fontWeight: 500 }),
        washi(60, 320, 200, "#c96c53", -8),
        washi(700, 260, 220, "#82a468", 10),
        shape("rect", 620, 340, 340, 420, "#ffffff", { rotation: 4, cornerRadius: 2 }),
        sticker("\u2708\ufe0f", "Travel", 90, 420, 72),
        sticker("\ud83d\uddfa\ufe0f", "Travel", 200, 540, 64),
        sticker("\ud83c\udfd6\ufe0f", "Travel", 110, 700, 68),
        doodle("M6 24 C6 10 20 6 30 12 C40 18 40 30 28 34 C20 37 12 32 14 26", "0 0 48 48", 380, 640, 60, 60, "#8d3f2c"),
        text("day one", 640, 780, { fontSize: 28, fontFamily: "var(--font-hand)", fill: "#3b2c22" }),
      ]),
    ],
  },
  {
    id: "vintage-journal",
    name: "Vintage Journal",
    category: "Journal",
    description: "Warm sepia tones, ink-stained textures and antique flourishes.",
    thumbnail: { background: "#e8dcc4", accent: "#875c1a", pattern: "vintage" },
    pages: [
      page("Vintage Journal", "#e6d7b8", [
        text("Dear Diary", 90, 120, { fontSize: 64, fontFamily: "var(--font-hand)", fill: "#4a3219" }),
        shape("rect", 80, 260, 900, 3, "#875c1a", { cornerRadius: 0 }),
        text(
          "Some mornings feel like they belong to another century \u2014 the kind of light that makes you want to write everything down before it disappears.",
          90,
          300,
          { fontSize: 24, fill: "#4a3219", width: 700, fontFamily: "var(--font-body)" }
        ),
        sticker("\ud83e\udeb6", "Nature", 850, 130, 60),
        sticker("\ud83d\udd6f\ufe0f", "Study", 780, 900, 56),
        washi(100, 900, 220, "#a7741f", -4),
        doodle("M2 8 C 10 -2 20 18 30 8 S 50 -2 60 8 S 80 18 90 8 S 100 4 100 8", "0 0 100 16", 90, 1000, 400, 40, "#6c481a"),
      ]),
    ],
  },
  {
    id: "polaroid-board",
    name: "Polaroid Board",
    category: "Photo",
    description: "A gallery wall of instant film photos pinned to soft linen.",
    thumbnail: { background: "#f4efe3", accent: "#2c2a28", pattern: "polaroid" },
    pages: [
      page("Polaroid Board", "#f4efe3", [
        shape("rect", 80, 90, 320, 380, "#ffffff", { rotation: -6, cornerRadius: 2 }),
        shape("rect", 420, 140, 320, 380, "#ffffff", { rotation: 4, cornerRadius: 2 }),
        shape("rect", 250, 480, 320, 380, "#ffffff", { rotation: -3, cornerRadius: 2 }),
        text("memories, undeveloped", 90, 900, { fontSize: 40, fontFamily: "var(--font-display)", fill: "#2c2a28" }),
        sticker("\ud83d\udccc", "Symbols", 380, 90, 40),
        sticker("\ud83d\udccc", "Symbols", 720, 140, 40),
        sticker("\ud83d\udccc", "Symbols", 560, 480, 40),
      ]),
    ],
  },
  {
    id: "dark-academia",
    name: "Dark Academia",
    category: "Aesthetic",
    description: "Moody library tones, gold leaf accents and serif elegance.",
    thumbnail: { background: "#241f2e", accent: "#c8912a", pattern: "dark-academia" },
    pages: [
      page("Dark Academia", "#241f2e", [
        text("ex libris", 90, 130, { fontSize: 60, fontFamily: "var(--font-display)", fill: "#c8912a" }),
        shape("rect", 90, 240, 500, 2, "#c8912a"),
        text("notes on the classics", 90, 270, { fontSize: 22, fill: "#e6ded0", fontFamily: "var(--font-body)" }),
        sticker("\ud83d\udcda", "Study", 800, 120, 68),
        sticker("\ud83d\udd6f\ufe0f", "Study", 760, 900, 56),
        doodle("M16 2 C4 2 8 16 2 20 C8 24 4 38 16 38 C4 38 8 52 2 56", "0 0 20 60", 900, 500, 40, 120, "#c8912a"),
        shape("circle", 200, 700, 240, 240, "#3b2c22", { opacity: 0.6 } as never),
      ]),
    ],
  },
  {
    id: "coffee-aesthetic",
    name: "Coffee Aesthetic",
    category: "Aesthetic",
    description: "Latte foam, kraft paper and warm cafe mornings.",
    thumbnail: { background: "#e8dcc4", accent: "#a7741f", pattern: "vintage" },
    pages: [
      page("Coffee Aesthetic", "#e2d3b8", [
        text("coffee & slow mornings", 80, 110, { fontSize: 46, fontFamily: "var(--font-display)", fill: "#5c2c20" }),
        sticker("\u2615", "Food", 90, 260, 84),
        sticker("\ud83e\udd50", "Food", 220, 300, 64),
        sticker("\ud83c\udf6f", "Food", 340, 260, 60),
        washi(80, 480, 240, "#a7741f", -5),
        shape("rect", 550, 220, 400, 500, "#f6f0e2", { rotation: 3, cornerRadius: 4 }),
        text("today's blend", 590, 260, { fontSize: 22, fontFamily: "var(--font-hand)", fill: "#4a3219" }),
      ]),
    ],
  },
  {
    id: "summer-memories",
    name: "Summer Memories",
    category: "Season",
    description: "Sun-bleached brights for beach days and long evenings.",
    thumbnail: { background: "#eaf1ea", accent: "#5f7f47", pattern: "mood" },
    pages: [
      page("Summer Memories", "#fbf3df", [
        text("summer, salt & sun", 80, 110, { fontSize: 50, fontFamily: "var(--font-display)", fill: "#a7741f" }),
        sticker("\ud83c\udfd6\ufe0f", "Nature", 100, 260, 72),
        sticker("\ud83c\udf34", "Nature", 220, 300, 68),
        sticker("\u2600\ufe0f", "Weather", 780, 130, 72),
        sticker("\ud83c\udf49", "Food", 340, 280, 56),
        washi(80, 460, 260, "#deb04a", -4),
        shape("rect", 560, 300, 360, 420, "#ffffff", { rotation: -3 }),
      ]),
    ],
  },
  {
    id: "couple-album",
    name: "Couple Album",
    category: "Love",
    description: "Soft blush tones for anniversaries and love letters.",
    thumbnail: { background: "#f4e1de", accent: "#c96c53", pattern: "mood" },
    pages: [
      page("Couple Album", "#f8e9e6", [
        text("us, always", 90, 120, { fontSize: 60, fontFamily: "var(--font-hand)", fill: "#a8503a" }),
        sticker("\ud83d\udc95", "Love", 780, 110, 64),
        sticker("\ud83d\udc8c", "Love", 100, 300, 60),
        shape("rect", 620, 260, 340, 420, "#ffffff", { rotation: 4 }),
        washi(100, 460, 220, "#e3a9a0", -6),
        doodle("M24 42 C6 30 4 18 12 12 C18 8 24 12 24 18 C24 12 30 8 36 12 C44 18 42 30 24 42 Z", "0 0 48 48", 250, 620, 70, 70, "#c96c53"),
      ]),
    ],
  },
  {
    id: "birthday-album",
    name: "Birthday Album",
    category: "Celebration",
    description: "Confetti, candles and celebration for a birthday keepsake.",
    thumbnail: { background: "#f5edd0", accent: "#deb04a", pattern: "mood" },
    pages: [
      page("Birthday Album", "#fbf0da", [
        text("make a wish", 90, 120, { fontSize: 58, fontFamily: "var(--font-display)", fill: "#a7741f" }),
        sticker("\ud83c\udf82", "Celebration", 100, 280, 76),
        sticker("\ud83c\udf88", "Celebration", 240, 260, 60),
        sticker("\ud83c\udf89", "Celebration", 800, 150, 60),
        sticker("\ud83e\udd73", "Celebration", 760, 900, 56),
        washi(90, 470, 240, "#deb04a", -4),
        shape("star", 620, 300, 90, 90, "#c96c53", { rotation: -8 }),
      ]),
    ],
  },
  {
    id: "vision-board",
    name: "Vision Board",
    category: "Planning",
    description: "Goals, affirmations and moodboard energy for the year ahead.",
    thumbnail: { background: "#e7ecdf", accent: "#5f7f47", pattern: "mood" },
    pages: [
      page("Vision Board", "#eef1e6", [
        text("2026 vision", 80, 100, { fontSize: 56, fontFamily: "var(--font-display)", fill: "#3b4f2c" }),
        shape("rect", 80, 220, 280, 340, "#ffffff", { rotation: -2 }),
        shape("rect", 400, 260, 280, 340, "#ffffff", { rotation: 3 }),
        shape("rect", 720, 220, 280, 340, "#ffffff", { rotation: -3 }),
        text("grow", 110, 620, { fontSize: 26, fontFamily: "var(--font-hand)", fill: "#4a6537" }),
        text("build", 430, 660, { fontSize: 26, fontFamily: "var(--font-hand)", fill: "#4a6537" }),
        text("travel", 750, 620, { fontSize: 26, fontFamily: "var(--font-hand)", fill: "#4a6537" }),
        sticker("\u2728", "Symbols", 900, 120, 48),
      ]),
    ],
  },
  {
    id: "study-journal",
    name: "Study Journal",
    category: "Study",
    description: "Clean layouts for lecture notes, planners and revision boards.",
    thumbnail: { background: "#eef1e6", accent: "#5f7f47", pattern: "study" },
    pages: [
      page("Study Journal", "#f6f4ec", [
        text("study notes", 80, 100, { fontSize: 50, fontFamily: "var(--font-display)", fill: "#2c2a28" }),
        shape("rect", 80, 220, 900, 2, "#c9c2ad"),
        text("Week 12 \u2014 Revision plan", 80, 250, { fontSize: 22, fontFamily: "var(--font-body)", fill: "#5f5a4d" }),
        sticker("\ud83d\udcda", "Study", 850, 100, 56),
        sticker("\u23f0", "Study", 800, 900, 48),
        shape("rect", 80, 340, 420, 260, "#ffffff", { cornerRadius: 12 }),
        shape("rect", 540, 340, 420, 260, "#ffffff", { cornerRadius: 12 }),
      ]),
    ],
  },
  {
    id: "minimal-beige",
    name: "Minimal Beige",
    category: "Minimal",
    description: "Quiet negative space with a single focal photo and caption.",
    thumbnail: { background: "#f4efe3", accent: "#2c2a28", pattern: "minimal" },
    pages: [
      page("Minimal Beige", "#f4efe3", [
        shape("rect", 240, 200, 600, 720, "#ffffff", { cornerRadius: 2 }),
        text("simplicity", 260, 960, { fontSize: 30, fontFamily: "var(--font-display)", fill: "#2c2a28" }),
        text("01", 900, 100, { fontSize: 22, fontFamily: "var(--font-mono)", fill: "#9a9284" }),
      ]),
    ],
  },
  {
    id: "mood-board",
    name: "Mood Board",
    category: "Aesthetic",
    description: "A collage-style board for colors, textures and inspiration.",
    thumbnail: { background: "#eee6da", accent: "#8a6bb1", pattern: "mood" },
    pages: [
      page("Mood Board", "#efe8dc", [
        shape("rect", 80, 100, 300, 300, "#dba38e"),
        shape("rect", 400, 100, 220, 300, "#5f7f47"),
        shape("rect", 640, 100, 340, 300, "#2c2a28"),
        shape("rect", 80, 420, 460, 260, "#ffffff"),
        shape("circle", 580, 440, 220, 220, "#deb04a"),
        text("mood", 820, 460, { fontSize: 40, fontFamily: "var(--font-display)", fill: "#2c2a28" }),
      ]),
    ],
  },
];

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export const TEMPLATE_CATEGORIES = Array.from(new Set(TEMPLATES.map((t) => t.category)));
