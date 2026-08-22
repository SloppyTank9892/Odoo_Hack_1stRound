'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { uploadMedia } from '@/app/actions/storage'
import type { Database, DbTrip, TripStop, DbActivity } from '@/types/database'

export type ActionResponse<T = undefined> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never }

export type TripStopWithActivities = TripStop & {
  activities: DbActivity[]
}

export type TripWithDetails = DbTrip & {
  trip_stops: TripStopWithActivities[]
}

export type CreateStopInput = {
  trip_id: string
  city_name: string
  country: string
  start_date?: string | null
  end_date?: string | null
  allocated_budget?: number | null
  order_index?: number
}

export type CreateActivityInput = {
  stop_id: string
  day_number?: number
  title: string
  category?: string | null
  cost?: number
  order_index?: number
}

// ---------------------------------------------------------------------------
// createTrip
// ---------------------------------------------------------------------------

/**
 * Creates a new Trip in Supabase.
 * Supports multipart FormData with optional cover file or string URL,
 * and optional initial stops JSON string.
 */
export async function createTrip(
  formData: FormData
): Promise<ActionResponse<{ tripId: string }>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'You must be logged in to create a trip.' }
    }

    const title = String(formData.get('title') ?? '').trim()
    const description = (formData.get('description') as string | null) || null
    const startDate = (formData.get('start_date') as string | null) || null
    const endDate = (formData.get('end_date') as string | null) || null
    const totalBudget = formData.has('total_budget')
      ? Number(formData.get('total_budget'))
      : 50000
    const isPublic = formData.get('is_public') === 'true'
    const status = ((formData.get('status') as string) || 'upcoming') as
      | 'upcoming'
      | 'ongoing'
      | 'completed'

    if (!title) {
      return { success: false, error: 'Trip title is required.' }
    }

    let coverImageUrl: string | null = (formData.get('cover_image_url') as string | null) || null

    // Check if a file was uploaded for cover image
    const coverFile = formData.get('cover_file')
    if (coverFile && coverFile instanceof File && coverFile.size > 0) {
      const uploadRes = await uploadMedia(coverFile, 'trip-covers')
      if (uploadRes.success && uploadRes.data?.url) {
        coverImageUrl = uploadRes.data.url
      }
    }

    // Insert Trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .insert({
        user_id: user.id,
        title,
        description,
        cover_image_url: coverImageUrl,
        start_date: startDate,
        end_date: endDate,
        total_budget: totalBudget,
        is_public: isPublic,
        status,
      })
      .select('id')
      .single()

    if (tripError || !trip) {
      return { success: false, error: tripError?.message || 'Failed to create trip.' }
    }

    // Handle optional initial stops
    const stopsJson = formData.get('initial_stops') as string | null
    if (stopsJson) {
      try {
        const parsedStops = JSON.parse(stopsJson) as Array<{
          cityName: string
          country: string
          daysCount?: number
          allocatedBudget?: number
        }>

        if (Array.isArray(parsedStops) && parsedStops.length > 0) {
          const stopsToInsert = parsedStops.map((s, index) => ({
            trip_id: trip.id,
            city_name: s.cityName,
            country: s.country,
            order_index: index,
            allocated_budget: s.allocatedBudget || 15000,
          }))

          await supabase.from('trip_stops').insert(stopsToInsert)
        }
      } catch (err) {
        console.warn('Could not parse initial stops JSON:', err)
      }
    }

    revalidatePath('/trips')
    revalidatePath('/dashboard')
    revalidatePath('/')

    return { success: true, data: { tripId: trip.id } }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'An unexpected error occurred while creating trip.'
    return { success: false, error: msg }
  }
}

// ---------------------------------------------------------------------------
// getTripById
// ---------------------------------------------------------------------------

/**
 * Fetches a single trip along with nested trip_stops and activities.
 */
