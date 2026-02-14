"use client";

import { useState, useCallback, useEffect } from "react";
import confetti from "canvas-confetti";

const SEEN_KEY = "puzzle-for-bae-welcomed";

export default function Welcome() {
  const [show, setShow] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem(SEEN_KEY)) {
      setShow(true);
    }
  }, []);

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
    setTimeout(() => {
      localStorage.setItem(SEEN_KEY, "true");
      setShow(false);
    }, 1500);
  }, [fireLoveConfetti]);

  if (!show) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-pink-400/80 to-purple-500/80 backdrop-blur-md ${
        closing ? "animate-fade-out" : "animate-fade-in"
      }`}
    >
      <div
        className={`relative bg-white rounded-3xl p-8 mx-4 max-w-md text-center shadow-2xl overflow-hidden ${
          closing ? "animate-fade-out" : "animate-bounce-in"
        }`}
      >
        {/* Decorative top gradient */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-400 via-purple-400 to-pink-400" />

        {/* Decorative floating hearts */}
        <div className="absolute top-5 left-5 text-pink-200 opacity-40 text-sm">
          &#10084;
        </div>
        <div className="absolute top-12 right-6 text-purple-200 opacity-30 text-xs">
          &#10084;
        </div>
        <div className="absolute bottom-16 left-8 text-pink-200 opacity-25 text-xs">
          &#10022;
        </div>
        <div className="absolute bottom-20 right-5 text-purple-200 opacity-30 text-sm">
          &#10022;
        </div>

        <div className="pt-3">
          <div className="text-6xl mb-4">💖</div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-2">
            Hey Beautiful!
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed mb-4">
            I made something special just for you.
          </p>
          <p className="text-gray-700 text-base leading-relaxed mb-2">
            I&apos;ve prepared some fun games and surprises — each one is a
            little piece of how much I love you.
          </p>
          <p className="text-pink-500 font-semibold text-lg mb-6">
            Ready to play? 😏
          </p>
          <button
            onClick={handleAccept}
            disabled={closing}
            className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full hover:from-pink-600 hover:to-purple-600 active:scale-95 transition-all font-medium text-lg disabled:opacity-70 shadow-md shadow-pink-200"
          >
            Let&apos;s Go! 💪
          </button>
        </div>
      </div>
    </div>
  );
}
