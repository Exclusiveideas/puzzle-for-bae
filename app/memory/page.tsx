"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import GameShell from "@/components/GameShell";
import Confetti from "@/components/Confetti";
import { memoryPairs } from "@/lib/memory-data";

type Card = {
  id: string;
  pairId: string;
  text: string;
  side: "a" | "b";
};

function buildDeck(): Card[] {
  const cards: Card[] = [];
  for (const pair of memoryPairs) {
    cards.push({ id: `${pair.id}-a`, pairId: pair.id, text: pair.cardA, side: "a" });
    cards.push({ id: `${pair.id}-b`, pairId: pair.id, text: pair.cardB, side: "b" });
  }
  // Fisher-Yates shuffle
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]];
  }
  return cards;
}

export default function MemoryPage() {
  const [cards] = useState<Card[]>(() => buildDeck());
  const [flipped, setFlipped] = useState<Set<string>>(new Set());
  const [matched, setMatched] = useState<Set<string>>(new Set());
  const [selected, setSelected] = useState<Card[]>([]);
  const [moves, setMoves] = useState(0);
  const [loveNote, setLoveNote] = useState<string | null>(null);
  const [showComplete, setShowComplete] = useState(false);
  const lockRef = useRef(false);

  const isComplete = matched.size === memoryPairs.length;

  useEffect(() => {
    if (isComplete && !showComplete) {
      const timer = setTimeout(() => setShowComplete(true), 600);
      return () => clearTimeout(timer);
    }
  }, [isComplete, showComplete]);

  const handleCardTap = useCallback(
    (card: Card) => {
      if (lockRef.current) return;
      if (flipped.has(card.id) || matched.has(card.pairId)) return;

      const newFlipped = new Set(flipped);
      newFlipped.add(card.id);
      setFlipped(newFlipped);

      const newSelected = [...selected, card];
      setSelected(newSelected);

      if (newSelected.length === 2) {
        setMoves((m) => m + 1);
        lockRef.current = true;

        const [first, second] = newSelected;
        if (first.pairId === second.pairId) {
          // Match found
          const note = memoryPairs.find((p) => p.id === first.pairId)?.loveNote ?? "";
          setTimeout(() => {
            setMatched((prev) => new Set([...prev, first.pairId]));
            setLoveNote(note);
            setSelected([]);
            lockRef.current = false;
            setTimeout(() => setLoveNote(null), 2000);
          }, 400);
        } else {
          // No match — flip back
          setTimeout(() => {
            setFlipped((prev) => {
              const next = new Set(prev);
              next.delete(first.id);
              next.delete(second.id);
              return next;
            });
            setSelected([]);
            lockRef.current = false;
          }, 800);
        }
      }
    },
    [flipped, matched, selected]
  );

  // 4 columns for 12 cards (3 rows x 4 cols)
  const cols = 4;

  return (
    <GameShell title="Memory Match 🃏">
      <div className="w-full max-w-md flex flex-col items-center gap-4">
        <p className="text-sm text-gray-500">
          Moves: <span className="font-bold text-pink-500">{moves}</span>
          <span className="mx-3 text-pink-200">|</span>
          Pairs: <span className="font-bold text-pink-500">{matched.size}/{memoryPairs.length}</span>
        </p>

        {/* Love note toast */}
        {loveNote && (
          <div className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-medium animate-bounce-in shadow-lg">
            {loveNote}
          </div>
        )}

        <div
          className="grid gap-2 w-full"
          style={{
            gridTemplateColumns: `repeat(${cols}, 1fr)`,
            maxWidth: "min(85vw, 400px)",
          }}
        >
          {cards.map((card) => {
            const isFlipped = flipped.has(card.id) || matched.has(card.pairId);
            const isMatched = matched.has(card.pairId);

            return (
              <button
                key={card.id}
                onClick={() => handleCardTap(card)}
                className="relative aspect-[3/4] rounded-xl transition-all duration-100"
                style={{ perspective: "600px" }}
              >
                <div
                  className="absolute inset-0 transition-transform duration-400"
                  style={{
                    transformStyle: "preserve-3d",
                    transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
                  }}
                >
                  {/* Card back */}
                  <div
                    className={`absolute inset-0 rounded-xl flex items-center justify-center border-2 ${
                      isMatched
                        ? "border-green-300 bg-green-50"
                        : "border-pink-200 bg-gradient-to-br from-pink-400 to-purple-400 active:scale-95"
                    } transition-all`}
                    style={{ backfaceVisibility: "hidden" }}
                  >
                    <span className="text-2xl">
                      {isMatched ? "✓" : "💖"}
                    </span>
                  </div>

                  {/* Card front */}
                  <div
                    className={`absolute inset-0 rounded-xl flex items-center justify-center p-2 border-2 ${
                      isMatched
                        ? "border-green-300 bg-green-50"
                        : "border-pink-300 bg-white"
                    }`}
                    style={{
                      backfaceVisibility: "hidden",
                      transform: "rotateY(180deg)",
                    }}
                  >
                    <span
                      className={`text-xs sm:text-sm font-semibold text-center leading-tight ${
                        isMatched ? "text-green-600" : "text-pink-600"
                      }`}
                    >
                      {card.text}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <Confetti
        show={showComplete}
        onClose={() => setShowComplete(false)}
        title="All Pairs Found!"
        message={`You matched them all in ${moves} moves! Just like how we're a perfect match. 💕`}
        buttonText="Back to Games 💖"
        navigateHome
      />
    </GameShell>
  );
}
