import { loadJson, writeData } from "../utils/wordUtils";

async function filterPlurals(filename: string) {
  const words: string[] = loadJson("hangman", filename);
  const filteredWords: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const suffixLength = word.endsWith("es") ? 2 : word.endsWith("s") ? 1 : 0;

    if (suffixLength === 0) {
      filteredWords.push(word);
      continue;
    }

    const singular = word.slice(0, -suffixLength);

    try {
      const response = await fetch(
        `https://api.dictionaryapi.dev/api/v2/entries/en/${singular}`,
      );
      if (!response.ok) {
        filteredWords.push(word);
      }
    } catch (err) {
      console.error(
        `Request failed for "${word}", skipping check, keeping word:`,
        err,
      );
      filteredWords.push(word);
    }
    await sleep(600);
  }

  return filteredWords;
}

async function filterWordLists() {
  console.log("Filtering easy words");
  const easy = await filterPlurals("easy.json");
  writeData("../data/hangman/easy.json", easy);
  console.log(`Done. Kept ${easy.length} easy words.\n`);

  console.log("Filtering medium words");
  const medium = await filterPlurals("medium.json");
  writeData("../data/hangman/medium.json", medium);
  console.log(`Done. Kept ${medium.length} medium words.\n`);

  console.log("Filtering hard words");
  const hard = await filterPlurals("hard.json");
  writeData("../data/hangman/hard.json", hard);
  console.log(`Done. Kept ${hard.length} hard words.`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

filterWordLists();
