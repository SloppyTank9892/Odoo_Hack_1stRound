import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { Database } from '@/types/database'

type DbTripInsert = Database['public']['Tables']['trips']['Insert']
type DbStopInsert = Database['public']['Tables']['trip_stops']['Insert']
type DbActivityInsert = Database['public']['Tables']['activities']['Insert']

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id: tripId } = await context.params
    if (!tripId) {
      return NextResponse.json(
        { success: false, error: 'Trip ID is required.' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // 1. Authenticate user
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { success: false, error: 'You must be signed in to copy a trip.' },
        { status: 401 }
      )
    }

    // 2. Fetch original trip
    const { data: originalTrip, error: tripError } = await supabase
      .from('trips')
      .select('*')
      .eq('id', tripId)
      .single()

    if (tripError || !originalTrip) {
      return NextResponse.json(
        { success: false, error: 'Original trip not found.' },
        { status: 404 }
      )
    }

    // Verify trip is either public or owned by requester
    if (!originalTrip.is_public && originalTrip.user_id !== user.id) {
      return NextResponse.json(
        { success: false, error: 'This trip is private and cannot be copied.' },
        { status: 403 }
      )
    }

    // 3. Create cloned trip record owned by user
    const newTripPayload: DbTripInsert = {
      user_id: user.id,
      title: `${originalTrip.title} (My Copy)`,
      description: originalTrip.description,
      cover_image_url: originalTrip.cover_image_url,
      start_date: originalTrip.start_date,
      end_date: originalTrip.end_date,
      total_budget: originalTrip.total_budget,
      is_public: false,
      status: 'upcoming',
    }

    const { data: newTrip, error: newTripError } = await supabase
      .from('trips')
      .insert(newTripPayload)
      .select('*')
      .single()

    if (newTripError || !newTrip) {
      return NextResponse.json(
        { success: false, error: newTripError?.message || 'Failed to create cloned trip.' },
        { status: 500 }
      )
    }

    // 4. Fetch stops of the original trip
    const { data: originalStops, error: stopsError } = await supabase
      .from('trip_stops')
      .select('*')
      .eq('trip_id', tripId)
      .order('order_index', { ascending: true })

    if (stopsError) {
      return NextResponse.json(
        { success: false, error: 'Failed to read original stops.' },
        { status: 500 }
      )
    }

    if (originalStops && originalStops.length > 0) {
      // 5. Clone each stop and its activities
      for (const stop of originalStops) {
        const newStopPayload: DbStopInsert = {
          trip_id: newTrip.id,
          city_name: stop.city_name,
          country: stop.country,
          start_date: stop.start_date,
          end_date: stop.end_date,
          allocated_budget: stop.allocated_budget,
          order_index: stop.order_index,
        }

        const { data: newStop, error: newStopError } = await supabase
          .from('trip_stops')
          .insert(newStopPayload)
          .select('*')
          .single()

        if (newStopError || !newStop) {
          continue
        }

        // Fetch and clone activities for this stop
        const { data: originalActivities } = await supabase
          .from('activities')
          .select('*')
          .eq('stop_id', stop.id)
          .order('order_index', { ascending: true })

        if (originalActivities && originalActivities.length > 0) {
          const newActivitiesPayload: DbActivityInsert[] = originalActivities.map((act) => ({
            stop_id: newStop.id,
            day_number: act.day_number,
            title: act.title,
            category: act.category,
            cost: act.cost,
            order_index: act.order_index,
          }))

          await supabase.from('activities').insert(newActivitiesPayload)
        }
      }
    }

    return NextResponse.json(
      {
        success: true,
        data: {
          newTripId: newTrip.id,
          trip: newTrip,
        },
        message: 'Trip copied successfully.',
      },
      { status: 201 }
    )
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Internal Server Error'
    return NextResponse.json({ success: false, error: msg }, { status: 500 })
  }
}
