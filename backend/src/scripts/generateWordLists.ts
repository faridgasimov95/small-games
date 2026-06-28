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
import nlp from "compromise";

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
          obj.freq >= minFreq &&
          !obj.isProper &&
          !obj.isProper2 &&
          !obj.isPlural &&
          !obj.word.includes(" "),
      )
      .map((obj: { word: string }) => obj.word);

    allWords.push(...words);
  }

  return [...new Set(allWords)];
}

async function generateWordLists() {
  console.log("Fetching easy words (4 letters)...");
  const superEasy = await fetchWords("???", 1.5);

  console.log("Fetching easy words (5 letters)...");
  const easy = await fetchWords("????", 1.5);

  console.log("Fetching medium words (5 letters)...");
  const medium = await fetchWords("?????", 1.5);

  console.log("Fetching hard words (5 letters)...");
  const hard = await fetchWords("??????", 1.5);

  const easyFiltered = easy.filter(
    (word: string) =>
      !(word[word.length - 1] === "s" && superEasy.includes(word.slice(0, -1))),
  );
  const mediumFiltered = medium.filter(
    (word: string) =>
      !(
        word[word.length - 1] === "s" &&
        (easy.includes(word.slice(0, -1)) ||
          superEasy.includes(word.slice(0, -2)))
      ),
  );
  const hardFiltered = hard.filter(
    (word: string) =>
      !(
        word[word.length - 1] === "s" &&
        (medium.includes(word.slice(0, -1)) || easy.includes(word.slice(0, -2)))
      ),
  );

  console.log(`Easy: ${easyFiltered.length} words`);
  console.log(`Medium: ${mediumFiltered.length} words`);
  console.log(`Hard: ${hardFiltered.length} words`);

  fs.writeFileSync(
    path.join(__dirname, "../data/wordle/easy.json"),
    JSON.stringify(easyFiltered, null, 2),
  );
  fs.writeFileSync(
    path.join(__dirname, "../data/wordle/medium.json"),
    JSON.stringify(mediumFiltered, null, 2),
  );
  fs.writeFileSync(
    path.join(__dirname, "../data/wordle/hard.json"),
    JSON.stringify(hardFiltered, null, 2),
  );

  console.log("Done!");
}

generateWordLists();
