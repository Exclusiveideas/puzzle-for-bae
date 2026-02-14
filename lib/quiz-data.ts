type QuizQuestion = {
  question: string;
  options: string[];
  correctIndex: number;
  rightMessage: string;
  wrongMessage: string;
};

export const quizQuestions: QuizQuestion[] = [
  {
    question: "Where did we have our first date?",
    options: ["A coffee shop", "A restaurant", "The park", "The movies"],
    correctIndex: 1,
    rightMessage: "You remember! That night was magical. 💕",
    wrongMessage: "Hmm, not quite! But I still love you. 😘",
  },
  {
    question: "What was the first thing I said to you?",
    options: ["Hey, beautiful", "Hi there", "Do I know you?", "Nice shoes"],
    correctIndex: 0,
    rightMessage: "And I'd say it again every single day. 🥰",
    wrongMessage: "Nope! But your smile makes me forget words too. 😄",
  },
  {
    question: "What's my favorite thing about you?",
    options: ["Your smile", "Your laugh", "Your eyes", "Everything"],
    correctIndex: 3,
    rightMessage: "Trick question — it's literally everything about you! ✨",
    wrongMessage: "Close, but the answer is EVERYTHING. 💖",
  },
  {
    question: "What song reminds me of you?",
    options: [
      "Perfect — Ed Sheeran",
      "All of Me — John Legend",
      "My Girl — The Temptations",
      "Thinking Out Loud — Ed Sheeran",
    ],
    correctIndex: 1,
    rightMessage: "Because all of me loves all of you! 🎵",
    wrongMessage: "Not that one, but they're all good choices for you. 🎶",
  },
  {
    question: "What do I love doing most with you?",
    options: [
      "Watching movies together",
      "Going on adventures",
      "Just talking for hours",
      "All of the above",
    ],
    correctIndex: 3,
    rightMessage: "Everything is better when it's with you! 💫",
    wrongMessage: "I love doing EVERYTHING with you, silly! 😏",
  },
  {
    question: "What's my pet name for you?",
    options: ["Babe", "Baby", "My love", "Sweetheart"],
    correctIndex: 0,
    rightMessage: "You know it! My one and only babe. 💝",
    wrongMessage: "I call you all of these, but you know the main one! 😉",
  },
  {
    question: "If I could describe you in one word, what would it be?",
    options: ["Beautiful", "Amazing", "Perfect", "Mine"],
    correctIndex: 2,
    rightMessage: "Absolutely perfect, inside and out. 🌹",
    wrongMessage: "All true, but I think you're just perfect! 💕",
  },
  {
    question: "What's the thing you do that makes my heart skip a beat?",
    options: [
      "When you smile at me",
      "When you laugh",
      "When you hold my hand",
      "When you exist",
    ],
    correctIndex: 3,
    rightMessage: "Just your existence makes my world brighter! ☀️",
    wrongMessage: "Honestly, you just existing does it for me. 🥰",
  },
];

export type { QuizQuestion };
