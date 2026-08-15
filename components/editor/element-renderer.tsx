"use client";

import * as React from "react";
import {
  Group,
  Rect,
  Ellipse,
  RegularPolygon,
  Star,
  Text as KonvaText,
  Image as KonvaImage,
  Line,
  Path,
} from "react-konva";
import useImage from "use-image";
import Konva from "konva";
import {
  CanvasElement,
  DoodleElement,
  FrameElement,
  ImageElement,
  LineElement,
  ShapeElement,
  StickerElement,
  TextElement,
  WashiElement,
} from "@/lib/types";

interface ElementNodeProps {
  element: CanvasElement;
  isSelected: boolean;
  onSelect: (e: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => void;
  onChange: (patch: Partial<CanvasElement>) => void;
  onDragEnd: () => void;
  registerRef: (node: Konva.Node | null) => void;
}

const SHAPE_PATHS: Record<string, string> = {
  heart: "M50 88 C10 62 -4 34 18 16 C32 4 50 12 50 28 C50 12 68 4 82 16 C104 34 90 62 50 88 Z",
  cloud: "M20 70 C0 70 0 44 20 44 C20 20 60 14 72 34 C96 30 108 54 88 64 C92 82 68 84 58 76 C46 84 20 82 20 70 Z",
  blob: "M50 6 C76 6 96 26 94 52 C92 78 70 96 44 94 C18 92 2 70 6 46 C10 22 26 6 50 6 Z",
  arrow: "M4 40 H70 V24 L96 50 L70 76 V60 H4 Z",
};

function ShapeNode({ el }: { el: ShapeElement }) {
  const common = {
    fill: el.fill,
    stroke: el.strokeWidth > 0 ? el.stroke : undefined,
    strokeWidth: el.strokeWidth,
  };
  switch (el.shape) {
    case "rect":
      return <Rect width={el.width} height={el.height} cornerRadius={el.cornerRadius} {...common} />;
    case "circle":
      return (
        <Ellipse
          x={el.width / 2}
          y={el.height / 2}
          radiusX={el.width / 2}
          radiusY={el.height / 2}
          {...common}
        />
      );
    case "triangle":
      return (
        <RegularPolygon
          x={el.width / 2}
          y={el.height / 2}
          sides={3}
          radius={Math.min(el.width, el.height) / 2}
          {...common}
        />
      );
    case "hexagon":
      return (
        <RegularPolygon
          x={el.width / 2}
          y={el.height / 2}
          sides={6}
          radius={Math.min(el.width, el.height) / 2}
          {...common}
        />
      );
    case "star":
      return (
        <Star
          x={el.width / 2}
          y={el.height / 2}
          numPoints={5}
          innerRadius={Math.min(el.width, el.height) / 4}
          outerRadius={Math.min(el.width, el.height) / 2}
          {...common}
        />
      );
    case "heart":
    case "cloud":
    case "blob":
    case "arrow":
      return (
        <Path
          data={SHAPE_PATHS[el.shape]}
          scaleX={el.width / 100}
          scaleY={el.height / 90}
          {...common}
        />
      );
    default:
      return <Rect width={el.width} height={el.height} {...common} />;
  }
}

function CurvedText({ el }: { el: TextElement }) {
  const chars = el.text.split("");
  const radius = el.curveRadius;
  const anglePerChar = chars.length > 0 ? Math.min(160, chars.length * 9) / chars.length : 0;
  const startAngle = -((anglePerChar * (chars.length - 1)) / 2);

  return (
    <Group>
      {chars.map((ch, i) => {
        const angle = startAngle + i * anglePerChar;
        const rad = (angle * Math.PI) / 180;
        const x = el.width / 2 + radius * Math.sin(rad);
        const y = el.height / 2 - radius * Math.cos(rad);
        return (
          <KonvaText
            key={i}
            text={ch}
            x={x}
            y={y}
            fontSize={el.fontSize}
            fontFamily={el.fontFamily}
            fontStyle={`${el.fontWeight >= 600 ? "bold" : "normal"} ${el.fontStyle}`.trim()}
            fill={el.fill}
            rotation={angle}
            offsetX={el.fontSize / 4}
            shadowColor={el.shadow ? el.shadowColor : undefined}
            shadowBlur={el.shadow ? el.shadowBlur : 0}
            shadowOffsetX={el.shadow ? el.shadowOffsetX : 0}
            shadowOffsetY={el.shadow ? el.shadowOffsetY : 0}
          />
        );
      })}
    </Group>
  );
}

function TextNode({ el }: { el: TextElement }) {
  if (el.curved) return <CurvedText el={el} />;
  return (
    <KonvaText
      text={el.text}
      width={el.width}
      height={el.height}
      fontSize={el.fontSize}
      fontFamily={el.fontFamily}
      fontStyle={`${el.fontWeight >= 600 ? "bold" : "normal"} ${el.fontStyle}`.trim()}
      fill={el.fill}
      align={el.align}
      letterSpacing={el.letterSpacing}
      lineHeight={el.lineHeight}
      shadowColor={el.shadow ? el.shadowColor : undefined}
      shadowBlur={el.shadow ? el.shadowBlur : 0}
      shadowOffsetX={el.shadow ? el.shadowOffsetX : 0}
      shadowOffsetY={el.shadow ? el.shadowOffsetY : 0}
      stroke={el.strokeWidth ? el.stroke : undefined}
      strokeWidth={el.strokeWidth}
      wrap="word"
    />
  );
}

const IMAGE_FILTER_CONFIG: Record<
  ImageElement["filter"],
  { filters: unknown[]; apply: (node: Konva.Image) => void } | null
> = {
  none: null,
  grayscale: { filters: [Konva.Filters.Grayscale], apply: () => {} },
  sepia: { filters: [Konva.Filters.Sepia], apply: () => {} },
  noir: {
    filters: [Konva.Filters.Grayscale, Konva.Filters.Contrast],
    apply: (node) => node.contrast(30),
  },
  warm: {
    filters: [Konva.Filters.HSL],
    apply: (node) => {
      node.saturation(0.3);
      node.hue(6);
    },
  },
  cool: {
    filters: [Konva.Filters.HSL],
    apply: (node) => {
      node.saturation(0.1);
      node.hue(-10);
    },
  },
  fade: {
    filters: [Konva.Filters.Brighten, Konva.Filters.Contrast],
    apply: (node) => {
      node.brightness(0.08);
      node.contrast(-12);
    },
  },
  polaroid: {
    filters: [Konva.Filters.Brighten, Konva.Filters.Contrast],
    apply: (node) => {
      node.brightness(0.05);
      node.contrast(-8);
    },
  },
};

function ImageNode({ el }: { el: ImageElement }) {
  const [img] = useImage(el.src, "anonymous");
  const imgRef = React.useRef<Konva.Image>(null);

  React.useEffect(() => {
    const node = imgRef.current;
    if (!node || !img) return;
    const config = IMAGE_FILTER_CONFIG[el.filter];
    if (!config) {
      node.filters([]);
      node.clearCache();
      return;
    }
    node.cache();
    node.filters(config.filters as never);
    config.apply(node);
    node.getLayer()?.batchDraw();
  }, [img, el.filter, el.width, el.height]);

  return (
    <Group
      clipFunc={(ctx) => {
        const r = el.borderRadius;
        const w = el.width;
        const h = el.height;
        ctx.beginPath();
        ctx.moveTo(r, 0);
        ctx.arcTo(w, 0, w, h, r);
        ctx.arcTo(w, h, 0, h, r);
        ctx.arcTo(0, h, 0, 0, r);
        ctx.arcTo(0, 0, w, 0, r);
        ctx.closePath();
      }}
    >
      {img ? (
        <KonvaImage ref={imgRef} image={img} width={el.width} height={el.height} />
      ) : (
        <Rect width={el.width} height={el.height} fill="#e5ddc9" />
      )}
      {el.borderWidth > 0 && (
        <Rect
          width={el.width}
          height={el.height}
          stroke={el.borderColor}
          strokeWidth={el.borderWidth}
          cornerRadius={el.borderRadius}
        />
      )}
    </Group>
  );
}

function StickerNode({ el }: { el: StickerElement }) {
  return (
    <KonvaText
      text={el.content}
      width={el.width}
      height={el.height}
      fontSize={Math.min(el.width, el.height) * 0.86}
      align="center"
      verticalAlign="middle"
      scaleX={el.flipX ? -1 : 1}
      offsetX={el.flipX ? el.width : 0}
    />
  );
}

function FrameNode({ el }: { el: FrameElement }) {
  const [img] = useImage(el.imageSrc ?? "", "anonymous");
  const padding = el.style === "polaroid" ? el.width * 0.06 : el.width * 0.035;
  const bottomPad = el.style === "polaroid" ? el.height * 0.16 : padding;
  const innerW = el.width - padding * 2;
  const innerH = el.height - padding - bottomPad;

  return (
    <Group>
      <Rect
        width={el.width}
        height={el.height}
        fill={el.style === "sticker-border" ? "transparent" : el.color}
        stroke={el.style === "sticker-border" ? el.color : undefined}
        strokeWidth={el.style === "sticker-border" ? 6 : 0}
        cornerRadius={
          el.style === "rounded" ? 24 : el.style === "arch" ? [el.width / 2, el.width / 2, 8, 8] : 2
        }
        shadowColor="black"
        shadowOpacity={0.18}
        shadowBlur={10}
        shadowOffsetY={3}
      />
      <Group clipX={padding} clipY={padding} clipWidth={innerW} clipHeight={innerH}>
        {img ? (
          <KonvaImage image={img} x={padding} y={padding} width={innerW} height={innerH} />
        ) : (
          <Rect x={padding} y={padding} width={innerW} height={innerH} fill="#e5ddc9" />
        )}
      </Group>
      {el.style === "film" && (
        <>
          {Array.from({ length: 6 }).map((_, i) => (
            <Rect
              key={`t-${i}`}
              x={(i + 0.5) * (el.width / 6) - 6}
              y={4}
              width={12}
              height={8}
              fill="#f4efe3"
              cornerRadius={2}
            />
          ))}
          {Array.from({ length: 6 }).map((_, i) => (
            <Rect
              key={`b-${i}`}
              x={(i + 0.5) * (el.width / 6) - 6}
              y={el.height - 12}
              width={12}
              height={8}
              fill="#f4efe3"
              cornerRadius={2}
            />
          ))}
        </>
      )}
    </Group>
  );
}

function WashiNode({ el }: { el: WashiElement }) {
  return (
    <Rect
      width={el.width}
      height={el.height}
      fill={el.color}
      opacity={0.85}
      cornerRadius={1}
      shadowColor="black"
      shadowOpacity={0.15}
      shadowBlur={4}
      shadowOffsetY={2}
    />
  );
}

function LineNode({ el }: { el: LineElement }) {
  const dash = el.lineStyle === "dashed" ? [14, 8] : el.lineStyle === "dotted" ? [2, 6] : undefined;
  if (el.lineStyle === "wavy" || el.lineStyle === "zigzag") {
    const segs = 10;
    const pts: number[] = [];
    for (let i = 0; i <= segs; i++) {
      const x = (i / segs) * el.width;
      const y = el.lineStyle === "wavy"
        ? Math.sin((i / segs) * Math.PI * 4) * 8 + el.height / 2
        : (i % 2 === 0 ? 0 : el.height);
      pts.push(x, y);
    }
    return (
      <Line
        points={pts}
        stroke={el.stroke}
        strokeWidth={el.strokeWidth}
        lineCap="round"
        lineJoin="round"
        tension={el.lineStyle === "wavy" ? 0.5 : 0}
      />
    );
  }
  return (
    <Line
      points={[0, el.height / 2, el.width, el.height / 2]}
      stroke={el.stroke}
      strokeWidth={el.strokeWidth}
      dash={dash}
      lineCap="round"
    />
  );
}

function DoodleNode({ el }: { el: DoodleElement }) {
  const [, , vbW, vbH] = el.viewBox.split(" ").map(Number);
  return (
    <Path
      data={el.path}
      stroke={el.stroke}
      strokeWidth={el.strokeWidth}
      scaleX={el.width / (vbW || 48)}
      scaleY={el.height / (vbH || 48)}
      lineCap="round"
      lineJoin="round"
    />
  );
}

export function ElementNode({ element, isSelected, onSelect, onChange, onDragEnd, registerRef }: ElementNodeProps) {
  const shapeRef = React.useRef<Konva.Node>(null);

  React.useEffect(() => {
    registerRef(shapeRef.current);
    return () => registerRef(null);
  }, [registerRef]);

  if (!element.visible) return null;

  return (
    <Group
      ref={shapeRef as React.RefObject<Konva.Group>}
      id={element.id}
      x={element.x}
      y={element.y}
      rotation={element.rotation}
      opacity={element.opacity}
      draggable={!element.locked}
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={(e) => {
        onChange({ x: e.target.x(), y: e.target.y() });
        onDragEnd();
      }}
      onTransformEnd={() => {
        const node = shapeRef.current as Konva.Group;
        if (!node) return;
        const scaleX = node.scaleX();
        const scaleY = node.scaleY();
        node.scaleX(1);
        node.scaleY(1);
        onChange({
          x: node.x(),
          y: node.y(),
          rotation: node.rotation(),
          width: Math.max(10, element.width * scaleX),
          height: Math.max(10, element.height * scaleY),
        });
        onDragEnd();
      }}
    >
      {element.type === "text" && <TextNode el={element} />}
      {element.type === "image" && <ImageNode el={element} />}
      {element.type === "sticker" && <StickerNode el={element} />}
      {element.type === "shape" && <ShapeNode el={element} />}
      {element.type === "frame" && <FrameNode el={element} />}
      {element.type === "washi" && <WashiNode el={element} />}
      {element.type === "line" && <LineNode el={element} />}
      {element.type === "doodle" && <DoodleNode el={element} />}
    </Group>
  );
}
