import nlp from "compromise";
import { loadJson, writeData } from "../utils/wordUtils";

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function filterInflections(words: string[]): string[] {
  return words.filter((word) => {
    const doc = nlp(word);
    const isPluralNoun = doc.nouns().isPlural().found;
    const isPastTense = doc.has("#PastTense");
    const isGerund = doc.has("#Gerund");
    const is3rdPersonVerb = doc.verbs().isSingular().found;

    return !isPluralNoun && !isPastTense && !isGerund && !is3rdPersonVerb;
  });
}

async function filterAgainstDictionary(words: string[]): Promise<string[]> {
  const filteredWords: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];

    if (/[.\d]/.test(word)) {
      continue;
    }

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
      );

      if (response.ok) {
        filteredWords.push(word);
      } else {
        console.error(`"${word}" -> status ${response.status}`);
      }
    } catch (err) {
      console.error(`Request failed for "${word}", skipping:`, err);
    }

    await sleep(1000);

    if ((i + 1) % 100 === 0 || i === words.length - 1) {
      console.log(
        `  ${i + 1}/${words.length} checked, ${filteredWords.length} kept so far`,
      );
    }
  }

  return filteredWords;
}

async function run() {
  const words: string[] = loadJson("wordsmith", "basis.json");
  console.log(`Starting basis size: ${words.length}`);

  //   console.log("Filtering inflected forms...");
  //   const afterInflectionFilter = filterInflections(words);
  //   console.log(`Kept ${afterInflectionFilter.length} after inflection filter.`);

  console.log("Filtering against dictionary API...");
  const afterDictionaryFilter = await filterAgainstDictionary(words);
  console.log(`Kept ${afterDictionaryFilter.length} after dictionary filter.`);

  writeData("../data/wordsmith/basis.json", afterDictionaryFilter);
  console.log("Done!");
}

run();
