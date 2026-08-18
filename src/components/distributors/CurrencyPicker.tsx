import { Check } from "lucide-react";
import type { Currency } from "@/types/distributor.types";

const CURRENCIES: { value: Currency; label: string; symbol: string }[] = [
  { value: "USD", label: "Dólar (USD)", symbol: "$" },
  { value: "EUR", label: "Euro (EUR)", symbol: "€" },
];

interface CurrencyPickerProps {
  value: Currency;
  onChange: (value: Currency) => void;
}

/** Moneda en la que llegan los importes del reporte. */
export function CurrencyPicker({ value, onChange }: CurrencyPickerProps) {
  return (
    <div className="grid grid-cols-2 gap-2.5" role="radiogroup" aria-label="Moneda del reporte">
      {CURRENCIES.map((currency) => {
        const selected = value === currency.value;
        return (
          <button
            key={currency.value}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(currency.value)}
            className={`flex items-center gap-2.5 rounded-2xl px-4 py-3 transition-colors ${
              selected
                ? "border-[1.5px] border-[#FF5C00] bg-[#FFEADD]"
                : "border border-[#E8E8EC] bg-white hover:border-[#D9DAE0]"
            }`}
          >
            <span
              className={`flex h-[26px] w-[26px] flex-shrink-0 items-center justify-center rounded-[9px] font-mono text-[13px] font-semibold ${
                selected ? "bg-[#FF5C00] text-white" : "bg-[#F4F5F7] text-[#71757E]"
              }`}
            >
              {currency.symbol}
            </span>
            <span
              className={`flex-1 text-left text-[12.5px] font-semibold ${
                selected ? "text-[#EA580C]" : "text-[#1C1D22]"
              }`}
            >
              {currency.label}
            </span>
            {selected && <Check className="h-[15px] w-[15px] flex-shrink-0 text-[#FF5C00]" />}
          </button>
        );
      })}
    </div>
  );
}
