import { loadJson, writeData } from "../utils/wordUtils";

const LETTER_COUNT = 7;
const PUZZLES_PER_DIFFICULTY = 100;

const MIN_WORDS_EASY = 12;
const MIN_WORDS_MEDIUM = 16;
const MIN_WORDS_HARD = 20;

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
): { letters: string[]; words: string[] } | null {
  const sourceWord =
    sevenLetterWords[Math.floor(Math.random() * sevenLetterWords.length)];
  const sourceCounts = letterCounts(sourceWord);

  const matches = basis.filter(
    (word) => word.length >= 3 && isSubsetWord(word, sourceCounts),
  );

  if (matches.length < minWords) return null;

  return { letters: sourceWord.split(""), words: matches };
}

function generatePuzzles(
  basis: string[],
  sevenLetterWords: string[],
  minWords: number,
  count: number,
): { letters: string[]; words: string[] }[] {
  const puzzles: { letters: string[]; words: string[] }[] = [];

  while (puzzles.length < count) {
    const puzzle = generatePuzzle(basis, sevenLetterWords, minWords);
    if (puzzle) puzzles.push(puzzle);
  }

  return puzzles;
}

function run() {
  const basis: string[] = loadJson("wordsmith", "basis.json");
  const sevenLetterWords = basis.filter((word) => word.length === LETTER_COUNT);

  console.log(`basis size: ${basis.length}`);
  console.log(`7-letter source candidates: ${sevenLetterWords.length}`);

  console.log("Generating easy puzzles...");
  const easy = generatePuzzles(
    basis,
    sevenLetterWords,
    MIN_WORDS_EASY,
    PUZZLES_PER_DIFFICULTY,
  );
  writeData("../data/wordsmith/easy.json", easy);
  console.log(`Done. Generated ${easy.length} easy puzzles.\n`);

  console.log("Generating medium puzzles...");
  const medium = generatePuzzles(
    basis,
    sevenLetterWords,
    MIN_WORDS_MEDIUM,
    PUZZLES_PER_DIFFICULTY,
  );
  writeData("../data/wordsmith/medium.json", medium);
  console.log(`Done. Generated ${medium.length} medium puzzles.\n`);

  console.log("Generating hard puzzles...");
  const hard = generatePuzzles(
    basis,
    sevenLetterWords,
    MIN_WORDS_HARD,
    PUZZLES_PER_DIFFICULTY,
  );
  writeData("../data/wordsmith/hard.json", hard);
  console.log(`Done. Generated ${hard.length} hard puzzles.\n`);
}

run();
