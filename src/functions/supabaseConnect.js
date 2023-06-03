
import { createClient } from "@supabase/supabase-js"
export const supabase = createClient(import.meta.env.VITE_supabaseURL, import.meta.env.VITE_supabaseToken);


