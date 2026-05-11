/**
 * Estilos compartidos para react-select con la paleta de color primario (#F97316).
 * Usar en todos los Select del proyecto para mantener consistencia visual.
 */
export const selectStyles = {
  control: (base: Record<string, unknown>) => ({
    ...base,
    border: "1px solid #e5e7eb",
    borderRadius: "8px",
    padding: "2px",
    boxShadow: "none",
    backgroundColor: "white",
    "&:hover": { border: "1px solid #F97316" },
    "&:focus-within": { border: "1px solid #F97316" },
  }),
  option: (
    base: Record<string, unknown>,
    { isSelected, isFocused }: { isSelected: boolean; isFocused: boolean }
  ) => ({
    ...base,
    backgroundColor: isSelected ? "#F97316" : isFocused ? "#fff7ed" : "white",
    color: isSelected ? "white" : "#374151",
    fontSize: "13px",
  }),
  multiValue: (base: Record<string, unknown>) => ({
    ...base,
    backgroundColor: "#fff7ed",
    borderRadius: "6px",
  }),
  multiValueLabel: (base: Record<string, unknown>) => ({
    ...base,
    color: "#c2410c",
    fontWeight: "500",
    fontSize: "12px",
  }),
  multiValueRemove: (base: Record<string, unknown>) => ({
    ...base,
    color: "#c2410c",
    "&:hover": { backgroundColor: "#F97316", color: "white" },
  }),
  placeholder: (base: Record<string, unknown>) => ({
    ...base,
    fontSize: "13px",
    color: "#9ca3af",
  }),
};
