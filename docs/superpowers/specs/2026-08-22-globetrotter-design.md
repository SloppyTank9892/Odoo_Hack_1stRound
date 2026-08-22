# GlobeTrotter — Warm Modern Explorer Design Specification

## 1. Product Overview
GlobeTrotter is a personalized, interactive travel planning workspace built with the **Warm Modern Explorer** aesthetic. It unifies the full traveler journey: **DISCOVER → BUILD → ORGANIZE → VISUALIZE → BUDGET → SHARE**.

The core entity is the **Trip Workspace**, where destinations, dates, activities, timeline, calendar, budget, and map reflect one single live reactive state.

---

## 2. Visual Identity & Design System

### 2.1 Color Palette
* **Background Primary**: Warm Ivory (`#F7F6F2`)
* **Background Surface / Cards**: Warm Pure White (`#FFFFFF`) with warm micro-border (`#E7E2D8`) and subtle warm shadow (`0 2px 8px -2px rgba(24, 24, 24, 0.05)`)
* **Primary Text**: Near Black (`#181818`)
* **Muted / Secondary Text**: Warm Slate (`#6B655E` / `#8C847B`)
* **Primary Signature Accent**: Sunset Amber (`#F4A62A`), hover state (`#E09115`), tint background (`#FEF7EC`)
* **Secondary Accent**: Muted Editorial Purple (`#76546F`), soft pill tint (`#F6F0F5`)
* **Semantic Accents**:
  * Positive / Under-Budget: Forest Sage (`#1B8755`, bg `#EDF7F2`)
  * Over-Budget / Warning: Terracotta Red (`#C84B31`, bg `#FDF1EE`)
  * Info / Route: Explorer Cobalt (`#2B6CB0`, bg `#EEF5FC`)

### 2.2 Typography
* **Primary UI & Data**: Plus Jakarta Sans / Inter for crisp hierarchy, legible time/cost numbers, and comfortable reading.
* **Editorial Highlights**: Playfair / Newsreader Serif for prominent destination badges and trip hero titles (e.g. `RAJASTHAN EXPLORER`, `JAPAN`).

### 2.3 Layout & Breakpoints
* **Mobile (320px - 767px)**: Vertical trip journal flow, sticky top contextual header, bottom navigation bar (`Home`, `Trips`, `Explore`, `Saved`), bottom-sheet drawers for adding activities/cities, horizontal date-pill scroller.
* **Tablet (768px - 1023px)**: Adaptive 2-column layout with collapsable inspection drawer.
* **Desktop (1024px+)**: Trip Command Center featuring persistent sidebar, multi-column workspace (Itinerary/Timeline left/center, dynamic Map & Live Budget on the right).

---

## 3. Architecture & State Management

### 3.1 Global Trip State (`TripContext`)
* **Live Trips Collection**: Contains pre-loaded demo trips (e.g. *Rajasthan Explorer* as primary demo, *Japan Adventure*, *Amalfi Coast Explorer*).
* **Active Trip Synchronization**:
  * Changing stop duration (e.g. Jaipur: 2 days → 3 days) automatically recalculates:
    * Total trip duration and end date
    * Shifted calendar dates for subsequent cities (Udaipur shifts automatically)
    * Dynamic timeline day blocks (Day 3 & Day 4 in Jaipur, Day 5 in Udaipur)
    * Estimated accommodation costs, daily meal budgets, and total trip budget
    * Average cost per day
    * Visual alert triggers if exceeding budget targets
* **CRUD Capabilities**:
  * Add / Remove / Reorder city stops
  * Add / Remove / Move activities between days and time slots
  * Custom activity creator with category, cost, duration, and time
  * Live category budget distribution (Transport, Accommodation, Activities, Meals, Misc)
  * Duplicate / "Copy This Trip" generator into user's private trips

---

## 4. Key Feature Views

1. **Auth / Welcome (`/auth`)**: Editorial split-screen with stunning destination imagery, tabbed Login/Signup, guest demo quick-access button.
2. **Dashboard (`/dashboard` & `/`)**:
   * Personalized greeting & "Plan a New Trip" hero banner
   * Active trip quick-resume card with progress ring and budget ticker
   * Upcoming & recent trips carousel/grid
   * Curated destination inspiration cards with cost index and tags
3. **Trip Workspace (`/trips/[id]`)**:
   * Contextual sub-nav tabs: `Overview`, `Itinerary (Timeline)`, `Calendar`, `Budget`, `Map`, `Share`
   * **Timeline View**: Time-slotted activity cards, category icon badges, cost pill, drag/move handles, and "+ Add Activity" side drawer / bottom sheet.
   * **Calendar View**: Interactive matrix with month/week views, day activity count chips, and quick day selection.
   * **Budget View**: Total vs Target meter, interactive expense category cards, daily expense breakdown, and over-budget alert banner with highlighted offending activities.
   * **Interactive Route Map**: SVG/Canvas-based aesthetic route visualization with city pins, route connectors, distance badges, and active stop focus.
4. **City & Activity Discovery (`/explore`)**:
   * Search input with live category filters (Culture, Food, Adventure, Nature, Sightseeing, Shopping).
   * City cards with popularity rank, cost tier (`$$$`), and 1-click "+ Add to Trip" modal.
   * Activity cards with duration badges and instant day-selector drawer.
5. **My Trips (`/trips`)**:
   * Card grid showing cover photos, route badges (`Delhi → Agra → Jaipur → Udaipur`), day count, budget progress, and quick actions (Edit, Duplicate, Share, Delete).
6. **Create Trip Flow (`/trips/new` modal / screen)**:
   * 3-step lightweight modal: 1. Trip Name & Style, 2. Start Date & Duration, 3. Initial Destinations picker.
7. **Public / Shared Itinerary (`/share/[id]`)**:
   * Editorial travel story view with high-res photography, route map overview, day-by-day story timeline, estimated budget breakdown, and sticky "Copy This Trip" action with toast notification.
8. **Profile & Settings (`/settings`)**:
   * Traveler preferences, currency selection (₹ INR, $ USD, € EUR, ¥ JPY), default pacing, saved places.
9. **Admin / Analytics (`/admin`)**:
   * Clean overview of platform trip metrics, top trending cities, and popular activities.

---

## 5. Verification & Demonstration Flow
* The prototype supports the complete judge demonstration script:
  1. Open Dashboard → View Rajasthan Explorer overview.
  2. Enter Trip Workspace → Inspect Day 3 (Jaipur).
  3. Trigger the WOW moment: Increase Jaipur stop from 2 days to 3 days.
  4. Observe live reactive recalculation of timeline dates, Udaipur schedule shift, calendar matrix update, and budget progress adjustment.
  5. Add an activity (e.g. "Chokhi Dhani Cultural Dinner") → Observe instant placement in timeline and budget categorization.
  6. Switch to Public Story (`/share/rajasthan-explorer`) → Click "Copy This Trip" → Confirm instant duplication into "My Trips".
