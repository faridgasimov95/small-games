import nlp from "compromise";
import fs from "fs";
import path from "path";
import { loadJson, writeData } from "../utils/wordUtils";

const MIN_LENGTH = 5;
const MAX_LENGTH = 10;

const FREQ_EASY_MIN = 5;
const FREQ_MEDIUM_MIN = 2;
const FREQ_HARD_MIN = 1;

async function fetchWordsForLength(
  length: number,
): Promise<{ word: string; freq: number }[]> {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  const results: { word: string; freq: number }[] = [];

  for (const letter of letters) {
    const pattern = letter + "?".repeat(length - 1);
    const data = await fetch(
      `https://api.datamuse.com/words?sp=${pattern}&md=f&max=1000`,
    );
    const response = await data.json();

    const words = response
      .map((obj: { word: string; tags: string[] }) => ({
        word: obj.word,
        freq: parseFloat(obj.tags?.[0]?.replace("f:", "") ?? "0"),
        isProper: obj.tags?.includes("prop"),
        isProper2: nlp(obj.word).has("#ProperNoun"),
        isPlural: nlp(obj.word).nouns().isPlural().found,
      }))
      .filter(
        (obj: {
          word: string;
          isProper: boolean;
          isProper2: boolean;
          isPlural: boolean;
        }) =>
          !obj.isProper &&
          !obj.isProper2 &&
          !obj.isPlural &&
          !obj.word.includes(" "),
      )
      .map((obj: { word: string; freq: number }) => ({
        word: obj.word,
        freq: obj.freq,
      }));

    results.push(...words);
  }

  return results;
}

async function generateWordLists() {
  const allWords: { word: string; freq: number }[] = [];

  for (let length = MIN_LENGTH; length <= MAX_LENGTH; length++) {
    console.log(`Fetching ${length}-letter words...`);
    const words = await fetchWordsForLength(length);
    allWords.push(...words);
  }

  const deduplicated = new Map<string, number>();
  for (const { word, freq } of allWords) {
    const existing = deduplicated.get(word);
    if (existing === undefined || freq > existing) {
      deduplicated.set(word, freq);
    }
  }

  const easy: string[] = [];
  const medium: string[] = [];
  const hard: string[] = [];

  for (const [word, freq] of deduplicated) {
    if (freq >= FREQ_EASY_MIN) easy.push(word);
    else if (freq >= FREQ_MEDIUM_MIN) medium.push(word);
    else if (freq >= FREQ_HARD_MIN) hard.push(word);
  }

  console.log(`Easy: ${easy.length} words`);
  console.log(`Medium: ${medium.length} words`);
  console.log(`Hard: ${hard.length} words`);

  fs.writeFileSync(
    path.join(__dirname, "../data/hangman/easy.json"),
    JSON.stringify(easy, null, 2),
  );
  fs.writeFileSync(
    path.join(__dirname, "../data/hangman/medium.json"),
    JSON.stringify(medium, null, 2),
  );
  fs.writeFileSync(
    path.join(__dirname, "../data/hangman/hard.json"),
    JSON.stringify(hard, null, 2),
  );

  console.log("Done!");
}

async function filterWords(filename: string): Promise<string[]> {
  const words: string[] = loadJson("hangman", filename);
  let filteredWords: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      );

      if (response.ok) {
        filteredWords.push(word);
      } else {
        console.error(
          `"${word}" -> status ${response.status} ${response.statusText}`,
        );
      }
    } catch (err) {
      console.error(`Request failed for "${word}", skipping:`, err);
    }

    await sleep(600);

    if ((i + 1) % 100 === 0 || i === words.length - 1) {
      console.log(
        `  ${i + 1}/${words.length} checked, ${filteredWords.length} kept so far`,
      );
    }
  }

  return filteredWords;
}

async function filterWordLists() {
  console.log("Filtering easy words...");
  const easy = await filterWords("easy.json");
  writeData("../data/hangman/easy.json", easy);
  console.log(`Done. Kept ${easy.length} easy words.\n`);

  console.log("Filtering medium words...");
  const medium = await filterWords("medium.json");
  writeData("../data/hangman/medium.json", medium);
  console.log(`Done. Kept ${medium.length} medium words.\n`);

  console.log("Filtering hard words...");
  const hard = await filterWords("hard.json");
  writeData("../data/hangman/hard.json", hard);
  console.log(`Done. Kept ${hard.length} hard words.`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  await generateWordLists();
  await filterWordLists();
}

run();
