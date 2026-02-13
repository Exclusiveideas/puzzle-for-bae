"use client";

import { useState, useCallback } from "react";
import Puzzle from "@/components/Puzzle";
import Sidebar from "@/components/Sidebar";
import Confetti from "@/components/Confetti";
import Welcome from "@/components/Welcome";

export default function Home() {
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
    <main className="flex h-dvh bg-gradient-to-br from-pink-50 to-purple-50">
      <Sidebar activeImage={activeImage} onSelectImage={handleSelectImage} />

      <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-auto">
        <h1 className="text-2xl md:text-3xl font-bold text-pink-500 mb-6">
          Puzzle For Bae 💖
        </h1>

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

      <Confetti show={showConfetti} onClose={handleCloseConfetti} />
      <Welcome />
    </main>
  );
}
