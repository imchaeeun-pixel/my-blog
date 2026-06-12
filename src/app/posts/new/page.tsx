import { createPostAction } from "@/app/posts/actions";
import PostForm from "@/components/PostForm";

export default function NewPostPage() {
  return (
    <section className="flex flex-col gap-6">
      <h1 className="text-2xl font-bold">새 글 작성</h1>
      <PostForm action={createPostAction} submitLabel="작성" cancelHref="/" />
    </section>
  );
}
