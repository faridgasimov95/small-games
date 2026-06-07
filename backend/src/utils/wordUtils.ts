import fs from "fs";
import path from "path";

export function loadJson<T>(foldername: string, filename: string): T[] {
  try {
    const data = JSON.parse(
      fs.readFileSync(
        path.join(__dirname, `../data/${foldername}/${filename}`),
        "utf-8",
      ),
    );
    if (!data.length) throw new Error(`${filename} is empty`);
    return data;
  } catch (e) {
    throw new Error(`Failed to load ${filename}: ${e}`);
  }
}

export const getRandom = <T>(items: T[]): T => {
  return items[Math.floor(Math.random() * items.length)];
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

export const updateTopTen = (top: number[], newValue: number) => {
  if (top.length === 0) return [newValue];

  let i = 0;
  while (i < top.length && newValue > top[i]) {
    i++;
  }

  if (i === top.length && top.length === 10) return top;

  const newTop = [...top.slice(0, i), newValue].concat(
    top.slice(i, top.length === 10 ? top.length - 1 : top.length),
  );

  return newTop;
};
