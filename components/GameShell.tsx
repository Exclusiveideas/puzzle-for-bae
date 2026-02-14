"use client";

import Link from "next/link";

type GameShellProps = {
  title: string;
  children: React.ReactNode;
  scrollable?: boolean;
};

export default function GameShell({
  title,
  children,
  scrollable = false,
}: GameShellProps) {
  return (
    <main
      className={`flex flex-col h-dvh bg-gradient-to-br from-pink-50 to-purple-50 ${
        scrollable ? "overflow-y-auto" : "overflow-hidden"
      }`}
    >
      <header className="flex items-center px-4 py-3 shrink-0">
        <Link
          href="/"
          className="flex items-center justify-center w-10 h-10 rounded-full bg-white/80 shadow-sm text-pink-500 hover:bg-white active:scale-95 transition-all"
          aria-label="Back to games"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </Link>
        <h1 className="flex-1 text-center text-xl md:text-2xl font-bold text-pink-500 pr-10">
          {title}
        </h1>
      </header>

      <div
        className={`flex-1 flex flex-col items-center ${
          scrollable ? "pb-8" : "justify-center"
        } px-4`}
      >
        {children}
      </div>
    </main>
  );
}
