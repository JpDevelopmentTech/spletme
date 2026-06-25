import { useEffect, useMemo, useState } from "react";
import { AuthService } from "@/services/auth";
import useSubUserByUser from "@/hooks/useSubUserByUser";

type SubUser = {
  id: string;
  name: string;
  email?: string;
  username?: string;
};

interface SelectUserProps {
  onClose?: () => void;
  onSelected?: (subUser: SubUser) => void;
}

export default function SelectUser({ onClose, onSelected }: SelectUserProps) {
  const { subUsers, loading, error, refetch } = useSubUserByUser();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rememberSelection, setRememberSelection] = useState<boolean>(true);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const selected = useMemo(() => {
    return (subUsers || []).find((s: SubUser) => s.id === selectedId) || null;
  }, [subUsers, selectedId]);

  useEffect(() => {
    const saved = localStorage.getItem("activeSubUser");
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as SubUser;
        setSelectedId(parsed.id);
      } catch {
        // ignore parse error
      }
    }
  }, []);

  const handleConfirm = async () => {
    if (!selected || !password) return;
    setSubmitting(true);
    setLoginError(null);
    try {
      const credential = selected.email || selected.username || "";
      const response = await AuthService.login(credential, password);
      const token = response?.token ?? response?.data?.token;
      const user = response?.user ?? response?.data?.user;

      if (!token || !user) {
        throw new Error("Respuesta de login inválida");
      }

      // Limpiar sesión actual y guardar la nueva
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      // Persistir subcuenta activa si corresponde
      if (rememberSelection) {
        localStorage.setItem("activeSubUser", JSON.stringify(selected));
      }

      if (onSelected) onSelected(selected);
      if (onClose) onClose();
    } catch (e) {
      setLoginError(
        "No se pudo iniciar sesión con esa subcuenta. Verifica la contraseña.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl bg-white shadow-2xl dark:bg-gray-800">
        <div className="flex items-center justify-between border-b border-gray-200 bg-gradient-to-r from-indigo-500 to-indigo-600 p-5 dark:border-gray-700">
          <h2 className="text-lg font-bold text-white md:text-xl">
            Selecciona una subcuenta
          </h2>
          <button
            aria-label="Cerrar"
            className="text-white/90 transition hover:text-white"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        <div className="p-5">
          <p className="mb-4 text-sm text-gray-600 dark:text-gray-300">
            Elige con qué subcuenta quieres trabajar. Puedes cambiarla más
            tarde.
          </p>

          {loading && (
            <div className="flex items-center justify-center py-10">
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
            </div>
          )}

          {!loading && error && (
            <div className="flex flex-col items-center gap-3 py-8">
              <span className="text-sm text-red-600 dark:text-red-400">
                {error}
              </span>
              <button
                className="rounded-md bg-indigo-600 px-3 py-1.5 text-sm text-white hover:bg-indigo-500"
                onClick={refetch}
              >
                Reintentar
              </button>
            </div>
          )}

          {!loading && !error && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-1">
              {subUsers && subUsers.length > 0 ? (
                subUsers.map((subUser: SubUser) => {
                  const isSelected = selectedId === subUser.id;
                  return (
                    <button
                      key={subUser.id}
                      onClick={() => setSelectedId(subUser.id)}
                      className={
                        "group w-full rounded-xl border p-4 text-left shadow-sm transition " +
                        (isSelected
                          ? "border-indigo-600 ring-2 ring-indigo-200 dark:ring-indigo-900/40"
                          : "border-gray-200 hover:border-indigo-300 dark:border-gray-700 dark:hover:border-indigo-600/60")
                      }
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={
                            "flex h-10 w-10 items-center justify-center rounded-full font-semibold text-white " +
                            (isSelected
                              ? "bg-indigo-600"
                              : "bg-indigo-500 group-hover:bg-indigo-600")
                          }
                        >
                          {subUser.name?.slice(0, 1)?.toUpperCase() || "S"}
                        </div>
                        <div className="min-w-0">
                          <div className="truncate font-semibold text-gray-900 dark:text-gray-100">
                            {subUser.name}
                          </div>
                          <div className="truncate text-xs text-gray-500 dark:text-gray-400">
                            {subUser.email || subUser.username || "Subcuenta"}
                          </div>
                        </div>
                        <div className="ml-auto">
                          <div
                            className={
                              "flex h-5 w-5 items-center justify-center rounded-full border " +
                              (isSelected
                                ? "border-indigo-600 bg-indigo-600"
                                : "border-gray-300 dark:border-gray-600")
                            }
                          >
                            {isSelected && (
                              <div className="h-2.5 w-2.5 rounded-full bg-white" />
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  );
                })
              ) : (
                <div className="col-span-full py-10 text-center text-sm text-gray-600 dark:text-gray-300">
                  No hay subcuentas todavía.
                </div>
              )}
              {subUsers && (
                <div className="col-span-full flex flex-col gap-2">
                  <input
                    type="password"
                    placeholder="Contraseña"
                    className="w-full rounded-md border border-gray-300 p-2 dark:border-gray-600"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  {loginError && (
                    <span className="text-xs text-red-600 dark:text-red-400">
                      {loginError}
                    </span>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-gray-200 px-5 pb-5 pt-3 dark:border-gray-700 sm:flex-row sm:items-center sm:justify-between">
          <label className="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
            <input
              type="checkbox"
              className="rounded border-gray-300 dark:border-gray-600"
              checked={rememberSelection}
              onChange={(e) => setRememberSelection(e.target.checked)}
            />
            Recordar selección
          </label>

          <div className="flex justify-end gap-2">
            <button
              className="rounded-md border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50 dark:border-gray-600 dark:text-gray-200 dark:hover:bg-gray-700/40"
              onClick={onClose}
            >
              Cancelar
            </button>
            <button
              className="rounded-md bg-indigo-600 px-4 py-2 text-white hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!selected || loading || submitting}
              onClick={handleConfirm}
            >
              {submitting ? "Iniciando…" : "Usar esta cuenta"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
