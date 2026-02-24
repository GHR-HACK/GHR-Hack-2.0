export type Team = {
  team_id: string;
  team_leader_email: string;
  college: string;
  created_at: string;
};

export type ProblemStatement = {
  id: string;
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
