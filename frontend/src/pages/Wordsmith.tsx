import EndlessNextControls from "@/components/EndlessNextControls";
import { useWordsmithGame } from "@/games/wordsmith/useWordsmithGame";
import { isValidPartialGuess } from "@/games/wordsmith/utils";
import WordsmithLettersBoard from "@/games/wordsmith/WordsmithLettersBoard";
import WordsmithResultModal from "@/games/wordsmith/WordsmithResultModal";
import WordsmithWordInput from "@/games/wordsmith/WordsmithWordInput";
import WordsmithWordList from "@/games/wordsmith/WordsmithWordList";
import type { Difficulty, Mode } from "@/types/game";
import { useState } from "react";

export default function WordsmithPage() {
  const {
    params,
    currentPuzzle,
    currentFoundWords,
    target,
    timeLeft,
    isSolved,
    readOnly,
    endlessSolved,
    showModal,
    streak,
    round,
    completionTime,
    isShaking,
    handleWordGuess,
    handleNext,
    handlePlayAgain,
    setShowModal,
  } = useWordsmithGame();

  const [guessValue, setGuessValue] = useState("");

  function handleGuessChange(newValue: string) {
    if (isValidPartialGuess(newValue, currentPuzzle.letters)) {
      setGuessValue(newValue);
    }
  }

  function handleLetterClick(letter: string) {
    handleGuessChange(guessValue + letter);
  }

  function handleSubmitGuess(word: string) {
    handleWordGuess(word);
    setGuessValue("");
  }

  return (
    <>
      <div className="flex flex-col gap-4 min-h-screen items-center pt-10">
        <div className="flex flex-col items-center">
          <h2 className="font-mono text-text/50">
            {params.mode?.toUpperCase()} MODE
          </h2>
          {params.mode === "endless" && (
            <p className="font-mono text-text/50 text-sm">Round {round}</p>
          )}
          <h1 className="flex justify-center gap-2 mt-2">
            <span className="font-pixel text-accent text-xl">WORDSMITH</span>
            <span className="bg-accent px-2 py-0.5 rounded-xl text-sm text-bg">
              {params.difficulty?.toUpperCase()}
            </span>
          </h1>
        </div>

        <p>
          {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, "0")}
        </p>

        <WordsmithLettersBoard
          letters={currentPuzzle.letters}
          onLetterClick={handleLetterClick}
          disabled={readOnly}
        />

        <WordsmithWordInput
          value={guessValue}
          onChange={handleGuessChange}
          onSubmit={handleSubmitGuess}
          disabled={readOnly}
          isShaking={isShaking}
        />

        <WordsmithWordList foundWords={currentFoundWords} target={target} />

        {params.mode === "endless" && endlessSolved && (
          <EndlessNextControls game="wordsmith" onNext={() => handleNext()} />
        )}
      </div>

      {showModal && (
        <WordsmithResultModal
          mode={params.mode as Mode}
          difficulty={params.difficulty as Difficulty}
          solved={isSolved}
          completionTime={completionTime ?? 0}
          foundWordsCount={currentFoundWords.length}
          target={target}
          streak={streak}
          onClose={() => setShowModal(false)}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </>
  );
}
