"use client";

import { useState, useCallback, useEffect } from "react";
import confetti from "canvas-confetti";
import GameShell from "@/components/GameShell";
import Sidebar from "@/components/Sidebar";
import Modal from "@/components/Modal";
import { getRandomLoveLetter } from "@/lib/love-letters";

const GRID = 3;
const TOTAL = GRID * GRID;

type Piece = {
  id: number;
  correctRow: number;
  correctCol: number;
  placed: boolean;
};

function createPieces(): Piece[] {
  const pieces: Piece[] = [];
  for (let r = 0; r < GRID; r++) {
    for (let c = 0; c < GRID; c++) {
      pieces.push({
        id: r * GRID + c,
        correctRow: r,
        correctCol: c,
        placed: false,
      });
    }
  }
  // Fisher-Yates shuffle
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  return pieces;
}

export default function JigsawPage() {
  const [activeImage, setActiveImage] = useState<string>("");
  const [pieces, setPieces] = useState<Piece[]>(() => createPieces());
  const [selectedPiece, setSelectedPiece] = useState<number | null>(null);
  const [grid, setGrid] = useState<(number | null)[]>(
    () => new Array(TOTAL).fill(null) as (number | null)[]
  );
  const [shakeCell, setShakeCell] = useState<number | null>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [showLetter, setShowLetter] = useState(false);
  const [loveLetter, setLoveLetter] = useState("");
  const [jigsawKey, setJigsawKey] = useState(0);

  const placedCount = grid.filter((g) => g !== null).length;
  const isComplete = placedCount === TOTAL;

  useEffect(() => {
    if (isComplete && !showLetter) {
      // Fire confetti then show love letter
      const colors = ["#ff69b4", "#ff1493", "#ff6eb4", "#ffb6c1", "#ffc0cb"];
      confetti({ particleCount: 80, spread: 70, origin: { x: 0.2, y: 0.6 }, colors });
      confetti({ particleCount: 80, spread: 70, origin: { x: 0.8, y: 0.6 }, colors });
      setTimeout(() => {
        confetti({ particleCount: 120, spread: 100, origin: { x: 0.5, y: 0.4 }, colors });
      }, 300);

      const timer = setTimeout(() => {
        setLoveLetter(getRandomLoveLetter());
        setShowLetter(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [isComplete, showLetter]);

  const handleSelectImage = useCallback((src: string) => {
    setActiveImage(src);
    setPieces(createPieces());
    setGrid(new Array(TOTAL).fill(null) as (number | null)[]);
    setSelectedPiece(null);
    setImageLoaded(false);
    setShowLetter(false);
    setJigsawKey((k) => k + 1);

    const img = new window.Image();
    img.onload = () => setImageLoaded(true);
    img.src = encodeURI(src);
  }, []);

  const handlePieceTap = useCallback(
    (pieceId: number) => {
      if (isComplete) return;
      const piece = pieces.find((p) => p.id === pieceId);
      if (!piece || piece.placed) return;
      setSelectedPiece(pieceId === selectedPiece ? null : pieceId);
    },
    [pieces, selectedPiece, isComplete]
  );

  const handleCellTap = useCallback(
    (cellIndex: number) => {
      if (selectedPiece === null || isComplete) return;
      if (grid[cellIndex] !== null) return;

      const piece = pieces.find((p) => p.id === selectedPiece);
      if (!piece) return;

      const targetRow = Math.floor(cellIndex / GRID);
      const targetCol = cellIndex % GRID;

      if (targetRow === piece.correctRow && targetCol === piece.correctCol) {
        // Correct placement
        setGrid((prev) => {
          const next = [...prev];
          next[cellIndex] = piece.id;
          return next;
        });
        setPieces((prev) =>
          prev.map((p) => (p.id === piece.id ? { ...p, placed: true } : p))
        );
        setSelectedPiece(null);
      } else {
        // Wrong placement — shake
        setShakeCell(cellIndex);
        setTimeout(() => setShakeCell(null), 500);
      }
    },
    [selectedPiece, grid, pieces, isComplete]
  );

  const encodedSrc = activeImage ? encodeURI(activeImage) : "";
  const cellSize = 100 / GRID;

  return (
    <GameShell title="Piece Together My Heart 💖">
      <div className="flex flex-1 w-full" key={jigsawKey}>
        <Sidebar activeImage={activeImage} onSelectImage={handleSelectImage} />

        <div className="flex-1 flex flex-col items-center justify-start p-4 overflow-y-auto gap-4">
          {!activeImage ? (
            <p className="text-pink-300 text-lg mt-20">
              Pick a photo from the sidebar!
            </p>
          ) : (
            <>
              <p className="text-sm text-gray-500">
                Placed:{" "}
                <span className="font-bold text-pink-500">
                  {placedCount}/{TOTAL}
                </span>
              </p>

              {/* Target grid */}
              <div
                className="relative bg-pink-100 rounded-lg shadow-inner border-2 border-dashed border-pink-200"
                style={{
                  width: "min(80vw, 300px)",
                  height: "min(80vw, 300px)",
                }}
              >
                {/* Ghost image */}
                {imageLoaded && (
                  <div
                    className="absolute inset-0 rounded-lg opacity-15"
                    style={{
                      backgroundImage: `url(${encodedSrc})`,
                      backgroundSize: "100% 100%",
                    }}
                  />
                )}

                {/* Grid cells */}
                {Array.from({ length: TOTAL }).map((_, i) => {
                  const row = Math.floor(i / GRID);
                  const col = i % GRID;
                  const placedPieceId = grid[i];
                  const isShaking = shakeCell === i;

                  return (
                    <button
                      key={i}
                      onClick={() => handleCellTap(i)}
                      className={`absolute border border-pink-200/50 transition-all ${
                        isShaking ? "animate-shake" : ""
                      } ${
                        placedPieceId !== null
                          ? "cursor-default"
                          : selectedPiece !== null
                          ? "cursor-pointer hover:bg-pink-200/30"
                          : "cursor-default"
                      }`}
                      style={{
                        width: `${cellSize}%`,
                        height: `${cellSize}%`,
                        left: `${col * cellSize}%`,
                        top: `${row * cellSize}%`,
                        ...(placedPieceId !== null && imageLoaded
                          ? {
                              backgroundImage: `url(${encodedSrc})`,
                              backgroundSize: `${GRID * 100}% ${GRID * 100}%`,
                              backgroundPosition: `${
                                (col / (GRID - 1)) * 100
                              }% ${(row / (GRID - 1)) * 100}%`,
                            }
                          : {}),
                      }}
                    />
                  );
                })}
              </div>

              {/* Scattered pieces */}
              {!isComplete && (
                <div className="w-full max-w-xs">
                  <p className="text-xs text-pink-300 text-center mb-2">
                    Tap a piece, then tap where it goes
                  </p>
                  <div className="grid grid-cols-3 gap-2">
                    {pieces
                      .filter((p) => !p.placed)
                      .map((piece) => {
                        const bgPosX =
                          (piece.correctCol / (GRID - 1)) * 100;
                        const bgPosY =
                          (piece.correctRow / (GRID - 1)) * 100;
                        const isSelected = selectedPiece === piece.id;

                        return (
                          <button
                            key={piece.id}
                            onClick={() => handlePieceTap(piece.id)}
                            className={`aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                              isSelected
                                ? "border-pink-500 scale-105 shadow-lg animate-pulse-glow"
                                : "border-pink-200 hover:border-pink-400 active:scale-95"
                            }`}
                            style={
                              imageLoaded
                                ? {
                                    backgroundImage: `url(${encodedSrc})`,
                                    backgroundSize: `${GRID * 100}% ${GRID * 100}%`,
                                    backgroundPosition: `${bgPosX}% ${bgPosY}%`,
                                  }
                                : { backgroundColor: "#f9a8d4" }
                            }
                          />
                        );
                      })}
                  </div>
                </div>
              )}

              {/* Completed state — full image */}
              {isComplete && (
                <div className="animate-fade-in text-center">
                  <p className="text-pink-500 font-semibold text-sm">
                    Beautiful! Just like you. 💕
                  </p>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Love letter modal */}
      <Modal open={showLetter} onClose={() => setShowLetter(false)}>
        <div className="text-5xl mb-3">💌</div>
        <h2 className="text-xl font-bold bg-gradient-to-r from-pink-500 to-purple-500 bg-clip-text text-transparent mb-4">
          A Letter For You
        </h2>
        <p className="text-gray-600 text-sm leading-relaxed mb-6 text-left italic">
          &ldquo;{loveLetter}&rdquo;
        </p>
        <button
          onClick={() => setShowLetter(false)}
          className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-8 py-3 rounded-full hover:from-pink-600 hover:to-purple-600 active:scale-95 transition-all font-medium shadow-md shadow-pink-200"
        >
          I Love You Too 💖
        </button>
      </Modal>
    </GameShell>
  );
}