export async function getTripById(
  tripId: string
): Promise<ActionResponse<TripWithDetails>> {
  try {
    const supabase = await createClient()

    // Fetch trip
    const { data: trip, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single()

    if (tripError || !trip) {
      return { success: false, error: tripError?.message || 'Trip not found.' }
    }

    // Fetch stops
    const { data: stops, error: stopsError } = await supabase
      .from('trip_stops')
      .select('*')
      .eq('trip_id', tripId)
      .order('order_index', { ascending: true })

    if (stopsError) {
      return { success: false, error: stopsError.message }
    }

    // Fetch activities for all stops
    const stopIds = (stops || []).map((s) => s.id)
    let activities: DbActivity[] = []

    if (stopIds.length > 0) {
      const { data: acts, error: actsError } = await supabase
        .from('activities')
        .select('*')
        .in('stop_id', stopIds)
        .order('order_index', { ascending: true })

      if (actsError) {
        return { success: false, error: actsError.message }
      }
      activities = acts || []
    }

    // Combine stops with their activities
    const nestedStops: TripStopWithActivities[] = (stops || []).map((stop) => ({
      ...stop,
      activities: activities.filter((act) => act.stop_id === stop.id),
    }))

    const result: TripWithDetails = {
      ...trip,
      trip_stops: nestedStops,
    }

    return { success: true, data: result }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch trip details.'
    return { success: false, error: msg }
  }
}

// ---------------------------------------------------------------------------
// getUserTrips
// ---------------------------------------------------------------------------

/**
 * Returns all trips belonging to the authenticated user, categorized by status.
 */
export async function getUserTrips(): Promise<
  ActionResponse<{
    all: DbTrip[]
    upcoming: DbTrip[]
    ongoing: DbTrip[]
    completed: DbTrip[]
  }>
> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return { success: false, error: 'Not authenticated.' }
    }

    const { data: trips, error } = await supabase
      .from('trips')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) {
      return { success: false, error: error.message }
    }

    const all = trips || []
    const upcoming = all.filter((t) => t.status === 'upcoming')
    const ongoing = all.filter((t) => t.status === 'ongoing')
    const completed = all.filter((t) => t.status === 'completed')

    return {
      success: true,
      data: {
        all,
        upcoming,
        ongoing,
        completed,
      },
    }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Failed to fetch user trips.'
    return { success: false, error: msg }
  }
}

// ---------------------------------------------------------------------------
// addTripStop
// ---------------------------------------------------------------------------

/**
 * Adds a destination stop to a trip.
 */
export async function addTripStop(
  stopData: CreateStopInput
): Promise<ActionResponse<TripStop>> {
  try {
    const supabase = await createClient()

    // Determine highest order index if not specified
    let orderIndex = stopData.order_index
    if (orderIndex === undefined) {
      const { data: existingStops } = await supabase
        .from('trip_stops')
        .select('order_index')
        .eq('trip_id', stopData.trip_id)
        .order('order_index', { ascending: false })
        .limit(1)

      orderIndex = (existingStops?.[0]?.order_index ?? -1) + 1
    }

    const { data, error } = await supabase
      .from('trip_stops')
      .insert({
        trip_id: stopData.trip_id,
        city_name: stopData.city_name,
        country: stopData.country,
        start_date: stopData.start_date || null,
        end_date: stopData.end_date || null,
        allocated_budget: stopData.allocated_budget || null,
        order_index: orderIndex,
      })
      .select('*')
      .single()

    if (error || !data) {
      return { success: false, error: error?.message || 'Failed to add stop.' }
    }

    revalidatePath(`/trips/${stopData.trip_id}`)
    revalidatePath('/trips')
    revalidatePath('/dashboard')

    return { success: true, data }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error adding trip stop.'
    return { success: false, error: msg }
  }
}

// ---------------------------------------------------------------------------
// updateTripStop
// ---------------------------------------------------------------------------

/**
 * Updates a stop's duration, budget, or dates.
 */
export async function updateTripStop(
  stopId: string,
  updates: Partial<{
    city_name: string
    country: string
    start_date: string | null
    end_date: string | null
    allocated_budget: number | null
    order_index: number
  }>
): Promise<ActionResponse<TripStop>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('trip_stops')
      .update(updates)
      .eq('id', stopId)
      .select('*')
      .single()

    if (error || !data) {
      return { success: false, error: error?.message || 'Failed to update stop.' }
    }

    revalidatePath(`/trips/${data.trip_id}`)
    revalidatePath('/trips')

    return { success: true, data }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error updating trip stop.'
    return { success: false, error: msg }
  }
}

// ---------------------------------------------------------------------------
// deleteTripStop
// ---------------------------------------------------------------------------

/**
 * Deletes a stop and cascades its activities.
 */
export async function deleteTripStop(
  stopId: string
): Promise<ActionResponse<{ stopId: string }>> {
  try {
    const supabase = await createClient()

    // Get trip_id first for cache invalidation
    const { data: stop } = await supabase
      .from('trip_stops')
      .select('trip_id')
      .eq('id', stopId)
      .single()

    const { error } = await supabase.from('trip_stops').delete().eq('id', stopId)

    if (error) {
      return { success: false, error: error.message }
    }

    if (stop?.trip_id) {
      revalidatePath(`/trips/${stop.trip_id}`)
    }
    revalidatePath('/trips')

    return { success: true, data: { stopId } }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error deleting trip stop.'
    return { success: false, error: msg }
  }
}

