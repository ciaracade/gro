-- gro! database schema

-- users table (extends supabase auth.users)
create table public.users (
  id uuid references auth.users(id) primary key,
  name text not null,
  email text,
  phone text,
  zip_code text,
  avatar_url text,
  points integer default 0,
  pickups integer default 0,
  lbs_saved numeric(10,2) default 0,
  high_contrast boolean default false,
  created_at timestamptz default now()
);

alter table public.users enable row level security;
create policy "users can read own profile" on public.users for select using (auth.uid() = id);
create policy "users can update own profile" on public.users for update using (auth.uid() = id);
create policy "users can insert own profile" on public.users for insert with check (auth.uid() = id);

-- listings table
create table public.listings (
  id uuid default gen_random_uuid() primary key,
  poster_id uuid references public.users(id) not null,
  title text not null,
  description text,
  photo_url text,
  food_type text not null check (food_type in ('produce', 'baked', 'prepared', 'packaged', 'dairy', 'meals', 'beverages', 'snacks')),
  location_name text not null,
  location_lat double precision,
  location_lng double precision,
  accessibility_tags text[] default '{}',
  available_from timestamptz not null,
  available_until timestamptz not null,
  status text default 'available' check (status in ('available', 'reserved', 'completed', 'expired')),
  created_at timestamptz default now()
);

alter table public.listings enable row level security;
create policy "anyone can read available listings" on public.listings for select using (true);
create policy "users can insert own listings" on public.listings for insert with check (auth.uid() = poster_id);
create policy "users can update own listings" on public.listings for update using (auth.uid() = poster_id);

-- pickup requests
create table public.pickup_requests (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references public.listings(id) not null,
  requester_id uuid references public.users(id) not null,
  pickup_time timestamptz,
  status text default 'pending' check (status in ('pending', 'confirmed', 'completed', 'cancelled')),
  created_at timestamptz default now()
);

alter table public.pickup_requests enable row level security;
create policy "users can read own requests" on public.pickup_requests for select using (auth.uid() = requester_id);
create policy "posters can read requests for their listings" on public.pickup_requests for select using (
  exists (select 1 from public.listings where id = listing_id and poster_id = auth.uid())
);
create policy "users can create requests" on public.pickup_requests for insert with check (auth.uid() = requester_id);
create policy "involved users can update requests" on public.pickup_requests for update using (
  auth.uid() = requester_id or
  exists (select 1 from public.listings where id = listing_id and poster_id = auth.uid())
);

-- swaps (completed exchanges)
create table public.swaps (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references public.listings(id) not null,
  poster_id uuid references public.users(id) not null,
  picker_id uuid references public.users(id) not null,
  points_awarded integer default 10,
  rating integer check (rating between 1 and 5),
  completed_at timestamptz default now()
);

alter table public.swaps enable row level security;
create policy "involved users can read swaps" on public.swaps for select using (auth.uid() = poster_id or auth.uid() = picker_id);
create policy "system can insert swaps" on public.swaps for insert with check (auth.uid() = picker_id);

-- reputation scores
create table public.reputation_scores (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.users(id) not null,
  total_swaps integer default 0,
  successful_swaps integer default 0,
  trust_score numeric(5,4) default 1.0,
  updated_at timestamptz default now()
);

alter table public.reputation_scores enable row level security;
create policy "anyone can read reputation" on public.reputation_scores for select using (true);

-- function to update points after swap completion
create or replace function update_points_on_swap()
returns trigger as $$
begin
  update public.users set
    points = points + new.points_awarded,
    pickups = pickups + 1
  where id = new.picker_id;

  update public.users set
    points = points + new.points_awarded
  where id = new.poster_id;

  return new;
end;
$$ language plpgsql security definer;

create trigger on_swap_completed
  after insert on public.swaps
  for each row execute function update_points_on_swap();
