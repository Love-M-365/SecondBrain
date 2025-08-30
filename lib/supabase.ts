import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: Platform.select({
      web: undefined, // Use default localStorage on web
      default: undefined, // Use default SecureStore on native
    }),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});