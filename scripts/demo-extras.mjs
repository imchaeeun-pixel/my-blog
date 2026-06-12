// 조회수/대표글/이미지·유튜브 기능을 바로 확인할 수 있도록 데모 데이터를 채운다.
// 실행: node scripts/demo-extras.mjs  (또는 demo.cmd)
// ※ 002_views_and_featured.sql 마이그레이션을 먼저 적용한 뒤 실행하세요.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const env = {};
for (const line of readFileSync(join(root, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^\s*([\w.]+)\s*=\s*(.*)\s*$/);
  if (m) env[m[1]] = m[2].trim();
}
const supabase = createClient(
  env.NEXT_PUBLIC_SUPABASE_URL,
  env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

// 1) 이미지 + 유튜브가 들어간 예시 글 (없을 때만 생성)
const showcaseTitle = "📸 사진과 영상이 들어간 글 예시";
const { data: exists } = await supabase
  .from("posts")
  .select("id")
  .eq("title", showcaseTitle)
  .maybeSingle();

if (!exists) {
  const showcaseContent = [
    "본문에 이미지 URL 을 한 줄로 넣으면 이렇게 사진이 보입니다 👇",
    "",
    "https://picsum.photos/seed/chaeeun-sky/800/450.jpg",
    "",
    "그리고 유튜브 URL 을 한 줄로 넣으면 영상이 바로 재생됩니다 👇",
    "",
    "https://youtu.be/jfKfPfyJRdk",
    "",
    "이렇게 글 사이사이에 사진과 영상을 자유롭게 넣어보세요!",
  ].join("\n");

  const { error } = await supabase.from("posts").insert({
    title: showcaseTitle,
    content: showcaseContent,
    category: "hobby",
    is_featured: true,
    views: 1530,
  });
  if (error) console.error("예시 글 생성 실패:", error.message);
  else console.log("✅ 이미지+유튜브 예시 글 생성");
} else {
  console.log("· 예시 글이 이미 있어 건너뜀");
}

// 2) 대표글 지정 + 조회수 세팅 (제목으로 매칭)
const featuredTitles = ["제주도 3박 4일 여행기", "Next.js 16으로 블로그 만들기"];
const viewsByTitle = {
  "Next.js 16으로 블로그 만들기": 1280,
  "제주도 3박 4일 여행기": 970,
  "집에서 만드는 마라탕 레시피": 760,
  "클라이밍을 시작했습니다": 540,
  "교토에서 보낸 가을": 430,
  "서울 빵집 탐방기": 320,
  "재택근무 1년 회고": 280,
  "Supabase로 5분 만에 백엔드 붙이기": 210,
  "TypeScript, 왜 쓰면 좋을까": 175,
  "아침 루틴을 바꿨더니": 120,
};

for (const [title, views] of Object.entries(viewsByTitle)) {
  const patch = { views };
  if (featuredTitles.includes(title)) patch.is_featured = true;
  const { error } = await supabase
    .from("posts")
    .update(patch)
    .eq("title", title);
  if (error) console.error(`업데이트 실패(${title}):`, error.message);
}
console.log("✅ 대표글/조회수 데모 데이터 적용 완료");
