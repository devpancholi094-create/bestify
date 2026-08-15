"use client";

import * as React from "react";
import { useEditorStore } from "@/lib/editor-store";

export function useAutoSave(intervalMs = 4000) {
  const isDirty = useEditorStore((s) => s.isDirty);
  const save = useEditorStore((s) => s.save);

  React.useEffect(() => {
    if (!isDirty) return;
    const t = setTimeout(() => {
      save();
    }, intervalMs);
    return () => clearTimeout(t);
  }, [isDirty, save, intervalMs]);

  React.useEffect(() => {
    function handleBeforeUnload(e: BeforeUnloadEvent) {
      if (useEditorStore.getState().isDirty) {
        useEditorStore.getState().save();
      }
    }
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);
}
