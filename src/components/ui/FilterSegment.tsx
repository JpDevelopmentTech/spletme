import type { FilterType } from "@/types";

interface FilterSegmentProps {
  value: FilterType;
  onChange: (v: FilterType) => void;
  labels: { all: string; except: string; only: string };
  name: string;
}

/**
 * Selector de 3 opciones (Todos / Excepto / Solo) reutilizable para
 * filtros de países y plataformas en formularios de splits.
 */
export function FilterSegment({
  value,
  onChange,
  labels,
  name,
}: FilterSegmentProps) {
  const options: { val: FilterType; label: string }[] = [
    { val: "all", label: labels.all },
    { val: "except", label: labels.except },
    { val: "only", label: labels.only },
  ];

  return (
    <div className="flex gap-0.5 rounded-lg border border-gray-200 bg-gray-50 p-0.5">
      {options.map((opt) => (
        <button
          key={opt.val}
          type="button"
          onClick={() => onChange(opt.val)}
          className={`flex-1 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
            value === opt.val
              ? "border border-gray-200 bg-white text-gray-900"
              : "text-gray-500 hover:text-gray-700"
          }`}
          aria-label={`${name} ${opt.label}`}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
