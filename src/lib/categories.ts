/**
 * 블로그 분야(카테고리) 정의.
 * - slug: DB의 posts.category 에 저장되는 값 / URL 쿼리에 쓰이는 값
 * - label: 화면에 표시되는 한글 이름
 * 분야를 추가/변경하려면 이 배열만 수정하면 됩니다.
 */
export const CATEGORIES = [
  { slug: "dev", label: "개발" },
  { slug: "daily", label: "일상" },
  { slug: "travel", label: "여행" },
  { slug: "food", label: "음식" },
  { slug: "hobby", label: "취미" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

/** 유효한 분야 슬러그 목록 */
export const CATEGORY_SLUGS = CATEGORIES.map((c) => c.slug) as CategorySlug[];

/** 기본 분야 (작성 시 미선택 시 사용) */
export const DEFAULT_CATEGORY: CategorySlug = "daily";

/** 슬러그가 유효한 분야인지 확인 */
export function isCategorySlug(value: string | undefined | null): value is CategorySlug {
  return !!value && (CATEGORY_SLUGS as string[]).includes(value);
}

/** 슬러그 → 한글 라벨 (없으면 슬러그 그대로 반환) */
export function categoryLabel(slug: string | undefined | null): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? slug ?? "";
}
