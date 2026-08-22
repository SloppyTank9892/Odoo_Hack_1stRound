'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Database, Profile } from '@/types/database'

type ProfileUpdate = Database['public']['Tables']['profiles']['Update']

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type ActionResult<T = undefined> =
  | { success: true; data: T; error?: never }
  | { success: false; error: string; data?: never }

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
  const supabase = await createClient()

  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const first_name = String(formData.get('first_name') ?? '')
  const last_name = String(formData.get('last_name') ?? '')

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
  redirect('/dashboard')
}

// ---------------------------------------------------------------------------
// signIn
// ---------------------------------------------------------------------------

/**
 * Signs in an existing user with email + password.
 * Respects an optional ?redirect= query param for post-login navigation.
 */
export async function signIn(
  formData: FormData
): Promise<ActionResult<{ userId: string }>> {
  const supabase = await createClient()

  const email = String(formData.get('email') ?? '')
  const password = String(formData.get('password') ?? '')
  const redirectTo = String(formData.get('redirect') ?? '/dashboard')

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
  redirect(redirectTo)
}

// ---------------------------------------------------------------------------
// signOut
// ---------------------------------------------------------------------------

/** Clears the Supabase session cookies and redirects to the auth page. */
export async function signOut(): Promise<ActionResult> {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/auth')
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
  const supabase = await createClient()

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { success: false, error: 'Not authenticated.' }
  }

  const { data, error } = await supabase
    .from('profiles')
    .update({
      first_name: (formData.get('first_name') as string | null) || null,
      last_name: (formData.get('last_name') as string | null) || null,
      phone_number: (formData.get('phone_number') as string | null) || null,
      city: (formData.get('city') as string | null) || null,
      country: (formData.get('country') as string | null) || null,
      bio: (formData.get('bio') as string | null) || null,
      avatar_url: (formData.get('avatar_url') as string | null) || null,
    } as ProfileUpdate)
    .eq('id', user.id)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  revalidatePath('/settings')
  return { success: true, data }
}
