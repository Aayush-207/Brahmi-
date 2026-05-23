import { createClient } from '@supabase/supabase-js'

const supabaseUrlValue = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKeyValue = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrlValue) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
}

if (!supabaseKeyValue) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY')
}

const supabaseUrl: string = supabaseUrlValue
const supabaseKey: string = supabaseKeyValue

let browserClient: ReturnType<typeof createClient> | null = null

export function getSupabaseBrowserClient() {
  if (!browserClient) {
    browserClient = createClient(supabaseUrl, supabaseKey)
  }

  return browserClient
}
