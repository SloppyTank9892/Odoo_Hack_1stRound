# Fix Photo Uploads, Trip Counter, and Public Stories System Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix uploaded photos not rendering, accurate trip count indicators across navigation, private trip privacy enforcement, owner vs non-owner controls on public stories, trip duplication for other users, and a community multi-story public stories hub.

**Architecture:** Next.js 15 App Router with Supabase Auth & Storage. Configures remote image patterns, auto-bucket creation and fallback storage serialization, creates a `/share` public stories community feed, enforces strict owner vs visitor capability checks on `/share/[id]`, and removes the copy self-action while enabling instant cloning for other users.

**Tech Stack:** Next.js 15, React 19, TypeScript, Supabase (Auth, Postgres, Storage), TailwindCSS, Lucide Icons, Canvas Confetti.

---

### Task 1: Fix Image Configuration & Storage Upload Resiliency

**Files:**
- Modify: `next.config.ts`
- Modify: `app/actions/storage.ts`
- Modify: `app/actions/trips.ts:98-132`

- [ ] **Step 1: Update `next.config.ts` to allow remote images from Supabase and external hosts**
- [ ] **Step 2: Update `app/actions/storage.ts` with auto-bucket creation and resilient base64 fallback**
- [ ] **Step 3: Update `app/actions/trips.ts` to return `coverImageUrl` in `createTrip` response**

---

### Task 2: Fix Trip Count Display and Client State Synchronization

**Files:**
- Modify: `context/TripContext.tsx`
- Modify: `components/navigation/DesktopSidebar.tsx`
- Modify: `app/trips/page.tsx`

- [ ] **Step 1: In `TripContext.tsx`, ensure optimistic `rawTrip` preserves `coverFile` preview and syncs server response**
- [ ] **Step 2: In `TripContext.tsx`, fix `refreshTrips` to handle 0 trips and parallelize detail fetching**
- [ ] **Step 3: In `DesktopSidebar.tsx`, show `trips.length` badge unconditionally on "My Trips"**
- [ ] **Step 4: In `app/trips/page.tsx`, show exact status counts in filter tabs**

---

### Task 3: Implement Multi-Story Public Stories Hub & Public Query Action

**Files:**
- Modify: `app/actions/trips.ts`
- Create: `app/share/page.tsx`
- Modify: `components/navigation/DesktopSidebar.tsx`
- Modify: `components/navigation/MobileBottomNav.tsx`

- [ ] **Step 1: In `app/actions/trips.ts`, create `getPublicTrips()` server action**
- [ ] **Step 2: Create `app/share/page.tsx` (Public Stories Hub) with grid, search, filter, and author badges**
- [ ] **Step 3: Update Sidebar and Mobile Nav to route "Public Stories" to `/share`**

---

### Task 4: Fix Private Story Protection & Owner vs Non-Owner Story Controls

**Files:**
- Modify: `app/share/[id]/page.tsx`
- Modify: `components/share/PublicStoryView.tsx`

- [ ] **Step 1: In `app/share/[id]/page.tsx`, check `trip.isPublic` and compare current user ID with `trip.user_id` / owner**
- [ ] **Step 2: For private trips, show "Private Story" screen to visitors and "Private Preview" banner with 1-click "Publish" toggle to owner**
- [ ] **Step 3: In `PublicStoryView.tsx`, hide "Copy Trip" for owner (show "Edit in Workspace" + "Share"); show "Copy to My Trips" for other users**
- [ ] **Step 4: Verify copying duplicates the trip cleanly for other users**

---

### Task 5: Build Verification and End-to-End Testing

- [ ] **Step 1: Run `npm run build` to verify type safety and compilation**
- [ ] **Step 2: Verify all 6 user requirements end-to-end**
