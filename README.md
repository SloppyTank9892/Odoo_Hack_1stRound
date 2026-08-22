# GlobeTrotter: Personalized Travel Planning & Interactive Itinerary Platform

GlobeTrotter is a personalized travel planning platform designed to simplify the process of planning and organizing multi-city trips. Rather than competing with travel-booking platforms (like MakeMyTrip or Trivago), GlobeTrotter focuses strictly on the **travel planning experience**: discovering destinations and activities, constructing a multi-city itinerary, managing dates, understanding estimated costs, visualizing the journey, and sharing the final plan.

---

## 1. Core Mission & Features

The primary goal of GlobeTrotter is to enable travelers to organize personalized trips efficiently, stay within budget, and maintain full visibility of their complete journey through a highly interactive **Trip Workspace**.

### Core User Roles
* **Regular User / Traveler:** The primary user who manages their trips, builds itineraries, tracks budgets, saves destinations, and shares trips.
* **Administrator (Optional):** Accesses user information, trip statistics, popular cities/activities, and platform usage trends via an Admin/Analytics dashboard.

### Core Feature Set (MVP Scope)
* **Login / Signup:** Authenticates users (Email, Password, Password reset) and manages active user sessions.
* **Dashboard / Home:** Displays a welcome message, recent/upcoming trips, recommended destinations, budget highlights, and a "Plan New Trip" action.
* **Create Trip:** Input trip name, start/end dates, description, optional cover image, and save.
* **My Trips:** View lists of existing trips with quick summary cards (trip name, date range, destination counts, edit/view/delete).
* **Interactive Itinerary Builder:** Visual workspace to add stops, select cities, assign dates, assign activities, and reorder cities (e.g., Delhi $\rightarrow$ Agra $\rightarrow$ Jaipur $\rightarrow$ Udaipur).
* **Itinerary View:** Structured representation of the trip including day-wise layouts, city headers, activity blocks, activity times, costs, and calendar/list toggles.
* **City & Activity Discovery:** Search, discover, filter, and add destinations or activities to a trip with rich visual cards and filters (cost, duration, category, popularity).
* **Trip Budget & Cost Breakdown:** Visual progress indicators (e.g., ₹47,200 / ₹50,000) showing categories (transport, stay, activities, meals, miscellaneous) and alerting on over-budget days.
* **Calendar / Timeline:** Dynamic calendar/vertical timeline for the itinerary with support for expandable days, activity ordering, drag-to-reorder, and quick editing.
* **Public / Shared Itinerary:** Share a read-only, polished view of the itinerary via a unique public URL allowing other users to copy the trip.
* **Profile / Settings:** Basic account management (profile photo, name, email, language, saved destinations, and account deletion).

---

## 2. Technical Stack

| Layer | Technology |
| :--- | :--- |
| **Framework** | Next.js |
| **Frontend** | React + TypeScript |
| **Styling** | Tailwind CSS |
| **UI Components** | shadcn/ui |
| **Animations** | Framer Motion |
| **Icons** | Lucide Icons |
| **Backend** | Next.js Server Components, Server Actions & Route Handlers |
| **Database** | Supabase PostgreSQL |
| **Authentication** | Supabase Auth |
| **Storage** | Supabase Storage |
| **Deployment** | Vercel |

---

## 3. Database Schema

### `profiles`
* `id` (UUID, Primary Key)
* `user_id` (UUID, Foreign Key to Auth)
* `name` (Text)
* `avatar_url` (Text)
* `email` (Text)
* `language` (Text)
* `role` (Text - `'user'` or `'admin'`)
* `created_at` (Timestamp)

### `trips`
* `id` (UUID, Primary Key)
* `user_id` (UUID, Foreign Key to `profiles.id`)
* `name` (Text)
* `description` (Text)
* `cover_image` (Text)
* `start_date` (Date)
* `end_date` (Date)
* `budget` (Numeric)
* `currency` (Text)
* `status` (Text)
* `is_public` (Boolean)
* `share_id` (UUID)
* `created_at` (Timestamp)
* `updated_at` (Timestamp)

### `cities`
* `id` (UUID, Primary Key)
* `name` (Text)
* `country` (Text)
* `region` (Text)
* `description` (Text)
* `image_url` (Text)
* `cost_index` (Integer)
* `popularity` (Integer)
* `latitude` (Float)
* `longitude` (Float)

### `trip_stops`
* `id` (UUID, Primary Key)
* `trip_id` (UUID, Foreign Key to `trips.id`)
* `city_id` (UUID, Foreign Key to `cities.id`)
* `start_date` (Date)
* `end_date` (Date)
* `order_index` (Integer)

