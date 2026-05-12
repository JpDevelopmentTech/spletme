import { AnimatePresence, motion } from "framer-motion";
import { Info, TriangleAlert, CircleCheck, CircleX, X } from "lucide-react";

export type ValidationToastType = "success" | "info" | "warning" | "error";

export interface ValidationToastItem {
  id: number;
  type: ValidationToastType;
  message: string;
  title?: string;
  email?: string;
  reasons?: string[];
  canPay?: boolean;
}

interface ValidationPopupQueueProps {
  toasts: ValidationToastItem[];
  onDequeue: (id: number) => void;
  onClearAll?: () => void;
}

const toastStyles: Record<
  ValidationToastType,
  { container: string; icon: string; Icon: typeof Info }
> = {
  success: {
    container:
      "bg-green-100 dark:bg-green-900 border-l-4 border-green-500 dark:border-green-700 text-green-900 dark:text-green-100",
    icon: "text-green-600",
    Icon: CircleCheck,
  },
  info: {
    container:
      "bg-blue-100 dark:bg-blue-900 border-l-4 border-blue-500 dark:border-blue-700 text-blue-900 dark:text-blue-100",
    icon: "text-blue-600",
    Icon: Info,
  },
  warning: {
    container:
      "bg-yellow-100 dark:bg-yellow-900 border-l-4 border-yellow-500 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100",
    icon: "text-yellow-600",
    Icon: TriangleAlert,
  },
  error: {
    container:
      "bg-red-100 dark:bg-red-900 border-l-4 border-red-500 dark:border-red-700 text-red-900 dark:text-red-100",
    icon: "text-red-600",
    Icon: CircleX,
  },
};

const ValidationPopupQueue = ({
  toasts,
  onDequeue,
  onClearAll,
}: ValidationPopupQueueProps) => {
  const isOpen = toasts.length > 0;
  const clearAll = onClearAll ?? (() => toasts.forEach((toast) => onDequeue(toast.id)));

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[998]"
          />

          {/* Popup centrado */}
          <motion.div
            key="popup"
            initial={{ opacity: 0, scale: 0.92, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 24 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed inset-0 flex items-center justify-center z-[999] pointer-events-none"
          >
            <div className="pointer-events-auto bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-200 dark:border-zinc-700">
                <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-200">
                  {toasts.length} {toasts.length === 1 ? "validación" : "validaciones"}
                </span>
                <button
                  type="button"
                  onClick={clearAll}
                  className="text-xs font-medium text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200 transition-colors"
                >
                  Cerrar todo
                </button>
              </div>

              {/* Lista de mensajes */}
              <ul className="flex flex-col gap-3 p-5 max-h-[80vh] overflow-y-auto">
                <AnimatePresence initial={false}>
                  {toasts.map((toast) => {
                    const style = toastStyles[toast.type];
                    const Icon = toast.canPay ? CircleCheck : style.Icon;
                    const reasons = toast.reasons ?? [];
                    return (
                      <motion.li
                        key={toast.id}
                        layout
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 16, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        role="alert"
                        className={`${style.container} flex gap-4 p-4 rounded-xl`}
                      >
                        <div className="mt-0.5 flex-shrink-0">
                          <Icon className={`h-6 w-6 ${style.icon}`} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold whitespace-normal break-words">
                                {toast.title || toast.message}
                              </p>
                              {toast.email && (
                                <p className="text-xs opacity-80 whitespace-normal break-words">
                                  {toast.email}
                                </p>
                              )}
                            </div>

                            <button
                              type="button"
                              onClick={() => onDequeue(toast.id)}
                              className="shrink-0 p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>

                          {toast.canPay ? (
                            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/70 dark:bg-white/10 px-2.5 py-1 text-xs font-semibold">
                              <CircleCheck className="w-3.5 h-3.5" />
                              Se puede pagar
                            </div>
                          ) : (
                            reasons.length > 0 && (
                              <ul className="mt-2 space-y-1.5">
                                {reasons.map((reason, index) => (
                                  <li
                                    key={`${toast.id}-${index}`}
                                    className="flex items-start gap-2 text-xs leading-5"
                                  >
                                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-current opacity-70" />
                                    <span className="flex-1 whitespace-normal break-words">{reason}</span>
                                  </li>
                                ))}
                              </ul>
                            )
                          )}
                        </div>
                      </motion.li>
                    );
                  })}
                </AnimatePresence>
              </ul>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ValidationPopupQueue;
