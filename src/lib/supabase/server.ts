import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * 서버 컴포넌트 / 서버 액션에서 사용하는 Supabase 클라이언트.
 * 로그인 기능을 붙이면 여기 쿠키 핸들러를 통해 세션이 자동으로 연동됩니다.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // 서버 컴포넌트에서 호출되면 set이 무시될 수 있습니다.
            // 세션 갱신은 추후 미들웨어에서 처리합니다.
          }
        },
      },
    },
  );
}

/** 환경변수가 채워졌는지 확인 (설정 안내 화면 표시용) */
export function isSupabaseConfigured() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
