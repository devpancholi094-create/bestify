"use client";

import * as React from "react";
import { Stage, Layer, Rect, Transformer } from "react-konva";
import Konva from "konva";
import { useEditorStore } from "@/lib/editor-store";
import { ElementNode } from "./element-renderer";
import { CanvasElement } from "@/lib/types";

interface CanvasEditorProps {
  stageWrapperRef: React.RefObject<HTMLDivElement>;
  onStageReady: (stage: Konva.Stage) => void;
}

export function CanvasEditor({ stageWrapperRef, onStageReady }: CanvasEditorProps) {
  const project = useEditorStore((s) => s.project);
  const activePageId = useEditorStore((s) => s.activePageId);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const zoom = useEditorStore((s) => s.zoom);
  const selectElements = useEditorStore((s) => s.selectElements);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const updateElement = useEditorStore((s) => s.updateElement);
  const removeElements = useEditorStore((s) => s.removeElements);
  const duplicateElements = useEditorStore((s) => s.duplicateElements);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const updateElements = useEditorStore((s) => s.updateElements);

  const stageRef = React.useRef<Konva.Stage>(null);
  const trRef = React.useRef<Konva.Transformer>(null);
  const nodeMap = React.useRef<Map<string, Konva.Node>>(new Map());
  const [containerSize, setContainerSize] = React.useState({ width: 900, height: 700 });

  const page = project?.pages.find((p) => p.id === activePageId) ?? null;
  const sortedElements = React.useMemo(
    () => (page ? [...page.elements].sort((a, b) => a.zIndex - b.zIndex) : []),
    [page]
  );

  React.useEffect(() => {
    if (stageRef.current) onStageReady(stageRef.current);
  }, [onStageReady]);

  React.useEffect(() => {
    function measure() {
      if (stageWrapperRef.current) {
        setContainerSize({
          width: stageWrapperRef.current.clientWidth,
          height: stageWrapperRef.current.clientHeight,
        });
      }
    }
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [stageWrapperRef]);

  React.useEffect(() => {
    if (!trRef.current) return;
    const nodes = selectedIds
      .map((id) => nodeMap.current.get(id))
      .filter((n): n is Konva.Node => Boolean(n));
    trRef.current.nodes(nodes);
    trRef.current.getLayer()?.batchDraw();
  }, [selectedIds, sortedElements]);

  // Keyboard shortcuts
  React.useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      const mod = e.metaKey || e.ctrlKey;
      if (mod && e.key.toLowerCase() === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (mod && (e.key.toLowerCase() === "y" || (e.key.toLowerCase() === "z" && e.shiftKey))) {
        e.preventDefault();
        redo();
      } else if (mod && e.key.toLowerCase() === "d") {
        e.preventDefault();
        if (selectedIds.length) duplicateElements(selectedIds);
      } else if ((e.key === "Delete" || e.key === "Backspace") && selectedIds.length) {
        e.preventDefault();
        removeElements(selectedIds);
      } else if (e.key === "Escape") {
        clearSelection();
      } else if (e.key.startsWith("Arrow") && selectedIds.length) {
        e.preventDefault();
        const delta = e.shiftKey ? 10 : 1;
        const dx = e.key === "ArrowLeft" ? -delta : e.key === "ArrowRight" ? delta : 0;
        const dy = e.key === "ArrowUp" ? -delta : e.key === "ArrowDown" ? delta : 0;
        const patches = selectedIds.map((id) => {
          const el = page?.elements.find((el2) => el2.id === id);
          return { id, patch: { x: (el?.x ?? 0) + dx, y: (el?.y ?? 0) + dy } };
        });
        updateElements(patches);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedIds, undo, redo, duplicateElements, removeElements, clearSelection, updateElements, page]);

  if (!page) return null;

  const stageWidth = containerSize.width;
  const stageHeight = containerSize.height;
  const offsetX = (stageWidth - page.width * zoom) / 2;
  const offsetY = (stageHeight - page.height * zoom) / 2;

  return (
    <Stage
      ref={stageRef}
      width={stageWidth}
      height={stageHeight}
      onMouseDown={(e) => {
        if (e.target === e.target.getStage()) clearSelection();
      }}
    >
      <Layer x={offsetX} y={offsetY} scaleX={zoom} scaleY={zoom}>
        <Rect
          width={page.width}
          height={page.height}
          fill={page.background}
          shadowColor="black"
          shadowOpacity={0.18}
          shadowBlur={30}
          shadowOffsetY={8}
          cornerRadius={2}
        />
        <Rect
          width={page.width}
          height={page.height}
          fillPatternImage={undefined}
          stroke="rgba(0,0,0,0.06)"
          strokeWidth={1}
          listening={false}
        />
        {sortedElements.map((el: CanvasElement) => (
          <ElementNode
            key={el.id}
            element={el}
            isSelected={selectedIds.includes(el.id)}
            onSelect={(e) => {
              const isShift = (e.evt as MouseEvent).shiftKey;
              if (isShift) {
                const set = new Set(selectedIds);
                if (set.has(el.id)) set.delete(el.id);
                else set.add(el.id);
                selectElements(Array.from(set));
              } else {
                selectElements([el.id]);
              }
            }}
            onChange={(patch) => updateElement(el.id, patch)}
            onDragEnd={() => pushHistory()}
            registerRef={(node) => {
              if (node) nodeMap.current.set(el.id, node);
              else nodeMap.current.delete(el.id);
            }}
          />
        ))}
        <Transformer
          ref={trRef}
          rotateEnabled
          flipEnabled={false}
          anchorSize={9}
          anchorCornerRadius={4}
          anchorStroke="#5f7f47"
          anchorFill="#ffffff"
          borderStroke="#5f7f47"
          borderDash={[4, 4]}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 12 || newBox.height < 12) return oldBox;
            return newBox;
          }}
        />
      </Layer>
    </Stage>
  );
}
