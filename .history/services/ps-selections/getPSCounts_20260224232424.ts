export interface PSCountsResponse {
  success: boolean;
  counts: Record<string, number>; // { "ps_id": team_count, ... }
}

export const getPSCounts = async (): Promise<Record<string, number>> => {
  try {
    console.log('📊 Fetching PS selection counts...');

    const response = await fetch('/api/ps-selection/counts', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch counts: ${response.status}`);
    }

    const data: PSCountsResponse = await response.json();

    console.log('✅ PS counts fetched:', data.counts);
    return data.counts;
  } catch (error) {
    console.error('❌ Error fetching PS counts:', error);
    // Return empty object on error so UI still renders
    return {};
  }
};
