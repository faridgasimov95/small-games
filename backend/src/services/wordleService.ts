import fs from "fs";
import path from "path";

function loadWords(filename: string): string[] {
  try {
    const words = JSON.parse(
      fs.readFileSync(path.join(__dirname, `../data/${filename}`), "utf-8"),
    );
    if (!words.length) throw new Error(`${filename} is empty`);
    return words;
  } catch (e) {
    throw new Error(`Failed to load ${filename}: ${e}`);
  }
}

const wordsEasy = loadWords("words5.json");
const wordsMedium = loadWords("words6.json");
const wordsHard = loadWords("words7.json");

export const getWord = (difficulty: string): string => {
  let words;

  switch (difficulty) {
    case "easy":
      words = wordsEasy;
      break;
    case "medium":
      words = wordsMedium;
      break;
    case "hard":
      words = wordsHard;
      break;
    default:
      throw new Error("Invalid difficulty level");
  }

  const word = words[Math.floor(Math.random() * words.length)];
  return word;
};
