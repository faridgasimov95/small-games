import type { WordDefinition } from "@/types/shared";

export async function fetchDefinition(
  word: string,
): Promise<WordDefinition[] | null> {
  try {
    const response = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    );

    if (!response.ok) return null;

    const data = await response.json();
    const entry = data[0];

    if (!entry?.meanings) return null;

    const results: WordDefinition[] = [];

    outer: for (const meaning of entry.meanings) {
      for (const def of meaning.definitions) {
        results.push({
          partOfSpeech: meaning.partOfSpeech,
          definition: def.definition,
        });
        if (results.length === 3) break outer;
      }
    }

    return results;
  } catch (err) {
    console.error(`Failed to fetch definition for "${word}":`, err);
    return null;
  }
}
