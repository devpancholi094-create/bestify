"use client";

import * as React from "react";
import { Camera } from "lucide-react";
import { CanvasPage } from "@/lib/types";

interface MiniCanvasPreviewProps {
  page: CanvasPage;
  className?: string;
}

/**
 * A lightweight, non-interactive HTML/CSS preview of a canvas page.
 * Used for template gallery cards and project thumbnails so people can see
 * the *actual* design (photo grid, stickers, washi tape, captions) instead
 * of a flat color swatch.
 */
export function MiniCanvasPreview({ page, className }: MiniCanvasPreviewProps) {
  const sorted = React.useMemo(
    () => [...page.elements].sort((a, b) => a.zIndex - b.zIndex),
    [page.elements]
  );

  return (
    <div
      className={className}
      style={{
        background: page.background,
        position: "relative",
        overflow: "hidden",
        containerType: "inline-size",
      } as React.CSSProperties}
    >
      {sorted.map((el) => {
        const style: React.CSSProperties = {
          position: "absolute",
          left: `${(el.x / page.width) * 100}%`,
          top: `${(el.y / page.height) * 100}%`,
          width: `${(el.width / page.width) * 100}%`,
          height: `${(el.height / page.height) * 100}%`,
          transform: `rotate(${el.rotation}deg)`,
          opacity: el.opacity,
        };

        switch (el.type) {
          case "text":
            return (
              <div
                key={el.id}
                style={{
                  ...style,
                  color: el.fill,
                  fontFamily: el.fontFamily,
                  fontWeight: el.fontWeight >= 600 ? 700 : 400,
                  fontStyle: el.fontStyle,
                  fontSize: "clamp(4px, 5.4cqw, 999px)",
                  lineHeight: 1.15,
                  textAlign: el.align,
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                }}
              >
                {el.text}
              </div>
            );
          case "sticker":
            return (
              <div
                key={el.id}
                style={{ ...style, fontSize: "clamp(6px, 8cqw, 999px)", lineHeight: 1, textAlign: "center" }}
              >
                {el.content}
              </div>
            );
          case "washi":
            return (
              <div
                key={el.id}
                style={{
                  ...style,
                  background: el.color,
                  opacity: 0.85,
                  boxShadow: "0 1px 2px rgba(0,0,0,0.15)",
                }}
              />
            );
          case "image":
          case "frame": {
            const src = el.type === "image" ? el.src : el.imageSrc;
            const color = el.type === "frame" ? el.color : "#ffffff";
            const radius =
              el.type === "image" ? el.borderRadius : el.style === "rounded" ? 10 : 1;
            return (
              <div
                key={el.id}
                style={{
                  ...style,
                  background: color,
                  borderRadius: Math.min(radius, 10),
                  boxShadow: "0 2px 5px rgba(0,0,0,0.18)",
                  padding: el.type === "frame" ? "6%" : 0,
                }}
              >
                <div
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: Math.max(0, Math.min(radius, 10) - 2),
                    background: src
                      ? `center/cover no-repeat url(${src})`
                      : "linear-gradient(135deg, #eadfc9, #f1e6cf)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#b9ab8c",
                  }}
                >
                  {!src && <Camera style={{ width: "22%", height: "22%" }} />}
                </div>
              </div>
            );
          }
          case "shape":
            return (
              <div
                key={el.id}
                style={{
                  ...style,
                  background: el.fill,
                  borderRadius:
                    el.shape === "circle" ? "50%" : el.shape === "rect" ? Math.min(el.cornerRadius, 10) : 4,
                  clipPath:
                    el.shape === "triangle"
                      ? "polygon(50% 0,0 100%,100% 100%)"
                      : el.shape === "hexagon"
                      ? "polygon(25% 0,75% 0,100% 50%,75% 100%,25% 100%,0 50%)"
                      : undefined,
                }}
              />
            );
          case "doodle": {
            const [, , vbW, vbH] = el.viewBox.split(" ").map(Number);
            return (
              <svg
                key={el.id}
                viewBox={el.viewBox}
                style={style}
                preserveAspectRatio="none"
                fill="none"
                stroke={el.stroke}
                strokeWidth={Math.max(2, (vbW || 48) * 0.05)}
              >
                <path d={el.path} />
              </svg>
            );
          }
          case "line":
            return (
              <div
                key={el.id}
                style={{
                  ...style,
                  borderTop: `2px ${el.lineStyle === "dashed" ? "dashed" : el.lineStyle === "dotted" ? "dotted" : "solid"} ${el.stroke}`,
                  height: 0,
                  top: `${((el.y + el.height / 2) / page.height) * 100}%`,
                }}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
