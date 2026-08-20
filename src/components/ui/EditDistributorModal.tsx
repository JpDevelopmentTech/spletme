import { useState } from "react";
import { CircleAlert, Info } from "lucide-react";
import type { Currency, Distributor } from "@/types/distributor.types";
import {
  ModalShell,
  FieldLabel,
  PrimaryButton,
  SecondaryButton,
  DistributorMark,
} from "@/components/ui/ModalShell";
import { CurrencyPicker } from "@/components/distributors/CurrencyPicker";

interface Props {
  distributor: Distributor;
  onClose: () => void;
  onConfirm: (payload: { name: string; currency: Currency }) => Promise<void>;
}

/**
 * Edición del nombre interno y la moneda. El proveedor no se cambia: es lo que
 * identifica de dónde salen los reportes ya cargados.
 */
export default function EditDistributorModal({ distributor, onClose, onConfirm }: Props) {
  const [name, setName] = useState(distributor.name);
  const [currency, setCurrency] = useState<Currency>(distributor.currency);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const trimmed = name.trim();
  const changed = trimmed !== distributor.name || currency !== distributor.currency;
  const currencyChanged = currency !== distributor.currency;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!trimmed) {
      setError("El nombre no puede quedar vacío.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onConfirm({ name: trimmed, currency });
      onClose();
    } catch {
      setError("No se pudieron guardar los cambios. Vuelve a intentarlo.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="contents">
      <ModalShell
        title="Editar distribuidor"
        subtitle={distributor.provider ?? "Sin proveedor asociado"}
        locked={saving}
        onClose={onClose}
        logo={<DistributorMark name={distributor.name} logo={distributor.photoUrl} />}
        footer={
          <>
            <span className="flex-1" />
            <SecondaryButton onClick={onClose} disabled={saving}>
              Cancelar
            </SecondaryButton>
            <PrimaryButton type="submit" disabled={saving || !changed || !trimmed}>
              {saving ? "Guardando…" : "Guardar cambios"}
            </PrimaryButton>
          </>
        }
      >
        <div className="flex flex-col gap-2">
          <FieldLabel required invalid={Boolean(error) && !trimmed}>
            NOMBRE INTERNO
          </FieldLabel>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`rounded-2xl border px-4 py-3 text-[13px] font-medium text-[#1C1D22] transition-colors focus:outline-none focus:ring-[3px] focus:ring-[#FF5C00]/15 ${
              error && !trimmed
                ? "border-[1.5px] border-[#E5484D] bg-[#FDECEC]"
                : "border-[#E8E8EC] focus:border-[#FF5C00]"
            }`}
          />
          <span className="text-[11px] leading-relaxed text-[#A6AAB2]">
            Así lo verás en tus listas. Útil si tienes varias cuentas del mismo distribuidor.
          </span>
        </div>

        <div className="flex flex-col gap-2">
          <FieldLabel>MONEDA HABITUAL DE SUS REPORTES</FieldLabel>
          <CurrencyPicker value={currency} onChange={setCurrency} />
        </div>

        {currencyChanged && (
          <p className="flex items-start gap-2.5 rounded-[14px] bg-[#FFEADD] px-3.5 py-3 text-[11px] leading-relaxed text-[#EA580C]">
            <CircleAlert className="mt-px h-3.5 w-3.5 flex-shrink-0 text-[#FF5C00]" />
            Solo cambia la moneda que se preselecciona al subir el próximo reporte. Los importes
            ya cargados están en dólares y no se tocan.
          </p>
        )}

        {!currencyChanged && (
          <p className="flex items-start gap-2.5 rounded-[14px] bg-[#F4F5F7] px-3.5 py-3 text-[11px] leading-relaxed text-[#71757E]">
            <Info className="mt-px h-3.5 w-3.5 flex-shrink-0" />
            El proveedor y los reportes ya cargados no se modifican.
          </p>
        )}

        {error && <p className="text-[12px] font-medium text-[#E5484D]">{error}</p>}
      </ModalShell>
    </form>
  );
}
