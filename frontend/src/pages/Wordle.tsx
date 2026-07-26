import EndlessNextControls from "@/components/EndlessNextControls";
import DefinitionButton from "@/games/wordle/DefinitionButton";
import { useWordleGame } from "@/games/wordle/useWordleGame";
import WordleBoard from "@/games/wordle/WordleBoard";
import WordleResultModal from "@/games/wordle/WordleResultModal";

export default function WordlePage() {
  const {
    params,
    currentHiddenWord,
    currentGuesses,
    readOnly,
    boardKey,
    endlessSolved,
    showModal,
    streak,
    isSolved,
    round,
    handleGuessSubmit,
    handleNext,
    handlePlayAgain,
    setShowModal,
  } = useWordleGame();

  return (
    <>
      <div className="flex flex-col gap-2 min-h-screen items-center pt-10">
        <div className="flex flex-col items-center gap-1">
          <h2 className="font-mono text-text/50">
            {params.mode?.toUpperCase()} MODE
          </h2>
          {params.mode === "endless" && (
            <p className="font-mono text-text/50 text-sm">Round {round}</p>
          )}
          <h1 className="flex justify-center gap-2 mt-2">
            <span className="font-pixel text-accent text-xl">WORDLE</span>
            <span className="bg-accent px-2 py-0.5 rounded-xl text-sm text-bg ">
              {params.difficulty?.toUpperCase()}
            </span>
          </h1>
        </div>
        <WordleBoard
          hiddenWord={currentHiddenWord}
          initialGuesses={currentGuesses}
          readOnly={readOnly}
          onGuessSubmit={handleGuessSubmit}
          key={boardKey}
        />
        {params.mode === "endless" && endlessSolved && (
          <EndlessNextControls
            word={currentHiddenWord}
            onNext={() => handleNext()}
          />
        )}
      </div>
      {showModal && (
        <WordleResultModal
          mode={params.mode!}
          difficulty={params.difficulty!}
          solved={isSolved}
          hiddenWord={currentHiddenWord}
          attempts={currentGuesses.length}
          streak={streak}
          onClose={() => setShowModal(false)}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </>
  );
}
