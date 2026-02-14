"use client";

import Link from "next/link";
import { games } from "@/lib/games";
import Welcome from "@/components/Welcome";

export default function Home() {
  return (
    <main className="flex flex-col h-dvh bg-gradient-to-br from-pink-50 to-purple-50 overflow-y-auto">
      <div className="flex flex-col items-center px-4 py-8 gap-6">
        <div className="text-center">
          <div className="text-5xl mb-3">💖</div>
          <h1 className="text-3xl md:text-4xl font-bold text-pink-500 mb-2">
            Our Love Games
          </h1>
          <p className="text-gray-500 text-base">
            Pick a game and have fun, my love
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full max-w-lg">
          {games.map((game) => (
            <Link
              key={game.href}
              href={game.href}
              className="flex items-center gap-4 bg-white rounded-2xl p-5 shadow-sm hover:shadow-lg active:scale-[0.97] transition-all border border-pink-100"
            >
              <div className="text-4xl shrink-0">{game.icon}</div>
              <div className="min-w-0">
                <h2 className="font-bold text-pink-500 text-base leading-tight">
                  {game.title}
                </h2>
                <p className="text-gray-400 text-sm mt-1 leading-snug">
                  {game.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        <p className="text-pink-300 text-xs mt-4">
          Made with love, just for you
        </p>
      </div>

      <Welcome />
    </main>
  );
}
