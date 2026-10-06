-- ====================================================================
-- СХЕМА БАЗЫ ДАННЫХ «МОЙ ГОД» (SUPABASE POSTGRESQL + RLS + STORAGE)
-- ====================================================================

-- 1. Profiles (Пользователи / Родители)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  phone text,
  full_name text,
  telegram_user_id text unique,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.profiles enable row level security;

create policy "Users can view own profile" 
  on public.profiles for select 
  using (auth.uid() = id);

create policy "Users can update own profile" 
  on public.profiles for update 
  using (auth.uid() = id);

-- 2. Children (Дети)
create table if not exists public.children (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  birth_date date not null,
  gender text check (gender in ('boy', 'girl')),
  is_primary boolean default false not null,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.children enable row level security;

create policy "Users can view their own children" 
  on public.children for select 
  using (auth.uid() = user_id);

create policy "Users can insert their own children" 
  on public.children for insert 
  with check (auth.uid() = user_id);

create policy "Users can update their own children" 
  on public.children for update 
  using (auth.uid() = user_id);

create policy "Users can delete their own children" 
  on public.children for delete 
  using (auth.uid() = user_id);

-- 3. Child Photos (Приватные фотографии детей)
create table if not exists public.child_photos (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  child_id uuid references public.children(id) on delete cascade not null,
  storage_path text not null,
  file_name text not null,
  file_size integer not null,
  mime_type text not null check (mime_type in ('image/jpeg', 'image/png', 'image/webp', 'image/heic')),
  is_main_face boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.child_photos enable row level security;

create policy "Users can view photos of their children" 
  on public.child_photos for select 
  using (auth.uid() = user_id);

create policy "Users can upload photos of their children" 
  on public.child_photos for insert 
  with check (auth.uid() = user_id);

create policy "Users can delete photos of their children" 
  on public.child_photos for delete 
  using (auth.uid() = user_id);

-- 4. Calendars (Календари)
create table if not exists public.calendars (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  year integer not null,
  style_id text not null,
  mood text not null,
  together_mode boolean default false not null,
  orientation text check (orientation in ('portrait', 'landscape')) default 'portrait' not null,
  page_format text check (page_format in ('A4', 'A3', 'square')) default 'A4' not null,
  binding_type text check (binding_type in ('wall', 'desk_flip')) default 'wall' not null,
  status text check (status in ('draft', 'generated', 'completed')) default 'draft' not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.calendars enable row level security;

create policy "Users can view their own calendars" 
  on public.calendars for select 
  using (auth.uid() = user_id);

create policy "Users can insert their own calendars" 
  on public.calendars for insert 
  with check (auth.uid() = user_id);

create policy "Users can update their own calendars" 
  on public.calendars for update 
  using (auth.uid() = user_id);

create policy "Users can delete their own calendars" 
  on public.calendars for delete 
  using (auth.uid() = user_id);

-- 5. Calendar Months (12 месяцев календаря)
create table if not exists public.calendar_months (
  id uuid default gen_random_uuid() primary key,
  calendar_id uuid references public.calendars(id) on delete cascade not null,
  month_number integer not null check (month_number between 1 and 12),
  month_name text not null,
  theme_title text not null,
  image_url text not null,
  story_caption text not null,
  regeneration_prompt text,
  version integer default 1 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique (calendar_id, month_number)
);

alter table public.calendar_months enable row level security;

create policy "Users can view months of their calendars" 
  on public.calendar_months for select 
  using (exists (
    select 1 from public.calendars 
    where calendars.id = calendar_months.calendar_id and calendars.user_id = auth.uid()
  ));

create policy "Users can manage months of their calendars" 
  on public.calendar_months for all 
  using (exists (
    select 1 from public.calendars 
    where calendars.id = calendar_months.calendar_id and calendars.user_id = auth.uid()
  ));

-- 6. Dedications (Посвящения)
create table if not exists public.dedications (
  id uuid default gen_random_uuid() primary key,
  calendar_id uuid references public.calendars(id) on delete cascade unique not null,
  enabled boolean default true not null,
  text text not null,
  author text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.dedications enable row level security;

create policy "Users can manage dedication for their calendar" 
  on public.dedications for all 
  using (exists (
    select 1 from public.calendars 
    where calendars.id = dedications.calendar_id and calendars.user_id = auth.uid()
  ));

-- 7. Generations (Журнал AI-генераций и аудита)
create table if not exists public.generations (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  calendar_id uuid references public.calendars(id) on delete cascade not null,
  month_number integer not null,
  prompt text not null,
  provider text not null,
  status text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.generations enable row level security;

create policy "Users can view own generation logs" 
  on public.generations for select 
  using (auth.uid() = user_id);

-- 8. Exports & Orders (Экспорты и заказы печати)
create table if not exists public.exports (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  calendar_id uuid references public.calendars(id) on delete cascade not null,
  export_type text check (export_type in ('pdf_download', 'print_order')) not null,
  file_url text,
  payment_status text check (payment_status in ('free', 'pending', 'paid')) default 'free',
  amount_rub integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table public.exports enable row level security;

create policy "Users can view own exports" 
  on public.exports for select 
  using (auth.uid() = user_id);

-- --------------------------------------------------------------------
-- STORAGE BUCKETS (Приватное хранилище фотографий детей)
-- --------------------------------------------------------------------
-- insert into storage.buckets (id, name, public) 
-- values ('child-private-photos', 'child-private-photos', false);
-- 
-- create policy "Users can upload private photos to child folder"
-- on storage.objects for insert with check (
--   bucket_id = 'child-private-photos' and auth.uid()::text = (storage.foldername(name))[1]
-- );
-- 
-- create policy "Users can read own child photos"
-- on storage.objects for select using (
--   bucket_id = 'child-private-photos' and auth.uid()::text = (storage.foldername(name))[1]
-- );
