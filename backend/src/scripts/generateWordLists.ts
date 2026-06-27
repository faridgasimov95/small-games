// export {};

// async function generateWordLists() {
//   const data = await fetch(
//     "https://api.datamuse.com/words?sp=???????&md=f&max=1000",
//   );
//   const response = await data.json();

//   const wordsArr = response
//     .map((obj: { word: string; tags: string[] }) => ({
//       word: obj.word,
//       freq: parseFloat(obj.tags?.[0]?.replace("f:", "") ?? "0"),
//     }))
//     .filter((obj: { word: string; freq: number }) => obj.freq < 1)
//     .sort(
//       (a: { word: string; freq: number }, b: { word: string; freq: number }) =>
//         b.freq - a.freq,
//     );
//   return wordsArr;
// }

// generateWordLists().then((words) => console.log(words));

import fs from "fs";
import path from "path";

async function fetchWords(pattern: string, minFreq: number): Promise<string[]> {
  const letters = "abcdefghijklmnopqrstuvwxyz".split("");
  const allWords: string[] = [];

  for (const letter of letters) {
    const data = await fetch(
      `https://api.datamuse.com/words?sp=${letter}${pattern}&md=f&max=1000`,
    );
    const response = await data.json();

    const words = response
      .map((obj: { word: string; tags: string[] }) => ({
        word: obj.word,
        freq: parseFloat(obj.tags?.[0]?.replace("f:", "") ?? "0"),
        isProper: obj.tags?.includes("prop"),
        isPlural: obj.tags?.includes("pl"),
      }))
      .filter(
        (obj: {
          word: string;
          freq: number;
          isProper: boolean;
          isPlural: boolean;
        }) =>
          obj.freq >= minFreq &&
          !obj.isProper &&
          !obj.isPlural &&
          !obj.word.includes(" "),
      )
      .map((obj: { word: string }) => obj.word);

    allWords.push(...words);
  }

  return [...new Set(allWords)];
}

async function generateWordLists() {
  console.log("Fetching easy words (5 letters)...");
  const easy = await fetchWords("????", 1.5);

  console.log("Fetching medium words (5 letters)...");
  const medium = await fetchWords("?????", 1.5);

  console.log("Fetching hard words (5 letters)...");
  const hard = await fetchWords("??????", 1.5);

  console.log(`Easy: ${easy.length} words`);
  console.log(`Medium: ${medium.length} words`);
  console.log(`Hard: ${hard.length} words`);

  fs.writeFileSync(
    path.join(__dirname, "../data/wordle/easy.json"),
    JSON.stringify(easy, null, 2),
  );
  fs.writeFileSync(
    path.join(__dirname, "../data/wordle/medium.json"),
    JSON.stringify(medium, null, 2),
  );
  fs.writeFileSync(
    path.join(__dirname, "../data/wordle/hard.json"),
    JSON.stringify(hard, null, 2),
  );

  console.log("Done!");
}

generateWordLists();
