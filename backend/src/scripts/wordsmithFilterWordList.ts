import nlp from "compromise";
import { loadJson, writeData } from "../utils/wordUtils";
import englishWords from "an-array-of-english-words";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function filterInflections(words: string[]): string[] {
  return words.filter((word) => {
    const doc = nlp(word);
    const isPluralNoun = doc.nouns().isPlural().found;
    const isPastTense = doc.has("#PastTense");
    const isGerund = doc.has("#Gerund");
    // const is3rdPersonVerb = doc.verbs().isSingular().found;

    return !isPluralNoun && !isPastTense && !isGerund; // && !is3rdPersonVerb;
  });
}

type WordCheckResult = "exists" | "not_found" | "unknown";

async function checkWordExists(
  word: string,
  retries = 3,
): Promise<WordCheckResult> {
  for (let attempt = 0; attempt < retries; attempt++) {
    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      );

      if (response.ok) return "exists";
      else if (response.status === 404) return "not_found";

      console.log(
        `${word} -> ${response.status}, retrying (attempt ${attempt + 1}/${retries})`,
      );
    } catch (err) {
      console.error(`Request error for "${word}":`, err);
    }

    await sleep(2000 * (attempt + 1));
  }

  console.error(`Gave up on "${word}" after ${retries} retries`);
  return "unknown";
}

async function filterAgainstDictionary(
  words: string[],
): Promise<{ passed: string[]; failed: string[] }> {
  const filteredWords: string[] = [];
  const failedWords: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    if (/[.\d]/.test(word)) {
      continue;
    }

    const exists = await checkWordExists(word);

    if (exists === "exists") {
      filteredWords.push(word);
    } else if (exists === "unknown") {
      failedWords.push(word);
    }

    if ((i + 1) % 100 === 0 || i === words.length - 1) {
      console.log(
        `  ${i + 1}/${words.length} checked, ${filteredWords.length} kept so far`,
      );
    }
  }

  return { passed: filteredWords, failed: failedWords };
}

function filterDigitsPunctuation(words: string[]): string[] {
  const filtered = words.filter((word) => !/[^a-z]/.test(word));
  return filtered;
}

async function run() {
  const words: string[] = loadJson("wordsmith", "basis.json");

  console.log(`Starting basis size: ${words.length}`);

  // console.log("Filtering inflected forms...");
  // const afterInflectionFilter = filterInflections(words);
  // console.log(`Kept ${afterInflectionFilter.length} after inflection filter.`);
  // writeData("../data/wordsmith/basis.json", afterInflectionFilter);

  // console.log("Filtering digits/punctuation...");
  // const filtered = filterDigitsPunctuation(words);
  // console.log(`Kept ${filtered.length} after removing digits/punctuation.`);
  // writeData("../data/wordsmith/basis.json", filtered);

  // const englishWordSet = new Set(englishWords);
  // const filtered = words.filter((word) => englishWordSet.has(word));
  // console.log(`Starting: ${words.length}, kept: ${filtered.length}`);
  // writeData("../data/wordsmith/basis.json", filtered);

  console.log("Filtering against dictionary API...");
  const { passed, failed } = await filterAgainstDictionary(words);
  console.log(`Kept ${passed.length} after dictionary filter.`);
  writeData("../data/wordsmith/basis.json", passed);
  writeData("../data/wordsmith/failedWords.json", failed);

  console.log("Done!");
}

run();
