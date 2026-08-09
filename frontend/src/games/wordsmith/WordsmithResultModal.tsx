type WorsmithResultModalProps = {
  onClose: () => void;
};

export default function WordsmithResultModal({
  onClose,
}: WorsmithResultModalProps) {
  return (
    <div>
      {/* TODO: split into Daily and Endless stats view like Wordle */}
      <button onClick={onClose}>Close</button>
    </div>
  );
}
