import { loadJson, writeData } from "../utils/wordUtils";

const MIN_LETTER_COUNT = 3;
const MAX_LETTER_COUNT = 7;

function sortSpecific(wordList: string[], letterCount: number): string[] {
  const specificWords = wordList.filter((word) => word.length === letterCount);

  const specificWordsSorted = specificWords.sort();

  return specificWordsSorted;
}

function sortAll() {
  const allWords: string[] = loadJson("wordsmith", "basis.json");
  const sortedWords: string[] = [];

  for (let i = MIN_LETTER_COUNT; i <= MAX_LETTER_COUNT; i++) {
    sortedWords.push(...sortSpecific(allWords, i));
  }

  console.log("Sorting the list of all words...");
  writeData("../data/wordsmith/basis.json", sortedWords);
  console.log(`The total of ${sortedWords.length} words sorted.`);
}

sortAll();
