import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Check,
  CircleAlert,
  Loader,
  Music2,
  TriangleAlert,
  Wallet,
  ArrowRight,
  Mail,
  HandCoins,
} from "lucide-react";
import PaymentsService, { type CollaboratorReadiness } from "@/services/payments";
import { formatCurrency } from "@/utils/format.utils";
import { collaboratorColor, initialsOf } from "@/utils/collaborators.utils";
import { ModalShell, PrimaryButton, SecondaryButton } from "@/components/ui/ModalShell";

/** Una persona a la que se le va a pagar. */
export interface PaymentTarget {
  id: string;
  name: string;
  email: string;
  pending: number;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  /** Uno o varios. En lote son cobros independientes, uno por persona. */
  targets: PaymentTarget[];
  onPaymentSuccess?: () => void;
}

type Step = "loading" | "confirm" | "processing" | "success";

interface BatchResult {
  target: PaymentTarget;
  ok: boolean;
  message?: string;
}

/**
 * Pago del saldo pendiente de un colaborador, o de varios de una vez.
 *
 * Para una sola persona se consulta el readiness antes de cobrar nada, que es lo
 * que dice si se puede pagar y por qué canciones. En lote se encadenan cobros
 * independientes —uno por persona— y así se advierte en el propio modal.
 */
export function CollaboratorPaymentModal({
  isOpen,
  onClose,
  targets,
  onPaymentSuccess,
}: Props) {
  const batch = targets.length > 1;
  const single = targets[0];

  const [step, setStep] = useState<Step>(batch ? "confirm" : "loading");
  const [readiness, setReadiness] = useState<CollaboratorReadiness | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<BatchResult[]>([]);
  const [current, setCurrent] = useState(0);

  const loadReadiness = useCallback(async () => {
    if (!single) return;
    setStep("loading");
    setError(null);
    setReadiness(null);

    const response = await PaymentsService.getCollaboratorReadiness(single.id);
    if (response.error || !response.data) {
      setError(response.message ?? "No se pudo calcular lo que le corresponde.");
    } else {
      setReadiness(response.data);
    }
    setStep("confirm");
  }, [single]);

  useEffect(() => {
    if (!isOpen) return;
    setResults([]);
    setCurrent(0);
    setError(null);
    if (batch) {
      setStep("confirm");
      setReadiness(null);
    } else {
      loadReadiness();
    }
  }, [isOpen, batch, loadReadiness]);

  const declaredTotal = useMemo(
    () => targets.reduce((sum, t) => sum + t.pending, 0),
    [targets],
  );
  const total = batch ? declaredTotal : (readiness?.totalPending ?? single?.pending ?? 0);
  const blocked = !batch && Boolean(readiness) && !readiness!.canPay;
  const canPay = batch ? total > 0 : Boolean(readiness?.canPay) && total > 0;

  if (!isOpen || targets.length === 0) return null;

  const handleClose = () => {
    if (step === "processing") return;
    onClose();
  };

  async function handlePay() {
    setError(null);
    setStep("processing");

    const collected: BatchResult[] = [];
    for (const [index, target] of targets.entries()) {
      setCurrent(index);
      const response = await PaymentsService.payCollaborator(target.id);
      collected.push({
        target,
        ok: !response.error,
        message: response.error ? (response.message ?? "No se pudo procesar") : undefined,
      });
      setResults([...collected]);
    }

    const anyOk = collected.some((r) => r.ok);
    if (!anyOk) {
      setError(collected[0]?.message ?? "No se pudo procesar el pago.");
      setStep("confirm");
      return;
    }
    setStep("success");
    onPaymentSuccess?.();
  }

  const title =
    step === "success"
      ? batch
        ? "Pagos enviados"
        : "Pago enviado"
      : step === "processing"
        ? "Procesando el pago"
        : batch
          ? `Pagar a ${targets.length} colaboradores`
          : `Pagar a ${single.name}`;

  const subtitle =
    step === "processing" || step === "success"
      ? `${formatCurrency(total)}${batch ? "" : ` a ${single.name}`}`
      : batch
        ? "Todos tienen sus datos de cobro completos"
        : single.email;

  return (
    <ModalShell
      title={title}
      subtitle={subtitle}
      width="lg"
      locked={step === "processing"}
      onClose={handleClose}
      logo={!batch ? <Avatar name={single.name} /> : undefined}
      footer={renderFooter()}
    >
      {step === "loading" && <LoadingState />}
      {step === "confirm" && !blocked && (
        <ConfirmState
          batch={batch}
          targets={targets}
          total={total}
          readiness={readiness}
          error={error}
        />
      )}
      {step === "confirm" && blocked && <BlockedState name={single.name} pending={total} readiness={readiness!} />}
      {step === "processing" && (
        <ProcessingState batch={batch} targets={targets} current={current} results={results} />
      )}
      {step === "success" && <SuccessState batch={batch} results={results} total={total} />}
    </ModalShell>
  );

  function renderFooter() {
    if (step === "loading") {
      return (
        <>
          <span className="flex-1" />
          <SecondaryButton onClick={handleClose}>Cancelar</SecondaryButton>
          <PrimaryButton disabled>Pagar</PrimaryButton>
        </>
      );
    }

    if (step === "processing") {
      return (
        <span className="flex-1 text-[11px] text-[#A6AAB2]">
          Tarda unos segundos. No cierres esta ventana.
        </span>
      );
    }

    if (step === "success") {
      return (
        <>
          <span className="flex-1 text-[11px] text-[#A6AAB2]">
            Los saldos ya están actualizados
          </span>
          <PrimaryButton onClick={onClose} icon={<ArrowRight className="h-[15px] w-[15px]" />}>
            Hecho
          </PrimaryButton>
        </>
      );
    }

    if (blocked) {
      return (
        <>
          <span className="flex-1" />
          <SecondaryButton onClick={handleClose}>Cerrar</SecondaryButton>
          <PrimaryButton
            onClick={() => window.open(`mailto:${single.email}`, "_blank")}
            icon={<Mail className="h-[15px] w-[15px]" />}
          >
            Enviar recordatorio
          </PrimaryButton>
        </>
      );
    }

    return (
      <>
        <span className="flex-1" />
        <SecondaryButton onClick={handleClose}>Cancelar</SecondaryButton>
        <PrimaryButton
          onClick={handlePay}
          disabled={!canPay}
          icon={<ArrowRight className="h-[15px] w-[15px]" />}
        >
          Pagar {formatCurrency(total)}
        </PrimaryButton>
      </>
    );
  }
}

