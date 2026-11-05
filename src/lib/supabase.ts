import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const isSupabaseConfigured = Boolean(url && anonKey)

// Placeholders keep the app rendering when keys are missing, so the UI can explain what to do.
// `||` rather than `??` so empty strings from a blank .env also fall back.
export const supabase = createClient(url || 'http://localhost', anonKey || 'missing-key')
