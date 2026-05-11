import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Info, TriangleAlert, CircleCheck, CircleX, X } from "lucide-react";

export type ValidationToastType = "success" | "info" | "warning" | "error";

export interface ValidationToastItem {
  id: number;
  type: ValidationToastType;
  message: string;
}

interface ValidationToastQueueProps {
  toasts: ValidationToastItem[];
  onDequeue: (id: number) => void;
  autoHideMs?: number;
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

const ValidationToastQueue = ({
  toasts,
  onDequeue,
  autoHideMs = 9000,
}: ValidationToastQueueProps) => {
  const activeToast = toasts[0];
  const activeStyle = activeToast ? toastStyles[activeToast.type] : null;
  const ActiveIcon = activeStyle?.Icon;

  useEffect(() => {
    if (!activeToast) return;

    const timeout = window.setTimeout(() => {
      onDequeue(activeToast.id);
    }, autoHideMs);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [activeToast, autoHideMs, onDequeue]);

  return (
    <div className="fixed top-3 right-3 z-[999]">
      <AnimatePresence mode="wait">
        {activeToast && (
          <motion.div
            key={activeToast.id}
            role="alert"
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`${activeStyle?.container} p-3 rounded-xl flex items-center transition duration-300 ease-in-out hover:scale-105 shadow-sm max-w-lg`}
          >
            {ActiveIcon && (
              <ActiveIcon
                className={`h-6 w-6 flex-shrink-0 mr-2.5 ${activeStyle?.icon}`}
              />
            )}
            <p className="text-sm font-semibold flex-1">{activeToast.message}</p>
            <button
              type="button"
              onClick={() => onDequeue(activeToast.id)}
              className="ml-2 p-1 rounded hover:bg-black/10"
            >
              <X className="w-5 h-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ValidationToastQueue;
