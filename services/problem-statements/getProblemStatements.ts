import { ProblemStatement } from '@/services/types/database';

export const getProblemStatements = async (): Promise<ProblemStatement[]> => {
  try {
    console.log('📋 Fetching problem statements...');

    const response = await fetch('/api/problem-statements', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store', // Always fetch fresh data
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch problem statements: ${response.status}`);
    }

    const result = await response.json();
    console.log(`✅ Fetched ${result.data?.length || 0} problem statements`);

    return result.data ?? [];
  } catch (error) {
    console.error('❌ Error fetching problem statements:', error);
    throw error;
  }
};
