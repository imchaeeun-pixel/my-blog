# My Blog

Next.js (App Router) + Supabase 기반 개인 블로그. 블로그 글 **CRUD**(목록·작성·조회·수정·삭제) 기능을 제공합니다.
로그인 기능은 다음 단계에서 추가 예정입니다.

## 기술 스택

- Next.js 16 (App Router, Server Actions)
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase (Postgres)

## 시작하기

### 1. Supabase 프로젝트 준비

1. [supabase.com](https://supabase.com) 에서 프로젝트 생성
2. **SQL Editor** 에서 [`supabase/schema.sql`](./supabase/schema.sql) 내용을 실행해 `posts` 테이블 생성

### 2. 환경변수 설정

```powershell
Copy-Item .env.local.example .env.local
```

`.env.local` 에 Supabase 값을 채웁니다 (대시보드 > Project Settings > API):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

### 3. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 접속. 환경변수가 비어 있으면 화면에 설정 안내가 표시됩니다.

## 라우트 구조

| 경로 | 설명 |
| --- | --- |
| `/` | 글 목록 (최신순) |
| `/posts/new` | 글 작성 |
| `/posts/[id]` | 글 조회 + 수정/삭제 버튼 |
| `/posts/[id]/edit` | 글 수정 |

## 주요 파일

- `src/lib/supabase/server.ts` · `client.ts` — Supabase 클라이언트
- `src/app/posts/actions.ts` — 생성/수정/삭제 서버 액션
- `src/components/PostForm.tsx` — 작성·수정 공용 폼
- `supabase/schema.sql` — 테이블/트리거/RLS 정의

## 로그인 추가 시 (다음 단계)

현재 `posts` 테이블의 RLS 정책은 `anon` 키로 모든 CRUD를 허용합니다(`supabase/schema.sql` 참고).
로그인을 붙인 뒤에는 **읽기는 모두 허용 / 쓰기는 인증 사용자만** 형태로 정책을 교체하고,
세션 쿠키 갱신용 미들웨어를 추가하면 됩니다. Supabase 클라이언트의 쿠키 핸들러는 이미 연동되어 있습니다.
