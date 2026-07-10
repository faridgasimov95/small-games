export function clearStaleDailyCache(today: string) {
  const dailyKeyPattern = /^(.+)-daily-.+-(\d{4}-\d{2}-\d{2})$/;
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key) continue;

    const match = key.match(dailyKeyPattern);
    if (!match) continue;

    const [, , keyDate] = match;
    if (keyDate !== today) keysToRemove.push(key);
  }

  keysToRemove.forEach((key) => {
    localStorage.removeItem(key);
  });
}

export function clearDefinitionCache() {
  const interfix = "-definition-";
  const keysToRemove: string[] = [];

  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key?.includes(interfix)) {
      keysToRemove.push(key);
    }
  }

  keysToRemove.forEach((key) => localStorage.removeItem(key));
}
