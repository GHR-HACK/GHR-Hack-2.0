import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import { ProblemStatement } from '@/services/types/database';

export const getProblemStatements = async (): Promise<ProblemStatement[]> => {
  const supabase = getSupabaseBrowserClient();

  const { data, error } = await supabase
    .from('problem_statements')
    .select('*')
    .order('created_at', { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
};
