import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { deletePostAction } from "@/app/posts/actions";
import DeleteButton from "@/components/DeleteButton";
import type { Post } from "@/lib/types";
import { categoryLabel } from "@/lib/categories";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function PostDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const { data: post } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle<Post>();

  if (!post) notFound();

  return (
    <article className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <Link
          href="/"
          className="text-sm text-black/50 hover:underline dark:text-white/50"
        >
          ← 목록으로
        </Link>
        <Link
          href={`/?category=${post.category}`}
          className="w-fit rounded-full bg-black/5 px-2.5 py-0.5 text-xs font-medium text-black/60 transition-colors hover:bg-black/10 dark:bg-white/10 dark:text-white/60 dark:hover:bg-white/20"
        >
          {categoryLabel(post.category)}
        </Link>
        <h1 className="text-3xl font-bold">{post.title}</h1>
        <time className="text-sm text-black/40 dark:text-white/40">
          {formatDate(post.created_at)}
          {post.updated_at !== post.created_at &&
            ` (수정됨: ${formatDate(post.updated_at)})`}
        </time>
      </div>

      <div className="whitespace-pre-wrap leading-relaxed">{post.content}</div>

      <div className="flex items-center gap-3 border-t border-black/10 pt-6 dark:border-white/10">
        <Link
          href={`/posts/${post.id}/edit`}
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          수정
        </Link>
        <DeleteButton action={deletePostAction.bind(null, post.id)} />
      </div>
    </article>
  );
}
