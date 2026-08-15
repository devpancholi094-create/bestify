"use client";

import { create } from "zustand";
import { nanoid } from "nanoid";
import { CanvasElement, CanvasPage, Project } from "./types";
import { storage } from "./storage";

interface HistoryEntry {
  pages: CanvasPage[];
  activePageId: string;
}

interface EditorState {
  project: Project | null;
  activePageId: string | null;
  selectedIds: string[];
  zoom: number;
  history: HistoryEntry[];
  historyIndex: number;
  isDirty: boolean;
  lastSavedAt: number | null;

  loadProject: (project: Project) => void;
  getActivePage: () => CanvasPage | null;

  addElement: (el: CanvasElement) => void;
  updateElement: (id: string, patch: Partial<CanvasElement>) => void;
  updateElements: (patches: { id: string; patch: Partial<CanvasElement> }[]) => void;
  removeElements: (ids: string[]) => void;
  duplicateElements: (ids: string[]) => void;

  selectElements: (ids: string[]) => void;
  clearSelection: () => void;

  bringForward: (id: string) => void;
  sendBackward: (id: string) => void;
  bringToFront: (id: string) => void;
  sendToBack: (id: string) => void;

  addPage: () => void;
  removePage: (id: string) => void;
  setActivePage: (id: string) => void;
  updatePageBackground: (color: string) => void;
  renamePage: (id: string, name: string) => void;

  setZoom: (zoom: number) => void;

  pushHistory: () => void;
  undo: () => void;
  redo: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;

  save: () => void;
  markClean: () => void;
}

const MAX_HISTORY = 60;

function cloneP(pages: CanvasPage[]): CanvasPage[] {
  return JSON.parse(JSON.stringify(pages));
}

