"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import {
  shuffleBoard,
  isSolved,
  GRID_SIZE,
  TOTAL_TILES,
  EMPTY,
} from "@/lib/shuffle";
import type { Board } from "@/lib/shuffle";

type PuzzleProps = {
  imageSrc: string;
  onSolved: () => void;
};

export default function Puzzle({ imageSrc, onSolved }: PuzzleProps) {
  const [board, setBoard] = useState<Board>(() => shuffleBoard());
  const [moveCount, setMoveCount] = useState(0);
  const [solved, setSolved] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [animating, setAnimating] = useState(false);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const encodedSrc = encodeURI(imageSrc);

  useEffect(() => {
    const newBoard = shuffleBoard();
    setBoard(newBoard);
    setMoveCount(0);
    setSolved(false);
    setImageLoaded(false);

    const img = new window.Image();
    img.onload = () => setImageLoaded(true);
    img.src = encodedSrc;
  }, [encodedSrc]);

  const moveTile = useCallback(
    (tileIndex: number) => {
      if (solved || animating) return;
      if (board[tileIndex] === EMPTY) return;

      const emptyIndex = board.indexOf(EMPTY);
      const clickedRow = Math.floor(tileIndex / GRID_SIZE);
      const clickedCol = tileIndex % GRID_SIZE;
      const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
      const emptyCol = emptyIndex % GRID_SIZE;

      const isAdjacent =
        (Math.abs(clickedRow - emptyRow) === 1 && clickedCol === emptyCol) ||
        (Math.abs(clickedCol - emptyCol) === 1 && clickedRow === emptyRow);

      if (!isAdjacent) return;

      // Block input during animation
      setAnimating(true);

      const newBoard = [...board];
      newBoard[emptyIndex] = newBoard[tileIndex];
      newBoard[tileIndex] = EMPTY;

      setBoard(newBoard);
      setMoveCount((prev) => prev + 1);

      // Wait for animation to finish before allowing next move
      setTimeout(() => {
        setAnimating(false);
        if (isSolved(newBoard)) {
          setSolved(true);
          onSolved();
        }
      }, 150);
    },
    [board, solved, animating, onSolved]
  );

  const handleSwipe = useCallback(
    (dx: number, dy: number) => {
      if (solved || animating) return;

      const emptyIndex = board.indexOf(EMPTY);
      const emptyRow = Math.floor(emptyIndex / GRID_SIZE);
      const emptyCol = emptyIndex % GRID_SIZE;

      let targetIndex = -1;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 0) {
          if (emptyCol > 0) targetIndex = emptyRow * GRID_SIZE + (emptyCol - 1);
        } else {
          if (emptyCol < GRID_SIZE - 1) targetIndex = emptyRow * GRID_SIZE + (emptyCol + 1);
        }
      } else {
        if (dy > 0) {
          if (emptyRow > 0) targetIndex = (emptyRow - 1) * GRID_SIZE + emptyCol;
        } else {
          if (emptyRow < GRID_SIZE - 1) targetIndex = (emptyRow + 1) * GRID_SIZE + emptyCol;
        }
      }

      if (targetIndex >= 0) {
        moveTile(targetIndex);
      }
    },
    [board, solved, animating, moveTile]
  );

  // Get grid cell index from pointer coordinates
  const getCellFromPointer = useCallback((clientX: number, clientY: number): number => {
    if (!gridRef.current) return -1;
    const rect = gridRef.current.getBoundingClientRect();
    const relX = clientX - rect.left;
    const relY = clientY - rect.top;
    const col = Math.min(GRID_SIZE - 1, Math.max(0, Math.floor((relX / rect.width) * GRID_SIZE)));
    const row = Math.min(GRID_SIZE - 1, Math.max(0, Math.floor((relY / rect.height) * GRID_SIZE)));
    return row * GRID_SIZE + col;
  }, []);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    gridRef.current?.setPointerCapture(e.pointerId);
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!pointerStartRef.current) return;
      const dx = e.clientX - pointerStartRef.current.x;
      const dy = e.clientY - pointerStartRef.current.y;
      pointerStartRef.current = null;

      if (Math.abs(dx) < 20 && Math.abs(dy) < 20) {
        // Tap — find which cell was tapped and try to move it
        const cellIndex = getCellFromPointer(e.clientX, e.clientY);
        if (cellIndex >= 0) moveTile(cellIndex);
        return;
      }

      handleSwipe(dx, dy);
    },
    [moveTile, handleSwipe, getCellFromPointer]
  );

  // Build pieces array: for each piece (0-7), find its current position
  const cellSize = 100 / GRID_SIZE;
  const pieces = [];
  for (let piece = 0; piece < TOTAL_TILES - 1; piece++) {
    const position = board.indexOf(piece);
    const row = Math.floor(position / GRID_SIZE);
    const col = position % GRID_SIZE;

    const pieceRow = Math.floor(piece / GRID_SIZE);
    const pieceCol = piece % GRID_SIZE;
    const bgPosX = (pieceCol / (GRID_SIZE - 1)) * 100;
    const bgPosY = (pieceRow / (GRID_SIZE - 1)) * 100;

    pieces.push({ piece, row, col, bgPosX, bgPosY });
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="text-sm text-gray-500">
        Moves: <span className="font-bold text-pink-500">{moveCount}</span>
      </div>

      <div
        ref={gridRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        className="relative bg-pink-200 rounded-lg shadow-lg select-none touch-none overflow-hidden"
        style={{
          width: "min(85vw, 400px)",
          height: "min(85vw, 400px)",
        }}
      >
        {pieces.map(({ piece, row, col, bgPosX, bgPosY }) => (
          <div
            key={piece}
            className={`absolute rounded-sm ${solved ? "" : "cursor-pointer"}`}
            style={{
              width: `calc(${cellSize}% - 2px)`,
              height: `calc(${cellSize}% - 2px)`,
              left: `calc(${col * cellSize}% + 1px)`,
              top: `calc(${row * cellSize}% + 1px)`,
              transition: "left 150ms ease-out, top 150ms ease-out",
              backgroundImage: imageLoaded ? `url(${encodedSrc})` : "none",
              backgroundSize: `${GRID_SIZE * 100}% ${GRID_SIZE * 100}%`,
              backgroundPosition: `${bgPosX}% ${bgPosY}%`,
              backgroundColor: imageLoaded ? undefined : "#f9a8d4",
            }}
          />
        ))}
      </div>

      {solved && (
        <div className="text-sm text-pink-400 font-medium animate-fade-in">
          Solved in {moveCount} moves!
        </div>
      )}
    </div>
  );
}
