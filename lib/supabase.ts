import { createClient } from "@supabase/supabase-js";
import { env } from "./env";

const isServer = typeof window === "undefined";

// Service role client used on backend API routes for full query capabilities and RLS bypass where necessary
export const supabase = isServer && env.SUPABASE_URL && env.SUPABASE_SERVICE_ROLE_KEY
  ? createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    })
  : (null as any);

// Anonymous client for browser/client-side subscriptions
const url = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_SUPABASE_URL || env.SUPABASE_URL) : env.SUPABASE_URL;
const anonKey = typeof window !== "undefined" ? (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || env.SUPABASE_ANON_KEY) : env.SUPABASE_ANON_KEY;

export const supabaseAnon = url && anonKey
  ? createClient(url, anonKey)
  : (null as any);
