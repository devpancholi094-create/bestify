import { nanoid } from "nanoid";
import {
  CanvasElement,
  CanvasPage,
  DoodleElement,
  FrameElement,
  ImageElement,
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
    rotation: opts.rotation ?? 0,
    ...opts,
  } as TextElement;
}

function washi(
  x: number,
  y: number,
  width: number,
  color: string,
  rotation = -6,
  height = 34
): WashiElement {
  return {
    ...baseDefaults({}),
    type: "washi",
    x,
    y,
    width,
    height,
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

function sticker(content: string, category: string, x: number, y: number, size = 64, rotation = 0): StickerElement {
  return {
    ...baseDefaults({}),
    type: "sticker",
    content,
    category,
    x,
    y,
    width: size,
    height: size,
    rotation,
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
  stroke: string,
  rotation = 0
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
    rotation,
  } as DoodleElement;
}

/** An empty photo slot the user taps to upload their own picture into. */
function photo(
  x: number,
  y: number,
  width: number,
  height: number,
  opts: Partial<ImageElement> = {}
): ImageElement {
  return {
    ...baseDefaults({}),
    type: "image",
    src: "",
    filter: "none",
    borderRadius: opts.borderRadius ?? 6,
    borderWidth: opts.borderWidth ?? 0,
    borderColor: opts.borderColor ?? "#ffffff",
    isPlaceholder: true,
    placeholderLabel: "Add photo",
    x,
    y,
    width,
    height,
    rotation: opts.rotation ?? 0,
    ...opts,
  } as ImageElement;
}

/** An empty polaroid / framed photo slot. */
function framedPhoto(
  style: FrameElement["style"],
  x: number,
  y: number,
  width: number,
  height: number,
  color: string,
  rotation = 0
): FrameElement {
  return {
    ...baseDefaults({}),
    type: "frame",
    frameId: `${style}-${nanoid(4)}`,
    style,
    color,
    isPlaceholder: true,
    placeholderLabel: "Add photo",
    x,
    y,
    width,
    height,
    rotation,
  } as FrameElement;
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

const ARROW_SWIRL = "M6 24 C6 10 20 6 30 12 C40 18 40 30 28 34 C20 37 12 32 14 26";
const HEART = "M24 42 C6 30 4 18 12 12 C18 8 24 12 24 18 C24 12 30 8 36 12 C44 18 42 30 24 42 Z";
const STAR = "M24 4 L28 20 L44 24 L28 28 L24 44 L20 28 L4 24 L20 20 Z";
const WAVY_UNDERLINE = "M2 8 Q 12 2 22 8 T 42 8 T 62 8 T 82 8 T 100 8";
const SQUIGGLE = "M0 8 C 10 -2 20 18 30 8 S 50 -2 60 8 S 80 18 90 8 S 100 4 100 8";
const PIN = "M16 42 C16 42 30 26 30 16 A14 14 0 1 0 2 16 C2 26 16 42 16 42 Z M16 22 A6 6 0 1 0 16 22.01";
const DASH_LINE = "M0 2 H8 M16 2 H24 M32 2 H40 M48 2 H56 M64 2 H72 M80 2 H88 M96 2 H100";

export const TEMPLATES: Template[] = [
  {
    id: "travel-scrapbook",
    name: "Travel Scrapbook",
    category: "Travel",
    description: "Passport stamps, polaroids and washi tape for your next adventure.",
    thumbnail: { background: "#e9dcc3", accent: "#c96c53", pattern: "polaroid" },
    pages: [
      page("Travel Scrapbook", "#f2e6cd", [
        text("wanderlust", 70, 70, { fontSize: 68, fill: "#8d3f2c", fontFamily: "var(--font-hand)", rotation: -2 }),
        text("Da Nang · Hội An · Hanoi · Hạ Long Bay", 76, 152, { fontSize: 20, fill: "#5c2c20", fontFamily: "var(--font-body)", fontWeight: 500, width: 500 }),
        washi(60, 220, 190, "#c96c53", -8),
        washi(660, 210, 210, "#82a468", 7),
        framedPhoto("polaroid", 60, 260, 320, 380, "#ffffff", -5),
        text("day one ✿", 96, 590, { fontSize: 24, fontFamily: "var(--font-hand)", fill: "#3b2c22", width: 260 }),
        framedPhoto("film", 420, 300, 300, 260, "#211d1a", 4),
        photo(760, 280, 250, 320, { rotation: -6, borderRadius: 4 }),
        washi(730, 260, 180, "#deb04a", -10),
        sticker("✈️", "Travel", 40, 20, 60, -10),
        sticker("🗺️", "Travel", 400, 610, 56, 6),
        sticker("🏖️", "Travel", 620, 640, 52, -8),
        sticker("🧭", "Travel", 950, 220, 46, 12),
        sticker("🏝️", "Travel", 960, 470, 48, -6),
        doodle(ARROW_SWIRL, "0 0 48 48", 380, 200, 56, 56, "#8d3f2c", 10),
        doodle(PIN, "0 0 32 44", 720, 620, 40, 52, "#a8503a"),
        text("\u201Cnot all who wander are lost\u201D", 90, 680, { fontSize: 22, fontFamily: "var(--font-hand)", fill: "#5c2c20", width: 420 }),
        framedPhoto("polaroid", 130, 780, 340, 400, "#ffffff", 4),
        washi(120, 760, 190, "#82a468", -6),
        photo(540, 800, 460, 300, { rotation: -3, borderRadius: 4 }),
        washi(560, 780, 190, "#c96c53", 8),
        sticker("🧳", "Travel", 500, 1120, 54, -4),
        sticker("🌴", "Nature", 620, 1150, 50, 6),
        sticker("📸", "Activities", 720, 1130, 46, -8),
        text("keep the tickets, forget the plans", 130, 1200, { fontSize: 26, fontFamily: "var(--font-hand)", fill: "#3b2c22", width: 420 }),
        doodle(SQUIGGLE, "0 0 100 16", 130, 1250, 300, 24, "#8d3f2c"),
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
        text("Dear Diary", 80, 90, { fontSize: 62, fontFamily: "var(--font-hand)", fill: "#4a3219", rotation: -1 }),
        shape("rect", 80, 220, 500, 3, "#875c1a", { cornerRadius: 0 }),
        text(
          "Some mornings feel like they belong to another century — the kind of light that makes you want to write everything down before it disappears.",
          80,
          252,
          { fontSize: 21, fill: "#4a3219", width: 460, fontFamily: "var(--font-body)", lineHeight: 1.5 }
        ),
        framedPhoto("torn", 620, 100, 340, 300, "#f4ecd8", 3),
        washi(650, 80, 200, "#a7741f", -7),
        sticker("🪶", "Nature", 960, 90, 54, 8),
        sticker("🔖", "Study", 900, 420, 44, -6),
        text("07 . 14", 640, 420, { fontSize: 16, fontFamily: "var(--font-mono)", fill: "#6c481a" }),
        doodle(SQUIGGLE, "0 0 100 16", 80, 470, 400, 34, "#6c481a"),
        photo(80, 520, 420, 340, { rotation: -2, borderRadius: 4, borderWidth: 6, borderColor: "#f4ecd8" }),
        washi(70, 500, 190, "#875c1a", -8),
        text("things I noticed today —", 540, 550, { fontSize: 26, fontFamily: "var(--font-hand)", fill: "#4a3219" }),
        text("· the smell of rain on warm stone\n· an old song on the radio\n· handwriting I didn't recognize", 540, 610, { fontSize: 19, fontFamily: "var(--font-body)", fill: "#4a3219", width: 420, lineHeight: 1.7 }),
        sticker("☕", "Food", 560, 830, 56, -4),
        sticker("🕯️", "Symbols", 660, 850, 48, 8),
        framedPhoto("ornate", 780, 780, 260, 320, "#4a3219", -4),
        doodle(HEART, "0 0 48 48", 900, 900, 44, 44, "#a7741f"),
        text("keep going, quietly.", 100, 950, { fontSize: 34, fontFamily: "var(--font-hand)", fill: "#4a3219", rotation: -2 }),
        washi(100, 1060, 220, "#a7741f", -4),
        doodle(WAVY_UNDERLINE, "0 0 100 16", 100, 1100, 420, 30, "#6c481a"),
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
        text("memories, undeveloped", 80, 70, { fontSize: 42, fontFamily: "var(--font-display)", fill: "#2c2a28" }),
        shape("rect", 80, 150, 320, 2, "#c9c2ad"),
        framedPhoto("polaroid", 70, 210, 280, 340, "#ffffff", -7),
        sticker("📌", "Symbols", 190, 200, 34, 0),
        framedPhoto("polaroid", 380, 260, 280, 340, "#ffffff", 5),
        sticker("📌", "Symbols", 500, 250, 34, 0),
        framedPhoto("polaroid", 690, 200, 280, 340, "#ffffff", -3),
        sticker("📌", "Symbols", 810, 190, 34, 0),
        washi(280, 230, 150, "#c96c53", -20),
        washi(600, 600, 150, "#82a468", 18),
        framedPhoto("polaroid", 130, 610, 280, 340, "#ffffff", 4),
        sticker("📌", "Symbols", 250, 600, 34, 0),
        framedPhoto("polaroid", 440, 640, 280, 340, "#ffffff", -6),
        sticker("📌", "Symbols", 560, 630, 34, 0),
        framedPhoto("polaroid", 750, 600, 280, 340, "#ffffff", 6),
        sticker("📌", "Symbols", 870, 590, 34, 0),
        text("a year, in frames", 100, 1030, { fontSize: 30, fontFamily: "var(--font-hand)", fill: "#2c2a28", rotation: -1 }),
        doodle(DASH_LINE, "0 0 100 4", 100, 1090, 460, 8, "#8a8171"),
        framedPhoto("polaroid", 250, 1120, 280, 340, "#ffffff", -2),
        sticker("📌", "Symbols", 370, 1110, 34, 0),
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
        text("ex libris", 80, 90, { fontSize: 58, fontFamily: "var(--font-display)", fill: "#c8912a", fontStyle: "italic" }),
        shape("rect", 80, 200, 480, 2, "#c8912a"),
        text("notes on the classics", 80, 226, { fontSize: 20, fill: "#e6ded0", fontFamily: "var(--font-body)" }),
        framedPhoto("film", 620, 90, 320, 260, "#0f0d12", 3),
        sticker("📚", "Study", 980, 90, 60, -6),
        doodle(PIN, "0 0 20 60", 940, 400, 32, 96, "#c8912a"),
        text("chapter one", 620, 380, { fontSize: 26, fontFamily: "var(--font-hand)", fill: "#c8912a" }),
        photo(80, 300, 440, 300, { rotation: -2, borderRadius: 2, borderWidth: 4, borderColor: "#33293b" }),
        washi(60, 280, 180, "#875c1a", -6),
        text(
          "\u201CI read to know that I am not alone.\u201D — a line I keep returning to on candle-lit evenings.",
          80,
          640,
          { fontSize: 19, fill: "#cfc4de", width: 460, fontFamily: "var(--font-body)", lineHeight: 1.6 }
        ),
        shape("circle", 640, 470, 230, 230, "#33293b", { opacity: 0.7 } as never),
        framedPhoto("ornate", 680, 500, 210, 260, "#c8912a", 4),
        sticker("🕯️", "Symbols", 200, 850, 52, -4),
        sticker("🖋️", "Study", 300, 880, 44, 8),
        sticker("🔑", "Symbols", 400, 850, 40, -6),
        text("ink-stained fingers, gold-lit rooms", 80, 960, { fontSize: 28, fontFamily: "var(--font-hand)", fill: "#e6ded0" }),
        washi(80, 1040, 220, "#c8912a", -4),
        doodle(SQUIGGLE, "0 0 100 16", 80, 1090, 400, 30, "#c8912a"),
        framedPhoto("double", 620, 850, 300, 360, "#33293b", -3),
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
        text("coffee & slow mornings", 80, 80, { fontSize: 44, fontFamily: "var(--font-display)", fill: "#5c2c20" }),
        sticker("☕", "Food", 90, 190, 84, -4),
        sticker("🥐", "Food", 220, 220, 64, 6),
        sticker("🍯", "Food", 330, 190, 56, -8),
        washi(80, 340, 220, "#a7741f", -5),
        framedPhoto("polaroid", 70, 380, 320, 380, "#faf3e2", -3),
        text("today's blend", 110, 720, { fontSize: 22, fontFamily: "var(--font-hand)", fill: "#4a3219" }),
        photo(440, 200, 420, 320, { rotation: 3, borderRadius: 6, borderWidth: 8, borderColor: "#faf3e2" }),
        washi(700, 180, 180, "#deb04a", 8),
        text("brewed slowly, savored slower", 460, 560, { fontSize: 24, fontFamily: "var(--font-hand)", fill: "#5c2c20", width: 380 }),
        doodle(SQUIGGLE, "0 0 100 16", 460, 610, 300, 24, "#6c481a"),
        framedPhoto("scalloped", 470, 660, 300, 340, "#faf3e2", -4),
        sticker("🍪", "Food", 800, 700, 56, 6),
        sticker("🧁", "Food", 880, 780, 52, -6),
        text(
          "The espresso machine hisses awake before I do — some rituals are worth the extra five minutes.",
          80,
          820,
          { fontSize: 19, fontFamily: "var(--font-body)", fill: "#4a3219", width: 340, lineHeight: 1.6 }
        ),
        washi(80, 970, 190, "#a7741f", -6),
        sticker("🍵", "Food", 300, 1000, 48, 4),
        photo(80, 1060, 380, 250, { rotation: -2, borderRadius: 6 }),
        doodle(HEART, "0 0 48 48", 900, 1000, 46, 46, "#a7741f"),
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
        text("summer, salt & sun", 80, 80, { fontSize: 48, fontFamily: "var(--font-display)", fill: "#a7741f" }),
        sticker("🏖️", "Nature", 90, 200, 72, -4),
        sticker("🌴", "Nature", 210, 240, 68, 8),
        sticker("☀️", "Weather", 900, 100, 72, 10),
        sticker("🍉", "Food", 330, 220, 56, -6),
        washi(80, 320, 220, "#deb04a", -5),
        framedPhoto("polaroid", 70, 360, 340, 400, "#ffffff", -3),
        text("beach day #1", 110, 720, { fontSize: 24, fontFamily: "var(--font-hand)", fill: "#8a6a1f" }),
        photo(460, 190, 420, 300, { rotation: 4, borderRadius: 8 }),
        washi(710, 170, 190, "#5f7f47", 8),
        sticker("🍦", "Food", 470, 530, 52, -4),
        sticker("🐚", "Nature", 600, 550, 44, 8),
        doodle(SQUIGGLE, "0 0 100 16", 460, 500, 320, 26, "#a7741f"),
        framedPhoto("film", 480, 600, 380, 280, "#2c2a28", -2),
        text("golden hour, every time", 490, 920, { fontSize: 30, fontFamily: "var(--font-hand)", fill: "#a7741f" }),
        sticker("🌊", "Nature", 850, 900, 52, -4),
        washi(80, 800, 210, "#5f7f47", -7),
        photo(80, 840, 360, 260, { rotation: -3, borderRadius: 6 }),
        doodle(STAR, "0 0 48 48", 950, 700, 44, 44, "#deb04a"),
        text("\u201Csunscreen & good company\u201D", 100, 1140, { fontSize: 22, fontFamily: "var(--font-hand)", fill: "#5c2c20", width: 400 }),
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
        text("us, always", 90, 90, { fontSize: 62, fontFamily: "var(--font-hand)", fill: "#a8503a", rotation: -2 }),
        sticker("💕", "Love", 620, 90, 60, 8),
        sticker("💌", "Love", 720, 60, 44, -6),
        framedPhoto("scalloped", 620, 190, 340, 400, "#ffffff", 4),
        washi(650, 170, 200, "#e3a9a0", -6),
        text("first date, replayed", 100, 250, { fontSize: 24, fontFamily: "var(--font-hand)", fill: "#a8503a", width: 420 }),
        photo(90, 300, 460, 320, { rotation: -3, borderRadius: 10, borderWidth: 10, borderColor: "#ffffff" }),
        doodle(HEART, "0 0 48 48", 250, 660, 64, 64, "#c96c53", -6),
        sticker("💐", "Love", 400, 680, 56, 6),
        text(
          "two years in, and I still reach for your hand before I even think about it.",
          620,
          650,
          { fontSize: 20, fontFamily: "var(--font-body)", fill: "#713424", width: 380, lineHeight: 1.6 }
        ),
        washi(100, 800, 210, "#c96c53", -5),
        framedPhoto("double", 90, 840, 380, 320, "#fff", -2),
        sticker("💍", "Love", 550, 900, 46, -4),
        sticker("🥰", "Love", 650, 950, 44, 8),
        photo(560, 880, 400, 300, { rotation: 3, borderRadius: 8 }),
        doodle(SQUIGGLE, "0 0 100 16", 570, 1190, 380, 30, "#a8503a"),
        text("here's to all our next chapters", 100, 1200, { fontSize: 26, fontFamily: "var(--font-hand)", fill: "#713424" }),
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
        text("make a wish", 90, 80, { fontSize: 56, fontFamily: "var(--font-display)", fill: "#a7741f" }),
        sticker("🎂", "Celebration", 100, 210, 76, -4),
        sticker("🎈", "Celebration", 240, 190, 60, 8),
        sticker("🎉", "Celebration", 850, 100, 60, -6),
        sticker("🎁", "Celebration", 340, 240, 54, 6),
        washi(90, 320, 220, "#deb04a", -5),
        framedPhoto("polaroid", 80, 360, 340, 400, "#ffffff", -3),
        text("the big day", 120, 720, { fontSize: 24, fontFamily: "var(--font-hand)", fill: "#8a6a1f" }),
        photo(460, 200, 420, 300, { rotation: 3, borderRadius: 10 }),
        washi(700, 180, 190, "#c96c53", 8),
        shape("star", 470, 540, 90, 90, "#c96c53", { rotation: -8 }),
        sticker("🥳", "Celebration", 620, 560, 54, -4),
        sticker("🍰", "Food", 720, 590, 48, 8),
        text("cake first, always", 470, 680, { fontSize: 26, fontFamily: "var(--font-hand)", fill: "#a7741f" }),
        washi(80, 800, 200, "#deb04a", -6),
        framedPhoto("film", 80, 840, 380, 280, "#2c2a28", -2),
        sticker("🎊", "Celebration", 500, 850, 52, 6),
        photo(560, 880, 400, 300, { rotation: -3, borderRadius: 8 }),
        doodle(STAR, "0 0 48 48", 950, 800, 44, 44, "#deb04a"),
        text("another year, more cake", 100, 1200, { fontSize: 24, fontFamily: "var(--font-hand)", fill: "#5c2c20" }),
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
        text("2026 vision", 80, 70, { fontSize: 54, fontFamily: "var(--font-display)", fill: "#3b4f2c" }),
        sticker("✨", "Symbols", 900, 90, 48, 8),
        photo(80, 200, 280, 320, { rotation: -2, borderRadius: 6 }),
        text("grow", 110, 540, { fontSize: 26, fontFamily: "var(--font-hand)", fill: "#4a6537" }),
        photo(400, 240, 280, 320, { rotation: 3, borderRadius: 6 }),
        text("build", 430, 580, { fontSize: 26, fontFamily: "var(--font-hand)", fill: "#4a6537" }),
        photo(720, 200, 280, 320, { rotation: -3, borderRadius: 6 }),
        text("travel", 750, 540, { fontSize: 26, fontFamily: "var(--font-hand)", fill: "#4a6537" }),
        washi(200, 190, 160, "#82a468", -12),
        washi(600, 220, 160, "#deb04a", 10),
        doodle(ARROW_SWIRL, "0 0 48 48", 340, 500, 56, 56, "#4a6537", -8),
        shape("rect", 80, 640, 900, 2, "#c9d4bb"),
        text("this year I am choosing to —", 80, 680, { fontSize: 24, fontFamily: "var(--font-hand)", fill: "#3b4f2c" }),
        text("· move my body daily\n· say yes to the trip\n· finish what I start\n· rest without guilt", 80, 730, { fontSize: 20, fontFamily: "var(--font-body)", fill: "#3b4f2c", width: 420, lineHeight: 1.8 }),
        framedPhoto("rounded", 620, 700, 340, 420, "#ffffff", 2),
        sticker("🌱", "Nature", 560, 900, 44, -4),
        sticker("🎯", "Symbols", 900, 1000, 46, 6),
        doodle(STAR, "0 0 48 48", 80, 1170, 40, 40, "#82a468"),
        text("small steps, every single day", 140, 1170, { fontSize: 22, fontFamily: "var(--font-hand)", fill: "#4a6537" }),
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
        text("study notes", 80, 70, { fontSize: 46, fontFamily: "var(--font-display)", fill: "#2c2a28" }),
        text("Week 12 — Revision plan", 84, 150, { fontSize: 20, fontFamily: "var(--font-body)", fill: "#5f5a4d" }),
        sticker("📚", "Study", 900, 70, 56, -4),
        shape("rect", 80, 210, 900, 2, "#c9c2ad"),
        shape("rect", 80, 250, 420, 260, "#ffffff", { cornerRadius: 14 }),
        text("Monday", 106, 274, { fontSize: 20, fontFamily: "var(--font-hand)", fill: "#4a6537" }),
        text("☐ Chapter 4 notes\n☐ Flashcards ×20\n☐ Practice set A", 106, 320, { fontSize: 17, fontFamily: "var(--font-body)", fill: "#3b3a33", width: 360, lineHeight: 1.9 }),
        shape("rect", 540, 250, 420, 260, "#ffffff", { cornerRadius: 14 }),
        text("Tuesday", 566, 274, { fontSize: 20, fontFamily: "var(--font-hand)", fill: "#4a6537" }),
        text("☐ Review lecture 6\n☐ Study group 4pm\n☐ Mock quiz", 566, 320, { fontSize: 17, fontFamily: "var(--font-body)", fill: "#3b3a33", width: 360, lineHeight: 1.9 }),
        sticker("⏰", "Study", 300, 560, 44, -6),
        sticker("✏️", "Study", 700, 560, 40, 8),
        washi(80, 560, 190, "#5f7f47", -6),
        photo(80, 620, 380, 260, { rotation: -2, borderRadius: 6 }),
        text("desk setup, week 12", 110, 900, { fontSize: 20, fontFamily: "var(--font-hand)", fill: "#4a6537" }),
        framedPhoto("rounded", 540, 610, 380, 300, "#ffffff", 2),
        doodle(DASH_LINE, "0 0 100 4", 80, 960, 460, 8, "#8a8171"),
        sticker("🧠", "Study", 900, 950, 46, -4),
        text("focus \u2192 rest \u2192 repeat", 100, 1030, { fontSize: 22, fontFamily: "var(--font-hand)", fill: "#3b4f2c" }),
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
        text("01", 900, 90, { fontSize: 22, fontFamily: "var(--font-mono)", fill: "#9a9284" }),
        photo(240, 190, 600, 720, { rotation: 0, borderRadius: 4 }),
        text("simplicity", 260, 950, { fontSize: 30, fontFamily: "var(--font-display)", fill: "#2c2a28" }),
        shape("rect", 260, 1010, 60, 2, "#2c2a28"),
        text("some days need nothing more than one good photograph and a little room to breathe.", 260, 1040, { fontSize: 16, fontFamily: "var(--font-body)", fill: "#6b6255", width: 420, lineHeight: 1.6 }),
        doodle(DASH_LINE, "0 0 100 4", 800, 200, 120, 8, "#c9c2ad", 90),
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
        photo(640, 100, 340, 300, { rotation: 0, borderRadius: 0 }),
        text("mood", 700, 200, { fontSize: 40, fontFamily: "var(--font-display)", fill: "#ffffff" }),
        shape("rect", 80, 420, 460, 260, "#ffffff"),
        photo(120, 450, 380, 200, { rotation: -2, borderRadius: 4 }),
        shape("circle", 580, 440, 220, 220, "#deb04a"),
        shape("rect", 820, 440, 180, 220, "#2c2a28"),
        sticker("🎨", "Symbols", 850, 700, 48, -4),
        washi(80, 700, 200, "#8a6bb1", -6),
        photo(80, 740, 460, 280, { rotation: 1, borderRadius: 4 }),
        shape("rect", 580, 700, 420, 320, "#dba38e"),
        doodle(SQUIGGLE, "0 0 100 16", 610, 900, 360, 30, "#4c261c"),
        text("texture · color · light", 80, 1060, { fontSize: 24, fontFamily: "var(--font-hand)", fill: "#2c2a28" }),
        sticker("🧵", "Symbols", 400, 1060, 44, 6),
        sticker("🪡", "Symbols", 480, 1080, 40, -6),
      ]),
    ],
  },
];

export function getTemplate(id: string): Template | undefined {
  return TEMPLATES.find((t) => t.id === id);
}

export const TEMPLATE_CATEGORIES = Array.from(new Set(TEMPLATES.map((t) => t.category)));
