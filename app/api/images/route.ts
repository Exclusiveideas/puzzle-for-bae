import { NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";

const PUZZLES_DIR = path.join(process.cwd(), "public", "puzzles");
const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]);

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    if (!fs.existsSync(PUZZLES_DIR)) {
      return NextResponse.json({ images: [] });
    }

    const files = fs.readdirSync(PUZZLES_DIR);
    const images = files
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return ALLOWED_EXTENSIONS.has(ext);
      })
      .map((file) => `/puzzles/${file}`);

    return NextResponse.json({ images });
  } catch {
    return NextResponse.json({ images: [] }, { status: 500 });
  }
}
