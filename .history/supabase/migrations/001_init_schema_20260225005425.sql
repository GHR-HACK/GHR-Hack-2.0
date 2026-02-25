-- Create Tables for Hackathon PS Selection System

-- 1. Teams Table
create table if not exists public.teams (
  team_id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  team_leader_name text not null,
  team_leader_email text not null unique,
  college text not null,
  created_at timestamptz default now()
);

-- 2. Problem Statements Table
create table if not exists public.problem_statements (
  id uuid primary key default gen_random_uuid(),
  domain text not null,
  title text not null,
  description text not null,
  expected_outcomes text[] default '{}',
  key_constraints text[] default '{}',
  created_at timestamptz default now()
);

-- 3. Team Selected PS Table (Junction Table)
create table if not exists public.team_selected_ps (
  id uuid primary key default gen_random_uuid(),
  team_id uuid not null unique references public.teams(team_id) on delete cascade,
  ps_id uuid not null references public.problem_statements(id) on delete cascade,
  created_at timestamptz default now()
);

-- Create indexes for faster queries
create index if not exists idx_teams_leader_email on public.teams(team_leader_email);
create index if not exists idx_team_selected_ps_team_id on public.team_selected_ps(team_id);
create index if not exists idx_team_selected_ps_ps_id on public.team_selected_ps(ps_id);

-- Enable RLS
alter table public.teams enable row level security;
alter table public.problem_statements enable row level security;
alter table public.team_selected_ps enable row level security;

-- RLS Policies for teams
create policy "Teams are viewable by authenticated users"
  on public.teams
  for select
  using (true);

-- RLS Policies for problem_statements
create policy "Problem statements are viewable by everyone"
  on public.problem_statements
  for select
  using (true);

-- RLS Policies for team_selected_ps
create policy "Team selections are viewable by authenticated users"
  on public.team_selected_ps
  for select
  using (true);

-- Function to enforce 3 team limit per PS
create or replace function public.enforce_ps_limit()
returns trigger
language plpgsql
as $$
declare
  team_count integer;
begin
  select count(*) into team_count
  from public.team_selected_ps
  where ps_id = new.ps_id;

  if team_count >= 3 then
    raise exception 'This problem statement has reached the maximum limit of 3 teams';
  end if;

  return new;
end;
$$;

-- Trigger to enforce PS limit
drop trigger if exists trg_ps_limit on public.team_selected_ps;
create trigger trg_ps_limit
before insert on public.team_selected_ps
for each row
execute procedure public.enforce_ps_limit();

-- Insert sample data
insert into public.problem_statements (domain, title, description, expected_outcomes, key_constraints)
values
  (
    'Artificial Intelligence & Computer Vision',
    'AI-Based Civil Drawing Analysis & Automated Construction Estimation System',
    'In the construction industry, extracting critical information from civil drawings (architectural, structural, and MEP plans) is a time-consuming and error-prone process. Engineers manually analyze drawings to estimate quantities, plan project phases, allocate resources, and define construction timelines. This often leads to delays, cost overruns, and inefficiencies due to inaccurate interpretation or missed details. Design an AI-powered system that can automatically analyze civil engineering drawings and extract key construction parameters such as dimensions, materials, structural components, and activity sequences. Based on these extracted insights, the system should generate: Quantity take-offs (materials and resources required), Cost estimation (optional but encouraged), Phase-wise construction breakdown, Automated project timeline and scheduling (Gantt-style output). The solution should assist engineers, contractors, and project managers in making faster and more accurate construction planning decisions.',
    array[
      'Automated extraction of key entities from 2D civil drawings (walls, columns, beams, slabs, dimensions, annotations)',
      'AI-driven quantity estimation and material calculation',
      'Intelligent construction activity sequencing',
      'Timeline generation with phase-wise duration estimation',
      'Visual dashboard for cost and schedule insights',
      'Exportable reports (PDF/Excel/Project format)'
    ],
    array[
      'Must handle both scanned and CAD-based drawings',
      'Should work without requiring highly specialized hardware',
      'Must account for variations in drawing standards and symbols',
      'Output estimations should be explainable and auditable',
      'Should minimize manual intervention in the estimation process'
    ]
  );
