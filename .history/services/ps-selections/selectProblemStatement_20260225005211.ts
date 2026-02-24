import { getStoredToken } from '@/services/auth/loginWithCredentials';

export interface PSSelectionResponse {
  success: boolean;
  message: string;
  team: {
    id: string;
    name: string;
    selected_ps: string;
    selected_at: string;
  };
  selection_count: number;
}

export const selectProblemStatement = async (psId: string): Promise<PSSelectionResponse> => {
  try {
    const token = getStoredToken();

    if (!token) {
      throw new Error('Authentication token not found. Please login again.');
    }

    console.log('🎯 Selecting PS:', psId);

    const response = await fetch('/api/ps-selection/select', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ ps_id: psId }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('❌ PS Selection failed:', data);
      throw new Error(data.error || `Selection failed with status ${response.status}`);
    }

    console.log('✅ PS Selected successfully!', data);
    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('🔥 PS Selection Exception:', errorMsg);
    throw error;
  }
};
