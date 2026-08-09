import type { Difficulty } from "@/types/game";

export const TIME_LIMIT_SECONDS = 300;

export const WORD_TARGETS: Record<Difficulty, number> = {
  easy: 8,
  medium: 12,
  hard: 16,
};
