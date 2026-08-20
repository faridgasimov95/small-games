import EndlessNextControls from "@/components/EndlessNextControls";
import { useWordsmithGame } from "@/games/wordsmith/useWordsmithGame";
import WordsmithLettersBoard from "@/games/wordsmith/WordsmithLettersBoard";
import WordsmithResultModal from "@/games/wordsmith/WordsmithResultModal";
import WordsmithWordInput from "@/games/wordsmith/WordsmithWordInput";
import WordsmithWordList from "@/games/wordsmith/WordsmithWordList";
import type { Difficulty, Mode } from "@/types/game";

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
    handleWordGuess,
    handleNext,
    handlePlayAgain,
    setShowModal,
  } = useWordsmithGame();

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

        <WordsmithLettersBoard letters={currentPuzzle.letters} />

        <WordsmithWordInput onSubmit={handleWordGuess} disabled={readOnly} />

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
