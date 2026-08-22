// =============================================================================
// GlobeTrotter — Supabase Database Type Definitions
// Auto-synced with: supabase/migrations/001_initial_schema.sql
// =============================================================================
// These types mirror the public schema tables exactly.
// Import the `Database` type into lib/supabase/client.ts and server.ts
// for end-to-end type safety with the Supabase client.
// =============================================================================

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          first_name: string | null
          last_name: string | null
          phone_number: string | null
          city: string | null
          country: string | null
          bio: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          first_name?: string | null
          last_name?: string | null
          phone_number?: string | null
          city?: string | null
          country?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          first_name?: string | null
          last_name?: string | null
          phone_number?: string | null
          city?: string | null
          country?: string | null
          bio?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          cover_image_url: string | null
          start_date: string | null
          end_date: string | null
          total_budget: number | null
          is_public: boolean
          status: 'ongoing' | 'upcoming' | 'completed'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          cover_image_url?: string | null
          start_date?: string | null
          end_date?: string | null
          total_budget?: number | null
          is_public?: boolean
          status?: 'ongoing' | 'upcoming' | 'completed'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          cover_image_url?: string | null
          start_date?: string | null
          end_date?: string | null
          total_budget?: number | null
          is_public?: boolean
          status?: 'ongoing' | 'upcoming' | 'completed'
          created_at?: string
        }
        Relationships: []
      }
      trip_stops: {
        Row: {
          id: string
          trip_id: string
          city_name: string
          country: string
          start_date: string | null
          end_date: string | null
          allocated_budget: number | null
          order_index: number
        }
        Insert: {
          id?: string
          trip_id: string
          city_name: string
          country: string
          start_date?: string | null
          end_date?: string | null
          allocated_budget?: number | null
          order_index?: number
        }
        Update: {
          id?: string
          trip_id?: string
          city_name?: string
          country?: string
          start_date?: string | null
          end_date?: string | null
          allocated_budget?: number | null
          order_index?: number
        }
        Relationships: []
      }
      activities: {
        Row: {
          id: string
          stop_id: string
          day_number: number
          title: string
          category: string | null
          cost: number
          order_index: number
        }
        Insert: {
          id?: string
          stop_id: string
          day_number?: number
          title: string
          category?: string | null
          cost?: number
          order_index?: number
        }
        Update: {
          id?: string
          stop_id?: string
          day_number?: number
          title?: string
          category?: string | null
          cost?: number
          order_index?: number
        }
        Relationships: []
      }
      community_posts: {
        Row: {
          id: string
          user_id: string
          trip_id: string | null
          title: string
          content: string
          rating: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          trip_id?: string | null
          title: string
          content: string
          rating?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          trip_id?: string | null
          title?: string
          content?: string
          rating?: number | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: {
      trip_status: 'ongoing' | 'upcoming' | 'completed'
    }
  }
}

// =============================================================================
// Row-level convenience aliases
// =============================================================================

export type Profile = Database['public']['Tables']['profiles']['Row']

/** Database trip row — prefixed to avoid collision with the UI Trip type in types/trip.ts */
export type DbTrip = Database['public']['Tables']['trips']['Row']

export type TripStop = Database['public']['Tables']['trip_stops']['Row']

/** Database activity row — prefixed to avoid collision with the UI Activity type */
export type DbActivity = Database['public']['Tables']['activities']['Row']

export type CommunityPost = Database['public']['Tables']['community_posts']['Row']

// =============================================================================
// Mutation payload types (used by Server Actions)
// =============================================================================

/** Payload for inserting a new trip */
export type CreateTripInput = Database['public']['Tables']['trips']['Insert']

/** Payload for updating a trip stop */
export type UpdateStopInput = Database['public']['Tables']['trip_stops']['Update']

/** Payload for adding an activity to a stop */
export type AddActivityInput = Database['public']['Tables']['activities']['Insert']

// =============================================================================
// Standard Action Response Envelope
// =============================================================================

export type ActionResponse<T = undefined> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never }
