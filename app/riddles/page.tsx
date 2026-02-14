"use client";

import { useState, useCallback } from "react";
import confetti from "canvas-confetti";
import GameShell from "@/components/GameShell";
import Confetti from "@/components/Confetti";
import { riddles } from "@/lib/riddle-data";

export default function RiddlesPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showHint, setShowHint] = useState(false);
  const [hintedRiddles, setHintedRiddles] = useState<number[]>([]);
  const [shaking, setShaking] = useState(false);
  const [showComplete, setShowComplete] = useState(false);

  const riddle = riddles[currentIndex];
  const total = riddles.length;
  const isCorrect =
    selectedOption !== null && riddle?.options[selectedOption] === riddle?.answer;

  const fireMiniBurst = useCallback(() => {
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { x: 0.5, y: 0.6 },
      colors: ["#ff69b4", "#ff1493", "#ff6eb4", "#ffb6c1"],
    });
  }, []);

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (answered) return;
      setSelectedOption(optionIndex);

      if (riddle.options[optionIndex] === riddle.answer) {
        setAnswered(true);
        fireMiniBurst();
      } else {
        setShaking(true);
        setTimeout(() => {
          setShaking(false);
          setSelectedOption(null);
        }, 600);
      }
    },
    [answered, riddle, fireMiniBurst]
  );

  const handleHint = useCallback(() => {
    setShowHint(true);
    setHintedRiddles((prev) => [...prev, currentIndex]);
  }, [currentIndex]);

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= total) {
      setShowComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setAnswered(false);
      setSelectedOption(null);
      setShowHint(false);
    }
  }, [currentIndex, total]);

  const penaltyMessage =
    hintedRiddles.length > 0
      ? `\n\nYou used ${hintedRiddles.length} hint${hintedRiddles.length > 1 ? "s" : ""} — ${
          hintedRiddles.map((i) => riddles[i].hintPenalty).join(" ")
        }`
      : "";

  return (
    <GameShell title="Riddle Me This 🔮">
      <div className="w-full max-w-md flex flex-col gap-5">
        {/* Progress bar */}
        <div className="w-full bg-pink-100 rounded-full h-2.5">
          <div
            className="bg-pink-500 h-2.5 rounded-full transition-all duration-500"
            style={{ width: `${((currentIndex + (answered ? 1 : 0)) / total) * 100}%` }}
          />
        </div>
        <p className="text-xs text-center text-pink-400 font-medium -mt-3">
          Riddle {currentIndex + 1} of {total}
        </p>

        {/* Riddle card */}
        <div
          className={`bg-white rounded-2xl p-6 shadow-md ${shaking ? "animate-shake" : "animate-slide-up"}`}
          key={currentIndex}
        >
          <div className="text-3xl text-center mb-4">🤔</div>
          <p className="text-lg text-gray-800 font-medium text-center leading-relaxed mb-6">
            {riddle.question}
          </p>

          {/* Hint */}
          {!showHint && !answered && (
            <button
              onClick={handleHint}
              className="w-full mb-4 py-2 text-sm text-pink-400 hover:text-pink-600 transition-colors"
            >
              Need a hint? 💭
            </button>
          )}
          {showHint && !answered && (
            <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-xl p-3 animate-fade-in">
              <p className="text-sm text-yellow-700">{riddle.hint}</p>
              <p className="text-xs text-pink-500 font-semibold mt-1">
                {riddle.hintPenalty}
              </p>
            </div>
          )}

          {/* Options */}
          <div className="flex flex-col gap-3">
            {riddle.options.map((option, i) => {
              let btnClass =
                "w-full text-left px-5 py-4 rounded-xl border-2 font-medium text-base transition-all ";

              if (!answered) {
                if (selectedOption === i && shaking) {
                  btnClass += "border-red-300 bg-red-50 text-red-600";
                } else {
                  btnClass +=
                    "border-pink-100 bg-pink-50/50 text-gray-700 hover:border-pink-300 active:scale-[0.97]";
                }
              } else if (option === riddle.answer) {
                btnClass += "border-green-400 bg-green-50 text-green-700";
              } else {
                btnClass += "border-gray-100 bg-gray-50 text-gray-400";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  disabled={answered}
                  className={btnClass}
                >
                  {option}
                </button>
              );
            })}
          </div>

          {/* Success feedback */}
          {answered && (
            <div className="mt-5 animate-fade-in text-center">
              <p className="text-green-600 font-semibold text-lg mb-1">
                You got it! 🎉
              </p>
              <p className="text-gray-500 text-sm mb-4">
                You&apos;re so smart, babe!
              </p>
              <button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-full hover:from-pink-600 hover:to-purple-600 active:scale-95 transition-all font-medium text-lg shadow-md shadow-pink-200"
              >
                {currentIndex + 1 >= total
                  ? "See Final Surprise 🎉"
                  : "Next Riddle →"}
              </button>
            </div>
          )}
        </div>
      </div>

      <Confetti
        show={showComplete}
        onClose={() => setShowComplete(false)}
        title="All Riddles Solved!"
        message={`You cracked them all! My brilliant, beautiful love. 🧠💕${penaltyMessage}`}
        buttonText="Back to Games 💖"
        navigateHome
      />
    </GameShell>
  );
}
