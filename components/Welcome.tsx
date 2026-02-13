"use client";

import { useState, useCallback } from "react";
import confetti from "canvas-confetti";

export default function Welcome() {
  const [show, setShow] = useState(true);
  const [closing, setClosing] = useState(false);

  const fireLoveConfetti = useCallback(() => {
    const heart = confetti.shapeFromText({ text: "❤️", scalar: 2 });
    const colors = ["#ff69b4", "#ff1493", "#ff6eb4", "#e91e63", "#f44336"];

    confetti({
      particleCount: 60,
      spread: 80,
      origin: { x: 0.5, y: 0.5 },
      shapes: [heart],
      scalar: 2,
      colors,
    });

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x: 0.3, y: 0.6 },
      shapes: [heart],
      scalar: 1.5,
      colors,
    });

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x: 0.7, y: 0.6 },
      shapes: [heart],
      scalar: 1.5,
      colors,
    });
  }, []);

  const handleAccept = useCallback(() => {
    setClosing(true);
    fireLoveConfetti();
    setTimeout(() => fireLoveConfetti(), 600);
    setTimeout(() => setShow(false), 1500);
  }, [fireLoveConfetti]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-400/80 to-purple-500/80 backdrop-blur-sm ${
        closing ? "animate-fade-out" : "animate-fade-in"
      }`}
    >
      <div
        className={`bg-white rounded-3xl p-8 mx-4 max-w-md text-center shadow-2xl ${
          closing ? "animate-fade-out" : "animate-bounce-in"
        }`}
      >
        <div className="text-6xl mb-4">💖</div>
        <h1 className="text-3xl font-bold text-pink-500 mb-2">
          Hey Beautiful!
        </h1>
        <p className="text-gray-600 text-lg leading-relaxed mb-4">
          I made something special just for you.
        </p>
        <p className="text-gray-700 text-base leading-relaxed mb-2">
          Each puzzle holds a picture of us — but I&apos;ve scrambled them all up.
          Think you can put them back together?
        </p>
        <p className="text-pink-500 font-semibold text-lg mb-6">
          I dare you. 😏
        </p>
        <button
          onClick={handleAccept}
          disabled={closing}
          className="bg-pink-500 text-white px-8 py-3 rounded-full hover:bg-pink-600 active:bg-pink-700 transition-colors font-medium text-lg disabled:opacity-70"
        >
          Challenge Accepted 💪
        </button>
      </div>
    </div>
  );
}
