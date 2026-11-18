-- Roamio Demo Schema
-- Run this in Supabase SQL Editor

-- Trips table
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  title text not null,
  destination text not null,
  start_date date not null,
  end_date date not null,
  budget_inr integer,
  travelers jsonb not null default '{"adults": 1, "children": 0}'::jsonb,
  interests text[] default '{}',
  pace text check (pace in ('relaxed', 'moderate', 'packed')) default 'moderate',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Itineraries table (one per day per trip)
create table if not exists public.itineraries (
  id uuid primary key default gen_random_uuid(),
  trip_id uuid references public.trips(id) on delete cascade not null,
  day_number integer not null,
  date date not null,
  activities jsonb not null default '[]'::jsonb,
  transport jsonb default '[]'::jsonb,
  notes text,
  created_at timestamptz default now(),
  unique (trip_id, day_number)
);

-- Indexes
create index if not exists idx_trips_user_id on public.trips(user_id);
create index if not exists idx_itineraries_trip_id on public.itineraries(trip_id);

-- RLS Policies
alter table public.trips enable row level security;
alter table public.itineraries enable row level security;

-- Users can only see their own trips
create policy "Users can view own trips" on public.trips
  for select using (auth.uid() = user_id);

create policy "Users can insert own trips" on public.trips
  for insert with check (auth.uid() = user_id);

create policy "Users can update own trips" on public.trips
  for update using (auth.uid() = user_id);

create policy "Users can delete own trips" on public.trips
  for delete using (auth.uid() = user_id);

-- Users can only see itineraries for their trips
create policy "Users can view own itineraries" on public.itineraries
  for select using (
    exists (
      select 1 from public.trips t
      where t.id = itineraries.trip_id
      and t.user_id = auth.uid()
    )
  );

create policy "Users can insert own itineraries" on public.itineraries
  for insert with check (
    exists (
      select 1 from public.trips t
      where t.id = itineraries.trip_id
      and t.user_id = auth.uid()
    )
  );

create policy "Users can update own itineraries" on public.itineraries
  for update using (
    exists (
      select 1 from public.trips t
      where t.id = itineraries.trip_id
      and t.user_id = auth.uid()
    )
  );

create policy "Users can delete own itineraries" on public.itineraries
  for delete using (
    exists (
      select 1 from public.trips t
      where t.id = itineraries.trip_id
      and t.user_id = auth.uid()
    )
  );

-- Updated at trigger
create or replace function public.handle_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists trips_updated_at on public.trips;
create trigger trips_updated_at
  before update on public.trips
  for each row execute function public.handle_updated_at();