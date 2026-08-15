"use client";

import * as React from "react";
import {
  Bold,
  Italic,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ChevronUp,
  ChevronDown,
  ChevronsUp,
  ChevronsDown,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Trash2,
  Copy,
  Plus,
  Spline,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { useEditorStore } from "@/lib/editor-store";
import { CanvasElement, TextElement, ImageElement, ShapeElement } from "@/lib/types";
import { FONT_FAMILIES, TEXT_COLORS } from "@/lib/assets-data";
import { cn } from "@/lib/utils";

export function RightPanel() {
  const project = useEditorStore((s) => s.project);
  const activePageId = useEditorStore((s) => s.activePageId);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const page = project?.pages.find((p) => p.id === activePageId);
  const selected = page?.elements.find((e) => selectedIds.length === 1 && e.id === selectedIds[0]);

  return (
    <div className="flex h-full w-[300px] shrink-0 flex-col border-l border-border bg-card">
      <Tabs defaultValue="design" className="flex h-full flex-col">
        <div className="border-b border-border p-2">
          <TabsList className="w-full">
            <TabsTrigger value="design" className="flex-1">
              Design
            </TabsTrigger>
            <TabsTrigger value="layers" className="flex-1">
              Layers
            </TabsTrigger>
            <TabsTrigger value="pages" className="flex-1">
              Pages
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="design" className="mt-0 flex-1 overflow-hidden">
          <ScrollArea className="h-full p-4">
            {selected ? (
              <ElementProperties element={selected} />
            ) : (
              <p className="mt-8 text-center text-sm text-muted-foreground">
                Select an element on the canvas to edit its style.
              </p>
            )}
          </ScrollArea>
        </TabsContent>

        <TabsContent value="layers" className="mt-0 flex-1 overflow-hidden">
          <LayersList />
        </TabsContent>

        <TabsContent value="pages" className="mt-0 flex-1 overflow-hidden">
          <PagesList />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  );
}

function ElementProperties({ element }: { element: CanvasElement }) {
  const updateElement = useEditorStore((s) => s.updateElement);
  const pushHistory = useEditorStore((s) => s.pushHistory);
  const removeElements = useEditorStore((s) => s.removeElements);
  const duplicateElements = useEditorStore((s) => s.duplicateElements);

  function patch(p: Partial<CanvasElement>) {
    updateElement(element.id, p);
  }
  function commit() {
    pushHistory();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => duplicateElements([element.id])}>
          <Copy className="h-3.5 w-3.5" /> Duplicate
        </Button>
        <Button variant="outline" size="sm" onClick={() => removeElements([element.id])}>
          <Trash2 className="h-3.5 w-3.5 text-destructive" />
        </Button>
      </div>

      <Field label="Opacity">
        <Slider
          value={[element.opacity * 100]}
          max={100}
          min={0}
          step={1}
          onValueChange={([v]) => patch({ opacity: v / 100 })}
          onValueCommit={commit}
        />
      </Field>

      <Field label="Rotation">
        <Slider
          value={[element.rotation]}
          max={180}
          min={-180}
          step={1}
          onValueChange={([v]) => patch({ rotation: v })}
          onValueCommit={commit}
        />
      </Field>

      {element.type === "text" && <TextProperties element={element as TextElement} patch={patch} commit={commit} />}
      {element.type === "image" && <ImageProperties element={element as ImageElement} patch={patch} commit={commit} />}
      {element.type === "shape" && <ShapeProperties element={element as ShapeElement} patch={patch} commit={commit} />}
      {(element.type === "sticker" || element.type === "washi" || element.type === "doodle" || element.type === "frame" || element.type === "line") && (
        <p className="text-xs text-muted-foreground">
          Drag the corner handles on the canvas to resize, or the top handle to rotate.
        </p>
      )}
    </div>
  );
}

