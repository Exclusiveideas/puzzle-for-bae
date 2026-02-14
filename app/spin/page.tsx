"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import confetti from "canvas-confetti";
import GameShell from "@/components/GameShell";
import Modal from "@/components/Modal";
import { wheelSegments } from "@/lib/spin-data";

export default function SpinPage() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rotationRef = useRef(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<(typeof wheelSegments)[0] | null>(null);
  const [canvasSize, setCanvasSize] = useState(300);

  const segmentCount = wheelSegments.length;
  const segmentAngle = (2 * Math.PI) / segmentCount;

  // Responsive canvas sizing
  useEffect(() => {
    const updateSize = () => {
      const vw = window.innerWidth * 0.8;
      setCanvasSize(Math.min(vw, 320));
    };
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const drawWheel = useCallback(
    (rotation: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const size = canvas.width;
      const center = size / 2;
      const radius = center - 4;

      ctx.clearRect(0, 0, size, size);

      for (let i = 0; i < segmentCount; i++) {
        const startAngle = rotation + i * segmentAngle - Math.PI / 2;
        const endAngle = startAngle + segmentAngle;

        // Draw segment
        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, radius, startAngle, endAngle);
        ctx.closePath();
        ctx.fillStyle = wheelSegments[i].color;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,255,255,0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw text
        ctx.save();
        ctx.translate(center, center);
        ctx.rotate(startAngle + segmentAngle / 2);
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = `bold ${Math.round(size / 22)}px sans-serif`;
        ctx.fillText(wheelSegments[i].icon, radius * 0.55, -4);
        ctx.font = `${Math.round(size / 28)}px sans-serif`;
        ctx.fillText(wheelSegments[i].label, radius * 0.55, 12);
        ctx.restore();
      }

      // Center circle
      ctx.beginPath();
      ctx.arc(center, center, radius * 0.15, 0, 2 * Math.PI);
      ctx.fillStyle = "white";
      ctx.fill();
      ctx.strokeStyle = "#ff69b4";
      ctx.lineWidth = 3;
      ctx.stroke();
    },
    [segmentCount, segmentAngle]
  );

  // Initial draw
  useEffect(() => {
    drawWheel(rotationRef.current);
  }, [drawWheel, canvasSize]);

  const getSegmentAtTop = useCallback(
    (rotation: number) => {
      // The pointer is at the top (12 o'clock). We need to find which segment is there.
      // Normalize rotation to 0-2PI
      const normalizedAngle =
        (((-rotation % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI));
      const index = Math.floor(normalizedAngle / segmentAngle) % segmentCount;
      return wheelSegments[index];
    },
    [segmentAngle, segmentCount]
  );

  const spin = useCallback(() => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    // Random spin: 5-8 full rotations + random offset
    const extraRotations = (5 + Math.random() * 3) * 2 * Math.PI;
    const randomOffset = Math.random() * 2 * Math.PI;
    const targetAngle = extraRotations + randomOffset;
    const startRotation = rotationRef.current;
    const duration = 4000;
    const startTime = performance.now();

    function animate(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Cubic ease-out for satisfying deceleration
      const eased = 1 - Math.pow(1 - progress, 3);

      const currentRotation = startRotation + targetAngle * eased;
      rotationRef.current = currentRotation;
      drawWheel(currentRotation);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        const segment = getSegmentAtTop(currentRotation);
        setResult(segment);
        setSpinning(false);

        confetti({
          particleCount: 60,
          spread: 80,
          origin: { x: 0.5, y: 0.5 },
          colors: ["#ff69b4", "#ff1493", "#ff6eb4", "#ffb6c1"],
        });
      }
    }

    requestAnimationFrame(animate);
  }, [spinning, drawWheel, getSegmentAtTop]);

  return (
    <GameShell title="Spin the Wheel 🎡">
      <div className="flex flex-col items-center gap-5">
        {/* Pointer triangle */}
        <div className="relative">
          <div
            className="absolute left-1/2 -translate-x-1/2 -top-3 z-10 w-0 h-0"
            style={{
              borderLeft: "12px solid transparent",
              borderRight: "12px solid transparent",
              borderTop: "20px solid #ff1493",
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))",
            }}
          />
          <canvas
            ref={canvasRef}
            width={canvasSize * 2}
            height={canvasSize * 2}
            className="rounded-full shadow-lg"
            style={{ width: canvasSize, height: canvasSize }}
            onClick={spin}
          />
        </div>

        <button
          onClick={spin}
          disabled={spinning}
          className={`w-full max-w-xs py-4 rounded-full font-bold text-lg text-white transition-all shadow-md shadow-pink-200 ${
            spinning
              ? "bg-pink-300 cursor-not-allowed shadow-none"
              : "bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 active:scale-95"
          }`}
        >
          {spinning ? "Spinning..." : "SPIN! 🎰"}
        </button>

        <p className="text-pink-300 text-xs">Tap the wheel or button to spin</p>
      </div>

      <Modal open={result !== null} onClose={() => setResult(null)}>
        {result && (
          <>
            <div className="text-5xl mb-3">{result.icon}</div>
            <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-3">
              {result.label}!
            </h2>
            <p className="text-gray-600 text-base leading-relaxed mb-5">
              {result.result}
            </p>
            <button
              onClick={() => setResult(null)}
              className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full hover:from-pink-600 hover:to-purple-600 active:scale-95 transition-all font-medium shadow-md shadow-pink-200"
            >
              Spin Again 💕
            </button>
          </>
        )}
      </Modal>
    </GameShell>
  );
}
