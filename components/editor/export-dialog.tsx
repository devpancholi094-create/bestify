"use client";

import * as React from "react";
import Konva from "konva";
import { jsPDF } from "jspdf";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useEditorStore } from "@/lib/editor-store";
import { Download, FileImage, FileText, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface ExportDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  getStage: () => Konva.Stage | null;
}

type Format = "png" | "jpg" | "pdf";

const RESOLUTIONS = [
  { label: "Standard", multiplier: 1, hint: "Fast, screen quality" },
  { label: "High (2x)", multiplier: 2, hint: "Great for print & sharing" },
  { label: "Ultra (3x)", multiplier: 3, hint: "Maximum detail" },
];

export function ExportDialog({ open, onOpenChange, getStage }: ExportDialogProps) {
  const project = useEditorStore((s) => s.project);
  const activePageId = useEditorStore((s) => s.activePageId);
  const selectedIds = useEditorStore((s) => s.selectedIds);
  const clearSelection = useEditorStore((s) => s.clearSelection);
  const selectElements = useEditorStore((s) => s.selectElements);
  const [format, setFormat] = React.useState<Format>("png");
  const [resolution, setResolution] = React.useState(1);
  const [exportAllPages, setExportAllPages] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  async function renderPageDataUrl(pageId: string, multiplier: number, mime: "png" | "jpg") {
    const stage = getStage();
    const page = project?.pages.find((p) => p.id === pageId);
    if (!stage || !page || !project) return null;

    // Switch active page onto the live stage momentarily if needed.
    const wasActive = activePageId === pageId;
    if (!wasActive) {
      useEditorStore.getState().setActivePage(pageId);
      await new Promise((r) => setTimeout(r, 60));
    }

    const previousSelection = [...selectedIds];
    clearSelection();
    await new Promise((r) => requestAnimationFrame(() => r(null)));

    const layer = stage.getLayers()[0];
    const dataUrl = layer.toDataURL({
      x: 0,
      y: 0,
      width: page.width,
      height: page.height,
      pixelRatio: multiplier,
      mimeType: mime === "jpg" ? "image/jpeg" : "image/png",
      quality: mime === "jpg" ? 0.92 : 1,
    });

    if (!wasActive) {
      useEditorStore.getState().setActivePage(activePageId ?? pageId);
    }
    selectElements(previousSelection);

    return dataUrl;
  }

  function download(dataUrl: string, filename: string) {
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  async function handleExport() {
    if (!project) return;
    setBusy(true);
    try {
      const pagesToExport = exportAllPages
        ? project.pages
        : project.pages.filter((p) => p.id === activePageId);

      if (format === "pdf") {
        const first = pagesToExport[0];
        const pdf = new jsPDF({
          orientation: first.width > first.height ? "landscape" : "portrait",
          unit: "px",
          format: [first.width, first.height],
        });

        for (let i = 0; i < pagesToExport.length; i++) {
          const p = pagesToExport[i];
          const dataUrl = await renderPageDataUrl(p.id, resolution, "jpg");
          if (!dataUrl) continue;
          if (i > 0) pdf.addPage([p.width, p.height]);
          pdf.addImage(dataUrl, "JPEG", 0, 0, p.width, p.height);
        }
        pdf.save(`${project.title.replace(/\s+/g, "-").toLowerCase()}.pdf`);
      } else {
        for (const p of pagesToExport) {
          const dataUrl = await renderPageDataUrl(p.id, resolution, format);
          if (!dataUrl) continue;
          download(
            dataUrl,
            `${project.title.replace(/\s+/g, "-").toLowerCase()}-${p.name.replace(/\s+/g, "-").toLowerCase()}.${format}`
          );
        }
      }
      toast.success("Export complete — check your downloads");
      onOpenChange(false);
    } catch (err) {
      console.error(err);
      toast.error("Export failed. Try a lower resolution.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Export project</DialogTitle>
          <DialogDescription>Download your scrapbook as an image or PDF.</DialogDescription>
        </DialogHeader>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Format</p>
          <div className="grid grid-cols-3 gap-2">
            {(
              [
                { id: "png", label: "PNG", icon: FileImage },
                { id: "jpg", label: "JPG", icon: FileImage },
                { id: "pdf", label: "PDF", icon: FileText },
              ] as const
            ).map((f) => (
              <button
                key={f.id}
                onClick={() => setFormat(f.id)}
                className={cn(
                  "flex flex-col items-center gap-1.5 rounded-xl border p-3 text-xs font-medium transition-colors",
                  format === f.id ? "border-primary bg-primary/5 text-primary" : "border-border text-ink-soft hover:border-primary/40"
                )}
              >
                <f.icon className="h-5 w-5" />
                {f.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 text-xs font-medium text-muted-foreground">Resolution</p>
          <div className="space-y-1.5">
            {RESOLUTIONS.map((r) => (
              <button
                key={r.multiplier}
                onClick={() => setResolution(r.multiplier)}
                className={cn(
                  "flex w-full items-center justify-between rounded-xl border px-3.5 py-2.5 text-left transition-colors",
                  resolution === r.multiplier ? "border-primary bg-primary/5" : "border-border hover:border-primary/40"
                )}
              >
                <span className="text-sm font-medium text-ink">{r.label}</span>
                <span className="text-xs text-muted-foreground">{r.hint}</span>
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-ink-soft">
          <input
            type="checkbox"
            checked={exportAllPages}
            onChange={(e) => setExportAllPages(e.target.checked)}
            className="h-4 w-4 rounded border-border accent-[hsl(var(--primary))]"
          />
          Export all pages {project && `(${project.pages.length})`}
        </label>

        <Button variant="primary" size="lg" onClick={handleExport} disabled={busy} className="w-full">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          {busy ? "Exporting…" : `Export as ${format.toUpperCase()}`}
        </Button>
      </DialogContent>
    </Dialog>
  );
}