### `activities`
* `id` (UUID, Primary Key)
* `city_id` (UUID, Foreign Key to `cities.id`)
* `name` (Text)
* `description` (Text)
* `category` (Text)
* `duration` (Integer)
* `estimated_cost` (Numeric)
* `image_url` (Text)

### `itinerary_items`
* `id` (UUID, Primary Key)
* `trip_stop_id` (UUID, Foreign Key to `trip_stops.id`)
* `activity_id` (UUID, Foreign Key to `activities.id`)
* `date` (Date)
* `start_time` (Time)
* `end_time` (Time)
* `order_index` (Integer)
* `notes` (Text)

### `expenses`
* `id` (UUID, Primary Key)
* `trip_id` (UUID, Foreign Key to `trips.id`)
* `trip_stop_id` (UUID, Foreign Key to `trip_stops.id`, Optional)
* `category` (Text - `'transport'`, `'stay'`, `'activities'`, `'meals'`, `'miscellaneous'`)
* `amount` (Numeric)
* `description` (Text)
* `date` (Date)

### `shared_trips`
* `id` (UUID, Primary Key)
* `trip_id` (UUID, Foreign Key to `trips.id`)
* `share_token` (Text)
* `is_public` (Boolean)
* `created_at` (Timestamp)

### `saved_destinations`
* `id` (UUID, Primary Key)
* `user_id` (UUID, Foreign Key to `profiles.id`)
* `city_id` (UUID, Foreign Key to `cities.id`)
* `created_at` (Timestamp)

---

## 4. Route Architecture (Next.js App Router)

```text
app/
├── (auth)/
│   ├── login/
│   └── signup/
│
├── (dashboard)/
│   ├── dashboard/
│   ├── trips/
│   │   ├── new/
│   │   └── [tripId]/
│   │       ├── overview/
│   │       ├── itinerary/
│   │       ├── calendar/
│   │       ├── budget/
│   │       ├── cities/
│   │       └── activities/
│   ├── discover/
│   │   ├── cities/
│   │   └── activities/
│   └── settings/
│
├── trip/
│   └── [shareId]/
│
├── admin/
│   ├── dashboard/
│   ├── users/
│   └── analytics/
│
└── api/
    ├── cities/
    ├── activities/
    ├── trips/
    └── share/
```

---

## 5. Frontend Component Architecture

```text
components/
├── ui/                 # Reusable primitive UI components
│   ├── Button
│   ├── Card
│   ├── Modal
│   ├── Tabs
│   ├── Drawer
│   └── ...
│
├── trip/               # Components specific to trip workspace
│   ├── TripHeader
│   ├── TripStats
│   ├── TripMap
│   ├── StopCard
│   ├── ActivityCard
│   ├── ItineraryBuilder
│   └── TripShare
│
├── itinerary/          # Components specific to building the timeline
│   ├── Timeline
│   ├── DayCard
│   ├── ActivityBlock
│   └── DragActivity
│
├── budget/             # Components for tracking costs
│   ├── BudgetOverview
│   ├── ExpenseChart
│   ├── CategoryBreakdown
│   └── BudgetAlert
│
├── discover/           # Destination & activity browsing components
│   ├── CityCard
│   ├── ActivityCard
│   ├── SearchBar
│   └── FilterPanel
│
└── dashboard/          # Home dashboard items
    ├── TripCard
    ├── DestinationCard
    └── RecommendationCard
```

---

## 6. Recommended Development Order

### Phase 1 — Foundation
* Set up: Next.js, TypeScript, Tailwind CSS, shadcn/ui.
* Integrate Supabase (Auth, Database schema creation, Vercel deployment setup).

### Phase 2 — Core Trip System
* Build the Dashboard.
* Implement Trip Creation (`/trips/new`) and "My Trips" listings.
* Build Trip details, Trip stops, and City lists.

### Phase 3 — Itinerary
* Develop City & Activity Discovery tools.
* Implement Add Activity to trip and Build Day-wise Itinerary.
* Add Activity Reordering, Timeline, and Calendar view.

### Phase 4 — Budget
* Establish the Expense model and cost calculation engine.
* Build Category Breakdowns, Daily Budget lists, Over-budget Alerts, and visual charts.

### Phase 5 — Visual Experience
* Connect Map representation to the itinerary.
* Enhance City/Destination cards, add transitions/animations, and integrate drag-and-drop workspace behaviors.

### Phase 6 — Sharing
* Construct Public URL read-only pages (`/trip/[shareId]`).
* Enable Copy Trip capability and build the social sharing UI.

### Phase 7 — Intelligence (Optional Enhancement Layer)
* Integrate optional AI layer for smart activity recommendations, budget optimizations, and itinerary suggestions.

### Phase 8 — Admin (Optional Secondary Layer)
* Implement Admin Dashboard with statistics, popular cities/activities, and engagement analytics.
