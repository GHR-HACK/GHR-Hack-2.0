-- Create Tables for Hackathon PS Selection System

-- 1. Teams Table
create table if not exists public.teams (
  team_id uuid primary key default gen_random_uuid(),
  team_leader_email text not null unique,
  college text not null,
  created_at timestamptz default now()
);

-- 2. Problem Statements Table
create table if not exists public.problem_statements (
  id uuid primary key default gen_random_uuid(),
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

-- Function to enforce 2 team limit per PS
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

  if team_count >= 2 then
    raise exception 'This problem statement has reached the maximum limit of 2 teams';
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

-- Insert sample data (optional for testing)
insert into public.problem_statements (title, description, expected_outcomes, key_constraints)
values
  (
    'AR-Based Interactive "X-Ray" Learning System for Engineering Education',
    'Engineering education often relies on static diagrams and theoretical explanations that fail to convey the internal structure and working of complex systems such as engines, circuit boards, or industrial machinery. Design an Augmented Reality (AR) application that allows users to point a mobile device at a physical object (e.g., a car engine, motherboard, or mechanical assembly) and view an overlaid interactive 3D exploded model.',
    array[
      'Real-time AR overlay of internal components',
      'Interactive exploded 3D models with component-level information',
      'Guided repair or learning instructions',
      'Enhanced conceptual understanding of complex systems'
    ],
    array[
      'The solution must function on consumer-grade mobile devices',
      'AR overlays should align accurately with real-world objects'
    ]
  ),
  (
    'Smart Campus Energy Optimization',
    'Use machine learning to predict energy usage and optimize campus utilities. Build a system that monitors consumption patterns and recommends efficiency improvements.',
    array[
      'Forecasting energy usage',
      'Anomaly detection',
      'Real-time dashboard'
    ],
    array[
      'Must integrate with existing campus infrastructure',
      'Low latency predictions required'
    ]
  );
