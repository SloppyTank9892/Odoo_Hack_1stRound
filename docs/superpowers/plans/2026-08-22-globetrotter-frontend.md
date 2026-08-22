# GlobeTrotter — Warm Modern Explorer Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete, responsive, hackathon-grade frontend prototype for GlobeTrotter featuring the Warm Modern Explorer design system, reactive Trip Workspace, dynamic stop-duration calculation engine (The WOW Moment), timeline, calendar, route map, budget breakdown, exploration hub, and editorial public travel story.

**Architecture:** Next.js 16 App Router with a centralized `TripContext` providing reactive state and live recalculations (durations, shifted dates, day-by-day activities, category budgets, alerts), coupled with modular UI components, responsive desktop sidebar & mobile bottom navigation shell.

**Tech Stack:** Next.js 16, React 19, TypeScript, Tailwind CSS v4, Lucide React, Canvas Confetti.

## Global Constraints
- Theme background: Warm Ivory (`#F7F6F2`)
- Primary text: Near Black (`#181818`)
- Signature accent: Sunset Amber (`#F4A62A`)
- Secondary accent: Muted Purple (`#76546F`)
- Frontend-only: All state in typed frontend models and local state. No backend API or database dependencies.
- Responsive breakpoints: Mobile (320px-767px), Tablet (768px-1023px), Desktop (1024px+).

---

### Task 1: Dependencies & Warm Modern Explorer Design System Tokens
**Files:**
- Modify: `package.json`
- Modify: `app/globals.css`
- Modify: `app/layout.tsx`

- [ ] **Step 1: Install required dependencies**
  - Install `lucide-react`, `clsx`, `tailwind-merge`, `canvas-confetti`, `@types/canvas-confetti`.
- [ ] **Step 2: Configure Warm Modern Explorer CSS tokens & typography**
  - Define custom CSS variables for `--background: #F7F6F2`, `--surface: #FFFFFF`, `--border-warm: #E7E2D8`, `--amber-primary: #F4A62A`, `--purple-muted: #76546F`, plus typography and smooth scrollbars.
- [ ] **Step 3: Update root layout with Plus Jakarta Sans & serif accents**
- [ ] **Step 4: Verify build/compilation**
- [ ] **Step 5: Commit**

---

### Task 2: Core Domain Types & Realistic Mock Data Engine
**Files:**
- Create: `types/trip.ts`
- Create: `data/mockTrips.ts`
- Create: `data/mockDestinations.ts`
- Create: `data/mockActivities.ts`

- [ ] **Step 1: Define comprehensive TypeScript interfaces**
  - `Trip`, `DestinationStop`, `Activity`, `DayPlan`, `BudgetCategory`, `CityDiscovery`, `ActivityDiscovery`, `TravelerProfile`.
- [ ] **Step 2: Create primary demo trip "Rajasthan Explorer"**
  - Delhi (2 days) → Agra (1 day) → Jaipur (2 days, editable to 3) → Udaipur (3 days), complete with 18+ realistic activities, timings, costs, coordinates, cover photos.
- [ ] **Step 3: Create secondary demo trips ("Japan Adventure", "Amalfi Coast Explorer")**
- [ ] **Step 4: Create discovery cities and activities repository**
- [ ] **Step 5: Commit**

---

### Task 3: Global Reactive State & Dynamic Recalculation Engine
**Files:**
- Create: `context/TripContext.tsx`
- Create: `lib/tripCalculations.ts`

- [ ] **Step 1: Implement trip calculation utilities**
  - Stop duration shift math, date propagation across cities, daily budget aggregation, category breakdown percentages, over-budget threshold detection.
- [ ] **Step 2: Implement `TripContext` provider and hooks**
  - Actions: `updateStopDuration(tripId, stopIndex, newDays)` [The WOW engine], `addStop`, `removeStop`, `reorderStops`, `addActivity`, `removeActivity`, `moveActivity`, `copyTrip`, `updateBudget`, `togglePublic`.
- [ ] **Step 3: Verify dynamic recalculation with test scenarios**
- [ ] **Step 4: Commit**

---

