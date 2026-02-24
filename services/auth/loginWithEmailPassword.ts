import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export const loginWithEmailPassword = async (email: string, password: string) => {
  try {
    const supabase = getSupabaseBrowserClient();
    
    console.log('🔐 Attempting login with email:', email);
    console.log('📍 Supabase URL:', process.env.NEXT_PUBLIC_SUPABASE_URL);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error('❌ Supabase Auth Error:', error);
      throw new Error(`Auth Error: ${error.message || error.status || 'Unknown error'}`);
    }

    console.log('✅ Login successful!');
    return data;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('🔥 Login Exception:', errorMsg);
    
    // Check for specific network errors
    if (errorMsg.includes('ERR_CONNECTION') || errorMsg.includes('Failed to fetch')) {
      throw new Error(
        'Cannot connect to Supabase. Check: 1) Is your Supabase project active? 2) Is your internet working? 3) Check browser console for details.'
      );
    }
    throw err;
  }
};
