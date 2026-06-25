import { AlertTriangle, RefreshCcw } from "lucide-react";

interface AppErrorFallbackProps {
  error: Error;
  onReset: () => void;
}

/**
 * UI amigable que se muestra cuando el Error Boundary captura un error de render.
 * Permite al usuario recargar la página o reintentar sin perder la sesión.
 */
export function AppErrorFallback({ error, onReset }: AppErrorFallbackProps) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F7F8FA] px-4">
      <div className="flex w-full max-w-md flex-col items-center gap-5 rounded-2xl border border-[#E5E7EB] bg-white p-10 text-center shadow-sm">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50">
          <AlertTriangle className="h-7 w-7 text-red-500" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg font-bold text-[#111827]">Algo salió mal</h2>
          <p className="text-sm text-[#6B7280]">
            Ocurrió un error inesperado en la aplicación. Tu sesión sigue activa.
          </p>
        </div>

        {import.meta.env.DEV && (
          <details className="w-full text-left">
            <summary className="cursor-pointer text-xs font-medium text-[#9CA3AF] hover:text-[#6B7280]">
              Detalle del error (solo en desarrollo)
            </summary>
            <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-words rounded-lg bg-red-50 p-3 text-xs text-red-600">
              {error.message}
              {"\n"}
              {error.stack}
            </pre>
          </details>
        )}

        <div className="flex w-full items-center gap-3">
          <button
            onClick={onReset}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#E5E7EB] py-2.5 text-sm font-semibold text-[#374151] transition-colors hover:bg-[#F9FAFB]"
          >
            <RefreshCcw className="h-4 w-4" />
            Reintentar
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 rounded-xl bg-[#F97316] py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
          >
            Recargar página
          </button>
        </div>
      </div>
    </div>
  );
}