function TextProperties({
  element,
  patch,
  commit,
}: {
  element: TextElement;
  patch: (p: Partial<CanvasElement>) => void;
  commit: () => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Text">
        <textarea
          value={element.text}
          onChange={(e) => patch({ text: e.target.value })}
          onBlur={commit}
          rows={3}
          className="w-full resize-none rounded-lg border border-input bg-background p-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
      </Field>

      <Field label="Font">
        <select
          value={element.fontFamily}
          onChange={(e) => {
            patch({ fontFamily: e.target.value });
            commit();
          }}
          className="w-full rounded-lg border border-input bg-background p-2 text-sm"
        >
          {FONT_FAMILIES.map((f) => (
            <option key={f.id} value={f.value}>
              {f.label}
            </option>
          ))}
        </select>
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Size">
          <input
            type="number"
            value={element.fontSize}
            onChange={(e) => patch({ fontSize: Number(e.target.value) })}
            onBlur={commit}
            className="w-full rounded-lg border border-input bg-background p-2 text-sm"
          />
        </Field>
        <Field label="Letter spacing">
          <input
            type="number"
            value={element.letterSpacing}
            onChange={(e) => patch({ letterSpacing: Number(e.target.value) })}
            onBlur={commit}
            className="w-full rounded-lg border border-input bg-background p-2 text-sm"
          />
        </Field>
      </div>

      <Field label="Style">
        <div className="flex gap-1.5">
          <Button
            variant={element.fontWeight >= 600 ? "primary" : "outline"}
            size="icon-sm"
            onClick={() => {
              patch({ fontWeight: element.fontWeight >= 600 ? 400 : 700 });
              commit();
            }}
          >
            <Bold className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant={element.fontStyle === "italic" ? "primary" : "outline"}
            size="icon-sm"
            onClick={() => {
              patch({ fontStyle: element.fontStyle === "italic" ? "normal" : "italic" });
              commit();
            }}
          >
            <Italic className="h-3.5 w-3.5" />
          </Button>
          <div className="mx-1 w-px bg-border" />
          {(
            [
              { v: "left", icon: AlignLeft },
              { v: "center", icon: AlignCenter },
              { v: "right", icon: AlignRight },
            ] as const
          ).map((a) => (
            <Button
              key={a.v}
              variant={element.align === a.v ? "primary" : "outline"}
              size="icon-sm"
              onClick={() => {
                patch({ align: a.v });
                commit();
              }}
            >
              <a.icon className="h-3.5 w-3.5" />
            </Button>
          ))}
        </div>
      </Field>

      <Field label="Color">
        <div className="flex flex-wrap gap-1.5">
          {TEXT_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => {
                patch({ fill: c });
                commit();
              }}
              className={cn(
                "h-6 w-6 rounded-full border border-border/60",
                element.fill === c && "ring-2 ring-primary ring-offset-1"
              )}
              style={{ backgroundColor: c }}
            />
          ))}
          <input
            type="color"
            value={element.fill}
            onChange={(e) => patch({ fill: e.target.value })}
            onBlur={commit}
            className="h-6 w-6 cursor-pointer rounded-full border border-border/60"
          />
        </div>
      </Field>

      <Field label="Curved text">
        <div className="flex items-center justify-between rounded-lg border border-border p-2.5">
          <span className="flex items-center gap-1.5 text-sm text-ink-soft">
            <Spline className="h-3.5 w-3.5" /> Curve along an arc
          </span>
          <Switch
            checked={element.curved}
            onCheckedChange={(v) => {
              patch({ curved: v });
              commit();
            }}
          />
        </div>
        {element.curved && (
          <Slider
            className="mt-2"
            value={[element.curveRadius]}
            min={60}
            max={400}
            step={5}
            onValueChange={([v]) => patch({ curveRadius: v })}
            onValueCommit={commit}
          />
        )}
      </Field>

      <Field label="Shadow effect">
        <div className="flex items-center justify-between rounded-lg border border-border p-2.5">
          <span className="text-sm text-ink-soft">Drop shadow</span>
          <Switch
            checked={element.shadow}
            onCheckedChange={(v) => {
              patch({ shadow: v });
              commit();
            }}
          />
        </div>
        {element.shadow && (
          <Slider
            className="mt-2"
            value={[element.shadowBlur]}
            min={0}
            max={30}
            step={1}
            onValueChange={([v]) => patch({ shadowBlur: v })}
            onValueCommit={commit}
          />
        )}
      </Field>
    </div>
  );
}

