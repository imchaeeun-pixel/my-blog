// 블로그 글 10개를 분야별로 시드(seed)하는 스크립트.
// 실행: node scripts/seed.mjs   (또는 seed.cmd 더블클릭)
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { createClient } from "@supabase/supabase-js";

// .env.local 직접 파싱 (Node 가 자동 로드하지 않으므로)
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

const posts = [
  {
    category: "dev",
    title: "Next.js 16으로 블로그 만들기",
    content:
      "App Router와 서버 컴포넌트만으로 블로그를 만들어 봤다.\n\n페이지를 async 함수로 작성하고 서버에서 바로 데이터를 가져오니, 클라이언트 상태 관리 코드가 거의 사라졌다. 서버 액션으로 폼 처리까지 끝내니 API 라우트를 따로 만들 일도 없었다.\n\n처음엔 'use server'와 'use client' 경계가 헷갈렸지만, 데이터를 읽는 곳은 서버, 상호작용이 필요한 곳만 클라이언트로 나누는 원칙만 지키면 깔끔해진다.",
  },
  {
    category: "dev",
    title: "Supabase로 5분 만에 백엔드 붙이기",
    content:
      "DB, 인증, 스토리지가 한 번에 딸려오는 Supabase를 써봤다.\n\nPostgres 위에 PostgREST가 얹혀 있어서, 테이블만 만들면 바로 REST API가 생긴다. RLS(Row Level Security) 정책으로 권한을 행 단위로 거는 게 핵심인데, 처음엔 '왜 데이터가 안 보이지' 하다가 결국 정책을 안 켜서였다.\n\n로컬 .env에 URL과 anon key만 넣으면 연결 끝. 프로토타입 속도가 정말 빠르다.",
  },
  {
    category: "dev",
    title: "TypeScript, 왜 쓰면 좋을까",
    content:
      "자바스크립트만 쓰다가 타입스크립트로 넘어온 지 2년.\n\n가장 큰 효용은 '리팩터링 자신감'이다. 함수 시그니처를 바꾸면 영향받는 곳이 빨간 줄로 다 뜬다. 런타임까지 가지 않고 에디터에서 버그를 잡는 경험이 쌓이면 되돌아가기 어렵다.\n\n단점이라면 초반 설정과 타입 씨름. 하지만 any로 도망치지 않고 제대로 타입을 잡아두면, 결국 문서 역할까지 해준다.",
  },
  {
    category: "daily",
    title: "재택근무 1년 회고",
    content:
      "꼬박 1년을 집에서 일했다.\n\n출퇴근 시간이 사라진 건 분명한 이득이지만, 일과 삶의 경계가 흐려지는 건 계속된 숙제였다. 결국 '퇴근 의식'을 만들었다. 노트북을 닫고 산책을 한 바퀴 돌면 뇌가 업무 모드에서 빠져나온다.\n\n동료와의 잡담이 그리울 때도 있다. 그래도 집중이 필요한 일은 재택이 압도적으로 유리하다는 결론.",
  },
  {
    category: "daily",
    title: "아침 루틴을 바꿨더니",
    content:
      "알람을 끄자마자 폰을 보던 습관을 버렸다.\n\n대신 일어나서 물 한 잔, 스트레칭 5분, 그리고 10분간 그날 할 일 세 가지만 적는다. 거창한 미라클 모닝은 아니지만, 하루를 '떠밀려' 시작하지 않게 된 것만으로 충분했다.\n\n2주쯤 지나니 오전 집중력이 확실히 달라졌다. 작은 순서 하나 바꿨을 뿐인데.",
  },
  {
    category: "travel",
    title: "제주도 3박 4일 여행기",
    content:
      "오랜만에 제주에 다녀왔다.\n\n첫날은 동쪽 성산 일출봉, 둘째 날은 서쪽 한림과 협재 바다. 렌터카로 해안도로를 달리는 그 시간이 여행의 절반이었다. 셋째 날엔 비가 와서 카페에서 책을 읽었는데, 그게 또 그렇게 좋았다.\n\n맛집을 욕심내기보다 한 곳에서 오래 머무는 여행이 나한테는 더 맞는 것 같다.",
  },
  {
    category: "travel",
    title: "교토에서 보낸 가을",
    content:
      "단풍철 교토는 사람이 정말 많았다.\n\n아라시야마 대나무 숲은 이른 아침에 가야 한다는 말을 믿고 7시에 도착했더니, 고요한 숲길을 거의 혼자 걸을 수 있었다. 오후의 기요미즈데라는 인파에 떠밀려 다녔지만, 언덕 위에서 본 붉은 도시 풍경은 그럴 만했다.\n\n작은 골목의 노포에서 먹은 소바 한 그릇이 가장 기억에 남는다.",
  },
  {
    category: "food",
    title: "집에서 만드는 마라탕 레시피",
    content:
      "배달만 시켜 먹던 마라탕을 직접 끓여봤다.\n\n핵심은 마라 소스와 육수다. 시판 마라 소스를 베이스로, 청경채·목이버섯·푸주·소고기를 넣고 끓이면 가게 맛의 80%는 나온다. 매운맛은 마라 소스 양으로, 얼얼한 맛은 화자오(산초)로 조절하면 된다.\n\n재료를 내가 고르니 양도 푸짐하고 가격도 절반. 주말 별미로 강력 추천.",
  },
  {
    category: "food",
    title: "서울 빵집 탐방기",
    content:
      "주말마다 동네 빵집을 한 곳씩 돌고 있다.\n\n갓 구운 크루아상은 결이 살아 있고, 바삭하게 부서지는 그 소리가 맛의 절반이다. 오래된 동네 빵집의 소보로와 단팥빵에서는 또 다른 정겨움이 있다.\n\n화려한 신상 디저트도 좋지만, 결국 기본에 충실한 식빵 한 줄이 제일 자주 손이 간다는 걸 깨달았다.",
  },
  {
    category: "hobby",
    title: "클라이밍을 시작했습니다",
    content:
      "운동을 싫어하던 내가 실내 클라이밍에 빠졌다.\n\n근력 운동이라기보다 '몸으로 푸는 퍼즐'에 가깝다. 같은 벽을 두고 어떻게 손과 발을 옮길지 고민하다 보면 한 시간이 훌쩍 간다. 못 풀던 문제를 성공했을 때의 쾌감이 중독적이다.\n\n손바닥은 까지고 팔은 뻐근하지만, 이렇게 시간 가는 줄 모르는 취미는 오랜만이다.",
  },
];

const { data, error } = await supabase
  .from("posts")
  .insert(posts)
  .select("id, title, category");

if (error) {
  console.error("시드 실패:", error.message);
  process.exit(1);
}

console.log(`✅ ${data.length}개 글 등록 완료`);
for (const p of data) console.log(`  - [${p.category}] ${p.title}`);
