import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export const getPSTeamCount = async (psId: string): Promise<number> => {
  const supabase = getSupabaseBrowserClient();

  const { count, error } = await supabase
    .from('team_selected_ps')
    .select('*', { count: 'exact', head: true })
    .eq('ps_id', psId);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
};
