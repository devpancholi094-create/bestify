"use client";

import { create } from "zustand";
import { nanoid } from "nanoid";
import { Project, Template } from "./types";
import { storage } from "./storage";

interface ProjectsState {
  projects: Project[];
  hydrated: boolean;
  hydrate: () => void;
  createProject: (title: string, category: string, ownerId: string, template?: Template) => Project;
  updateProject: (project: Project) => void;
  deleteProject: (id: string) => void;
  duplicateProject: (id: string) => Project | undefined;
  renameProject: (id: string, title: string) => void;
}

export const useProjectsStore = create<ProjectsState>((set, get) => ({
  projects: [],
  hydrated: false,

  hydrate: () => {
    set({ projects: storage.getProjects(), hydrated: true });
  },

  createProject: (title, category, ownerId, template) => {
    const now = Date.now();
    const project: Project = {
      id: nanoid(10),
      title: title || "Untitled Project",
      category,
      pages: template
        ? template.pages.map((p) => ({ ...p, id: nanoid(8) }))
        : [
            {
              id: nanoid(8),
              name: "Page 1",
              width: 1080,
              height: 1350,
              background: "#f6f0e2",
              elements: [],
            },
          ],
      createdAt: now,
      updatedAt: now,
      ownerId,
    };
    storage.upsertProject(project);
    set({ projects: [project, ...get().projects] });
    return project;
  },

  updateProject: (project) => {
    const updated = { ...project, updatedAt: Date.now() };
    storage.upsertProject(updated);
    set({
      projects: get().projects.map((p) => (p.id === updated.id ? updated : p)),
    });
  },

  deleteProject: (id) => {
    storage.deleteProject(id);
    set({ projects: get().projects.filter((p) => p.id !== id) });
  },

  duplicateProject: (id) => {
    const original = get().projects.find((p) => p.id === id);
    if (!original) return undefined;
    const now = Date.now();
    const copy: Project = {
      ...original,
      id: nanoid(10),
      title: `${original.title} (copy)`,
      createdAt: now,
      updatedAt: now,
    };
    storage.upsertProject(copy);
    set({ projects: [copy, ...get().projects] });
    return copy;
  },

  renameProject: (id, title) => {
    const project = get().projects.find((p) => p.id === id);
    if (!project) return;
    const updated = { ...project, title, updatedAt: Date.now() };
    storage.upsertProject(updated);
    set({
      projects: get().projects.map((p) => (p.id === id ? updated : p)),
    });
  },
}));
