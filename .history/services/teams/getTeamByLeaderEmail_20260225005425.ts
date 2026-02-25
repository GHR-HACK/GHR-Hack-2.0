import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { TeamRecord } from '../problem-statements/types';

export const getTeamByLeaderEmail = async (email: string): Promise<TeamRecord | null> => {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('leader_email', email)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(error.message);
  }

  return data;
};
