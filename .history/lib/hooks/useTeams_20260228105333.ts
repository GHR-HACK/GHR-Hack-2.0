import { useQuery } from '@tanstack/react-query';

interface Team {
  id: string;
  team_name: string;
  team_leader_name: string;
  leader_email: string;
  selected_ps: string | null;
  selected_ps_title: string;
  selected_ps_domain: string | null;
  github_repo?: string;
  created_at: Date;
}

interface TeamsResponse {
  success: boolean;
  count: number;
  data: Team[];
  ps_statistics: Array<{
    title: string;
    domain: string;
    count: number;
  }>;
}

async function fetchTeams(): Promise<TeamsResponse> {
  const response = await fetch('/api/admin/teams');
  
  if (!response.ok) {
    throw new Error('Failed to fetch teams');
  }
  
  return response.json();
}

export function useTeams() {
  return useQuery({
    queryKey: ['admin-teams'],
    queryFn: fetchTeams,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });
}
