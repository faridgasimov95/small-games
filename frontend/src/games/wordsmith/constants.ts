import type { Difficulty } from "@/types/game";

export const TIME_LIMIT_SECONDS = 300;
export const DAILY_TIME_BOUNDS = [30, 60, 120, 180] as const;

export const DAILY_BUCKET_LABELS = DAILY_TIME_BOUNDS.map((bound, i) =>
  i === 0 ? `<${bound}` : `${DAILY_TIME_BOUNDS[i - 1]}-${bound}`,
).concat(`<${DAILY_TIME_BOUNDS[DAILY_TIME_BOUNDS.length - 1]}`);

export const WORD_TARGETS: Record<Difficulty, number> = {
  easy: 8,
  medium: 12,
  hard: 16,
};
