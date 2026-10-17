import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://mbnihjnusnctnwrfmfzw.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'sb_publishable_hQponPfgU2RSnpTL3TdLwg_p40uzFtF';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
