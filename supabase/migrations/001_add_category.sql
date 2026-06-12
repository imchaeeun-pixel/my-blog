-- ============================================================
-- 기존 posts 테이블에 분야(category) 컬럼 추가
-- Supabase 대시보드 > SQL Editor 에 붙여넣고 실행하세요.
-- (이미 schema.sql 을 새로 실행했다면 다시 실행할 필요 없습니다.)
-- ============================================================

alter table public.posts
  add column if not exists category text not null default 'daily';

create index if not exists posts_category_idx
  on public.posts (category);
