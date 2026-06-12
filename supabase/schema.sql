-- ============================================================
-- 블로그 posts 테이블 스키마
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- ============================================================

create extension if not exists "pgcrypto";

create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  title       text not null,
  content     text not null,
  category    text not null default 'daily',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- 최신 글이 위로 오도록 정렬용 인덱스
create index if not exists posts_created_at_idx
  on public.posts (created_at desc);

-- 분야별 필터링용 인덱스
create index if not exists posts_category_idx
  on public.posts (category);

-- updated_at 자동 갱신 트리거
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists posts_set_updated_at on public.posts;
create trigger posts_set_updated_at
  before update on public.posts
  for each row execute function public.set_updated_at();

-- ============================================================
-- RLS (Row Level Security)
-- 1차 버전은 로그인이 없으므로 anon 키로 모든 CRUD를 허용합니다.
-- 로그인 기능을 붙인 뒤에는 아래 정책을 제거하고
-- "읽기는 모두 허용 / 쓰기는 인증 사용자만" 형태로 교체하세요.
-- ============================================================
alter table public.posts enable row level security;

drop policy if exists "posts public read"   on public.posts;
drop policy if exists "posts public insert" on public.posts;
drop policy if exists "posts public update" on public.posts;
drop policy if exists "posts public delete" on public.posts;

create policy "posts public read"   on public.posts for select using (true);
create policy "posts public insert" on public.posts for insert with check (true);
create policy "posts public update" on public.posts for update using (true) with check (true);
create policy "posts public delete" on public.posts for delete using (true);
