"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import Konva from "konva";
import { TopToolbar } from "@/components/editor/top-toolbar";
import { LeftSidebar } from "@/components/editor/left-sidebar";
import { RightPanel } from "@/components/editor/right-panel";
import { ExportDialog } from "@/components/editor/export-dialog";
import { useEditorStore } from "@/lib/editor-store";
import { useAuthStore } from "@/lib/auth-store";
import { storage } from "@/lib/storage";
import { useAutoSave } from "@/hooks/use-auto-save";

const CanvasEditor = dynamic(
  () => import("@/components/editor/canvas-editor").then((m) => m.CanvasEditor),
  { ssr: false }
);

export default function EditorPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const hydratedAuth = useAuthStore((s) => s.hydrated);
  const loadProject = useEditorStore((s) => s.loadProject);
  const project = useEditorStore((s) => s.project);
  const [notFound, setNotFound] = React.useState(false);
  const [exportOpen, setExportOpen] = React.useState(false);
  const stageWrapperRef = React.useRef<HTMLDivElement>(null!);
  const stageRef = React.useRef<Konva.Stage | null>(null);

  useAutoSave();

  React.useEffect(() => {
    hydrateAuth();
  }, [hydrateAuth]);

  React.useEffect(() => {
    if (hydratedAuth && !user) {
      router.replace("/");
    }
  }, [hydratedAuth, user, router]);

  React.useEffect(() => {
    if (!params.id) return;
    const found = storage.getProject(params.id);
    if (found) {
      loadProject(found);
    } else {
      setNotFound(true);
    }
  }, [params.id, loadProject]);

  if (notFound) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background text-center">
        <h1 className="font-display text-2xl font-semibold text-ink">Project not found</h1>
        <p className="text-sm text-ink-soft">It may have been deleted, or the link is incorrect.</p>
        <button
          onClick={() => router.push("/dashboard")}
          className="mt-2 rounded-full bg-ink px-5 py-2 text-sm font-medium text-paper"
        >
          Back to dashboard
        </button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      <TopToolbar onExport={() => setExportOpen(true)} />
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar />
        <div ref={stageWrapperRef} className="relative flex-1 overflow-hidden bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.06)_1px,transparent_0)] bg-[length:22px_22px]">
          <CanvasEditor
            stageWrapperRef={stageWrapperRef}
            onStageReady={(stage) => {
              stageRef.current = stage;
            }}
          />
        </div>
        <RightPanel />
      </div>
      <ExportDialog open={exportOpen} onOpenChange={setExportOpen} getStage={() => stageRef.current} />
    </div>
  );
}
