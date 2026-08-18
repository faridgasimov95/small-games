import { useWordsmithGame } from "@/games/wordsmith/useWordsmithGame";
import WordsmithLettersBoard from "@/games/wordsmith/WordsmithLettersBoard";
import WordsmithResultModal from "@/games/wordsmith/WordsmithResultModal";
import WordsmithWordInput from "@/games/wordsmith/WordsmithWordInput";
import WordsmithWordList from "@/games/wordsmith/WordsmithWordList";

export default function WordsmithPage() {
  const {
    params,
    currentPuzzle,
    currentFoundWords,
    target,
    timeLeft,
    isSolved,
    isTimeUp,
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
      </div>

      {showModal && (
        <WordsmithResultModal
          mode={params.mode as "daily" | "endless"}
          difficulty={params.difficulty as "easy" | "medium" | "hard"}
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