// ---------------------------------------------------------------------------
// addActivity
// ---------------------------------------------------------------------------

/**
 * Adds an activity to a specific trip stop.
 */
export async function addActivity(
  activityData: CreateActivityInput
): Promise<ActionResponse<DbActivity>> {
  try {
    const supabase = await createClient()

    let orderIndex = activityData.order_index
    if (orderIndex === undefined) {
      const { data: existingActs } = await supabase
        .from('activities')
        .select('order_index')
        .eq('stop_id', activityData.stop_id)
        .order('order_index', { ascending: false })
        .limit(1)

      orderIndex = (existingActs?.[0]?.order_index ?? -1) + 1
    }

    const { data, error } = await supabase
      .from('activities')
      .insert({
        stop_id: activityData.stop_id,
        day_number: activityData.day_number || 1,
        title: activityData.title,
        category: activityData.category || null,
        cost: activityData.cost || 0,
        order_index: orderIndex,
      })
      .select('*')
      .single()

    if (error || !data) {
      return { success: false, error: error?.message || 'Failed to add activity.' }
    }

    // Invalidate paths
    const { data: stop } = await supabase
      .from('trip_stops')
      .select('trip_id')
      .eq('id', activityData.stop_id)
      .single()

    if (stop?.trip_id) {
      revalidatePath(`/trips/${stop.trip_id}`)
    }

    return { success: true, data }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error adding activity.'
    return { success: false, error: msg }
  }
}

// ---------------------------------------------------------------------------
// deleteActivity
// ---------------------------------------------------------------------------

/**
 * Removes an activity.
 */
export async function deleteActivity(
  activityId: string
): Promise<ActionResponse<{ activityId: string }>> {
  try {
    const supabase = await createClient()

    const { data: act } = await supabase
      .from('activities')
      .select('stop_id')
      .eq('id', activityId)
      .single()

    const { error } = await supabase.from('activities').delete().eq('id', activityId)

    if (error) {
      return { success: false, error: error.message }
    }

    if (act?.stop_id) {
      const { data: stop } = await supabase
        .from('trip_stops')
        .select('trip_id')
        .eq('id', act.stop_id)
        .single()

      if (stop?.trip_id) {
        revalidatePath(`/trips/${stop.trip_id}`)
      }
    }

    return { success: true, data: { activityId } }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error deleting activity.'
    return { success: false, error: msg }
  }
}

// ---------------------------------------------------------------------------
// toggleTripPublicStatus
// ---------------------------------------------------------------------------

/**
 * Toggles whether a trip is publicly visible on /share/[id].
 */
export async function toggleTripPublicStatus(
  tripId: string,
  isPublic: boolean
): Promise<ActionResponse<{ tripId: string; isPublic: boolean }>> {
  try {
    const supabase = await createClient()

    const { error } = await supabase
      .from('trips')
      .update({ is_public: isPublic })
      .eq('id', tripId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath(`/trips/${tripId}`)
    revalidatePath(`/share/${tripId}`)
    revalidatePath('/trips')

    return { success: true, data: { tripId, isPublic } }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error toggling public status.'
    return { success: false, error: msg }
  }
}

// ---------------------------------------------------------------------------
// updateTrip
// ---------------------------------------------------------------------------

/**
 * Updates general trip properties like title, target budget, dates.
 */
export async function updateTrip(
  tripId: string,
  updates: Partial<{
    title: string
    description: string | null
    cover_image_url: string | null
    start_date: string | null
    end_date: string | null
    total_budget: number | null
    is_public: boolean
    status: 'upcoming' | 'ongoing' | 'completed'
  }>
): Promise<ActionResponse<DbTrip>> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('trips')
      .update(updates)
      .eq('id', tripId)
      .select('*')
      .single()

    if (error || !data) {
      return { success: false, error: error?.message || 'Failed to update trip.' }
    }

    revalidatePath(`/trips/${tripId}`)
    revalidatePath('/trips')
    revalidatePath('/dashboard')

    return { success: true, data }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error updating trip.'
    return { success: false, error: msg }
  }
}

// ---------------------------------------------------------------------------
// deleteTrip
// ---------------------------------------------------------------------------

/**
 * Deletes a trip and cascades all stops and activities.
 */
export async function deleteTrip(
  tripId: string
): Promise<ActionResponse<{ tripId: string }>> {
  try {
    const supabase = await createClient()

    const { error } = await supabase.from('trips').delete().eq('id', tripId)

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/trips')
    revalidatePath('/dashboard')
    revalidatePath('/')

    return { success: true, data: { tripId } }
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Error deleting trip.'
    return { success: false, error: msg }
  }
}
