"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { ArrowLeft, Undo2, Redo2, Download, Moon, Sun, Check, Cloud } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ZoomControls } from "./zoom-controls";
import { useEditorStore } from "@/lib/editor-store";
import { useProjectsStore } from "@/lib/projects-store";

export function TopToolbar({ onExport }: { onExport: () => void }) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const project = useEditorStore((s) => s.project);
  const canUndo = useEditorStore((s) => s.canUndo());
  const canRedo = useEditorStore((s) => s.canRedo());
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const isDirty = useEditorStore((s) => s.isDirty);
  const save = useEditorStore((s) => s.save);
  const updateProjectStore = useProjectsStore((s) => s.updateProject);

  React.useEffect(() => setMounted(true), []);

  function handleTitleChange(title: string) {
    if (!project) return;
    useEditorStore.setState({ project: { ...project, title } });
  }

  function handleSave() {
    save();
    const p = useEditorStore.getState().project;
    if (p) updateProjectStore(p);
  }

  if (!project) return null;

  return (
    <div className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-4">
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => { handleSave(); router.push("/dashboard"); }}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <input
          value={project.title}
          onChange={(e) => handleTitleChange(e.target.value)}
          onBlur={handleSave}
          className="w-56 rounded-md bg-transparent px-1.5 py-1 font-display text-base font-semibold text-ink outline-none focus:bg-muted"
        />
        <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
          {isDirty ? (
            <>
              <Cloud className="h-3 w-3" /> Saving…
            </>
          ) : (
            <>
              <Check className="h-3 w-3 text-primary" /> Saved
            </>
          )}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo} aria-label="Undo">
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo} aria-label="Redo">
          <Redo2 className="h-4 w-4" />
        </Button>
        <div className="mx-1 h-6 w-px bg-border" />
        <ZoomControls />
        <div className="mx-1 h-6 w-px bg-border" />
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          {mounted && theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Button variant="primary" onClick={onExport}>
          <Download className="h-4 w-4" /> Export
        </Button>
      </div>
    </div>
  );
}
