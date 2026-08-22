'use server'

import { revalidatePath } from 'next/cache'
import { cookies } from 'next/headers'
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
  ActionResult<{ id: string; email?: string; profile: Profile | null; isGuest?: boolean }>
> {
  try {
    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    const cookieStore = await cookies()
    const isGuestCookie = cookieStore.get('gt_guest_mode')?.value === 'true'

    if (user) {
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
          isGuest: isGuestCookie || user.email === 'guest.explorer@globetrotter.travel',
        },
      }
    }

    if (isGuestCookie) {
      return {
        success: true,
        data: {
          id: 'demo-guest-user',
          email: 'guest@globetrotter.travel',
          profile: {
            id: 'demo-guest-user',
            first_name: 'Guest',
            last_name: 'Explorer',
            phone_number: null,
            city: 'Global',
            country: 'Earth',
            bio: 'Demo Guest Explorer exploring the world with GlobeTrotter.',
            avatar_url: null,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          isGuest: true,
        },
      }
    }

    return { success: false, error: 'Not authenticated.' }
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
 * Creates a new Supabase Auth user with automatic fallback login and resilient rate-limit recovery.
 */
export async function signUp(
  formData: FormData
): Promise<ActionResult<{ userId: string }>> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('gt_guest_mode')

    const supabase = await createClient()

    const rawEmail = String(formData.get('email') ?? '').trim()
    const email = rawEmail.toLowerCase()
    const password = String(formData.get('password') ?? '')
    const first_name = String(formData.get('first_name') ?? '').trim()
    const last_name = String(formData.get('last_name') ?? '').trim()

    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Please enter a valid email address.' }
    }

    if (password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long.' }
    }

    // Attempt Supabase sign up
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          first_name: first_name || undefined,
          last_name: last_name || undefined,
        },
      },
    })

    if (error) {
      const lowerErr = error.message.toLowerCase()

      // If user was already created, or if email confirmation rate limit is hit,
      // attempt direct sign-in with the provided credentials
      if (
        lowerErr.includes('rate limit') ||
        lowerErr.includes('already registered') ||
        lowerErr.includes('already exists') ||
        lowerErr.includes('user already')
      ) {
        const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (signInData?.user && !signInErr) {
          revalidatePath('/', 'layout')
          return { success: true, data: { userId: signInData.user.id } }
        }
      }

      if (lowerErr.includes('rate limit')) {
        return {
          success: false,
          error: 'Supabase email rate limit reached. Please sign in directly with your password, or use "Continue as Demo Guest Explorer".',
        }
      }

      if (lowerErr.includes('invalid') && lowerErr.includes('email')) {
        return {
          success: false,
          error: 'Email format rejected by mail service. Please try a standard email or use Demo Guest Explorer.',
        }
      }

      return { success: false, error: error.message }
    }

    if (!data.user) {
      return { success: false, error: 'Sign-up failed: no user account returned.' }
    }

    // Handle case where user already exists (identities array is empty in Supabase)
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (signInData?.user && !signInErr) {
        revalidatePath('/', 'layout')
        return { success: true, data: { userId: signInData.user.id } }
      }

      return {
        success: false,
        error: 'An account with this email already exists. Please switch to the Sign In tab.',
      }
    }

    // Auto-login to obtain a valid session cookie immediately
    if (!data.session) {
      const { data: autoLogin } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (autoLogin?.user) {
        revalidatePath('/', 'layout')
        return { success: true, data: { userId: autoLogin.user.id } }
      }
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
    const cookieStore = await cookies()
    cookieStore.delete('gt_guest_mode')

    const supabase = await createClient()

    const rawEmail = String(formData.get('email') ?? '').trim()
    const email = rawEmail.toLowerCase()
    const password = String(formData.get('password') ?? '')

    if (!email || !password) {
      return { success: false, error: 'Email and password are required.' }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return { success: false, error: 'Please enter a valid email address.' }
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      const lowerErr = error.message.toLowerCase()
      if (lowerErr.includes('invalid login credentials') || lowerErr.includes('invalid_grant')) {
        return { success: false, error: 'Invalid email or password. Please check your credentials.' }
      }
      if (lowerErr.includes('email not confirmed')) {
        return { success: false, error: 'Email not yet confirmed. Please check your inbox or continue as Demo Guest Explorer.' }
      }
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
// signInAsGuest
// ---------------------------------------------------------------------------

/**
 * Signs in as a Demo Guest Explorer. Sets guest cookie and connects Supabase demo session.
 */
export async function signInAsGuest(): Promise<ActionResult<{ userId: string }>> {
  try {
    const cookieStore = await cookies()
    cookieStore.set('gt_guest_mode', 'true', {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      sameSite: 'lax',
      httpOnly: true,
    })

    const supabase = await createClient()
    const guestEmail = 'guest.explorer@globetrotter.travel'
    const guestPassword = 'DemoGuest123456!'
    let userId = 'demo-guest-user'

    // Attempt sign in
    const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
      email: guestEmail,
      password: guestPassword,
    })

    if (signInData?.user) {
      userId = signInData.user.id
    } else if (signInError) {
      // If demo account doesn't exist in Supabase Auth, auto-create it
      const { data: signUpData } = await supabase.auth.signUp({
        email: guestEmail,
        password: guestPassword,
        options: {
          data: {
            first_name: 'Guest',
            last_name: 'Explorer',
          },
        },
      })

      if (signUpData?.user) {
        userId = signUpData.user.id
      }
    }

    revalidatePath('/', 'layout')
    return {
      success: true,
      data: { userId },
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Could not initialize guest session.'
    return { success: false, error: message }
  }
}

// ---------------------------------------------------------------------------
// signOut
// ---------------------------------------------------------------------------

/** Clears the Supabase session cookies and redirects to the auth page. */
export async function signOut(): Promise<ActionResult> {
  try {
    const cookieStore = await cookies()
    cookieStore.delete('gt_guest_mode')

    const supabase = await createClient()
    await supabase.auth.signOut()

    revalidatePath('/', 'layout')
    return { success: true, data: undefined }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An error occurred during sign out.'
    return { success: false, error: message }
  }
}

// ---------------------------------------------------------------------------
// resetPasswordForEmail
// ---------------------------------------------------------------------------

/** Sends a password reset email via Supabase Auth */
export async function resetPasswordForEmail(
  email: string
): Promise<ActionResult> {
  try {
    const supabase = await createClient()
    const normalizedEmail = email.trim().toLowerCase()

    if (!normalizedEmail) {
      return { success: false, error: 'Email address is required.' }
    }

    const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail)

    if (error) {
      return { success: false, error: error.message }
    }

    return { success: true, data: undefined }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to send password reset email.'
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
    revalidatePath('/', 'layout')
    return { success: true, data }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Failed to update profile.'
    return { success: false, error: message }
  }
}
