"use client";

import { useEffect, useCallback, useRef } from "react";
import confetti from "canvas-confetti";
import { getRandomMessage } from "@/lib/messages";

type ConfettiProps = {
  show: boolean;
  onClose: () => void;
};

export default function Confetti({ show, onClose }: ConfettiProps) {
  const messageRef = useRef<string>("");

  const fireConfetti = useCallback(() => {
    const colors = ["#ff69b4", "#ff1493", "#ff6eb4", "#ffb6c1", "#ffc0cb"];

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.2, y: 0.6 },
      colors,
    });

    confetti({
      particleCount: 80,
      spread: 70,
      origin: { x: 0.8, y: 0.6 },
      colors,
    });

    setTimeout(() => {
      confetti({
        particleCount: 120,
        spread: 100,
        origin: { x: 0.5, y: 0.4 },
        colors,
      });
    }, 300);
  }, []);

  useEffect(() => {
    if (show) {
      messageRef.current = getRandomMessage();
      fireConfetti();
      const timer = setTimeout(fireConfetti, 1200);
      return () => clearTimeout(timer);
    }
  }, [show, fireConfetti]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-8 mx-4 max-w-sm text-center shadow-2xl animate-bounce-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-5xl mb-4">🎉</div>
        <h2 className="text-2xl font-bold text-pink-500 mb-3">
          Puzzle Complete!
        </h2>
        <p className="text-gray-600 text-lg leading-relaxed mb-6">
          {messageRef.current}
        </p>
        <button
          onClick={onClose}
          className="bg-pink-500 text-white px-8 py-3 rounded-full hover:bg-pink-600 active:bg-pink-700 transition-colors font-medium text-lg"
        >
          Next Puzzle 💕
        </button>
      </div>
    </div>
  );
}