const FILTERS: ImageElement["filter"][] = ["none", "grayscale", "sepia", "warm", "cool", "fade", "polaroid", "noir"];

function ImageProperties({
  element,
  patch,
  commit,
}: {
  element: ImageElement;
  patch: (p: Partial<CanvasElement>) => void;
  commit: () => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Filter">
        <div className="grid grid-cols-4 gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => {
                patch({ filter: f });
                commit();
              }}
              className={cn(
                "rounded-lg border px-1 py-1.5 text-[10px] capitalize",
                element.filter === f ? "border-primary bg-primary/5 text-primary" : "border-border text-ink-soft"
              )}
            >
              {f}
            </button>
          ))}
        </div>
      </Field>
      <Field label="Corner radius">
        <Slider
          value={[element.borderRadius]}
          min={0}
          max={100}
          step={1}
          onValueChange={([v]) => patch({ borderRadius: v })}
          onValueCommit={commit}
        />
      </Field>
      <Field label="Border width">
        <Slider
          value={[element.borderWidth]}
          min={0}
          max={20}
          step={1}
          onValueChange={([v]) => patch({ borderWidth: v })}
          onValueCommit={commit}
        />
      </Field>
      <Field label="Border color">
        <input
          type="color"
          value={element.borderColor}
          onChange={(e) => patch({ borderColor: e.target.value })}
          onBlur={commit}
          className="h-8 w-full cursor-pointer rounded-lg border border-border/60"
        />
      </Field>
    </div>
  );
}

function ShapeProperties({
  element,
  patch,
  commit,
}: {
  element: ShapeElement;
  patch: (p: Partial<CanvasElement>) => void;
  commit: () => void;
}) {
  return (
    <div className="space-y-4">
      <Field label="Fill color">
        <div className="flex flex-wrap gap-1.5">
          {TEXT_COLORS.map((c) => (
            <button
              key={c}
              onClick={() => {
                patch({ fill: c });
                commit();
              }}
              className={cn("h-6 w-6 rounded-full border border-border/60", element.fill === c && "ring-2 ring-primary ring-offset-1")}
              style={{ backgroundColor: c }}
            />
          ))}
          <input
            type="color"
            value={element.fill}
            onChange={(e) => patch({ fill: e.target.value })}
            onBlur={commit}
            className="h-6 w-6 cursor-pointer rounded-full border border-border/60"
          />
        </div>
      </Field>
      <Field label="Stroke width">
        <Slider
          value={[element.strokeWidth]}
          min={0}
          max={20}
          step={1}
          onValueChange={([v]) => patch({ strokeWidth: v })}
          onValueCommit={commit}
        />
      </Field>
      {element.strokeWidth > 0 && (
        <Field label="Stroke color">
          <input
            type="color"
            value={element.stroke === "transparent" ? "#2c2a28" : element.stroke}
            onChange={(e) => patch({ stroke: e.target.value })}
            onBlur={commit}
            className="h-8 w-full cursor-pointer rounded-lg border border-border/60"
          />
        </Field>
      )}
      {element.shape === "rect" && (
        <Field label="Corner radius">
          <Slider
            value={[element.cornerRadius]}
            min={0}
            max={80}
            step={1}
            onValueChange={([v]) => patch({ cornerRadius: v })}
            onValueCommit={commit}
          />
        </Field>
      )}
    </div>
  );
}

