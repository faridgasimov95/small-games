import { loadJson, writeData } from "../utils/wordUtils";

const FREQ_THRESHOLD = 5;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function getFrequency(word: string): Promise<number> {
  const response = await fetch(
    `https://api.datamuse.com/words?sp=${word}&md=f&max=1`,
  );
  const data = await response.json();

  const entry = data[0];
  if (!entry || entry.word !== word) return 0;

  const freqTag = entry.tags?.find((t: string) => t.startsWith("f:"));
  return freqTag ? parseFloat(freqTag.replace("f:", "")) : 0;
}

async function splitByFrequency(
  words: string[],
): Promise<{ lowFreq: string[]; highFreq: string[] }> {
  const lowFreq: string[] = [];
  const highFreq: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const freq = await getFrequency(word);

    if (freq < FREQ_THRESHOLD) {
      lowFreq.push(word);
    } else {
      highFreq.push(word);
    }

    await sleep(150);

    if ((i + 1) % 50 === 0 || i === words.length - 1) {
      console.log(`  ${i + 1}/${words.length} checked`);
    }
  }

  return { lowFreq, highFreq };
}

async function run() {
  const words: string[] = loadJson("wordsmith", "setLetterWords.json");
  console.log(`Checking frequency for ${words.length} words...`);

  const { lowFreq, highFreq } = await splitByFrequency(words);

  console.log(`Low freq (<${FREQ_THRESHOLD}): ${lowFreq.length}`);
  console.log(`High freq (>=${FREQ_THRESHOLD}): ${highFreq.length}`);

  writeData("../data/wordsmith/setLetterWords.json", { lowFreq, highFreq });
  console.log("Done!");
}

run();
