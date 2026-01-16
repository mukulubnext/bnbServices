type SortOrder = "asc" | "desc";

interface SortIndicatorProps {
  active: boolean;
  order: SortOrder;
}

export function SortIndicator({ active, order }: SortIndicatorProps) {
  return (
    <span className="inline-flex flex-col ml-2 leading-none">
      <span
        className={`text-xs transition-colors ${
          active && order === "asc"
            ? "text-dark"
            : "text-dark/30"
        }`}
      >
        ▲
      </span>

      <span
        className={`text-xs transition-colors -mt-1 ${
          active && order === "desc"
            ? "text-dark"
            : "text-dark/30"
        }`}
      >
        ▼
      </span>
    </span>
  );
}
