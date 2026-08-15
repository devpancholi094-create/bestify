export type ElementType =
  | "text"
  | "image"
  | "sticker"
  | "shape"
  | "frame"
  | "washi"
  | "line"
  | "doodle";

export type ShapeKind =
  | "rect"
  | "circle"
  | "triangle"
  | "star"
  | "heart"
  | "hexagon"
  | "arrow"
  | "cloud"
  | "blob";

export interface BaseElement {
  id: string;
  type: ElementType;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  locked: boolean;
  visible: boolean;
  name: string;
}

export interface TextElement extends BaseElement {
  type: "text";
  text: string;
  fontFamily: string;
  fontSize: number;
  fontWeight: number;
  fontStyle: "normal" | "italic";
  fill: string;
  align: "left" | "center" | "right";
  letterSpacing: number;
  lineHeight: number;
  curved: boolean;
  curveRadius: number;
  shadow: boolean;
  shadowColor: string;
  shadowBlur: number;
  shadowOffsetX: number;
  shadowOffsetY: number;
  stroke?: string;
  strokeWidth?: number;
  background?: string;
  highlight?: string;
}

export interface ImageElement extends BaseElement {
  type: "image";
  src: string;
  filter: "none" | "grayscale" | "sepia" | "warm" | "cool" | "fade" | "polaroid" | "noir";
  borderRadius: number;
  frameStyle?: string;
  borderWidth: number;
  borderColor: string;
}

export interface StickerElement extends BaseElement {
  type: "sticker";
  content: string;
  category: string;
  flipX: boolean;
}

export interface ShapeElement extends BaseElement {
  type: "shape";
  shape: ShapeKind;
  fill: string;
  stroke: string;
  strokeWidth: number;
  cornerRadius: number;
}

export interface FrameElement extends BaseElement {
  type: "frame";
  frameId: string;
  style: "polaroid" | "scalloped" | "film" | "torn" | "double" | "rounded" | "hexagon" | "arch" | "ornate" | "sticker-border";
  color: string;
  imageSrc?: string;
}

export interface WashiElement extends BaseElement {
  type: "washi";
  pattern: string;
  color: string;
}

export interface LineElement extends BaseElement {
  type: "line";
  points: number[];
  stroke: string;
  strokeWidth: number;
  dash: number[];
  lineStyle: "solid" | "dashed" | "dotted" | "wavy" | "zigzag";
}

export interface DoodleElement extends BaseElement {
  type: "doodle";
  path: string;
  stroke: string;
  strokeWidth: number;
  viewBox: string;
}

export type CanvasElement =
  | TextElement
  | ImageElement
  | StickerElement
  | ShapeElement
  | FrameElement
  | WashiElement
  | LineElement
  | DoodleElement;

export interface CanvasPage {
  id: string;
  name: string;
  width: number;
  height: number;
  background: string;
  backgroundImage?: string;
  elements: CanvasElement[];
}

export interface Project {
  id: string;
  title: string;
  description?: string;
  category: string;
  pages: CanvasPage[];
  thumbnail?: string;
  createdAt: number;
  updatedAt: number;
  ownerId: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isGuest: boolean;
  createdAt: number;
}

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  thumbnail: {
    background: string;
    accent: string;
    pattern: "polaroid" | "washi-grid" | "vintage" | "mood" | "minimal" | "study" | "dark-academia";
  };
  pages: CanvasPage[];
}
