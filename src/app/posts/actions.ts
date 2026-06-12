"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { DEFAULT_CATEGORY, isCategorySlug } from "@/lib/categories";

export type FormState = { error?: string };

function parseForm(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const rawCategory = String(formData.get("category") ?? "").trim();
  const category = isCategorySlug(rawCategory) ? rawCategory : DEFAULT_CATEGORY;
  return { title, content, category };
}

/** 글 작성 — useActionState 시그니처 (prevState, formData) */
export async function createPostAction(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { title, content, category } = parseForm(formData);
  if (!title || !content) {
    return { error: "제목과 내용을 모두 입력하세요." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .insert({ title, content, category })
    .select("id")
    .single();

  if (error) return { error: error.message };

  revalidatePath("/");
  redirect(`/posts/${data.id}`);
}

/** 글 수정 — id를 bind한 뒤 (id, prevState, formData) */
export async function updatePostAction(
  id: string,
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { title, content, category } = parseForm(formData);
  if (!title || !content) {
    return { error: "제목과 내용을 모두 입력하세요." };
  }

  const supabase = await createClient();
  const { error } = await supabase
    .from("posts")
    .update({ title, content, category })
    .eq("id", id);

  if (error) return { error: error.message };

  revalidatePath("/");
  revalidatePath(`/posts/${id}`);
  redirect(`/posts/${id}`);
}

/** 글 삭제 — id를 bind한 뒤 폼 submit으로 호출 */
export async function deletePostAction(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("posts").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  redirect("/");
}
