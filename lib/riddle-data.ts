type Riddle = {
  question: string;
  answer: string;
  hint: string;
  hintPenalty: string;
  options: string[];
};

export const riddles: Riddle[] = [
  {
    question:
      "I happened before everything else between us. Without me, there would be no 'us'. What am I?",
    answer: "Our first meeting",
    hint: "Think about the very beginning of our story...",
    hintPenalty: "You owe me a kiss! 😘",
    options: ["Our first text", "Our first meeting", "Our first date", "Our first call"],
  },
  {
    question:
      "I'm something you do every day that makes my heart race. It doesn't cost anything, but it's worth everything to me. What am I?",
    answer: "Your smile",
    hint: "You do it with your face and it lights up every room...",
    hintPenalty: "That's a hug you owe me! 🤗",
    options: ["Your laugh", "Your smile", "A good morning text", "Saying I love you"],
  },
  {
    question:
      "I'm a place we've been together that holds a special memory. The food was great but the company was even better. Where am I?",
    answer: "Our favorite restaurant",
    hint: "Think about where we go to eat together...",
    hintPenalty: "You owe me a date night! 🍽️",
    options: [
      "The pizza place",
      "That rooftop spot",
      "Our favorite restaurant",
      "The street food market",
    ],
  },
  {
    question:
      "I'm three words, eight letters. I'm said too much by some and not enough by others. You make me mean them every time. What am I?",
    answer: "I love you",
    hint: "It's the most important thing I tell you...",
    hintPenalty: "Say it back right now! 💕",
    options: ["You are mine", "I love you", "You are beautiful", "I miss you"],
  },
  {
    question:
      "I'm not a place, not a thing, but a feeling. I started small but now I'm enormous. I grow every day we're together. What am I?",
    answer: "Our love",
    hint: "It's the thing between us that keeps getting stronger...",
    hintPenalty: "You owe me a cuddle session! 🥰",
    options: ["Our trust", "Our love", "Our memories", "Our bond"],
  },
  {
    question:
      "I'm something you haven't seen yet but I'm already planning it. It involves you, me, and the rest of our lives. What am I?",
    answer: "Our future",
    hint: "Think about what comes next for us...",
    hintPenalty: "You owe me forever! 💍",
    options: ["A surprise date", "Our future", "A vacation together", "A love letter"],
  },
];

export type { Riddle };
