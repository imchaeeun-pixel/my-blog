-- ============================================================
-- 조회수(views) + 대표글(is_featured) 기능 추가
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- ============================================================

-- 1) 컬럼 추가
alter table public.posts
  add column if not exists views integer not null default 0,
  add column if not exists is_featured boolean not null default false;

-- 2) 정렬/필터용 인덱스
create index if not exists posts_views_idx
  on public.posts (views desc);
create index if not exists posts_featured_idx
  on public.posts (is_featured) where is_featured;

-- 3) 조회수 +1 함수 (앱에서 supabase.rpc('increment_views', { p_id }) 로 호출)
create or replace function public.increment_views(p_id uuid)
returns void
language sql
as $$
  update public.posts set views = views + 1 where id = p_id;
$$;

-- 4) updated_at 트리거 개선:
--    조회수만 바뀌는 경우엔 "수정됨" 으로 잡히지 않도록,
--    제목/내용/분야/대표여부가 실제로 변경될 때만 updated_at 을 갱신한다.
create or replace function public.set_updated_at()
returns trigger as $$
begin
  if new.title is distinct from old.title
     or new.content is distinct from old.content
     or new.category is distinct from old.category
     or new.is_featured is distinct from old.is_featured then
    new.updated_at = now();
  end if;
  return new;
end;
$$ language plpgsql;
