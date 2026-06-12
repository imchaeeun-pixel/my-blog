"use client";

type Props = {
  action: () => Promise<void>;
};

export default function DeleteButton({ action }: Props) {
  return (
    <form
      action={action}
      onSubmit={(e) => {
        if (!confirm("정말 이 글을 삭제할까요?")) {
          e.preventDefault();
        }
      }}
    >
      <button
        type="submit"
        className="rounded-md border border-red-500/40 px-4 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-500/10"
      >
        삭제
      </button>
    </form>
  );
}
