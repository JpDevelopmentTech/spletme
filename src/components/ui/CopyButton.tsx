import { useState } from "react";
import { Check, Copy } from "lucide-react";
import type { CopyButtonProps } from "@/types/copy-button.types";

/**
 * Botón reutilizable para copiar un texto al portapapeles. Muestra un check
 * temporal tras copiar. Agnóstico al dominio: solo recibe el valor a copiar.
 */
export function CopyButton({ value, size = 13, className = "", title = "Copiar" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      title={copied ? "¡Copiado!" : title}
      aria-label={title}
      className={`inline-flex items-center justify-center rounded p-0.5 text-gray-400 hover:text-orange-500 hover:bg-gray-100 transition-colors ${className}`}
    >
      {copied ? <Check size={size} className="text-green-500" /> : <Copy size={size} />}
    </button>
  );
}
