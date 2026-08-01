import nlp from "compromise";
import fs from "fs";
import path from "path";

const MIN_LENGTH = 3;
const MAX_LENGTH = 7;
const FREQ_MIN = 1.0;

async function fetchWordsForLength(length: number): Promise<string[]> {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  const results: string[] = [];

  for (const letter of letters) {
    const pattern = letter + "?".repeat(length - 1);
    const data = await fetch(
      `https://api.datamuse.com/words?sp=${pattern}&md=pf&max=1000`,
    );
    const response = await data.json();

    const words = response
      .map((obj: { word: string; tags: string[] }) => ({
        word: obj.word,
        freq: parseFloat(
          obj.tags?.find((t) => t.startsWith("f:"))?.replace("f:", "") ?? "0",
        ),
        isProper: obj.tags?.includes("prop"),
        isProper2: nlp(obj.word).has("#ProperNoun"),
        isPlural: nlp(obj.word).nouns().isPlural().found,
      }))
      .filter(
        (obj: {
          word: string;
          freq: number;
          isProper: boolean;
          isProper2: boolean;
          isPlural: boolean;
        }) =>
          obj.freq >= FREQ_MIN &&
          !obj.isProper &&
          !obj.isProper2 &&
          !obj.isPlural &&
          !obj.word.includes(" "),
      )
      .map((obj: { word: string }) => obj.word);

    results.push(...words);
  }

  return results;
}

async function generatebasis() {
  const allWords: string[] = [];

  for (let length = MIN_LENGTH; length <= MAX_LENGTH; length++) {
    console.log(`Fetching ${length}-letter words...`);
    const words = await fetchWordsForLength(length);
    allWords.push(...words);
  }

  const basis = [...new Set(allWords)];

  console.log(`Basis: ${basis.length} words`);

  fs.writeFileSync(
    path.join(__dirname, "../data/wordsmith/basis.json"),
    JSON.stringify(basis, null, 2),
  );

  console.log("Done!");
}

generatebasis();
