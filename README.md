# ☁️ 채은이의 일기

![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![Supabase](https://img.shields.io/badge/Supabase-Postgres-3ECF8E?logo=supabase&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)

채은이의 일상 · 여행 · 개발 이야기를 담은, Next.js(App Router) + Supabase 기반 개인 블로그입니다.
글 **CRUD**(작성·조회·수정·삭제), **분야(카테고리)별 분류·필터**, 그리고 **몽글몽글한 구름 배경 테마**를 제공합니다.

> 데모 데이터로 5개 분야에 걸친 샘플 글 10개가 준비되어 있습니다.
> 누구나 자유롭게 사용·수정·배포할 수 있는 **오픈소스(MIT License)** 프로젝트입니다.

---

## ✨ 주요 기능

- **글 관리(CRUD)** — 서버 컴포넌트로 조회, 서버 액션으로 작성/수정/삭제
- **분야별 분류** — 개발 · 일상 · 여행 · 음식 · 취미 5개 분야
- **분야 필터** — 목록 상단 버튼 또는 `/?category=<분야>` 로 해당 분야 글만 보기
- **구름 배경 테마** — 둥실둥실 떠다니는 구름 이미지 + 파스텔 하늘, 반투명 프로스티드 글 카드
- **다크 모드** — OS 설정에 따라 자동으로 밤하늘 테마로 전환
- **반응형** — 모바일/데스크톱 대응

---

## 🛠 기술 스택

| 분류 | 사용 기술 |
| --- | --- |
| 프레임워크 | Next.js 16 (App Router, Server Actions) |
| UI | React 19, Tailwind CSS v4 |
| 언어 | TypeScript 5 |
| 백엔드/DB | Supabase (Postgres + PostgREST) |
| 빌드 | Turbopack |

---

## 🚀 시작하기

### 1. 설치

```powershell
git clone https://github.com/imchaeeun-pixel/my-blog.git
cd my-blog
npm install
```

### 2. Supabase 프로젝트 준비

1. [supabase.com](https://supabase.com) 에서 프로젝트 생성
2. 대시보드 > **SQL Editor** 에서 [`supabase/schema.sql`](./supabase/schema.sql) 전체를 붙여넣고 **Run**
   - `posts` 테이블, 인덱스, `updated_at` 자동 갱신 트리거, RLS 정책이 한 번에 생성됩니다.
   - `category` 컬럼이 처음부터 포함되어 있습니다.

> 이미 `category` 컬럼 없이 운영 중인 기존 DB라면, 대신
> [`supabase/migrations/001_add_category.sql`](./supabase/migrations/001_add_category.sql) 만 실행하면 됩니다.

### 3. 환경변수 설정

프로젝트 루트에 `.env.local` 파일을 만들고 Supabase 값을 채웁니다
(대시보드 > **Project Settings > API**):

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
```

> ⚠️ `.env.local` 은 `.gitignore` 에 포함되어 git 에 올라가지 않습니다. 키를 안전하게 보관하세요.

### 4. 개발 서버 실행

```bash
npm run dev
```

[http://localhost:3000](http://localhost:3000) 접속.
환경변수가 비어 있으면 화면에 설정 안내가 표시됩니다.

#### 💡 Windows 에서 `npm` 이 인식되지 않을 때

`'npm' 용어가 인식되지 않습니다` 오류가 나면, Node.js 가 현재 터미널의 PATH 에
없는 경우입니다. 프로젝트 루트의 헬퍼 스크립트를 쓰면 한 번에 해결됩니다.

```powershell
.\dev.cmd      # Node 경로를 잡고 npm run dev 실행
```

또는 IDE(VS Code 등)를 **완전히 종료 후 재시작**하면 새 PATH 가 적용됩니다.

---

## 📝 샘플 글 등록(시드)

분야별 샘플 글 10개를 한 번에 넣으려면:

```powershell
.\seed.cmd
```

내부적으로 [`scripts/seed.mjs`](./scripts/seed.mjs) 를 실행하며, `.env.local` 의
Supabase 값을 읽어 `posts` 테이블에 INSERT 합니다.
(반드시 위 2번 스키마 적용으로 `category` 컬럼이 생성된 뒤에 실행하세요.)

---

## 🧭 라우트 구조

| 경로 | 설명 |
| --- | --- |
| `/` | 글 목록 (최신순) + 분야 필터 |
| `/?category=<slug>` | 특정 분야 글만 보기 (예: `/?category=dev`) |
| `/posts/new` | 글 작성 (분야 선택 포함) |
| `/posts/[id]` | 글 조회 + 분야 뱃지 + 수정/삭제 |
| `/posts/[id]/edit` | 글 수정 |

---

## 🗂 사용 방법

- **글 작성** — 우상단 `새 글 작성` → 제목·분야·내용 입력 후 저장
- **분야 필터** — 목록 상단의 `전체 / 개발 / 일상 / 여행 / 음식 / 취미` 버튼 클릭,
  또는 글 상세의 분야 뱃지를 누르면 같은 분야 글만 모아 보기
- **수정/삭제** — 글 상세 페이지 하단 버튼

---

## 🏷 분야(카테고리) 커스터마이징

분야는 [`src/lib/categories.ts`](./src/lib/categories.ts) 의 배열 하나로 관리됩니다.

```ts
export const CATEGORIES = [
  { slug: "dev", label: "개발" },
  { slug: "daily", label: "일상" },
  { slug: "travel", label: "여행" },
  { slug: "food", label: "음식" },
  { slug: "hobby", label: "취미" },
] as const;
```

- `slug` — DB의 `posts.category` 에 저장되는 값이자 URL 쿼리에 쓰이는 값(영문 권장)
- `label` — 화면에 표시되는 한글 이름

분야를 추가/변경하려면 이 배열만 수정하면 폼 드롭다운·필터·뱃지에 모두 자동 반영됩니다.
(기존 글의 분야 기본값은 `DEFAULT_CATEGORY = "daily"` 입니다.)

---

## ☁️ 구름 배경 커스터마이징

- 구름 이미지: [`public/cloud.svg`](./public/cloud.svg)
- 하늘 색·구름 배치·움직임: [`src/app/globals.css`](./src/app/globals.css)
  - `body::before` — 하늘 그라데이션
  - `.cloud-field` / `.cloud-1 ~ .cloud-8` — 구름 위치·크기·투명도·애니메이션
  - `@keyframes float-x-a / float-x-b / bob-y` — 떠다니는 움직임
- 구름 레이어 마크업: [`src/app/layout.tsx`](./src/app/layout.tsx)
- `prefers-reduced-motion` 설정 시 애니메이션이 자동으로 멈춥니다.

---

## 📁 프로젝트 구조

```
my-blog/
├─ src/
│  ├─ app/
│  │  ├─ layout.tsx           # 공통 레이아웃 + 구름 배경 레이어
│  │  ├─ page.tsx             # 글 목록 + 분야 필터
│  │  ├─ globals.css          # 구름 배경/하늘 테마 스타일
│  │  └─ posts/
│  │     ├─ actions.ts        # 생성/수정/삭제 서버 액션
│  │     ├─ new/page.tsx      # 글 작성
│  │     └─ [id]/
│  │        ├─ page.tsx       # 글 조회
│  │        └─ edit/page.tsx  # 글 수정
│  ├─ components/
│  │  ├─ PostForm.tsx         # 작성·수정 공용 폼 (분야 선택 포함)
│  │  └─ DeleteButton.tsx     # 삭제 버튼
│  └─ lib/
│     ├─ categories.ts        # 분야 정의/헬퍼
│     ├─ types.ts             # Post 타입
│     └─ supabase/
│        ├─ server.ts         # 서버용 Supabase 클라이언트
│        └─ client.ts         # 클라이언트용 Supabase 클라이언트
├─ supabase/
│  ├─ schema.sql              # 테이블/인덱스/트리거/RLS 정의
│  └─ migrations/
│     └─ 001_add_category.sql # 기존 DB에 category 컬럼 추가
├─ scripts/seed.mjs           # 샘플 글 10개 시드 스크립트
├─ public/cloud.svg           # 구름 이미지
├─ dev.cmd                    # (Windows) 개발 서버 실행 헬퍼
└─ seed.cmd                   # (Windows) 시드 실행 헬퍼
```

---

## 🔒 데이터베이스 & 보안 메모

현재 `posts` 테이블의 RLS 정책은 `anon` 키로 **모든 CRUD 를 허용**합니다
([`supabase/schema.sql`](./supabase/schema.sql) 참고). 1차 버전에 로그인이 없기 때문입니다.

로그인을 붙인 뒤에는 **읽기는 모두 허용 / 쓰기는 인증 사용자만** 형태로 정책을 교체하고,
세션 쿠키 갱신용 미들웨어를 추가하면 됩니다. Supabase 클라이언트의 쿠키 핸들러는
이미 연동되어 있어([`src/lib/supabase/server.ts`](./src/lib/supabase/server.ts)) 확장이 쉽습니다.

---

## 🚢 배포 (선택)

[Vercel](https://vercel.com) 에 배포하는 것을 권장합니다.

1. GitHub 레포를 Vercel 에 임포트
2. 환경변수 `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` 등록
3. 배포

---

## 🗺 향후 계획

- [ ] 이메일/소셜 로그인 및 작성자별 권한
- [ ] 마크다운 본문 렌더링
- [ ] 이미지 업로드(Supabase Storage)
- [ ] 댓글 기능

---

## 🤝 기여하기 (Contributing)

이 프로젝트는 오픈소스입니다. 누구나 기여를 환영합니다!

1. 이 레포를 **Fork** 합니다.
2. 기능 브랜치를 만듭니다. `git checkout -b feature/멋진-기능`
3. 변경 사항을 커밋합니다. `git commit -m "feat: 멋진 기능 추가"`
4. 브랜치를 푸시합니다. `git push origin feature/멋진-기능`
5. **Pull Request** 를 생성합니다.

버그 제보나 기능 제안은 [Issues](https://github.com/imchaeeun-pixel/my-blog/issues) 에 남겨주세요.

---

## 📄 라이선스 (License)

이 프로젝트는 **MIT License** 를 따릅니다. 자세한 내용은 [`LICENSE`](./LICENSE) 파일을 참고하세요.

자유롭게 사용·복제·수정·배포할 수 있으며, 저작권 고지와 라이선스 전문을 포함하면 됩니다.

```
Copyright (c) 2026 채은 (imchaeeun-pixel)
```
