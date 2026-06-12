/**
 * 글 본문을 줄 단위로 해석해서 렌더링한다.
 * - 한 줄이 이미지 URL 이면  → <img> 로 표시
 * - 한 줄이 유튜브 URL 이면  → 유튜브 플레이어(iframe) 임베드
 * - 한 줄이 일반 링크면      → 클릭 가능한 링크
 * - 그 외 텍스트            → 단락으로 표시(줄바꿈 유지)
 */

const IMAGE_RE = /^https?:\/\/\S+\.(?:jpg|jpeg|png|gif|webp|svg|bmp|avif)(?:\?\S*)?$/i;
const URL_RE = /^https?:\/\/\S+$/i;

/** 본문에서 첫 번째 이미지 URL 을 찾는다 (썸네일용). 없으면 null. */
export function firstImageUrl(content: string): string | null {
  for (const line of content.split("\n")) {
    const url = line.trim();
    if (IMAGE_RE.test(url)) return url;
  }
  return null;
}

/** 목록 미리보기용 텍스트 (이미지/유튜브/URL 만 있는 줄은 제외). */
export function excerpt(content: string): string {
  return content
    .split("\n")
    .filter((line) => {
      const url = line.trim();
      return !URL_RE.test(url); // URL 단독 줄(이미지·유튜브·링크) 제거
    })
    .join(" ")
    .trim();
}

/** 유튜브 URL 에서 영상 ID 추출 (watch / youtu.be / shorts / embed 지원) */
function youtubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([A-Za-z0-9_-]{11})/,
    /(?:youtu\.be\/)([A-Za-z0-9_-]{11})/,
    /(?:youtube\.com\/(?:shorts|embed)\/)([A-Za-z0-9_-]{11})/,
  ];
  for (const re of patterns) {
    const m = url.match(re);
    if (m) return m[1];
  }
  return null;
}

export default function PostContent({ content }: { content: string }) {
  const lines = content.split("\n");
  const blocks: React.ReactNode[] = [];
  let textBuffer: string[] = [];

  const flushText = (key: string) => {
    if (textBuffer.length === 0) return;
    const text = textBuffer.join("\n");
    textBuffer = [];
    if (text.trim() === "") return;
    blocks.push(
      <p key={key} className="whitespace-pre-wrap leading-relaxed">
        {text}
      </p>,
    );
  };

  lines.forEach((line, i) => {
    const url = line.trim();
    const ytId = youtubeId(url);

    if (ytId) {
      flushText(`t-${i}`);
      blocks.push(
        <div
          key={`yt-${i}`}
          className="aspect-video w-full overflow-hidden rounded-xl bg-black/5 shadow-sm dark:bg-white/5"
        >
          <iframe
            className="h-full w-full"
            src={`https://www.youtube.com/embed/${ytId}`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>,
      );
    } else if (IMAGE_RE.test(url)) {
      flushText(`t-${i}`);
      blocks.push(
        // 임의의 외부 URL 이라 next/image 대신 <img> 사용
        // eslint-disable-next-line @next/next/no-img-element
        <img
          key={`img-${i}`}
          src={url}
          alt=""
          className="mx-auto max-h-[70vh] w-auto max-w-full rounded-xl shadow-sm"
          loading="lazy"
        />,
      );
    } else if (URL_RE.test(url)) {
      flushText(`t-${i}`);
      blocks.push(
        <p key={`link-${i}`}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-600 underline underline-offset-2 hover:text-sky-700 dark:text-sky-400"
          >
            {url}
          </a>
        </p>,
      );
    } else {
      textBuffer.push(line);
    }
  });
  flushText("t-end");

  return <div className="flex flex-col gap-4">{blocks.map((b) => b)}</div>;
}
