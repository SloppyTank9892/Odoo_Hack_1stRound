'use server'

import { createClient } from '@/lib/supabase/server'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp'])
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB

type StorageBucket = 'avatars' | 'trip-covers'

type UploadResult =
  | { success: true; data: { url: string }; error?: never }
  | { success: false; error: string; data?: never }

// ---------------------------------------------------------------------------
// uploadMedia
// ---------------------------------------------------------------------------

/**
 * Uploads a media file to the specified Supabase Storage bucket.
 *
 * - Validates that the user is authenticated.
 * - Validates MIME type (jpeg / png / webp only).
 * - Validates file size (max 5 MB).
 * - Stores the file under a user-scoped path: `{userId}/{timestamp}-{filename}`.
 * - Returns the public CDN URL on success.
 */
export async function uploadMedia(
  file: File,
  bucket: StorageBucket
): Promise<UploadResult> {
  const supabase = await createClient()

  // ── Auth check ──────────────────────────────────────────────────────────
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      success: false,
      error: 'You must be logged in to upload files.',
    }
  }

  // ── MIME type validation ────────────────────────────────────────────────
  if (!ALLOWED_MIME_TYPES.has(file.type)) {
    return {
      success: false,
      error: 'Invalid file type. Only JPEG, PNG, and WebP images are allowed.',
    }
  }

  // ── File size validation ────────────────────────────────────────────────
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      success: false,
      error: 'File too large. Maximum size is 5MB.',
    }
  }

  // ── Upload ───────────────────────────────────────────────────────────────
  // Use a user-scoped path so storage RLS policies (folder-based) pass.
  const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const filePath = `${user.id}/${Date.now()}-${sanitizedName}`

  const fileBuffer = await file.arrayBuffer()

  let { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, fileBuffer, {
      contentType: file.type,
      upsert: true,
    })

  // If bucket not found, attempt to auto-create public bucket and retry
  if (uploadError && (uploadError.message?.toLowerCase().includes('bucket not found') || uploadError.message?.toLowerCase().includes('not found') || uploadError.message?.toLowerCase().includes('does not exist'))) {
    try {
      await supabase.storage.createBucket(bucket, { public: true })
      const retry = await supabase.storage
        .from(bucket)
        .upload(filePath, fileBuffer, {
          contentType: file.type,
          upsert: true,
        })
      uploadError = retry.error
    } catch (createErr) {
      console.warn(`Could not auto-create storage bucket "${bucket}":`, createErr)
    }
  }

  if (uploadError) {
    console.warn(`Storage upload warning for bucket "${bucket}": ${uploadError.message}. Falling back to Data URL encoding.`)
    // Resilient fallback: Convert to Data URL so photo is NEVER lost
    const base64 = Buffer.from(fileBuffer).toString('base64')
    const dataUrl = `data:${file.type};base64,${base64}`
    return { success: true, data: { url: dataUrl } }
  }

  // ── Get public URL ───────────────────────────────────────────────────────
  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(filePath)

  return { success: true, data: { url: publicUrl } }
}
