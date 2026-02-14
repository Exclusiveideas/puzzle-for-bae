"use client";

import { useState, useCallback } from "react";
import Puzzle from "@/components/Puzzle";
import Sidebar from "@/components/Sidebar";
import Confetti from "@/components/Confetti";
import GameShell from "@/components/GameShell";

export default function PuzzlePage() {
  const [activeImage, setActiveImage] = useState<string>("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [puzzleKey, setPuzzleKey] = useState(0);

  const handleSelectImage = useCallback((src: string) => {
    setActiveImage(src);
    setShowConfetti(false);
    setPuzzleKey((prev) => prev + 1);
  }, []);

  const handleSolved = useCallback(() => {
    setShowConfetti(true);
  }, []);

  const handleCloseConfetti = useCallback(() => {
    setShowConfetti(false);
  }, []);

  return (
    <GameShell title="Sliding Puzzle 🧩">
      <div className="flex flex-1 w-full">
        <Sidebar activeImage={activeImage} onSelectImage={handleSelectImage} />

        <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-auto">
          {activeImage ? (
            <Puzzle
              key={puzzleKey}
              imageSrc={activeImage}
              onSolved={handleSolved}
            />
          ) : (
            <p className="text-pink-300 text-lg">
              Pick a puzzle from the sidebar to begin!
            </p>
          )}
        </div>
      </div>

      <Confetti show={showConfetti} onClose={handleCloseConfetti} />
    </GameShell>
  );
}
