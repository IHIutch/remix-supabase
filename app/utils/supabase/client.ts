import { createBrowserClient } from "@supabase/ssr";
import { SupabaseClient } from "@supabase/supabase-js";

export const createClient = ({
    supabaseUrl,
    supabaseKey
}: {
    supabaseUrl: SupabaseClient['supabaseUrl'],
    supabaseKey: SupabaseClient['supabaseKey']
}) => createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
);
