"use client";

import { useState, useEffect } from "react";
import Image from "next/image";

type SidebarProps = {
  activeImage: string;
  onSelectImage: (src: string) => void;
};

export default function Sidebar({ activeImage, onSelectImage }: SidebarProps) {
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchImages() {
      try {
        const res = await fetch("/api/images");
        const data = await res.json();
        setImages(data.images);
        if (data.images.length > 0 && !activeImage) {
          onSelectImage(data.images[0]);
        }
      } catch (error) {
        console.error("Failed to fetch images:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchImages();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <aside className="w-20 md:w-28 shrink-0 bg-pink-50 border-r border-pink-200 overflow-y-auto p-2 flex flex-col gap-2">
      <h2 className="text-xs font-semibold text-pink-400 text-center mb-1">
        Puzzles
      </h2>

      {loading && (
        <div className="text-xs text-pink-300 text-center animate-pulse">
          Loading...
        </div>
      )}

      {images.map((src) => (
        <button
          key={src}
          onClick={() => onSelectImage(src)}
          className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
            activeImage === src
              ? "border-pink-500 shadow-md shadow-pink-200 scale-105"
              : "border-transparent hover:border-pink-300 opacity-70 hover:opacity-100"
          }`}
        >
          <Image
            src={src}
            alt="Puzzle thumbnail"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 80px, 112px"
          />
        </button>
      ))}

      {!loading && images.length === 0 && (
        <p className="text-xs text-pink-300 text-center mt-4">
          Add images to public/puzzles/
        </p>
      )}
    </aside>
  );
}