export const useEditorStore = create<EditorState>((set, get) => ({
  project: null,
  activePageId: null,
  selectedIds: [],
  zoom: 1,
  history: [],
  historyIndex: -1,
  isDirty: false,
  lastSavedAt: null,

  loadProject: (project) => {
    set({
      project,
      activePageId: project.pages[0]?.id ?? null,
      selectedIds: [],
      zoom: 1,
      history: [{ pages: cloneP(project.pages), activePageId: project.pages[0]?.id ?? "" }],
      historyIndex: 0,
      isDirty: false,
      lastSavedAt: Date.now(),
    });
  },

  getActivePage: () => {
    const { project, activePageId } = get();
    if (!project) return null;
    return project.pages.find((p) => p.id === activePageId) ?? null;
  },

  addElement: (el) => {
    const { project, activePageId } = get();
    if (!project || !activePageId) return;
    const pages = project.pages.map((p) =>
      p.id === activePageId ? { ...p, elements: [...p.elements, el] } : p
    );
    set({ project: { ...project, pages }, selectedIds: [el.id], isDirty: true });
    get().pushHistory();
  },

  updateElement: (id, patch) => {
    const { project, activePageId } = get();
    if (!project || !activePageId) return;
    const pages = project.pages.map((p) =>
      p.id === activePageId
        ? {
            ...p,
            elements: p.elements.map((e) => (e.id === id ? ({ ...e, ...patch } as CanvasElement) : e)),
          }
        : p
    );
    set({ project: { ...project, pages }, isDirty: true });
  },

  updateElements: (patches) => {
    const { project, activePageId } = get();
    if (!project || !activePageId) return;
    const map = new Map(patches.map((p) => [p.id, p.patch]));
    const pages = project.pages.map((p) =>
      p.id === activePageId
        ? {
            ...p,
            elements: p.elements.map((e) =>
              map.has(e.id) ? ({ ...e, ...map.get(e.id) } as CanvasElement) : e
            ),
          }
        : p
    );
    set({ project: { ...project, pages }, isDirty: true });
  },

  removeElements: (ids) => {
    const { project, activePageId } = get();
    if (!project || !activePageId) return;
    const idSet = new Set(ids);
    const pages = project.pages.map((p) =>
      p.id === activePageId ? { ...p, elements: p.elements.filter((e) => !idSet.has(e.id)) } : p
    );
    set({ project: { ...project, pages }, selectedIds: [], isDirty: true });
    get().pushHistory();
  },

  duplicateElements: (ids) => {
    const { project, activePageId } = get();
    if (!project || !activePageId) return;
    const idSet = new Set(ids);
    const newIds: string[] = [];
    const pages = project.pages.map((p) => {
      if (p.id !== activePageId) return p;
      const clones = p.elements
        .filter((e) => idSet.has(e.id))
        .map((e) => {
          const id = nanoid(8);
          newIds.push(id);
          return { ...e, id, x: e.x + 24, y: e.y + 24, zIndex: p.elements.length };
        });
      return { ...p, elements: [...p.elements, ...clones] };
    });
    set({ project: { ...project, pages }, selectedIds: newIds, isDirty: true });
    get().pushHistory();
  },

  selectElements: (ids) => set({ selectedIds: ids }),
  clearSelection: () => set({ selectedIds: [] }),

  bringForward: (id) => {
    const { project, activePageId } = get();
    if (!project || !activePageId) return;
    const pages = project.pages.map((p) => {
      if (p.id !== activePageId) return p;
      const sorted = [...p.elements].sort((a, b) => a.zIndex - b.zIndex);
      const idx = sorted.findIndex((e) => e.id === id);
      if (idx < 0 || idx === sorted.length - 1) return p;
      [sorted[idx].zIndex, sorted[idx + 1].zIndex] = [sorted[idx + 1].zIndex, sorted[idx].zIndex];
      return { ...p, elements: sorted };
    });
    set({ project: { ...project, pages }, isDirty: true });
    get().pushHistory();
  },

  sendBackward: (id) => {
    const { project, activePageId } = get();
    if (!project || !activePageId) return;
    const pages = project.pages.map((p) => {
      if (p.id !== activePageId) return p;
      const sorted = [...p.elements].sort((a, b) => a.zIndex - b.zIndex);
      const idx = sorted.findIndex((e) => e.id === id);
      if (idx <= 0) return p;
      [sorted[idx].zIndex, sorted[idx - 1].zIndex] = [sorted[idx - 1].zIndex, sorted[idx].zIndex];
      return { ...p, elements: sorted };
    });
    set({ project: { ...project, pages }, isDirty: true });
    get().pushHistory();
  },

  bringToFront: (id) => {
    const { project, activePageId } = get();
    if (!project || !activePageId) return;
    const pages = project.pages.map((p) => {
      if (p.id !== activePageId) return p;
      const maxZ = Math.max(0, ...p.elements.map((e) => e.zIndex));
      return {
        ...p,
        elements: p.elements.map((e) => (e.id === id ? { ...e, zIndex: maxZ + 1 } : e)),
      };
    });
    set({ project: { ...project, pages }, isDirty: true });
    get().pushHistory();
  },

  sendToBack: (id) => {
    const { project, activePageId } = get();
    if (!project || !activePageId) return;
    const pages = project.pages.map((p) => {
      if (p.id !== activePageId) return p;
      const minZ = Math.min(0, ...p.elements.map((e) => e.zIndex));
      return {
        ...p,
        elements: p.elements.map((e) => (e.id === id ? { ...e, zIndex: minZ - 1 } : e)),
      };
    });
    set({ project: { ...project, pages }, isDirty: true });
    get().pushHistory();
  },

  addPage: () => {
    const { project } = get();
    if (!project) return;
    const ref = project.pages[0];
    const newPage: CanvasPage = {
      id: nanoid(8),
      name: `Page ${project.pages.length + 1}`,
      width: ref?.width ?? 1080,
      height: ref?.height ?? 1350,
      background: ref?.background ?? "#f6f0e2",
      elements: [],
    };
    set({
      project: { ...project, pages: [...project.pages, newPage] },
      activePageId: newPage.id,
      isDirty: true,
    });
    get().pushHistory();
  },

  removePage: (id) => {
    const { project, activePageId } = get();
    if (!project || project.pages.length <= 1) return;
    const pages = project.pages.filter((p) => p.id !== id);
    set({
      project: { ...project, pages },
      activePageId: activePageId === id ? pages[0].id : activePageId,
      isDirty: true,
    });
    get().pushHistory();
  },

  setActivePage: (id) => set({ activePageId: id, selectedIds: [] }),

  updatePageBackground: (color) => {
    const { project, activePageId } = get();
    if (!project || !activePageId) return;
    const pages = project.pages.map((p) => (p.id === activePageId ? { ...p, background: color } : p));
    set({ project: { ...project, pages }, isDirty: true });
    get().pushHistory();
  },

  renamePage: (id, name) => {
    const { project } = get();
    if (!project) return;
    const pages = project.pages.map((p) => (p.id === id ? { ...p, name } : p));
    set({ project: { ...project, pages }, isDirty: true });
  },

  setZoom: (zoom) => set({ zoom: Math.min(3, Math.max(0.1, zoom)) }),

  pushHistory: () => {
    const { project, activePageId, history, historyIndex } = get();
    if (!project || !activePageId) return;
    const entry: HistoryEntry = { pages: cloneP(project.pages), activePageId };
    const trimmed = history.slice(0, historyIndex + 1);
    trimmed.push(entry);
    while (trimmed.length > MAX_HISTORY) trimmed.shift();
    set({ history: trimmed, historyIndex: trimmed.length - 1 });
  },

  undo: () => {
    const { history, historyIndex, project } = get();
    if (!project || historyIndex <= 0) return;
    const newIndex = historyIndex - 1;
    const entry = history[newIndex];
    set({
      project: { ...project, pages: cloneP(entry.pages) },
      activePageId: entry.activePageId,
      historyIndex: newIndex,
      selectedIds: [],
      isDirty: true,
    });
  },

  redo: () => {
    const { history, historyIndex, project } = get();
    if (!project || historyIndex >= history.length - 1) return;
    const newIndex = historyIndex + 1;
    const entry = history[newIndex];
    set({
      project: { ...project, pages: cloneP(entry.pages) },
      activePageId: entry.activePageId,
      historyIndex: newIndex,
      selectedIds: [],
      isDirty: true,
    });
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  save: () => {
    const { project } = get();
    if (!project) return;
    const updated = { ...project, updatedAt: Date.now() };
    storage.upsertProject(updated);
    set({ project: updated, isDirty: false, lastSavedAt: Date.now() });
  },

  markClean: () => set({ isDirty: false }),
}));
