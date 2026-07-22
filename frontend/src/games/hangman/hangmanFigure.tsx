type HangmanFigureProps = {
  mistakes: number;
};

export default function HangmanFigure({ mistakes }: HangmanFigureProps) {
  return (
    <svg viewBox="0 0 200 200" className="w-40 h-40">
      <line
        x1="20"
        y1="180"
        x2="100"
        y2="180"
        stroke="currentColor"
        strokeWidth="4"
      />
      <line
        x1="60"
        y1="180"
        x2="60"
        y2="20"
        stroke="currentColor"
        strokeWidth="4"
      />
      <line
        x1="60"
        y1="20"
        x2="140"
        y2="20"
        stroke="currentColor"
        strokeWidth="4"
      />
      <line
        x1="140"
        y1="20"
        x2="140"
        y2="40"
        stroke="currentColor"
        strokeWidth="4"
      />

      {mistakes >= 1 && (
        <circle
          cx="140"
          cy="55"
          r="15"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
        />
      )}
      {mistakes >= 2 && (
        <line
          x1="140"
          y1="70"
          x2="140"
          y2="85"
          stroke="currentColor"
          strokeWidth="3"
        />
      )}
      {mistakes >= 3 && (
        <line
          x1="140"
          y1="85"
          x2="140"
          y2="130"
          stroke="currentColor"
          strokeWidth="3"
        />
      )}
      {mistakes >= 4 && (
        <line
          x1="140"
          y1="95"
          x2="120"
          y2="115"
          stroke="currentColor"
          strokeWidth="3"
        />
      )}
      {mistakes >= 5 && (
        <line
          x1="140"
          y1="95"
          x2="160"
          y2="115"
          stroke="currentColor"
          strokeWidth="3"
        />
      )}
      {mistakes >= 6 && (
        <line
          x1="140"
          y1="130"
          x2="120"
          y2="160"
          stroke="currentColor"
          strokeWidth="3"
        />
      )}
      {mistakes >= 7 && (
        <line
          x1="140"
          y1="130"
          x2="160"
          y2="160"
          stroke="currentColor"
          strokeWidth="3"
        />
      )}
    </svg>
  );
}
