# GlobeTrotter: Personalized Travel Planning & Interactive Itinerary Platform

GlobeTrotter is a personalized, interactive travel planning platform designed to streamline multi-city travel. Built with **Next.js 16 App Router**, **Supabase PostgreSQL & SSR Auth**, and the **Warm Modern Explorer** design system, GlobeTrotter provides an intuitive workspace for discovering destinations, constructing multi-city itineraries, managing dates with automatic cascade updates, calculating live budgets, and sharing travel stories.

---

## 1. Key Features & Capabilities

### 🗺️ Interactive Trip Workspace
* **Multi-City Route Builder**: Add stops (e.g., Delhi → Agra → Jaipur → Udaipur), adjust durations, and view chronological date cascades.
* **Drag-and-Drop Activity Reordering**: Reorder activities within days and move items between days using `@dnd-kit`.
* **Dynamic Date Cascading**: Changing the duration of any stop automatically adjusts downstream dates, day numbers, and itinerary schedules.
* **Stop Duration Syncer**: Interactive stepper for each city stop with visual cascade alerts.

### 💰 Live Budget & Cost Breakdown Engine
* **Real-time Financial Ledger**: Automatic recalculation of accommodation, meals, activities, transit, and contingency buffers.
* **Multi-Currency Support**: Instant conversion between INR (₹), USD ($), EUR (€), GBP (£), and JPY (¥).
* **Target Budget & Overrun Alerts**: Interactive target spending caps with automatic cap adjustment suggestions.
* **Category Distribution**: Visual progress bars and day-by-day expense tables.

### 🧭 Exploration & Discovery Hub
* **Curated Destinations**: Rich destination cards with cost indicators, popular rank, and region tags.
* **Curated Activities**: Filter by category (Culture, Food, Adventure, Nature, Transport, Sightseeing), time of day, and duration.
* **Quick Add to Trip**: Modal selector to schedule any destination or activity directly into the active trip or any chosen day.
* **Saved Bookmarks**: Local storage and database bookmarking for quick reference.

### 📖 Social Stories & Sharing
* **Public Editorial Itinerary Reader** (`/share/[id]`): Clean, magazine-style read-only view with interactive route maps and chapter breakdowns.
* **One-Click Trip Duplication**: Fork and clone public itineraries directly into your personal workspace.
* **Social Share Modal**: Instant links, WhatsApp share, and X/Twitter share.

### 🔐 Supabase SSR Authentication & Profile
* **Email & Password Authentication**: Full SSR cookie session handling via `@supabase/ssr`.
* **Guest / Demo Mode**: Instant one-click guest login for demonstration without signup friction.
* **User Profile & Settings**: Avatar upload, preferred travel pacing (relaxed, balanced, fast-paced), currency preferences, and home city.

---

## 2. Technical Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js 16 (App Router + Server Actions) |
| **Language** | TypeScript (Strict Mode) |
| **Styling** | Vanilla Tailwind CSS (Warm Modern Explorer Theme) |
| **Drag & Drop** | `@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities` |
| **Animations** | Framer Motion & Canvas Confetti |
| **Icons** | Lucide React |
| **Database & Auth** | Supabase (PostgreSQL, SSR Cookie Auth, Storage) |
| **State Management**| React Context (`TripContext`, `ToastProvider`) + Supabase DB Sync |

---

## 3. Design System: Warm Modern Explorer

The user interface follows the **Warm Modern Explorer** aesthetic:
* **Background Canvas**: Ivory / Parchment (`#F7F6F2`)
* **Primary Contrast**: Deep Charcoal (`#181818`)
* **Warm Accents**: Rich Amber (`#F4A62A` / `#B86E00`), Plum (`#76546F`), Forest Green (`#1B8755`)
* **Card Surfaces**: Pure White (`#FFFFFF`) with warm neutral borders (`#E7E2D8`)
* **Typography**: *Playfair Display* for editorial headings & *Plus Jakarta Sans* for clean UI hierarchy

---

## 4. Project Structure

```text
├── app/
│   ├── actions/                  # Next.js Server Actions (Auth, Trips, Storage)
│   ├── admin/                    # Admin Intelligence & KPI Dashboard
│   ├── api/                      # Route Handlers (/api/trips/[id]/copy)
│   ├── auth/                     # Auth login & signup pages
│   ├── explore/                  # Discovery hub & saved bookmarks
│   ├── privacy/                  # Privacy policy
│   ├── settings/                 # Profile & travel preferences
│   ├── share/                    # Public stories gallery & [id] reader
│   ├── terms/                    # Terms of service
│   ├── thank-you/                # Post-sync celebration page
│   ├── trips/                    # My Trips collection & [id] Workspace
│   ├── globals.css               # Design tokens & core styles
│   ├── layout.tsx                # Root layout with font and providers
│   ├── page.tsx                  # Home dashboard
│   ├── robots.ts                 # SEO robots configuration
│   └── sitemap.ts                # Dynamic sitemap generator
├── components/
│   ├── analytics/                # Analytics & telemetry
│   ├── budget/                   # Budget overview, alerts & ledgers
│   ├── dashboard/                # Hero banner, active trip card & upcoming grid
│   ├── explore/                  # ActivityCard & AddToTripModal
│   ├── itinerary/                # TimelineView, DayCard, ActivityItem, AddDrawer
│   ├── layout/                   # AppShell, Footer
│   ├── navigation/               # TopBar, DesktopSidebar, MobileBottomNav
│   ├── settings/                 # PreferencesForm, AvatarUpload
│   ├── share/                    # PublicStoryView, SocialShareModal
│   ├── trip/                     # CreateTripModal, TripMap, TripCalendar, StopDurationEditor
│   └── ui/                       # Button, Card, Badge, Modal, Drawer, Toast, Skeleton
├── context/
│   └── TripContext.tsx           # Global state engine, calculations & Supabase sync
├── data/
│   ├── curatedDestinations.ts    # Curated cities catalog
│   └── curatedActivities.ts      # Curated activity catalog
├── lib/
│   ├── supabase/                 # Supabase client, server & middleware helpers
│   ├── tripCalculations.ts       # Date cascade & budget recalculation engine
│   └── utils.ts                  # Classname merging utility
└── supabase/
    └── migrations/               # SQL schema definitions & RLS policies
```

---

## 5. Getting Started

### Prerequisites
* Node.js 18+ or 20+
* npm or pnpm
* Supabase project (optional for local mock fallback, required for live DB persistence)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd Odoo_Hack_1stRound
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env.local` file in the root directory:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

4. **Run Database Migrations (Supabase)**:
   Apply the SQL migration in `supabase/migrations/` to set up tables (`profiles`, `trips`, `trip_stops`, `itinerary_items`, `expenses`, `saved_destinations`) and Row Level Security (RLS) policies.

5. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the workspace.

6. **Production Build**:
   ```bash
   npm run build
   npm start
   ```

---

## 6. License

MIT License. Designed for the Odoo Hackathon.
