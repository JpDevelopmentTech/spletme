import { LabelSplitModal } from "@/components/labels/LabelSplitModal";

interface CreateSplitsByLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  label: string;
  songCount: number;
  /** Canciones que ya tienen split, para avisar de que se sobrescriben. */
  alreadyWithSplit?: number;
}

/**
 * Reparto del porcentaje del owner en un sello artístico.
 *
 * El formulario es el mismo que el del sello personalizado, así que vive en
 * `LabelSplitModal`; aquí solo se fija el tipo de destino.
 */
export default function CreateSplitsByLabelModal({
  isOpen,
  onClose,
  label,
  songCount,
  alreadyWithSplit,
}: CreateSplitsByLabelModalProps) {
  return (
    <LabelSplitModal
      isOpen={isOpen}
      onClose={onClose}
      target={{ type: "artistic", name: label, songCount, alreadyWithSplit }}
    />
  );
}
