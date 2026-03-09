interface FilterChipProps {
  label: string;
  emoji: string;
  selected: boolean;
  onClick: () => void;
}

export default function FilterChip({
  label,
  emoji,
  selected,
  onClick,
}: FilterChipProps) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
        selected
          ? "border-teal text-teal bg-teal/5"
          : "border-gray-300 text-gray-600 bg-white"
      }`}
    >
      <span>{emoji}</span>
      <span>{label}</span>
    </button>
  );
}
