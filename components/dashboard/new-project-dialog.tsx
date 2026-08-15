"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TEMPLATES, TEMPLATE_CATEGORIES } from "@/lib/templates-data";
import { useProjectsStore } from "@/lib/projects-store";
import { useAuthStore } from "@/lib/auth-store";
import { Template } from "@/lib/types";
import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { MiniCanvasPreview } from "@/components/shared/mini-canvas-preview";

interface NewProjectDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewProjectDialog({ open, onOpenChange }: NewProjectDialogProps) {
  const router = useRouter();
  const createProject = useProjectsStore((s) => s.createProject);
  const user = useAuthStore((s) => s.user);
  const [title, setTitle] = React.useState("");
  const [selected, setSelected] = React.useState<Template | null>(null);

  function handleCreate(template?: Template) {
    if (!user) return;
    const project = createProject(
      title || template?.name || "Untitled Project",
      template?.category ?? "Blank",
      user.id,
      template
    );
    onOpenChange(false);
    setTitle("");
    setSelected(null);
    router.push(`/editor/${project.id}`);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>Create a new project</DialogTitle>
          <DialogDescription>Start from a blank canvas or pick a template to remix.</DialogDescription>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="project-title">Project name</Label>
          <Input
            id="project-title"
            placeholder="Vietnam Trip 2026"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <button
          onClick={() => handleCreate()}
          className="flex items-center gap-3 rounded-xl border border-dashed border-border p-3.5 text-left transition-colors hover:border-primary hover:bg-primary/5"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-ink-soft">
            <LayoutGrid className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-ink">Blank canvas</p>
            <p className="text-xs text-muted-foreground">Start from scratch, 1080 × 1350</p>
          </div>
        </button>

        <Tabs defaultValue="all">
          <TabsList className="flex-wrap">
            <TabsTrigger value="all">All templates</TabsTrigger>
            {TEMPLATE_CATEGORIES.map((c) => (
              <TabsTrigger key={c} value={c}>
                {c}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all">
            <TemplateGrid templates={TEMPLATES} selected={selected} onSelect={setSelected} onCreate={handleCreate} />
          </TabsContent>
          {TEMPLATE_CATEGORIES.map((c) => (
            <TabsContent key={c} value={c}>
              <TemplateGrid
                templates={TEMPLATES.filter((t) => t.category === c)}
                selected={selected}
                onSelect={setSelected}
                onCreate={handleCreate}
              />
            </TabsContent>
          ))}
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

function TemplateGrid({
  templates,
  selected,
  onSelect,
  onCreate,
}: {
  templates: Template[];
  selected: Template | null;
  onSelect: (t: Template) => void;
  onCreate: (t: Template) => void;
}) {
  return (
    <div className="grid max-h-[45vh] grid-cols-2 gap-3 overflow-y-auto pr-1 pt-3 sm:grid-cols-4">
      {templates.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelect(t)}
          onDoubleClick={() => onCreate(t)}
          className={cn(
            "group text-left rounded-xl border p-1.5 transition-all",
            selected?.id === t.id ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/40"
          )}
        >
          <div
            className="relative aspect-[4/5] w-full overflow-hidden rounded-lg"
            style={{ backgroundColor: t.thumbnail.background }}
          >
            <MiniCanvasPreview page={t.pages[0]} className="h-full w-full" />
            <span
              className="pointer-events-none absolute bottom-1.5 left-1.5 rounded-full px-2 py-0.5 text-[9px] font-medium text-white shadow"
              style={{ backgroundColor: t.thumbnail.accent }}
            >
              {t.category}
            </span>
          </div>
          <p className="mt-1.5 truncate px-0.5 text-xs font-medium text-ink">{t.name}</p>
          {selected?.id === t.id && (
            <Button size="sm" variant="primary" className="mt-1.5 w-full" onClick={() => onCreate(t)}>
              Use template
            </Button>
          )}
        </button>
      ))}
    </div>
  );
}
