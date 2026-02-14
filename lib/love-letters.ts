const loveLetters: string[] = [
  "To the one who makes my heart skip a beat every single day — you are my everything. I look at you and I see my whole future. I love you more than words could ever express. You're not just my partner, you're my best friend, my safe place, and the reason I smile in my sleep. Thank you for being you. 💖",
  "Hey beautiful, if you're reading this, it means you just pieced together my heart — literally! But the truth is, you do that every day just by being in my life. Every moment with you feels like a gift I don't deserve but I'm so grateful for. I love you endlessly. 💕",
  "My dearest love, I made this for you because I wanted you to know — even in a silly little puzzle game — that you are the most important piece of my life. Without you, nothing fits. With you, everything is perfect. I love you, today and always. ❤️",
];

let usedLetterIndices: Set<number> = new Set();

export function getRandomLoveLetter(): string {
  if (usedLetterIndices.size >= loveLetters.length) {
    usedLetterIndices = new Set();
  }

  let index: number;
  do {
    index = Math.floor(Math.random() * loveLetters.length);
  } while (usedLetterIndices.has(index));

  usedLetterIndices.add(index);
  return loveLetters[index];
}
