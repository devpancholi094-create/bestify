"use client";

import { Minus, Plus, Maximize } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/editor-store";

export function ZoomControls() {
  const zoom = useEditorStore((s) => s.zoom);
  const setZoom = useEditorStore((s) => s.setZoom);

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-card px-1.5 py-1 shadow-sm">
      <Button variant="ghost" size="icon-sm" onClick={() => setZoom(zoom - 0.1)} aria-label="Zoom out">
        <Minus className="h-3.5 w-3.5" />
      </Button>
      <button
        onClick={() => setZoom(1)}
        className="w-12 rounded-md px-1 py-0.5 text-center text-xs font-medium text-ink-soft hover:bg-muted"
      >
        {Math.round(zoom * 100)}%
      </button>
      <Button variant="ghost" size="icon-sm" onClick={() => setZoom(zoom + 0.1)} aria-label="Zoom in">
        <Plus className="h-3.5 w-3.5" />
      </Button>
      <Button variant="ghost" size="icon-sm" onClick={() => setZoom(1)} aria-label="Fit to screen">
        <Maximize className="h-3.5 w-3.5" />
      </Button>
    </div>
  );
}
