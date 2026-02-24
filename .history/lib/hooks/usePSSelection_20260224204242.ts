'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { TeamSelectedPS } from '@/services/types/database';

export const useTeamSelection = (teamId: string | undefined) => {
  return useQuery({
    queryKey: ['team-selection', teamId],
    queryFn: async () => {
      if (!teamId) return null;
      const { getTeamSelection } = await import('@/services/ps-selections/getTeamSelection');
      return getTeamSelection(teamId);
    },
    enabled: !!teamId,
  });
};

export const useCreateSelection = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ teamId, psId }: { teamId: string; psId: string }) => {
      const { selectProblemStatement } = await import('@/services/ps-selections/selectProblemStatement');
      return selectProblemStatement(teamId, psId);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['team-selection'] });
      queryClient.invalidateQueries({ queryKey: ['psTeamCounts'] });
    },
  });
};

export const usePSSelectionCount = (psId: string | undefined) => {
  return useQuery({
    queryKey: ['ps-count', psId],
    queryFn: async () => {
      if (!psId) return 0;
      const { getPSTeamCount } = await import('@/services/ps-selections/getPSTeamCount');
      return getPSTeamCount(psId);
    },
    enabled: !!psId,
  });
};