### Task 4: Design System Reusable UI Components
**Files:**
- Create: `lib/utils.ts`
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Badge.tsx`
- Create: `components/ui/Card.tsx`
- Create: `components/ui/Modal.tsx`
- Create: `components/ui/Drawer.tsx`
- Create: `components/ui/Tabs.tsx`
- Create: `components/ui/ProgressBar.tsx`
- Create: `components/ui/Toast.tsx`

- [ ] **Step 1: Implement button with Amber primary, subtle outline, ghost variants and loading states**
- [ ] **Step 2: Implement warm elevated card, badge, and progress bar with smooth transitions**
- [ ] **Step 3: Implement accessible Modal and Drawer (desktop side panel & mobile bottom sheet)**
- [ ] **Step 4: Implement Toast notification system**
- [ ] **Step 5: Commit**

---

### Task 5: Responsive Application Shell & Navigation
**Files:**
- Create: `components/navigation/DesktopSidebar.tsx`
- Create: `components/navigation/MobileBottomNav.tsx`
- Create: `components/navigation/TopBar.tsx`
- Create: `components/layout/AppShell.tsx`

- [ ] **Step 1: Build Desktop Sidebar with brand mark, navigation links (`Dashboard`, `My Trips`, `Explore`, `Saved`, `Settings`), active states, and user mini-profile**
- [ ] **Step 2: Build Mobile Bottom Nav with thumb-friendly icons and badges**
- [ ] **Step 3: Build TopBar with universal search modal trigger, quick "+ Plan Trip" action, currency switcher, and notification drawer**
- [ ] **Step 4: Integrate responsive shell**
- [ ] **Step 5: Commit**

---

### Task 6: Dashboard / Travel Command Center
**Files:**
- Create: `app/page.tsx`
- Create: `components/dashboard/HeroBanner.tsx`
- Create: `components/dashboard/ActiveTripCard.tsx`
- Create: `components/dashboard/UpcomingTripsGrid.tsx`
- Create: `components/dashboard/CuratedDestinations.tsx`
- Create: `components/dashboard/BudgetHighlightWidget.tsx`

- [ ] **Step 1: Build inspirational greeting & quick plan action**
- [ ] **Step 2: Build active trip spotlight with live route graphic, progress meter, and 1-click workspace jump**
- [ ] **Step 3: Build upcoming & past trips carousel/grid**
- [ ] **Step 4: Build curated destination discovery cards with cost index and tags**
- [ ] **Step 5: Verify responsive layout on mobile & desktop**
- [ ] **Step 6: Commit**

---

### Task 7: My Trips Hub & Create Trip Workflow
**Files:**
- Create: `app/trips/page.tsx`
- Create: `components/trip/TripGridCard.tsx`
- Create: `components/trip/CreateTripModal.tsx`

- [ ] **Step 1: Build My Trips view with filter tabs (All, Planning, Active, Completed)**
- [ ] **Step 2: Build rich trip cards with route badges, budget chips, and action menus (Edit, Duplicate, Share, Delete)**
- [ ] **Step 3: Build lightweight 3-step Create Trip modal with destination suggestions**
- [ ] **Step 4: Verify navigation from creation directly into Trip Workspace**
- [ ] **Step 5: Commit**

---

### Task 8: Trip Workspace — Contextual Header & Timeline / Itinerary View
**Files:**
- Create: `app/trips/[id]/page.tsx`
- Create: `components/trip/TripWorkspaceHeader.tsx`
- Create: `components/itinerary/TimelineView.tsx`
- Create: `components/itinerary/DayCard.tsx`
- Create: `components/itinerary/ActivityItem.tsx`
- Create: `components/itinerary/AddActivityDrawer.tsx`

- [ ] **Step 1: Build Trip Workspace header with route overview, total days, estimated cost, and tab bar (`Timeline`, `Calendar`, `Budget`, `Map`, `Share`)**
- [ ] **Step 2: Build day-wise Timeline with city banners, subtle timeline connectors, and time-stamped activity cards**
- [ ] **Step 3: Build activity action menu (reorder, move to another day, delete)**
- [ ] **Step 4: Build desktop side-drawer / mobile bottom sheet for searching & adding activities to any selected day**
- [ ] **Step 5: Commit**

---

### Task 9: The WOW Moment Engine — Dynamic Stop Duration & Multi-City Sync
**Files:**
- Create: `components/trip/StopDurationEditor.tsx`
- Modify: `components/trip/TripWorkspaceHeader.tsx`
- Modify: `components/itinerary/TimelineView.tsx`

- [ ] **Step 1: Build interactive Stop Duration Editor in Trip Workspace (e.g. Jaipur: 2 days [ - / + ] 3 days)**
- [ ] **Step 2: Wire up live synchronization: increasing Jaipur from 2 to 3 days instantly adjusts trip end date, pushes Udaipur days forward, adds Day 5 into Jaipur itinerary, recalculates accommodation & food budget, and updates the timeline**
- [ ] **Step 3: Add highlight animation badge to visually communicate recalculated fields to judges**
- [ ] **Step 4: Commit**

---

### Task 10: Trip Workspace — Interactive Route Map & Calendar Matrix
**Files:**
- Create: `components/trip/TripMap.tsx`
- Create: `components/trip/TripCalendar.tsx`

- [ ] **Step 1: Build visual route map component with city nodes, route lines, travel times, and active stop focus**
- [ ] **Step 2: Build responsive calendar view: desktop interactive multi-week grid and mobile horizontal date strip selector**
- [ ] **Step 3: Synchronize date selection with day itinerary scroll**
- [ ] **Step 4: Commit**

---

### Task 11: Trip Workspace — Budget Breakdown & Over-Budget Alerts
**Files:**
- Create: `components/budget/BudgetOverview.tsx`
- Create: `components/budget/CategoryBreakdown.tsx`
- Create: `components/budget/DailyExpenseBreakdown.tsx`
- Create: `components/budget/BudgetAlertBanner.tsx`

- [ ] **Step 1: Build total budget vs estimated spend progress bar with remaining amount & avg daily cost**
- [ ] **Step 2: Build interactive category breakdown (Transport, Accommodation, Activities, Meals, Misc) with live percentages**
- [ ] **Step 3: Build day-by-day expense breakdown**
- [ ] **Step 4: Build dynamic Over-Budget warning state with offending activity highlight and 1-click inspection**
- [ ] **Step 5: Commit**

---

### Task 12: City & Activity Exploration Hub
**Files:**
- Create: `app/explore/page.tsx`
- Create: `components/explore/CityCard.tsx`
- Create: `components/explore/ActivityCard.tsx`
- Create: `components/explore/ExploreFilters.tsx`
- Create: `components/explore/AddToTripModal.tsx`

- [ ] **Step 1: Build visual search bar and horizontally scrollable category filter chips**
- [ ] **Step 2: Build City cards with country, cost rating (`$$$`), popularity %, and "Add to Trip" action**
- [ ] **Step 3: Build Activity cards with category icons, duration, and price**
- [ ] **Step 4: Build "Add to Trip" modal/drawer to select which trip and day to insert the destination/activity**
- [ ] **Step 5: Commit**

---

### Task 13: Editorial Public Travel Story & Copy Trip Experience
**Files:**
- Create: `app/share/[id]/page.tsx`
- Create: `components/share/PublicStoryView.tsx`
- Create: `components/share/SocialShareModal.tsx`

- [ ] **Step 1: Build high-editorial public travel page with hero photography, route map badge, quote/story summary, and day-by-day itinerary**
- [ ] **Step 2: Build interactive "Copy This Trip" button with celebration confetti and instant toast notification linking to the duplicated trip**
- [ ] **Step 3: Build social sharing modal with copy link, WhatsApp, Twitter/X, and QR code preview**
- [ ] **Step 4: Ensure flawless mobile viewing experience**
- [ ] **Step 5: Commit**

---

### Task 14: Authentication, Settings & Admin Analytics
**Files:**
- Create: `app/auth/page.tsx`
- Create: `app/settings/page.tsx`
- Create: `app/admin/page.tsx`

- [ ] **Step 1: Build split-screen Auth page with destination imagery, login/signup toggle, and 1-click guest access**
- [ ] **Step 2: Build Profile & Settings page with currency selector, pacing preferences, and saved items**
- [ ] **Step 3: Build Admin / Analytics dashboard with platform metrics, popular routes, and engagement stats**
- [ ] **Step 4: Commit**

---

### Task 15: Polish, Visual QA, Responsive Verification & Demo Walkthrough
**Files:**
- Review and polish all screens across 375px, 768px, 1280px, 1920px.
- Create: `docs/superpowers/plans/walkthrough.md`

- [ ] **Step 1: Test complete hackathon demo story end-to-end**
- [ ] **Step 2: Verify all micro-interactions, empty states, hover elevations, and responsive drawers**
- [ ] **Step 3: Run linter and build check (`next build`) to ensure 0 errors**
- [ ] **Step 4: Document walkthrough and user guide**
- [ ] **Step 5: Commit**
