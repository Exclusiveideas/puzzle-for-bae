"use client";

import { useRef, useEffect, useState } from "react";
import GameShell from "@/components/GameShell";
import { milestones } from "@/lib/timeline-data";

function TimelineEntry({
  milestone,
  index,
}: {
  milestone: (typeof milestones)[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true);
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className="relative flex gap-4 pb-10 last:pb-0">
      {/* Timeline line + dot */}
      <div className="flex flex-col items-center shrink-0">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center text-xl shadow-sm transition-all duration-700 ${
            visible
              ? "bg-pink-500 scale-100"
              : "bg-pink-200 scale-75"
          }`}
          style={{ transitionDelay: `${index * 80}ms` }}
        >
          {milestone.emoji}
        </div>
        {index < milestones.length - 1 && (
          <div className="w-0.5 flex-1 bg-gradient-to-b from-pink-300 to-pink-100 mt-1" />
        )}
      </div>

      {/* Content card */}
      <div
        className={`flex-1 bg-white rounded-2xl p-5 shadow-sm border border-pink-50 transition-all duration-700 ${
          visible
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-6"
        }`}
        style={{ transitionDelay: `${index * 80 + 100}ms` }}
      >
        <span className="text-xs font-semibold text-pink-400 uppercase tracking-wider">
          {milestone.date}
        </span>
        <h3 className="text-lg font-bold text-gray-800 mt-1 mb-2">
          {milestone.title}
        </h3>
        <p className="text-gray-600 text-sm leading-relaxed">
          {milestone.description}
        </p>
      </div>
    </div>
  );
}

export default function TimelinePage() {
  return (
    <GameShell title="Our Timeline 📖" scrollable>
      <div className="w-full max-w-md py-6">
        <div className="text-center mb-8 animate-fade-in">
          <div className="text-4xl mb-2">💕</div>
          <h2 className="text-xl font-bold text-pink-500">Our Love Story</h2>
          <p className="text-gray-400 text-sm mt-1">
            Scroll through our journey together
          </p>
        </div>

        <div className="flex flex-col">
          {milestones.map((milestone, i) => (
            <TimelineEntry key={i} milestone={milestone} index={i} />
          ))}
        </div>

        <div className="text-center mt-8 animate-fade-in">
          <p className="text-pink-400 font-medium">
            Every moment with you is my favorite. 💖
          </p>
        </div>
      </div>
    </GameShell>
  );
}
