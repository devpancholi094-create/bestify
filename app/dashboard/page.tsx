"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Plus, Search, FolderHeart } from "lucide-react";
import { DashboardNavbar } from "@/components/dashboard/navbar";
import { ProjectCard } from "@/components/dashboard/project-card";
import { NewProjectDialog } from "@/components/dashboard/new-project-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/lib/auth-store";
import { useProjectsStore } from "@/lib/projects-store";

export default function DashboardPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const hydratedAuth = useAuthStore((s) => s.hydrated);
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const projects = useProjectsStore((s) => s.projects);
  const hydratedProjects = useProjectsStore((s) => s.hydrated);
  const hydrateProjects = useProjectsStore((s) => s.hydrate);

  const [query, setQuery] = React.useState("");
  const [newOpen, setNewOpen] = React.useState(false);

  React.useEffect(() => {
    hydrateAuth();
    hydrateProjects();
  }, [hydrateAuth, hydrateProjects]);

  React.useEffect(() => {
    if (hydratedAuth && !user) {
      router.replace("/");
    }
  }, [hydratedAuth, user, router]);

  const myProjects = React.useMemo(
    () => projects.filter((p) => p.ownerId === user?.id),
    [projects, user?.id]
  );

  const filtered = React.useMemo(() => {
    if (!query.trim()) return myProjects;
    const q = query.toLowerCase();
    return myProjects.filter((p) => p.title.toLowerCase().includes(q) || p.category.toLowerCase().includes(q));
  }, [myProjects, query]);

  if (!hydratedAuth || !hydratedProjects || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardNavbar />

      <main className="container py-10">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-ink">
              {user.isGuest ? "Your scrapbooks" : `Welcome back, ${user.name.split(" ")[0]}`}
            </h1>
            <p className="mt-1 text-sm text-ink-soft">
              {myProjects.length} project{myProjects.length === 1 ? "" : "s"} saved to this device
            </p>
          </div>
          <Button variant="primary" onClick={() => setNewOpen(true)}>
            <Plus className="h-4 w-4" /> New project
          </Button>
        </div>

        <div className="relative mt-8 max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects…"
            className="pl-9"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>

        {filtered.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-16 flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-20 text-center"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
              <FolderHeart className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-xl font-semibold text-ink">
              {query ? "No projects match your search" : "No projects yet"}
            </h3>
            <p className="mt-1 max-w-xs text-sm text-ink-soft">
              {query ? "Try a different search term." : "Start your first scrapbook from a blank canvas or a template."}
            </p>
            {!query && (
              <Button variant="primary" className="mt-6" onClick={() => setNewOpen(true)}>
                <Plus className="h-4 w-4" /> Create your first project
              </Button>
            )}
          </motion.div>
        ) : (
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {filtered.map((project, i) => (
              <ProjectCard key={project.id} project={project} index={i} />
            ))}
          </div>
        )}
      </main>

      <NewProjectDialog open={newOpen} onOpenChange={setNewOpen} />
    </div>
  );
}
