import Select from "react-select";
import type { StylesConfig } from "react-select";

const MONTHS = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

interface Option {
  value: string;
  label: string;
}

/**
 * Estilos de los dos desplegables de fecha: los de siempre, pero apretados.
 *
 * Comparten familia con `selectStyles` (mismo naranja, mismo radio) y solo
 * cambian de talla: aquí caben dos por fila dentro del modal, así que el
 * control pierde el alto por defecto de react-select y el separador vertical,
 * que a este tamaño solo mete ruido.
 */
const monthSelectStyles: StylesConfig<Option, false> = {
  menuPortal: (base) => ({ ...base, zIndex: 10000 }),
  menu: (base) => ({ ...base, width: "auto", minWidth: "100%", marginTop: 4 }),
  menuList: (base) => ({ ...base, maxHeight: 200, padding: 4 }),
  control: (base, { isFocused }) => ({
    ...base,
    "minHeight": 33,
    "border": `1px solid ${isFocused ? "#FF5C00" : "#E8E8EC"}`,
    "borderRadius": 10,
    "boxShadow": isFocused ? "0 0 0 2px rgba(255,92,0,0.2)" : "none",
    "cursor": "pointer",
    "&:hover": { border: `1px solid ${isFocused ? "#FF5C00" : "#D5D6DB"}` },
  }),
  valueContainer: (base) => ({ ...base, padding: "0 2px 0 8px" }),
  singleValue: (base) => ({
    ...base,
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 12,
    fontWeight: 600,
    color: "#1C1D22",
  }),
  placeholder: (base) => ({ ...base, fontSize: 12, color: "#A6AAB2" }),
  input: (base) => ({ ...base, margin: 0, padding: 0, fontSize: 12 }),
  indicatorSeparator: () => ({ display: "none" }),
  dropdownIndicator: (base) => ({ ...base, padding: "0 4px", color: "#C9CBD1" }),
  option: (base, { isSelected, isFocused }) => ({
    ...base,
    "backgroundColor": isSelected ? "#FF5C00" : isFocused ? "#FFF3EB" : "white",
    "color": isSelected ? "white" : "#1C1D22",
    "fontFamily": "ui-monospace, SFMono-Regular, Menlo, monospace",
    "fontSize": 12,
    "fontWeight": 600,
    "borderRadius": 6,
    "padding": "6px 8px",
    "cursor": "pointer",
    ":active": { backgroundColor: isSelected ? "#FF5C00" : "#FFEADD" },
  }),
};

interface MonthFieldProps {
  /** Mes en formato `YYYY-MM`, o "" si todavía no se ha elegido. */
  value: string;
  onChange: (value: string) => void;
  /** Primer y último año elegibles. */
  minYear: number;
  maxYear: number;
  label: string;
  invalid?: boolean;
}

/**
 * Selector de mes y año: dos desplegables, uno para cada cosa.
 *
 * No usa `<input type="month">`, que pinta el mes en el idioma del NAVEGADOR:
 * en una interfaz en español acababa enseñando "March 2026" justo encima de un
 * "may 2026" nuestro, y esa mezcla hacía dudar de si las dos fechas eran
 * siquiera del mismo tipo. Tampoco pide un día, que aquí no significa nada: el
 * distribuidor reporta por mes.
 *
 * Usa react-select y no un `<select>` estilado porque el nativo reserva sitio
 * para el botón que dibuja el navegador —y `appearance: none` no siempre se lo
 * quita—, así que a este ancho el mes quedaba recortado fuera del campo. Es
 * además el mismo desplegable que ya usan los filtros de países y plataformas,
 * con el menú portado al body para que no lo recorte el modal.
 */
export function MonthField({
  value,
  onChange,
  minYear,
  maxYear,
  label,
  invalid = false,
}: MonthFieldProps) {
  const [year, month] = (value || "").split("-");

  const monthOptions: Option[] = MONTHS.map((name, i) => ({
    value: String(i + 1).padStart(2, "0"),
    label: name,
  }));

  const yearOptions: Option[] = [];
  for (let y = minYear; y <= maxYear; y += 1) yearOptions.push({ value: String(y), label: String(y) });

  const emit = (nextYear: string, nextMonth: string) =>
    onChange(nextYear && nextMonth ? `${nextYear}-${nextMonth}` : "");

  const styles: StylesConfig<Option, false> = invalid
    ? {
        ...monthSelectStyles,
        control: (base, state) => ({
          ...(monthSelectStyles.control?.(base, state) as object),
          border: "1px solid #E5484D",
        }),
      }
    : monthSelectStyles;

  return (
    <span className="flex min-w-0 items-center gap-1">
      <span className="w-[74px] shrink-0">
        <Select<Option>
          options={monthOptions}
          value={monthOptions.find((o) => o.value === month) ?? null}
          onChange={(option) =>
            emit(year || String(new Date().getFullYear()), option?.value ?? "")
          }
          styles={styles}
          menuPortalTarget={document.body}
          menuPosition="fixed"
          isSearchable={false}
          placeholder="mes"
          aria-label={`Mes · ${label}`}
          noOptionsMessage={() => "Sin meses"}
        />
      </span>

      <span className="w-[82px] shrink-0">
        <Select<Option>
          options={yearOptions}
          value={yearOptions.find((o) => o.value === year) ?? null}
          onChange={(option) => emit(option?.value ?? "", month || "01")}
          styles={styles}
          menuPortalTarget={document.body}
          menuPosition="fixed"
          placeholder="año"
          aria-label={`Año · ${label}`}
          noOptionsMessage={() => "Sin años"}
        />
      </span>
    </span>
  );
}

export default MonthField;
