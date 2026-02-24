import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export const loginWithEmailPassword = async (email: string, password: string) => {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
