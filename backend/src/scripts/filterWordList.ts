import { loadJson, writeData } from "../utils/wordUtils";

async function filterWords(filename: string): Promise<string[]> {
  const words: string[] = loadJson("wordle", filename);
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
  console.log("Filtering easy words (5 letters)...");
  const easy = await filterWords("easy.json");
  writeData("../data/wordle/easy.json", easy);
  console.log(`Done. Kept ${easy.length} easy words.\n`);

  console.log("Filtering medium words (6 letters)...");
  const medium = await filterWords("medium.json");
  writeData("../data/wordle/medium.json", medium);
  console.log(`Done. Kept ${medium.length} medium words.\n`);

  console.log("Filtering hard words (7 letters)...");
  const hard = await filterWords("hard.json");
  writeData("../data/wordle/hard.json", hard);
  console.log(`Done. Kept ${hard.length} hard words.`);
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

filterWordLists();
