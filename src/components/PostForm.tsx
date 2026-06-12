"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { FormState } from "@/app/posts/actions";
import { CATEGORIES, DEFAULT_CATEGORY } from "@/lib/categories";

type Props = {
  action: (prev: FormState, formData: FormData) => Promise<FormState>;
  defaultValues?: {
    title?: string;
    content?: string;
    category?: string;
    is_featured?: boolean;
  };
  submitLabel: string;
  cancelHref: string;
};

export default function PostForm({
  action,
  defaultValues,
  submitLabel,
  cancelHref,
}: Props) {
  const [state, formAction, pending] = useActionState<FormState, FormData>(
    action,
    {},
  );

  return (
    <form action={formAction} className="flex flex-col gap-5">
      <div className="flex flex-col gap-2">
        <label htmlFor="title" className="text-sm font-medium">
          제목
        </label>
        <input
          id="title"
          name="title"
          type="text"
          defaultValue={defaultValues?.title}
          placeholder="제목을 입력하세요"
          required
          className="rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50"
        />
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="category" className="text-sm font-medium">
          분야
        </label>
        <select
          id="category"
          name="category"
          defaultValue={defaultValues?.category ?? DEFAULT_CATEGORY}
          className="rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50"
        >
          {CATEGORIES.map((c) => (
            <option key={c.slug} value={c.slug}>
              {c.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="content" className="text-sm font-medium">
          내용
        </label>
        <textarea
          id="content"
          name="content"
          rows={14}
          defaultValue={defaultValues?.content}
          placeholder={
            "내용을 입력하세요.\n\n• 이미지: 한 줄에 이미지 URL 만 붙여넣으면 사진으로 보입니다.\n  예) https://example.com/photo.jpg\n• 유튜브: 한 줄에 유튜브 URL 만 붙여넣으면 영상이 재생됩니다.\n  예) https://youtu.be/dQw4w9WgXcQ"
          }
          required
          className="resize-y rounded-md border border-black/15 bg-transparent px-3 py-2 outline-none focus:border-black/40 dark:border-white/20 dark:focus:border-white/50"
        />
        <p className="text-xs text-black/45 dark:text-white/45">
          💡 이미지·유튜브 URL 을 본문에 <b>한 줄로</b> 넣으면 자동으로 사진/영상으로 표시됩니다.
        </p>
      </div>

      <label className="flex w-fit cursor-pointer items-center gap-2 text-sm font-medium">
        <input
          type="checkbox"
          name="is_featured"
          defaultChecked={defaultValues?.is_featured}
          className="h-4 w-4 accent-sky-500"
        />
        ⭐ 대표글로 설정 (상단 대표글 영역에 노출)
      </label>

      {state.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={pending}
          className="rounded-md bg-foreground px-4 py-2 text-sm font-medium text-background transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "저장 중..." : submitLabel}
        </button>
        <Link
          href={cancelHref}
          className="rounded-md border border-black/15 px-4 py-2 text-sm font-medium transition-colors hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
        >
          취소
        </Link>
      </div>
    </form>
  );
}
