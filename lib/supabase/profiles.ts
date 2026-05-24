import type { User } from '@supabase/supabase-js'
import { getSupabaseBrowserClient } from './client'

export type AppUserProfile = {
  id: string
  email: string | null
  full_name: string | null
  avatar_url: string | null
  provider: string | null
  last_sign_in_at: string | null
  updated_at: string
}

function pickName(user: User): string | null {
  const metadata = user.user_metadata || {}
  return metadata.full_name || metadata.name || metadata.display_name || null
}

function pickAvatar(user: User): string | null {
  const metadata = user.user_metadata || {}
  return metadata.avatar_url || metadata.picture || metadata.avatar || metadata.image || null
}

export async function upsertUserProfile(user: User): Promise<boolean> {
  const supabase = getSupabaseBrowserClient()
  if (!supabase) {
    return false
  }
  const provider = user.app_metadata?.provider || user.identities?.[0]?.provider || null

  const profile: AppUserProfile = {
    id: user.id,
    email: user.email || null,
    full_name: pickName(user),
    avatar_url: pickAvatar(user),
    provider,
    last_sign_in_at: user.last_sign_in_at || user.created_at || null,
    updated_at: new Date().toISOString()
  }

  const profilesTable = supabase.from('profiles') as any
  const { error } = await profilesTable.upsert(profile, { onConflict: 'id' })

  if (error) {
    console.warn('Failed to upsert user profile:', {
      message: error?.message || 'Unknown Supabase error',
      code: error?.code || null,
      details: error?.details || null,
      hint: error?.hint || null,
    })
    return false
  }

  return true
}
