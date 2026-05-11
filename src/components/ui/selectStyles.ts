/**
 * Estilos compartidos para react-select.
 * selectStyles → paleta naranja (#F97316) para formularios de colaboradores.
 * amberSelectStyles → paleta ámbar (#f59e0b) para formularios de owner splits.
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

export const amberSelectStyles = {
  control: (base: Record<string, unknown>) => ({
    ...base,
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "4px",
    boxShadow: "none",
    "&:hover": { border: "1px solid #f59e0b" },
    "&:focus-within": {
      border: "1px solid #f59e0b",
      boxShadow: "0 0 0 3px rgba(245,158,11,0.1)",
    },
  }),
  option: (
    base: Record<string, unknown>,
    { isSelected, isFocused }: { isSelected: boolean; isFocused: boolean }
  ) => ({
    ...base,
    backgroundColor: isSelected ? "#f59e0b" : isFocused ? "#fef3c7" : "white",
    color: isSelected ? "white" : "#374151",
  }),
  multiValue: (base: Record<string, unknown>) => ({
    ...base,
    backgroundColor: "#fef3c7",
    borderRadius: "8px",
  }),
  multiValueLabel: (base: Record<string, unknown>) => ({
    ...base,
    color: "#92400e",
    fontWeight: "500",
  }),
  multiValueRemove: (base: Record<string, unknown>) => ({
    ...base,
    color: "#92400e",
    "&:hover": { backgroundColor: "#f59e0b", color: "white" },
  }),
};
