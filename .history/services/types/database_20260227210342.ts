export type Team = {
  id: string;
  name: string;
  leader_email: string;
  selected_ps?: string;
  selected_at?: string;
  github_repo?: string;
  created_at?: string;
  updated_at?: string;
};

export type ProblemStatement = {
  id: string;
  domain: string;
  title: string;
  description: string;
  expected_outcomes: string[];
  key_constraints: string[];
  created_at: string;
};

export type TeamSelectedPS = {
  id: string;
  team_id: string;
  ps_id: string;
  created_at: string;
};
