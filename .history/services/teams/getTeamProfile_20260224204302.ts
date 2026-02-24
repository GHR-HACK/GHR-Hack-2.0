import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { Team } from '@/services/types/database';

export const getTeamProfile = async (userId: string): Promise<Team | null> => {
  const supabase = getSupabaseBrowserClient();

  // Note: Teams table has user_id reference to auth.users.id
  // For now, this assumes teams table has a user_id column
  // If not, we'll need to query differently
  const { data, error } = await supabase
    .from('teams')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(error.message);
  }

  return data;
};
