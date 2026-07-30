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
  corpus: string[],
  sevenLetterWords: string[],
  minWords: number,
): { letters: string[]; words: string[] } | null {
  const sourceWord =
    sevenLetterWords[Math.floor(Math.random() * sevenLetterWords.length)];
  const sourceCounts = letterCounts(sourceWord);

  const matches = corpus.filter(
    (word) => word.length >= 3 && isSubsetWord(word, sourceCounts),
  );

  if (matches.length < minWords) return null;

  return { letters: sourceWord.split(""), words: matches };
}

function generatePuzzles(
  corpus: string[],
  sevenLetterWords: string[],
  minWords: number,
  count: number,
): { letters: string[]; words: string[] }[] {
  const puzzles: { letters: string[]; words: string[] }[] = [];

  while (puzzles.length < count) {
    const puzzle = generatePuzzle(corpus, sevenLetterWords, minWords);
    if (puzzle) puzzles.push(puzzle);
  }

  return puzzles;
}
