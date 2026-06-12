import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { updatePostAction } from "@/app/posts/actions";
import PostForm from "@/components/PostForm";
import type { Post } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function EditPostPage({
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
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">글 수정</h1>
      <PostForm
        action={updatePostAction.bind(null, post.id)}
        defaultValues={{
          title: post.title,
          content: post.content,
          category: post.category,
        }}
        submitLabel="수정 완료"
        cancelHref={`/posts/${post.id}`}
      />
    </section>
  );
}
