import Link from "next/link";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";
import type { Post } from "@/lib/types";
import { CATEGORIES, categoryLabel, isCategorySlug } from "@/lib/categories";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
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
  let query = supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (activeCategory) {
    query = query.eq("category", activeCategory);
  }

  const { data: posts, error } = await query.returns<Post[]>();

  if (error) {
    return (
      <p className="text-sm text-red-600">
        글을 불러오지 못했습니다: {error.message}
      </p>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">블로그 글</h1>
        <Link
          href="/posts/new"
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90"
        >
          새 글 작성
        </Link>
      </div>

      <CategoryFilter active={activeCategory} />

      {!posts || posts.length === 0 ? (
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
                <h2 className="text-lg font-semibold group-hover:underline">
                  {post.title}
                </h2>
                <p className="mt-1 line-clamp-2 text-sm text-black/60 dark:text-white/60">
                  {post.content}
                </p>
                <time className="mt-2 block text-xs text-black/40 dark:text-white/40">
                  {formatDate(post.created_at)}
                </time>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
