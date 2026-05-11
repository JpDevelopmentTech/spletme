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
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl border border-[#E5E7EB] p-10 max-w-md w-full flex flex-col items-center gap-5 text-center shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center">
          <AlertTriangle className="w-7 h-7 text-red-500" />
        </div>

        <div className="flex flex-col gap-1.5">
          <h2 className="text-lg font-bold text-[#111827]">Algo salió mal</h2>
          <p className="text-sm text-[#6B7280]">
            Ocurrió un error inesperado en la aplicación. Tu sesión sigue activa.
          </p>
        </div>

        {import.meta.env.DEV && (
          <details className="w-full text-left">
            <summary className="text-xs font-medium text-[#9CA3AF] cursor-pointer hover:text-[#6B7280]">
              Detalle del error (solo en desarrollo)
            </summary>
            <pre className="mt-2 text-xs text-red-600 bg-red-50 rounded-lg p-3 overflow-auto max-h-40 whitespace-pre-wrap break-words">
              {error.message}
              {"\n"}
              {error.stack}
            </pre>
          </details>
        )}

        <div className="flex items-center gap-3 w-full">
          <button
            onClick={onReset}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold border border-[#E5E7EB] text-[#374151] hover:bg-[#F9FAFB] transition-colors"
          >
            <RefreshCcw className="w-4 h-4" />
            Reintentar
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-[#F97316] hover:bg-orange-600 text-white transition-colors"
          >
            Recargar página
          </button>
        </div>
      </div>
    </div>
  );
}
