import fs from "fs";
import path from "path";

export function loadWords(foldername: string, filename: string): string[] {
  try {
    const words = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, `../data/${foldername}/${filename}`),
        "utf-8",
      ),
    );
    if (!words.length) throw new Error(`${filename} is empty`);
    return words;
  } catch (e) {
    throw new Error(`Failed to load ${filename}: ${e}`);
  }
}

export const getWord = (words: string[]): string => {
  return words[Math.floor(Math.random() * words.length)];
};

export function loadStats<T>(filePath: string): T {
  try {
    const stats = JSON.parse(
      fs.readFileSync(path.join(__dirname, filePath), "utf-8"),
    );
    if (!Object.keys(stats).length) throw new Error(`${filePath} is empty`);
    return stats;
  } catch (e) {
    throw new Error(`Failed to load stats: ${e}`);
  }
}
