# Bestify

A Canva-inspired scrapbook and memory board creator. Build aesthetic digital
journals, travel scrapbooks, photo collages, mood boards and memory albums
with a drag-and-drop canvas editor — right in the browser.

## Tech stack

- **Next.js 15** (App Router) + **TypeScript**
- **Tailwind CSS** + custom design tokens (warm "paper" palette, dark mode)
- **shadcn/ui**-style components (Radix primitives + CVA)
- **Framer Motion** for animation
- **Konva.js / react-konva** for the infinite canvas editor (drag, resize,
  rotate, layers, undo/redo)
- **jsPDF** for PDF export (image data comes straight from Konva's own
  `toDataURL`, which renders the canvas more faithfully than screenshotting
  the DOM with html2canvas)
- **Zustand** for state (auth, projects, editor/undo-redo)
- **localStorage** for persistence — no backend required

## Getting started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project structure

```
app/
  page.tsx                landing page
  dashboard/page.tsx       project dashboard (create/search/edit/delete)
  editor/[id]/page.tsx     canvas editor route
  layout.tsx               fonts, theme provider, toaster
  globals.css              design tokens + base styles

components/
  ui/                      shadcn-style primitives (button, dialog, tabs, …)
  auth/                    email + guest auth dialog
  dashboard/                navbar, project cards, new-project/template dialog
  editor/
    canvas-editor.tsx       Konva Stage/Layer/Transformer, selection, keyboard shortcuts
    element-renderer.tsx    renders each element type (text/image/sticker/shape/frame/washi/line/doodle)
    left-sidebar.tsx        asset library (text, shapes, stickers, uploads, frames, washi, lines, backgrounds)
    right-panel.tsx         properties panel, layers list, pages list
    top-toolbar.tsx         undo/redo, zoom, save state, export
    export-dialog.tsx       PNG/JPG/PDF export at 1x/2x/3x resolution
    zoom-controls.tsx

lib/
  types.ts                 CanvasElement / Project / Template types
  storage.ts                localStorage read/write helpers
  auth-store.ts              Zustand auth store
  projects-store.ts          Zustand dashboard projects store
  editor-store.ts            Zustand canvas store (elements, layers, history, zoom)
  assets-data.ts              generated sticker/background/frame/washi/doodle library
  templates-data.ts           the 12 starter templates
  utils.ts                    cn() + date helpers

hooks/
  use-auto-save.ts           debounced autosave + save-on-unload
```

## Notes on the asset library

Stickers, decorative doodles, washi tape and frame styles are generated
programmatically from emoji + hand-authored SVG path data (see
`lib/assets-data.ts`) rather than shipped as hundreds of binary image files.
This keeps the repo tiny, avoids any image-hosting/CDN setup, and means the
app works immediately after `npm install` — no asset pipeline required.
Counts: 200 stickers, 100 background variants, 50 frame variants, 21 washi
tapes, 100 doodle/line variants.

## Data & accounts

Bestify stores everything in the browser's `localStorage`:

- `bestify:user` — the signed-in (or guest) user
- `bestify:projects` — all saved projects
- `bestify:draft:<id>` — per-project autosave draft slot

There's no backend, database, or API route, so there's nothing to configure
before deploying. Because storage is per-browser, guest and email accounts
alike only persist on the device where you created them.

## Deploying to Vercel

This is a stock Next.js 15 App Router project with zero required
environment variables, so it deploys with the default settings:

1. Push this repository to GitHub (or your Git host of choice).
2. Go to [vercel.com/new](https://vercel.com/new) and import the repo.
3. Leave the framework preset as **Next.js** and click **Deploy**.

Or from the CLI:

```bash
npm i -g vercel
vercel
```

No environment variables, database, or additional configuration needed.

## Keyboard shortcuts (in the editor)

| Shortcut                | Action              |
| ------------------------ | ------------------- |
| `Cmd/Ctrl + Z`            | Undo                 |
| `Cmd/Ctrl + Shift + Z` / `Cmd/Ctrl + Y` | Redo |
| `Cmd/Ctrl + D`            | Duplicate selection  |
| `Delete` / `Backspace`    | Delete selection     |
| Arrow keys                | Nudge selection (hold Shift for 10px) |
| `Escape`                  | Clear selection      |
| Shift + click             | Add/remove from selection |

## Known limitations / good next steps

- Auth is intentionally lightweight (no password, no server) — swap
  `lib/auth-store.ts` and `lib/storage.ts` for real API calls + a database
  (e.g. Postgres via Prisma, or Supabase) if you need multi-device accounts.
- Image filters run through Konva's canvas filters, which cover the common
  editorial looks (grayscale, sepia, warm/cool, faded, noir) but are not a
  full non-destructive editing pipeline.
- There's no server-side image storage — uploaded photos are embedded as
  base64 data URLs inside the project JSON in `localStorage`. This is simple
  and fully client-side, but large images will use up local storage quota
  faster; swapping in object storage (S3/R2/Supabase Storage) is the natural
  upgrade if you outgrow it.
