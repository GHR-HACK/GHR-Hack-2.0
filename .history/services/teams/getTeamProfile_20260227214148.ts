import { getStoredToken } from '@/services/auth/loginWithCredentials';

export interface TeamProfile {
  id: string;
  name: string;
  leader_email: string;
  selected_ps: string | null;
  selected_at: string | null;
  github_repo?: string;
}

export const getTeamProfile = async (): Promise<TeamProfile> => {
  try {
    const token = getStoredToken();

    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    const response = await fetch('/api/team/profile', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch team profile: ${response.status}`);
    }

    const data = await response.json();
    return data.team;
  } catch (error) {
    console.error('❌ Error fetching team profile:', error);
    throw error;
  }
};
