# CLAUDE.md

We're building the app describred in @SPEC.MD. Read that file for general architectural tasks or to bouble-check the exact database structure, tech stack or application architecture.

Keep your replies extremely concise and focus on conveying the key information. No unncessary fluff, no long code snippets.

Whenever working with any third-party library or something similar, you MUST look up the official documentation to wnsure that you are working with up-to-date information. User DocsExplorer subagent for efficient documentation lookup.

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
bun run dev      # Start development server (http://localhost:3000)
bun run build    # Production build
bun run lint     # Run ESLint
```

This project uses **Bun** as the runtime and package manager. Use `bun` instead of `npm`/`node` for all commands.

## What This Is

A note-taking web app (see `SPEC.MD` for full spec). Users authenticate, create/edit/delete rich-text notes via TipTap, and can share notes publicly via a unique slug (`/p/[slug]`).

**Stack:** Next.js 16 (App Router) · React 19 · TypeScript · TailwindCSS 4 · SQLite (Bun native) · better-auth · TipTap 3 · Zod

## Architecture

### Directory Layout (to be built)

```
app/
  layout.tsx               # Root layout (Geist fonts, global CSS)
  page.tsx                 # Landing page
  (auth)/login/            # Login page
  (auth)/register/         # Register page
  dashboard/               # Authenticated notes list
  notes/[id]/              # Note editor page
  p/[slug]/                # Public read-only note page
  api/notes/               # REST endpoints for notes CRUD
  api/notes/[id]/share/    # Toggle public sharing
  api/auth/[...all]/       # better-auth catch-all handler
lib/
  db.ts                    # Bun SQLite singleton + query helpers
  notes.ts                 # Note repository functions (all SQL here)
  auth.ts                  # better-auth server config
components/
  NoteEditor.tsx           # TipTap client component (editable)
  NoteList.tsx             # Notes list with links
  ShareToggle.tsx          # isPublic switch + public URL display
  DeleteNoteButton.tsx     # Confirm + DELETE API call
  PublicNoteViewer.tsx     # TipTap EditorContent with editable:false
data/
  app.db                   # SQLite database file (gitignored)
```

### Key Architectural Points

**Database:** Raw SQL via `bun:sqlite`. `lib/db.ts` exports a singleton connection and typed wrappers (`query<T>`, `get<T>`, `run`). All note queries in `lib/notes.ts` filter by `user_id` to enforce per-user isolation.

**Auth:** better-auth handles sessions. Server components and API routes call a `getCurrentUser()` / `getSession()` helper from `lib/auth.ts`. Middleware protects `/dashboard` and `/notes/[id]`.

**TipTap content:** Stored as `JSON.stringify(editor.getJSON())` in the `content_json` column. When loading, `JSON.parse` and pass as TipTap's `content` prop. Never store or render as raw HTML.

**Public sharing:** When `isPublic` is toggled on, a `nanoid()` slug (16+ chars) is generated and stored in `public_slug`. `/p/[slug]` is a server component that reads directly from DB — no API hop needed. When toggled off, `public_slug` is set to NULL.

**API routes** live under `app/api/notes/` following REST conventions. All note API routes return 401 without a valid session.

### Data Model (SQLite)

`notes` table: `id, user_id, title, content_json, is_public, public_slug, created_at, updated_at`

better-auth manages its own tables: `user`, `session`, `account`, `verification`.

Indexes on `notes(user_id)`, `notes(public_slug)`, `notes(is_public)`.
