import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase URL or Key is missing from environment variables (.env)')
}

export const supabase = createClient(supabaseUrl || '', supabaseKey || '', {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
})

// Owner credentials for exclusive access verification
export const OWNER_UID = 'ee68b45b-f854-4fcc-9af6-f9e7a707afb5'
export const OWNER_EMAIL = 'teerapat.choet@gmail.com'

export const isOwner = (user) => {
  if (!user) return false
  return user.id === OWNER_UID || user.email?.toLowerCase() === OWNER_EMAIL.toLowerCase()
}
