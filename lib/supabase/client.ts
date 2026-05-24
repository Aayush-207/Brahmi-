import { createClient } from '@supabase/supabase-js'

const supabaseUrlValue = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKeyValue = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

let browserClient: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowserClient() {
  if (!supabaseUrlValue || !supabaseKeyValue) {
    return null
  }

  if (!browserClient) {
    browserClient = createClient(supabaseUrlValue, supabaseKeyValue)
  }

  return browserClient
}
