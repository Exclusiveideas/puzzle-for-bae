"use client";

import { useState, useCallback } from "react";
import confetti from "canvas-confetti";
import GameShell from "@/components/GameShell";
import Confetti from "@/components/Confetti";
import { quizQuestions } from "@/lib/quiz-data";

export default function QuizPage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [answered, setAnswered] = useState(false);
  const [showFinal, setShowFinal] = useState(false);
  const [shaking, setShaking] = useState(false);

  const question = quizQuestions[currentIndex];
  const isCorrect = selectedOption === question?.correctIndex;
  const total = quizQuestions.length;

  const fireMiniBurst = useCallback(() => {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { x: 0.5, y: 0.7 },
      colors: ["#ff69b4", "#ff1493", "#ff6eb4", "#ffb6c1"],
    });
  }, []);

  const handleSelect = useCallback(
    (optionIndex: number) => {
      if (answered) return;
      setSelectedOption(optionIndex);
      setAnswered(true);

      if (optionIndex === question.correctIndex) {
        setScore((s) => s + 1);
        fireMiniBurst();
      } else {
        setShaking(true);
        setTimeout(() => setShaking(false), 500);
      }
    },
    [answered, question, fireMiniBurst]
  );

  const handleNext = useCallback(() => {
    if (currentIndex + 1 >= total) {
      setShowFinal(true);
    } else {
      setCurrentIndex((i) => i + 1);
      setSelectedOption(null);
      setAnswered(false);
    }
  }, [currentIndex, total]);

  const getFinalMessage = () => {
    const pct = score / total;
    if (pct === 1)
      return "PERFECT SCORE! You know us better than anyone! 🏆💕";
    if (pct >= 0.75)
      return `${score}/${total} — You know me so well! I'm blushing over here. 🥰`;
    if (pct >= 0.5)
      return `${score}/${total} — Not bad! We just need more date nights. 😏`;
    return `${score}/${total} — Looks like we need to spend even MORE time together! 💕`;
  };

  if (showFinal) {
    return (
      <GameShell title="Quiz Results 💡">
        <Confetti
          show
          onClose={() => setShowFinal(false)}
          title={score === total ? "Perfect Score!" : "Quiz Complete!"}
          message={getFinalMessage()}
          buttonText="Back to Games 💕"
          navigateHome
        />
      </GameShell>
    );
  }

  return (
    <GameShell title="How Well Do You Know Us? 💡">
      <div className="w-full max-w-md flex flex-col gap-6">
        {/* Progress dots */}
        <div className="flex justify-center gap-2">
          {quizQuestions.map((_, i) => (
            <div
              key={i}
              className={`w-2.5 h-2.5 rounded-full transition-colors ${
                i < currentIndex
                  ? "bg-pink-400"
                  : i === currentIndex
                  ? "bg-pink-500 scale-125"
                  : "bg-pink-200"
              }`}
            />
          ))}
        </div>

        {/* Question card */}
        <div
          className={`bg-white rounded-2xl p-6 shadow-md animate-slide-up ${
            shaking ? "animate-shake" : ""
          }`}
          key={currentIndex}
        >
          <p className="text-xs text-pink-300 mb-2 font-medium">
            Question {currentIndex + 1} of {total}
          </p>
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            {question.question}
          </h2>

          <div className="flex flex-col gap-3">
            {question.options.map((option, i) => {
              let btnClass =
                "w-full text-left px-5 py-4 rounded-xl border-2 font-medium text-base transition-all ";

              if (!answered) {
                btnClass +=
                  "border-pink-100 bg-pink-50/50 text-gray-700 hover:border-pink-300 active:scale-[0.97]";
              } else if (i === question.correctIndex) {
                btnClass +=
                  "border-green-400 bg-green-50 text-green-700";
              } else if (i === selectedOption) {
                btnClass += "border-red-300 bg-red-50 text-red-600";
              } else {
                btnClass +=
                  "border-gray-100 bg-gray-50 text-gray-400";
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

          {/* Feedback message */}
          {answered && (
            <div className="mt-5 animate-fade-in">
              <p
                className={`text-base font-medium ${
                  isCorrect ? "text-green-600" : "text-pink-500"
                }`}
              >
                {isCorrect ? question.rightMessage : question.wrongMessage}
              </p>
              <button
                onClick={handleNext}
                className="mt-4 w-full bg-gradient-to-r from-pink-500 to-purple-500 text-white py-3 rounded-full hover:from-pink-600 hover:to-purple-600 active:scale-95 transition-all font-medium text-lg shadow-md shadow-pink-200"
              >
                {currentIndex + 1 >= total ? "See Results 🎉" : "Next Question →"}
              </button>
            </div>
          )}
        </div>
      </div>
    </GameShell>
  );
}
