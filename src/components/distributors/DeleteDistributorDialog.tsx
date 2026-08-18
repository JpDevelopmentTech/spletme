import { useState } from "react";
import { TriangleAlert, Trash2 } from "lucide-react";
import { formatMoney } from "@/utils/format.utils";
import { ModalShell, SecondaryButton, DistributorMark } from "@/components/ui/ModalShell";
import type { DistributorListItem } from "./types";

interface DeleteDistributorDialogProps {
  item: DistributorListItem;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}

/**
 * Confirmación de borrado. Enseña lo que se pierde antes de preguntar, porque
 * eliminar un distribuidor arrastra todas sus cargas y los ingresos que
 * aportaron.
 */
export function DeleteDistributorDialog({
  item,
  onClose,
  onConfirm,
}: DeleteDistributorDialogProps) {
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");
  const { distributor, kpi } = item;

  async function handleDelete() {
    setDeleting(true);
    setError("");
    try {
      await onConfirm();
      onClose();
    } catch {
      setError("No se pudo eliminar el distribuidor. Vuelve a intentarlo.");
      setDeleting(false);
    }
  }

  return (
    <ModalShell
      title="Eliminar distribuidor"
      subtitle="Esta acción no se puede deshacer"
      locked={deleting}
      onClose={onClose}
      logo={
        <DistributorMark
          name={distributor.name}
          logo={distributor.photoUrl}
          color={item.color}
        />
      }
      footer={
        <>
          <span className="flex-1" />
          <SecondaryButton onClick={onClose} disabled={deleting}>
            Cancelar
          </SecondaryButton>
          <button
            type="button"
            onClick={handleDelete}
            disabled={deleting}
            className="flex items-center gap-2 rounded-[22px] bg-[#E5484D] px-[18px] py-2.5 text-[12.5px] font-semibold text-white transition-colors enabled:hover:bg-[#C93B40] disabled:opacity-60"
          >
            <Trash2 className="h-[15px] w-[15px]" />
            {deleting ? "Eliminando…" : "Eliminar"}
          </button>
        </>
      }
    >
      <p className="text-[13px] leading-relaxed text-[#1C1D22]">
        Vas a eliminar <strong className="font-semibold">{distributor.name}</strong> y todo su
        historial de cargas.
      </p>

      <ul className="flex flex-col gap-2 rounded-[18px] bg-[#FDECEC] p-4">
        <Impact label="Cargas registradas" value={(kpi?.uploadCount ?? 0).toLocaleString()} />
        <Impact label="Canciones asociadas" value={(kpi?.songsCount ?? 0).toLocaleString()} />
        <Impact
          label="Ingresos netos acumulados"
          value={formatMoney(kpi?.totalNetIncome ?? 0, distributor.currency)}
        />
      </ul>

      <p className="flex items-start gap-2.5 text-[11.5px] leading-relaxed text-[#71757E]">
        <TriangleAlert className="mt-px h-3.5 w-3.5 flex-shrink-0 text-[#E5484D]" />
        Las canciones seguirán en tu catálogo, pero perderán los ingresos que aportaba este
        distribuidor.
      </p>

      {error && <p className="text-[12px] font-medium text-[#E5484D]">{error}</p>}
    </ModalShell>
  );
}

function Impact({ label, value }: { label: string; value: string }) {
  return (
    <li className="flex items-center justify-between gap-4">
      <span className="text-[12px] text-[#71757E]">{label}</span>
      <span className="font-mono text-[12.5px] font-semibold text-[#1C1D22]">{value}</span>
    </li>
  );
}
