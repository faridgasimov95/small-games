import WordleBoard from "@/games/wordle/WordleBoard";
import {
  useLoaderData,
  useParams,
  type LoaderFunctionArgs,
} from "react-router-dom";

export async function wordleLoader({ params }: LoaderFunctionArgs) {
  const response = await fetch(
    `http://localhost:3000/wordle/word?difficulty=${params.difficulty}`,
  );
  const word = await response.text();
  return { word };
}

export default function WordlePage() {
  const param = useParams();
  const { word } = useLoaderData() as { word: string };

  return <WordleBoard hiddenWord={word} onGameEnd={() => {}} />;
}
