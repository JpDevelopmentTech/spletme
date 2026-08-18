import { LabelSplitModal } from "@/components/labels/LabelSplitModal";

interface CreateSplitsByCustomLabelModalProps {
  isOpen: boolean;
  onClose: () => void;
  labelName: string;
  /** Sellos artísticos que agrupa. El servidor los resuelve por el nombre del sello. */
  artisticLabels?: string[];
  songCount: number;
  /** Canciones que ya tienen split, para avisar de que se sobrescriben. */
  alreadyWithSplit?: number;
}

/**
 * Reparto del porcentaje del owner en un sello personalizado: alcanza a las
 * canciones de todos los sellos artísticos que agrupa.
 *
 * Comparte formulario con el sello artístico; aquí solo se fija el destino.
 */
export default function CreateSplitsByCustomLabelModal({
  isOpen,
  onClose,
  labelName,
  songCount,
  alreadyWithSplit,
}: CreateSplitsByCustomLabelModalProps) {
  return (
    <LabelSplitModal
      isOpen={isOpen}
      onClose={onClose}
      target={{ type: "custom", name: labelName, songCount, alreadyWithSplit }}
    />
  );
}
