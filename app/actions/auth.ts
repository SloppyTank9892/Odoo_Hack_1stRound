'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Database, Profile } from '@/types/database'

type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// ---------------------------------------------------------------------------
// Standard Action Response Envelope
// ---------------------------------------------------------------------------

export type ActionResult<T = undefined> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never }

// ---------------------------------------------------------------------------
// getAuthUser & getProfile
// ---------------------------------------------------------------------------

/**
 * Returns the currently authenticated Supabase user and profile.
 */
export async function getAuthUser(): Promise<
  ActionResult<{ id: string; email?: string; profile: Profile | null }>
> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: 'Not authenticated.' }
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle()

    return {
      success: true,
      data: {
        id: user.id,
        email: user.email,
        profile: profile || null,
      },
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch user.'
    return { success: false, error: message }
  }
}

/**
 * Returns a user's public profile by user ID.
 */
export async function getProfile(
  userId: string
): Promise<ActionResult<Profile>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !data) {
      return { success: false, error: error?.message || 'Profile not found.' }
    }

    return { success: true, data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to fetch profile.'
    return { success: false, error: message }
  }
}

// ---------------------------------------------------------------------------
// signUp
// ---------------------------------------------------------------------------

/**
 * Creates a new Supabase Auth user.
 * The auto-profile trigger in the DB will create the matching profiles row.
 */
export async function signUp(
  formData: FormData
): Promise<ActionResult<{ userId: string }>> {
  try {
    const supabase = await createClient()

    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')
    const first_name = String(formData.get('first_name') ?? '').trim()
    const last_name = String(formData.get('last_name') ?? '').trim()

    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { first_name, last_name },
      },
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (!data.user) {
      return { success: false, error: 'Sign-up failed: no user returned.' }
    }

    revalidatePath('/', 'layout')
    return { success: true, data: { userId: data.user.id } }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred during sign up.'
    return { success: false, error: message }
  }
}

// ---------------------------------------------------------------------------
// signIn
// ---------------------------------------------------------------------------

/**
 * Signs in an existing user with email + password.
 */
export async function signIn(
  formData: FormData
): Promise<ActionResult<{ userId: string }>> {
  try {
    const supabase = await createClient()

    const email = String(formData.get('email') ?? '').trim()
    const password = String(formData.get('password') ?? '')

    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return { success: false, error: error.message }
    }

    if (!data.user) {
      return { success: false, error: 'Sign-in failed: no user returned.' }
    }

    revalidatePath('/', 'layout')
    return { success: true, data: { userId: data.user.id } }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred during sign in.'
    return { success: false, error: message }
  }
}

// ---------------------------------------------------------------------------
// signOut
// ---------------------------------------------------------------------------

/** Clears the Supabase session cookies and redirects to the auth page. */
export async function signOut(): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const { error } = await supabase.auth.signOut()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/', 'layout')
    return { success: true, data: undefined }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An error occurred during sign out.'
    return { success: false, error: message }
  }
}

// ---------------------------------------------------------------------------
// updateProfile
// ---------------------------------------------------------------------------

/**
 * Updates the authenticated user's profile metadata in public.profiles.
 */
export async function updateProfile(
  formData: FormData
): Promise<ActionResult<Profile>> {
  try {
    const supabase = await createClient()

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return { success: false, error: 'Not authenticated.' }
    }

    const first_name = formData.has('first_name') ? (formData.get('first_name') as string) : undefined
    const last_name = formData.has('last_name') ? (formData.get('last_name') as string) : undefined
    const phone_number = formData.has('phone_number') ? (formData.get('phone_number') as string) : undefined
    const city = formData.has('city') ? (formData.get('city') as string) : undefined
    const country = formData.has('country') ? (formData.get('country') as string) : undefined
    const bio = formData.has('bio') ? (formData.get('bio') as string) : undefined
    const avatar_url = formData.has('avatar_url') ? (formData.get('avatar_url') as string) : undefined

    const updatePayload: ProfileUpdate = {}
    if (first_name !== undefined) updatePayload.first_name = first_name || null
    if (last_name !== undefined) updatePayload.last_name = last_name || null
    if (phone_number !== undefined) updatePayload.phone_number = phone_number || null
    if (city !== undefined) updatePayload.city = city || null
    if (country !== undefined) updatePayload.country = country || null
    if (bio !== undefined) updatePayload.bio = bio || null
    if (avatar_url !== undefined) updatePayload.avatar_url = avatar_url || null

    const { data, error } = await supabase
      .from('profiles')
      .update(updatePayload)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      return { success: false, error: error.message }
    }

    revalidatePath('/settings')
    return { success: true, data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update profile.'
    return { success: false, error: message }
  }
}
