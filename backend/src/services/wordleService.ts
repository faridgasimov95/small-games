import fs from "fs";
import path from "path";

const wordsEasy = JSON.parse(
  fs.readFileSync(path.join(__dirname, `../data/words5.json`), "utf-8"),
);

const wordsMedium = JSON.parse(
  fs.readFileSync(path.join(__dirname, `../data/words6.json`), "utf-8"),
);

const wordsHard = JSON.parse(
  fs.readFileSync(path.join(__dirname, `../data/words7.json`), "utf-8"),
);

export const getWord = (difficulty: string): string => {
  let words;

  switch (difficulty) {
    case "medium":
      words = wordsMedium;
      break;
    case "hard":
      words = wordsHard;
      break;
    default:
      words = wordsEasy;
  }

  const word = words[Math.floor(Math.random() * words.length)];

  return word;
};
