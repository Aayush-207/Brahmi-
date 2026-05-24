import { createClient } from '@supabase/supabase-js'

const FALLBACK_SUPABASE_URL = 'https://ggmmxqqlxsazygmikwjp.supabase.co'
const FALLBACK_SUPABASE_KEY = 'sb_publishable_sZZDsHHzBoJdX08-vlg2NQ_x7kkWBXV'

const supabaseUrlValue = process.env.NEXT_PUBLIC_SUPABASE_URL || FALLBACK_SUPABASE_URL
const supabaseKeyValue = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || FALLBACK_SUPABASE_KEY

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
