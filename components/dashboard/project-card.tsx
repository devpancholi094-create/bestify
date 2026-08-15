"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { MoreHorizontal, Pencil, Copy, Trash2, Clock } from "lucide-react";
import { Project } from "@/lib/types";
import { timeAgo } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useProjectsStore } from "@/lib/projects-store";
import { toast } from "sonner";

export function ProjectCard({ project, index }: { project: Project; index: number }) {
  const router = useRouter();
  const deleteProject = useProjectsStore((s) => s.deleteProject);
  const duplicateProject = useProjectsStore((s) => s.duplicateProject);
  const [renaming, setRenaming] = React.useState(false);
  const [confirmDelete, setConfirmDelete] = React.useState(false);
  const renameProject = useProjectsStore((s) => s.renameProject);
  const [title, setTitle] = React.useState(project.title);

  const page = project.pages[0];
  const elementCount = project.pages.reduce((sum, p) => sum + p.elements.length, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: Math.min(index * 0.04, 0.4) }}
      className="group relative overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-shadow hover:shadow-paper"
    >
      <button
        onClick={() => router.push(`/editor/${project.id}`)}
        className="block w-full text-left"
        aria-label={`Open ${project.title}`}
      >
        <div
          className="relative aspect-[4/5] w-full overflow-hidden"
          style={{ background: page?.background ?? "#f6f0e2" }}
        >
          {page?.elements.slice(0, 6).map((el) => (
            <div
              key={el.id}
              className="absolute rounded-sm bg-white/70"
              style={{
                left: `${(el.x / page.width) * 100}%`,
                top: `${(el.y / page.height) * 100}%`,
                width: `${(el.width / page.width) * 100}%`,
                height: `${(el.height / page.height) * 100}%`,
                transform: `rotate(${el.rotation}deg)`,
                opacity: 0.85,
              }}
            />
          ))}
          {elementCount === 0 && (
            <div className="flex h-full w-full items-center justify-center text-xs text-ink-soft/50">
              Empty canvas
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
        </div>
      </button>

      <div className="flex items-start justify-between gap-2 p-3.5">
        <div className="min-w-0">
          {renaming ? (
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              onBlur={() => {
                setRenaming(false);
                if (title.trim()) renameProject(project.id, title.trim());
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") e.currentTarget.blur();
              }}
              className="w-full rounded-md border border-border bg-background px-1.5 py-0.5 text-sm font-medium"
            />
          ) : (
            <p className="truncate text-sm font-medium text-ink">{project.title}</p>
          )}
          <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="h-3 w-3" /> Edited {timeAgo(project.updatedAt)}
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm" className="shrink-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => router.push(`/editor/${project.id}`)}>
              <Pencil className="h-4 w-4" /> Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setRenaming(true)}>
              <Pencil className="h-4 w-4" /> Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                const copy = duplicateProject(project.id);
                if (copy) toast.success("Project duplicated");
              }}
            >
              <Copy className="h-4 w-4" /> Duplicate
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            {confirmDelete ? (
              <DropdownMenuItem
                className="text-destructive"
                onClick={() => {
                  deleteProject(project.id);
                  toast.success("Project deleted");
                }}
              >
                <Trash2 className="h-4 w-4" /> Confirm delete
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="text-destructive"
                onSelect={(e) => {
                  e.preventDefault();
                  setConfirmDelete(true);
                }}
              >
                <Trash2 className="h-4 w-4" /> Delete
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}
