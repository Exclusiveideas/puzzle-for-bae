const congratsMessages: string[] = [
  "You did it, my love! Just like you piece together my heart every day. 💕",
  "Puzzle solved! But the biggest mystery is how I got so lucky to have you. 🥰",
  "You're amazing! Every piece falls into place when I'm with you. ✨",
  "Brilliantly done! You complete me just like you completed this puzzle. 💖",
  "Look at you go! Smart AND beautiful — the full package. 🌹",
  "Nailed it! But then again, you nail everything you do. 💫",
  "You're a genius, babe! My heart is doing a happy dance right now. 💃",
  "Solved! Just like how you solve every bad day I have with your smile. ☀️",
  "Perfect! Kind of like you — absolutely perfect. 💝",
  "Winner winner! The real prize is being loved by you though. 🏆",
  "You make everything look easy, including stealing my heart. 😘",
  "That brain of yours is as beautiful as your face. Wow. 🧠💕",
  "Another one solved! I fall for you more with every puzzle. 🌙",
  "Incredible! You put the pieces together faster than I fell for you — and that was instant. ⚡",
  "My clever love! This puzzle didn't stand a chance against you. 🔥",
  "Solved with style! Everything you do has that magic touch. ✨",
  "You + puzzles = unstoppable. You + me = forever. 💞",
];

let usedIndices: Set<number> = new Set();

export function getRandomMessage(): string {
  if (usedIndices.size >= congratsMessages.length) {
    usedIndices = new Set();
  }

  let index: number;
  do {
    index = Math.floor(Math.random() * congratsMessages.length);
  } while (usedIndices.has(index));

  usedIndices.add(index);
  return congratsMessages[index];
}
