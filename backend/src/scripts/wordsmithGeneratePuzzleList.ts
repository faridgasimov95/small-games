import { loadJson, writeData } from "../utils/wordUtils";

const LETTER_COUNT = 7;
const PUZZLES_NUMBER = 200;

const MIN_WORDS = 24;
const MAX_WORDS = 45;

function letterCounts(word: string): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const char of word) {
    counts[char] = (counts[char] ?? 0) + 1;
  }

  return counts;
}

function isSubsetWord(
  word: string,
  sourceCounts: Record<string, number>,
): boolean {
  const wordCounts = letterCounts(word);
  for (const [letter, count] of Object.entries(wordCounts)) {
    if ((sourceCounts[letter] ?? 0) < count) return false;
  }

  return true;
}

function generatePuzzle(
  basis: string[],
  sevenLetterWords: string[],
  minWords: number,
  maxWords: number,
): { letters: string[]; words: string[] } | null {
  const sourceWord =
    sevenLetterWords[Math.floor(Math.random() * sevenLetterWords.length)];
  const sourceCounts = letterCounts(sourceWord);

  const matches = basis.filter(
    (word) => word.length >= 3 && isSubsetWord(word, sourceCounts),
  );

  if (matches.length < minWords || matches.length > maxWords) return null;

  return { letters: sourceWord.split(""), words: matches };
}

function generatePuzzles(
  basis: string[],
  sevenLetterWords: string[],
  minWords: number,
  maxWords: number,
  count: number,
): {
  puzzles: { letters: string[]; words: string[] }[];
  puzzleStats: Record<string, number>;
} {
  const puzzles: { letters: string[]; words: string[] }[] = [];
  let puzzleStats: Record<string, number> = {};

  while (puzzles.length < count) {
    const puzzle = generatePuzzle(basis, sevenLetterWords, minWords, maxWords);
    if (puzzle) puzzles.push(puzzle);
    else continue;

    if (puzzle.words) {
      const key = puzzle.words.length;
      const currentCount = puzzleStats[key] ?? 0;
      puzzleStats = { ...puzzleStats, [key]: currentCount + 1 };
    }
  }

  return { puzzles, puzzleStats };
}

function run() {
  const basis: string[] = loadJson("wordsmith", "basis.json");
  const sevenLetterWords = basis.filter((word) => word.length === LETTER_COUNT);

  console.log(`basis size: ${basis.length}`);
  console.log(`7-letter source candidates: ${sevenLetterWords.length}`);

  console.log("Generating  puzzles...");
  const { puzzles, puzzleStats } = generatePuzzles(
    basis,
    sevenLetterWords,
    MIN_WORDS,
    MAX_WORDS,
    PUZZLES_NUMBER,
  );
  writeData("../data/wordsmith/puzzles.json", puzzles);
  console.log(`Done. Generated ${puzzles.length} puzzles.\n`);

  for (const [key, value] of Object.entries(puzzleStats)) {
    console.log(`${key}: ${value} puzzles`);
  }
}

run();
