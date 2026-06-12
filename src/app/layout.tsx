import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "채은이의 일기",
  description: "채은이의 일상 · 여행 · 개발 이야기를 담은 블로그",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ko"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <div className="cloud-field" aria-hidden="true">
          <span className="cloud cloud-1" />
          <span className="cloud cloud-2" />
          <span className="cloud cloud-3" />
          <span className="cloud cloud-4" />
          <span className="cloud cloud-5" />
          <span className="cloud cloud-6" />
          <span className="cloud cloud-7" />
          <span className="cloud cloud-8" />
        </div>
        <header className="sticky top-0 z-10 border-b border-white/40 bg-white/40 backdrop-blur-md dark:border-white/10 dark:bg-black/20">
          <div className="mx-auto flex w-full max-w-3xl items-center px-6 py-4">
            <Link href="/" className="text-lg font-bold">
              ☁️ 채은이의 일기
            </Link>
          </div>
        </header>
        <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
          <div className="rounded-[2rem] border border-white/60 bg-white/70 p-6 shadow-[0_10px_50px_rgba(150,180,220,0.3)] backdrop-blur-xl sm:p-9 dark:border-white/10 dark:bg-white/[0.06]">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}
