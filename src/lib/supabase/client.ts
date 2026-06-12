import { createBrowserClient } from "@supabase/ssr";

/**
 * 브라우저(클라이언트 컴포넌트)에서 사용하는 Supabase 클라이언트.
 * 현재 CRUD는 서버 액션으로 처리하므로 아직 직접 쓰지 않지만,
 * 로그인 기능 추가 시 클라이언트 측 인증에 사용됩니다.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