function LayersList() {
  const project = useEditorStore((s) => s.project);
  const activePageId = useEditorStore((s) => s.activePageId);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const selectElements = useEditorStore((s) => s.selectElements);
  const updateElement = useEditorStore((s) => s.updateElement);
  const bringForward = useEditorStore((s) => s.bringForward);
  const sendBackward = useEditorStore((s) => s.sendBackward);
  const bringToFront = useEditorStore((s) => s.bringToFront);
  const sendToBack = useEditorStore((s) => s.sendToBack);
  const removeElements = useEditorStore((s) => s.removeElements);

  const page = project?.pages.find((p) => p.id === activePageId);
  const elements = [...(page?.elements ?? [])].sort((a, b) => b.zIndex - a.zIndex);

  if (!elements.length) {
    return <p className="p-4 text-center text-sm text-muted-foreground">No layers yet. Add an element to get started.</p>;
  }

  return (
    <ScrollArea className="h-full p-3">
      <div className="space-y-1">
        {elements.map((el) => (
          <div
            key={el.id}
            onClick={() => selectElements([el.id])}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-lg border px-2.5 py-2 text-sm",
              selectedIds.includes(el.id) ? "border-primary bg-primary/5" : "border-transparent hover:bg-muted"
            )}
          >
            <span className="flex-1 truncate capitalize text-ink-soft">
              {el.type === "text" ? (el as TextElement).text.slice(0, 22) || "Text" : el.type}
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateElement(el.id, { visible: !el.visible });
              }}
              className="text-muted-foreground hover:text-ink"
            >
              {el.visible ? <Eye className="h-3.5 w-3.5" /> : <EyeOff className="h-3.5 w-3.5" />}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                updateElement(el.id, { locked: !el.locked });
              }}
              className="text-muted-foreground hover:text-ink"
            >
              {el.locked ? <Lock className="h-3.5 w-3.5" /> : <Unlock className="h-3.5 w-3.5" />}
            </button>
            <button onClick={(e) => { e.stopPropagation(); bringForward(el.id); }} className="text-muted-foreground hover:text-ink">
              <ChevronUp className="h-3.5 w-3.5" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); sendBackward(el.id); }} className="text-muted-foreground hover:text-ink">
              <ChevronDown className="h-3.5 w-3.5" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); bringToFront(el.id); }} className="text-muted-foreground hover:text-ink">
              <ChevronsUp className="h-3.5 w-3.5" />
            </button>
            <button onClick={(e) => { e.stopPropagation(); sendToBack(el.id); }} className="text-muted-foreground hover:text-ink">
              <ChevronsDown className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeElements([el.id]);
              }}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

function PagesList() {
  const project = useEditorStore((s) => s.project);
  const activePageId = useEditorStore((s) => s.activePageId);
  const setActivePage = useEditorStore((s) => s.setActivePage);
  const addPage = useEditorStore((s) => s.addPage);
  const removePage = useEditorStore((s) => s.removePage);
  const renamePage = useEditorStore((s) => s.renamePage);

  return (
    <ScrollArea className="h-full p-3">
      <div className="space-y-2">
        {project?.pages.map((p, i) => (
          <div
            key={p.id}
            onClick={() => setActivePage(p.id)}
            className={cn(
              "flex cursor-pointer items-center gap-2 rounded-xl border p-2",
              activePageId === p.id ? "border-primary bg-primary/5" : "border-border hover:bg-muted"
            )}
          >
            <div
              className="h-12 w-10 shrink-0 rounded-sm border border-border/50"
              style={{ backgroundColor: p.background }}
            />
            <input
              value={p.name}
              onChange={(e) => renamePage(p.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
              className="flex-1 bg-transparent text-sm text-ink outline-none"
            />
            <span className="text-[10px] text-muted-foreground">#{i + 1}</span>
            {project.pages.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removePage(p.id);
                }}
                className="text-muted-foreground hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        ))}
        <Button variant="outline" size="sm" className="w-full" onClick={addPage}>
          <Plus className="h-3.5 w-3.5" /> Add page
        </Button>
      </div>
    </ScrollArea>
  );
}
