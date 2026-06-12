import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import { CATEGORIES, categoryLabel, isCategorySlug } from "@/lib/categories";
import { firstImageUrl, excerpt } from "@/components/PostContent";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function Views({ n }: { n: number | null | undefined }) {
  return (
    <span title="조회수" className="inline-flex items-center gap-1">
      👁 {(n ?? 0).toLocaleString("ko-KR")}
    </span>
  );
}

function SetupNotice() {
  return (
    <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-6 text-sm leading-relaxed">
      <p className="mb-2 font-semibold">⚙️ Supabase 설정이 필요합니다</p>
      <ol className="list-decimal space-y-1 pl-5">
        <li>
          <code>.env.local.example</code> 을 <code>.env.local</code> 로 복사
        </li>
        <li>
          Supabase 대시보드의 <code>URL</code> 과 <code>anon key</code> 를 채우기
        </li>
        <li>
          <code>supabase/schema.sql</code> 을 SQL Editor 에서 실행
        </li>
        <li>dev 서버 재시작</li>
      </ol>
    </div>
  );
}

function CategoryFilter({ active }: { active?: string }) {
  const base =
    "rounded-full border px-3 py-1.5 text-sm font-medium transition-colors";
  const on = "border-foreground bg-foreground text-background";
  const off =
    "border-black/15 hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10";

  return (
    <nav className="flex flex-wrap gap-2">
      <Link href="/" className={`${base} ${!active ? on : off}`}>
        전체
      </Link>
      {CATEGORIES.map((c) => (
        <Link
          key={c.slug}
          href={`/?category=${c.slug}`}
          className={`${base} ${active === c.slug ? on : off}`}
        >
          {c.label}
        </Link>
      ))}
    </nav>
  );
}

/** 상단 대표글 카드 (썸네일 + 제목 + 요약) */
function FeaturedCard({ post }: { post: Post }) {
  const thumb = firstImageUrl(post.content);
  return (
    <Link
      href={`/posts/${post.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-black/10 bg-white/60 shadow-sm transition-shadow hover:shadow-md dark:border-white/10 dark:bg-white/[0.04]"
    >
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-gradient-to-br from-sky-100 to-pink-100 dark:from-sky-950 dark:to-purple-950">
        {thumb ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={thumb}
            alt=""
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-4xl opacity-60">
            ☁️
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-full bg-black/55 px-2 py-0.5 text-xs font-medium text-white backdrop-blur">
          {categoryLabel(post.category)}
        </span>
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <h3 className="font-semibold group-hover:underline">{post.title}</h3>
        <p className="line-clamp-2 text-sm text-black/55 dark:text-white/55">
          {excerpt(post.content)}
        </p>
        <div className="mt-1 text-xs text-black/40 dark:text-white/40">
          {formatDate(post.created_at)} · <Views n={post.views} />
        </div>
      </div>
    </Link>
  );
}

/** 인기글 순위 행 */
function PopularRow({ post, rank }: { post: Post; rank: number }) {
  return (
    <Link
      href={`/posts/${post.id}`}
      className="group flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-black/5 dark:hover:bg-white/10"
    >
      <span className="w-5 shrink-0 text-center text-lg font-bold text-sky-500">
        {rank}
      </span>
      <span className="flex-1 truncate font-medium group-hover:underline">
        {post.title}
      </span>
      <span className="shrink-0 text-xs text-black/40 dark:text-white/40">
        <Views n={post.views} />
      </span>
    </Link>
  );
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  if (!isSupabaseConfigured()) {
    return <SetupNotice />;
  }

  const { category } = await searchParams;
  const activeCategory = isCategorySlug(category) ? category : undefined;

  const supabase = await createClient();

  // 목록 (분야 필터 적용)
  let listQuery = supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });
  if (activeCategory) listQuery = listQuery.eq("category", activeCategory);

  // 대표글 / 인기글 은 필터가 없을 때(전체 보기)만 보여준다
  const [listRes, featuredRes, popularRes] = await Promise.all([
    listQuery.returns<Post[]>(),
    activeCategory
      ? Promise.resolve({ data: [] as Post[] })
      : supabase
          .from("posts")
          .select("*")
          .eq("is_featured", true)
          .order("created_at", { ascending: false })
          .limit(4)
          .returns<Post[]>(),
    activeCategory
      ? Promise.resolve({ data: [] as Post[] })
      : supabase
          .from("posts")
          .select("*")
          .order("views", { ascending: false })
          .order("created_at", { ascending: false })
          .limit(5)
          .returns<Post[]>(),
  ]);

  if (listRes.error) {
    return (
      <p className="text-sm text-red-600">
        글을 불러오지 못했습니다: {listRes.error.message}
      </p>
    );
  }

  const posts = listRes.data ?? [];
  const featured = featuredRes.data ?? [];
  const popular = (popularRes.data ?? []).filter((p) => (p.views ?? 0) > 0);

  return (
    <section className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">블로그 글</h1>
        <Link
          href="/posts/new"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          새 글 작성
        </Link>
      </div>

      {/* 카테고리 */}
      <div className="flex flex-col gap-2">
        <h2 className="text-xs font-semibold tracking-wide text-black/45 dark:text-white/45">
          📂 카테고리
        </h2>
        <CategoryFilter active={activeCategory} />
      </div>

      {!activeCategory && featured.length > 0 && (
        <div className="flex flex-col gap-3">
          <h2 className="text-lg font-bold">⭐ 대표글</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {featured.map((post) => (
              <FeaturedCard key={post.id} post={post} />
            ))}
          </div>
        </div>
      )}

      {!activeCategory && popular.length > 0 && (
        <div className="flex flex-col gap-2">
          <h2 className="text-lg font-bold">🔥 인기글</h2>
          <div className="rounded-xl border border-black/10 bg-white/50 p-2 dark:border-white/10 dark:bg-white/[0.03]">
            {popular.map((post, i) => (
              <PopularRow key={post.id} post={post} rank={i + 1} />
            ))}
          </div>
        </div>
      )}

      {/* 전체/분야 글 목록 */}
      <div className="flex flex-col gap-3">
        <h2 className="text-lg font-bold">
          {activeCategory ? `${categoryLabel(activeCategory)} 글` : "전체 글"}
        </h2>
        {posts.length === 0 ? (
          <p className="text-black/60 dark:text-white/60">
            {activeCategory
              ? `'${categoryLabel(activeCategory)}' 분야에 글이 없습니다.`
              : "아직 작성된 글이 없습니다. 첫 글을 작성해보세요!"}
          </p>
        ) : (
          <ul className="flex flex-col divide-y divide-black/10 dark:divide-white/10">
            {posts.map((post) => (
              <li key={post.id} className="py-4">
                <Link href={`/posts/${post.id}`} className="group block">
                  <span className="mb-1 inline-block rounded-full bg-black/5 px-2 py-0.5 text-xs font-medium text-black/60 dark:bg-white/10 dark:text-white/60">
                    {categoryLabel(post.category)}
                  </span>
                  <h3 className="text-lg font-semibold group-hover:underline">
                    {post.title}
                  </h3>
                  <p className="mt-1 line-clamp-2 text-sm text-black/60 dark:text-white/60">
                    {excerpt(post.content)}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-black/40 dark:text-white/40">
                    <time>{formatDate(post.created_at)}</time>
                    <span aria-hidden>·</span>
                    <Views n={post.views} />
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