function Avatar({ name, index = 0 }: { name: string; index?: number }) {
  return (
    <span
      className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-full"
      style={{ backgroundColor: collaboratorColor(index) }}
    >
      <span className="text-[13px] font-semibold text-white">{initialsOf(name)}</span>
    </span>
  );
}

function LoadingState() {
  return (
    <>
      <div className="flex flex-col gap-2.5 rounded-[18px] bg-[#F4F5F7] p-4">
        <span className="h-2.5 w-[110px] animate-pulse rounded-full bg-white" />
        <span className="h-7 w-[190px] animate-pulse rounded-lg bg-white" />
        <span className="h-2.5 w-[280px] animate-pulse rounded-full bg-white/70" />
      </div>
      <p className="flex items-center justify-center gap-2.5 py-2 text-[11.5px] text-[#71757E]">
        <Loader className="h-4 w-4 animate-spin text-[#FF5C00]" />
        Revisando canciones y saldos pendientes
      </p>
    </>
  );
}

function ConfirmState({
  batch,
  targets,
  total,
  readiness,
  error,
}: {
  batch: boolean;
  targets: PaymentTarget[];
  total: number;
  readiness: CollaboratorReadiness | null;
  error: string | null;
}) {
  return (
    <>
      <div className="flex flex-col gap-1.5 rounded-[18px] bg-[#FFEADD] p-4">
        <span className="font-mono text-[9.5px] font-medium tracking-[1.2px] text-[#FF5C00]">
          TOTAL A PAGAR
        </span>
        <span className="font-mono text-[30px] font-semibold leading-none tracking-tight text-[#FF5C00]">
          {formatCurrency(total)}
        </span>
        <span className="text-[11px] leading-relaxed text-[#EA580C]">
          {batch
            ? `Se harán ${targets.length} cobros independientes, uno por persona.`
            : "Se cobrará de tu cuenta bancaria y llegará por Wise."}
        </span>
      </div>

      {batch ? (
        <ul className="flex flex-col gap-1.5">
          {targets.map((target, index) => (
            <li
              key={target.id}
              className="flex items-center gap-2.5 rounded-[14px] bg-[#F4F5F7] px-3 py-2.5"
            >
              <span
                className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full"
                style={{ backgroundColor: collaboratorColor(index) }}
              >
                <span className="text-[10px] font-semibold text-white">
                  {initialsOf(target.name)}
                </span>
              </span>
              <span className="flex-1 truncate text-[12px] font-medium text-[#1C1D22]">
                {target.name}
              </span>
              <span className="font-mono text-[12px] font-semibold text-[#1C1D22]">
                {formatCurrency(target.pending)}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        readiness &&
        readiness.songs.length > 0 && (
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[12.5px] font-semibold text-[#1C1D22]">
                {readiness.songs.length}{" "}
                {readiness.songs.length === 1 ? "canción con saldo" : "canciones con saldo"}
              </span>
              <span className="text-[11px] text-[#A6AAB2]">Se paga todo junto</span>
            </div>
            <ul className="flex max-h-[220px] flex-col gap-1.5 overflow-y-auto">
              {readiness.songs.map((song) => (
                <li
                  key={song.songId}
                  className="flex items-center gap-2.5 rounded-[13px] bg-[#F4F5F7] px-3 py-2.5"
                >
                  <Music2 className="h-3.5 w-3.5 flex-shrink-0 text-[#A6AAB2]" />
                  <span className="flex-1 truncate text-[12px] text-[#1C1D22]">
                    {song.trackTitle}
                  </span>
                  <span className="font-mono text-[12px] font-semibold text-[#1C1D22]">
                    {formatCurrency(song.pendingAmount)}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )
      )}

      {error && (
        <p className="flex items-center gap-2 rounded-[14px] bg-[#FDECEC] px-3.5 py-3 text-[12px] font-medium text-[#E5484D]">
          <CircleAlert className="h-4 w-4 flex-shrink-0" />
          {error}
        </p>
      )}
    </>
  );
}

function BlockedState({
  name,
  pending,
  readiness,
}: {
  name: string;
  pending: number;
  readiness: CollaboratorReadiness;
}) {
  return (
    <>
      <div className="flex items-start gap-3 rounded-[18px] bg-[#FDECEC] p-4">
        <span className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-full bg-white">
          <Wallet className="h-4 w-4 text-[#E5484D]" />
        </span>
        <span className="flex flex-col gap-1">
          <span className="text-[13px] font-semibold text-[#E5484D]">
            {name} aún no puede recibir pagos
          </span>
          {readiness.issues.length > 0 ? (
            readiness.issues.map((issue) => (
              <span key={issue.code} className="text-[11.5px] leading-relaxed text-[#E5484D]">
                {issue.message}
              </span>
            ))
          ) : (
            <span className="text-[11.5px] leading-relaxed text-[#E5484D]">
              Le faltan datos de cobro. Su saldo queda retenido hasta que los complete.
            </span>
          )}
        </span>
      </div>

      <div className="flex items-center justify-between rounded-[18px] bg-[#F4F5F7] p-4">
        <span className="text-[12px] text-[#71757E]">Saldo retenido</span>
        <span className="font-mono text-[20px] font-semibold text-[#71757E]">
          {formatCurrency(pending)}
        </span>
      </div>
    </>
  );
}

function ProcessingState({
  batch,
  targets,
  current,
  results,
}: {
  batch: boolean;
  targets: PaymentTarget[];
  current: number;
  results: BatchResult[];
}) {
  return (
    <>
      <div className="flex flex-col items-center gap-3 py-2">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFEADD]">
          <Loader className="h-6 w-6 animate-spin text-[#FF5C00]" />
        </span>
        <span className="font-display text-base font-semibold text-[#1C1D22]">
          {batch ? `Pagando ${current + 1} de ${targets.length}` : "Cobrando de tu cuenta"}
        </span>
        <span className="text-[12px] text-[#71757E]">
          No cierres esta ventana hasta que termine.
        </span>
      </div>

      {batch && (
        <ul className="flex flex-col gap-1.5">
          {targets.map((target, index) => {
            const done = results.find((r) => r.target.id === target.id);
            const active = index === current && !done;
            return (
              <li
                key={target.id}
                className={`flex items-center gap-2.5 rounded-[13px] px-3 py-2.5 ${
                  active ? "bg-[#FFEADD]" : "bg-[#F4F5F7]"
                }`}
              >
                <span
                  className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full ${
                    done ? (done.ok ? "bg-[#2FB37E]" : "bg-[#E5484D]") : active ? "bg-[#FF5C00]" : "bg-[#E8E8EC]"
                  }`}
                >
                  {done ? (
                    done.ok ? (
                      <Check className="h-3 w-3 text-white" />
                    ) : (
                      <TriangleAlert className="h-3 w-3 text-white" />
                    )
                  ) : active ? (
                    <Loader className="h-3 w-3 animate-spin text-white" />
                  ) : null}
                </span>
                <span
                  className={`flex-1 truncate text-[12px] ${
                    active ? "font-semibold text-[#1C1D22]" : "text-[#71757E]"
                  }`}
                >
                  {target.name}
                </span>
                <span className="font-mono text-[11.5px] text-[#71757E]">
                  {formatCurrency(target.pending)}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </>
  );
}

function SuccessState({
  batch,
  results,
  total,
}: {
  batch: boolean;
  results: BatchResult[];
  total: number;
}) {
  const failed = results.filter((r) => !r.ok);
  const paid = results.filter((r) => r.ok);
  const paidTotal = paid.reduce((sum, r) => sum + r.target.pending, 0);

  return (
    <>
      <div className="flex flex-col items-center gap-2.5 rounded-[18px] bg-[#E4F5EC] p-[18px]">
        <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#2FB37E]">
          <Check className="h-6 w-6 text-white" />
        </span>
        <span className="font-mono text-[26px] font-semibold text-[#1F7D58]">
          {formatCurrency(batch ? paidTotal : total)}
        </span>
        <span className="text-center text-[12px] text-[#2FB37E]">
          {batch
            ? `${paid.length} ${paid.length === 1 ? "pago iniciado" : "pagos iniciados"}`
            : "Saldo liquidado por completo"}
        </span>
      </div>

      {failed.length > 0 && (
        <div className="flex flex-col gap-2 rounded-[18px] bg-[#FDECEC] p-4">
          <span className="flex items-center gap-2 text-[12.5px] font-semibold text-[#E5484D]">
            <TriangleAlert className="h-3.5 w-3.5 flex-shrink-0" />
            {failed.length} {failed.length === 1 ? "pago no salió" : "pagos no salieron"}
          </span>
          {failed.map((item) => (
            <span key={item.target.id} className="text-[11.5px] text-[#E5484D]">
              {item.target.name}: {item.message}
            </span>
          ))}
        </div>
      )}

      <ul className="flex flex-col gap-2">
        <Detail label="Cobro de tu cuenta" value="Confirmado hoy" />
        <Detail label="Llega al colaborador" value="~2 días hábiles" />
        <Detail
          label="Vía"
          value={
            <span className="flex items-center gap-1.5">
              <HandCoins className="h-3 w-3 text-[#A6AAB2]" />
              Wise
            </span>
          }
        />
      </ul>
    </>
  );
}

function Detail({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <li className="flex items-center justify-between gap-4">
      <span className="text-[11.5px] text-[#71757E]">{label}</span>
      <span className="text-[11.5px] font-semibold text-[#1C1D22]">{value}</span>
    </li>
  );
}

export default CollaboratorPaymentModal;
