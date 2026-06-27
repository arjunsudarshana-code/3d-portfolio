import { createClient } from '@supabase/supabase-js';

// 🌟 ඔයාගේ සජීවී Supabase Credentials දෙක මෙන්න මචන්
const supabaseUrl = 'https://dfmtdhiymqqxezpmseon.supabase.co';
const supabaseAnonKey = 'sb_publishable_MsCoujMJdUHp5qQA3LYoHA_vPX3hKUv';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);