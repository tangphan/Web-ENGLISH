create table if not exists public.rewiews (
  name text,
  rating smallint not null check (rating between 1 and 5),
  comment text not null check (char_length(btrim(comment)) between 1 and 1000)
);

alter table public.rewiews
  add column if not exists name text;

alter table public.rewiews enable row level security;

drop policy if exists "Authenticated users can read feedback" on public.rewiews;
create policy "Authenticated users can read feedback"
  on public.rewiews for select
  to authenticated
  using (true);

drop policy if exists "Authenticated users can create feedback" on public.rewiews;
create policy "Authenticated users can create feedback"
  on public.rewiews for insert
  to authenticated
  with check (true);

grant select, insert on public.rewiews to authenticated;
