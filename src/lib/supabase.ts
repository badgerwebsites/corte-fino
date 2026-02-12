import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create client with placeholder values if not configured yet
// This allows the app to load without errors during initial setup
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder_key'
);

// Helper to check if Supabase is properly configured
export const isSupabaseConfigured = () => {
  return supabaseUrl &&
         supabaseAnonKey &&
         !supabaseUrl.includes('placeholder') &&
         !supabaseAnonKey.includes('placeholder');
};

console.log("PROD URL:", import.meta.env.VITE_SUPABASE_URL);
