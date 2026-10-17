'use strict';

const SUPABASE_URL = 'https://tqowyynuyejmdclomyzh.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_xAJevhtZFGAlW_129Q3YIA_fFqc4dzi';

if (!window.supabase?.createClient) {
  throw new Error('Supabase SDK failed to load.');
}

window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    autoRefreshToken: true,
    detectSessionInUrl: true,
    persistSession: true,
  },
});
