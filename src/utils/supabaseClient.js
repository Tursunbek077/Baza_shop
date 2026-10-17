import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://mbnihjnusnctnwrfmfzw.supabase.co';
const supabaseAnonKey = 'sb_publishable_hQponPfgU2RSnpTL3TdLwg_p40uzFtF';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
