import { getSupabaseBrowserClient } from '@/lib/supabase/client';

export const updateTeamGitHubRepo = async (teamId: string, githubRepo: string) => {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from('teams')
    .update({
      github_repo: githubRepo,
      updated_at: new Date().toISOString(),
    })
    .eq('team_id', teamId)
    .select('*')
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
