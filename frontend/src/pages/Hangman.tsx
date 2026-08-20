import EndlessNextControls from "@/components/EndlessNextControls";
import HangmanFigure from "@/games/hangman/hangmanFigure";
import HangmanKeyboard from "@/games/hangman/hangmanKeyboard";
import HangmanResultModal from "@/games/hangman/HangmanResultModal";
import HangmanWord from "@/games/hangman/hangmanWord";
import { useHangmanGame } from "@/games/hangman/useHangmanGame";
import type { Difficulty, Mode } from "@/types/game";

export default function HangmanPage() {
  const {
    params,
    currentHiddenWord,
    currentGuessedLetters,
    mistakes,
    isSolved,
    readOnly,
    endlessSolved,
    showModal,
    streak,
    round,
    handleLetterGuess,
    handleNext,
    handlePlayAgain,
    setShowModal,
  } = useHangmanGame();

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
            <span className="font-pixel text-accent text-xl">HANGMAN</span>
            <span className="bg-accent px-2 py-0.5 rounded-xl text-sm text-bg ">
              {params.difficulty?.toUpperCase()}
            </span>
          </h1>
        </div>
        <HangmanFigure mistakes={mistakes} />
        <HangmanWord
          hiddenWord={currentHiddenWord}
          guessedLetters={currentGuessedLetters}
        />
        <HangmanKeyboard
          guessedLetters={currentGuessedLetters}
          hiddenWord={currentHiddenWord}
          readOnly={readOnly}
          onGuess={handleLetterGuess}
        />
        {params.mode === "endless" && endlessSolved && (
          <EndlessNextControls
            word={currentHiddenWord}
            game={"hangman"}
            onNext={() => handleNext()}
          />
        )}
      </div>
      {showModal && (
        <HangmanResultModal
          mode={params.mode! as Mode}
          difficulty={params.difficulty! as Difficulty}
          solved={isSolved}
          hiddenWord={currentHiddenWord}
          mistakes={mistakes}
          streak={streak}
          onClose={() => setShowModal(false)}
          onPlayAgain={handlePlayAgain}
        />
      )}
    </>
  );
}
