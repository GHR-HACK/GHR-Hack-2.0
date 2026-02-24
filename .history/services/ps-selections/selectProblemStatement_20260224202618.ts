import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export const selectProblemStatement = async (teamId: string, psId: string) => {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from('team_selected_ps')
    .insert({
      team_id: teamId,
      ps_id: psId,
    })
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
