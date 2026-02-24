import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { TeamSelectedPS } from '@/services/types/database';

export const getTeamSelection = async (teamId: string): Promise<TeamSelectedPS | null> => {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from('team_selected_ps')
    .select('*')
    .eq('team_id', teamId)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(error.message);
  }

  return data;
};
