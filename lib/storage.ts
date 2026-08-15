import { Project, User } from "./types";

const KEYS = {
  projects: "bestify:projects",
  user: "bestify:user",
  drafts: "bestify:draft:",
} as const;

function safeParse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export const storage = {
  getProjects(): Project[] {
    if (typeof window === "undefined") return [];
    return safeParse<Project[]>(localStorage.getItem(KEYS.projects), []);
  },

  saveProjects(projects: Project[]) {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEYS.projects, JSON.stringify(projects));
  },

  upsertProject(project: Project) {
    const projects = storage.getProjects();
    const idx = projects.findIndex((p) => p.id === project.id);
    if (idx >= 0) {
      projects[idx] = project;
    } else {
      projects.unshift(project);
    }
    storage.saveProjects(projects);
  },

  deleteProject(id: string) {
    const projects = storage.getProjects().filter((p) => p.id !== id);
    storage.saveProjects(projects);
    if (typeof window !== "undefined") {
      localStorage.removeItem(KEYS.drafts + id);
    }
  },

  getProject(id: string): Project | undefined {
    return storage.getProjects().find((p) => p.id === id);
  },

  saveDraft(id: string, project: Project) {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEYS.drafts + id, JSON.stringify(project));
  },

  getDraft(id: string): Project | undefined {
    if (typeof window === "undefined") return undefined;
    return safeParse<Project | undefined>(
      localStorage.getItem(KEYS.drafts + id),
      undefined
    );
  },

  getUser(): User | null {
    if (typeof window === "undefined") return null;
    return safeParse<User | null>(localStorage.getItem(KEYS.user), null);
  },

  saveUser(user: User) {
    if (typeof window === "undefined") return;
    localStorage.setItem(KEYS.user, JSON.stringify(user));
  },

  clearUser() {
    if (typeof window === "undefined") return;
    localStorage.removeItem(KEYS.user);
  },
};
