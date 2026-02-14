"use client";

import { useEffect, useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import confetti from "canvas-confetti";
import { getRandomMessage } from "@/lib/messages";

type ConfettiProps = {
  show: boolean;
  onClose: () => void;
  title?: string;
  message?: string;
  buttonText?: string;
  navigateHome?: boolean;
};

export default function Confetti({
  show,
  onClose,
  title = "Puzzle Complete!",
  message: messageProp,
  buttonText = "Next Puzzle 💕",
  navigateHome = false,
}: ConfettiProps) {
  const [randomMessage, setRandomMessage] = useState("");
  const router = useRouter();

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
      if (!messageProp) {
        setRandomMessage(getRandomMessage());
      }
      fireConfetti();
      const timer = setTimeout(fireConfetti, 1200);
      return () => clearTimeout(timer);
    }
  }, [show, fireConfetti, messageProp]);

  const handleClose = useCallback(() => {
    onClose();
    if (navigateHome) {
      router.push("/");
    }
  }, [onClose, navigateHome, router]);

  if (!show) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fade-in"
      onClick={handleClose}
    >
      <div
        className="relative bg-white rounded-3xl p-8 mx-4 max-w-sm text-center shadow-2xl animate-bounce-in overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative top gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400" />

        {/* Decorative sparkles */}
        <div className="absolute top-4 left-5 text-pink-200 text-xs opacity-50">
          &#10022;
        </div>
        <div className="absolute top-4 right-5 text-purple-200 text-xs opacity-50">
          &#10022;
        </div>

        <div className="pt-2">
          <div className="text-5xl mb-4">🎉</div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-3">
            {title}
          </h2>
          <p className="text-gray-600 text-lg leading-relaxed mb-6">
            {messageProp ?? randomMessage}
          </p>
          <button
            onClick={handleClose}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full hover:from-pink-600 hover:to-purple-600 active:scale-95 transition-all font-medium text-lg shadow-md shadow-pink-200"
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
