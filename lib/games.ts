type GameCard = {
  title: string;
  description: string;
  icon: string;
  href: string;
};

export const games: GameCard[] = [
  {
    title: "Sliding Puzzle",
    description: "Unscramble our pictures, piece by piece",
    icon: "🧩",
    href: "/puzzle",
  },
  {
    title: "Memory Match",
    description: "Find the matching pairs of our love story",
    icon: "🃏",
    href: "/memory",
  },
  {
    title: "How Well Do You Know Us?",
    description: "Quiz time! Let's see what you remember",
    icon: "💡",
    href: "/quiz",
  },
  {
    title: "Our Timeline",
    description: "Scroll through our love story together",
    icon: "📖",
    href: "/timeline",
  },
  {
    title: "Spin the Wheel",
    description: "Spin and see what love has in store",
    icon: "🎡",
    href: "/spin",
  },
  {
    title: "Piece Together My Heart",
    description: "A jigsaw puzzle with a secret message",
    icon: "💖",
    href: "/jigsaw",
  },
  {
    title: "Riddle Me This, Love",
    description: "Solve sweet riddles about us",
    icon: "🔮",
    href: "/riddles",
  },
];

export type { GameCard };
