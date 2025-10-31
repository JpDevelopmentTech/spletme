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
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));

            // Persistir subcuenta activa si corresponde
            if (rememberSelection) {
                localStorage.setItem("activeSubUser", JSON.stringify(selected));
            }

            if (onSelected) onSelected(selected);
            if (onClose) onClose();
        } catch (e) {
            setLoginError("No se pudo iniciar sesión con esa subcuenta. Verifica la contraseña.");
        } finally {
            setSubmitting(false);
        }
    };

  return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-xl overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-indigo-500 to-indigo-600">
                    <h2 className="text-lg md:text-xl font-bold text-white">Selecciona una subcuenta</h2>
                    <button
                        aria-label="Cerrar"
                        className="text-white/90 hover:text-white transition"
                        onClick={onClose}
                    >
                        ✕
                    </button>
                </div>

                <div className="p-5">
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                        Elige con qué subcuenta quieres trabajar. Puedes cambiarla más tarde.
                    </p>

                    {loading && (
                        <div className="flex items-center justify-center py-10">
                            <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-500 border-t-transparent" />
                        </div>
                    )}

                    {!loading && error && (
                        <div className="flex flex-col items-center gap-3 py-8">
                            <span className="text-red-600 dark:text-red-400 text-sm">{error}</span>
                            <button
                                className="px-3 py-1.5 text-sm rounded-md bg-indigo-600 text-white hover:bg-indigo-500"
                                onClick={refetch}
                            >
                                Reintentar
                            </button>
                        </div>
                    )}

                    {!loading && !error && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {subUsers && subUsers.length > 0 ? (
                                subUsers.map((subUser: SubUser) => {
                                    const isSelected = selectedId === subUser.id;
                                    return (
                                        <button
                                            key={subUser.id}
                                            onClick={() => setSelectedId(subUser.id)}
                                            className={
                                                "group text-left w-full rounded-xl border p-4 transition shadow-sm " +
                                                (isSelected
                                                    ? "border-indigo-600 ring-2 ring-indigo-200 dark:ring-indigo-900/40"
                                                    : "border-gray-200 dark:border-gray-700 hover:border-indigo-300 dark:hover:border-indigo-600/60")
                                            }
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={
                                                    "flex h-10 w-10 items-center justify-center rounded-full text-white font-semibold " +
                                                    (isSelected ? "bg-indigo-600" : "bg-indigo-500 group-hover:bg-indigo-600")
                                                }>
                                                    {subUser.name?.slice(0, 1)?.toUpperCase() || "S"}
                                                </div>
                                                <div className="min-w-0">
                                                    <div className="font-semibold text-gray-900 dark:text-gray-100 truncate">
                                                        {subUser.name}
                                                    </div>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                        {subUser.email || subUser.username || "Subcuenta"}
                                                    </div>
                                                </div>
                                                <div className="ml-auto">
                                                    <div className={
                                                        "h-5 w-5 rounded-full border flex items-center justify-center " +
                                                        (isSelected ? "bg-indigo-600 border-indigo-600" : "border-gray-300 dark:border-gray-600")
                                                    }>
                                                        {isSelected && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="col-span-full text-center py-10 text-sm text-gray-600 dark:text-gray-300">
                                    No hay subcuentas todavía.
                                </div>
                            )}
                            {subUsers && (
                                <div className="col-span-full flex flex-col gap-2">
                                    <input
                                        type="password"
                                        placeholder="Contraseña"
                                        className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    {loginError && (
                                        <span className="text-xs text-red-600 dark:text-red-400">{loginError}</span>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                            </div>

                <div className="px-5 pb-5 pt-3 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <label className="inline-flex items-center gap-2 text-xs text-gray-600 dark:text-gray-300">
                        <input
                            type="checkbox"
                            className="rounded border-gray-300 dark:border-gray-600"
                            checked={rememberSelection}
                            onChange={(e) => setRememberSelection(e.target.checked)}
                        />
                        Recordar selección
                    </label>

                    <div className="flex gap-2 justify-end">
                        <button
                            className="px-4 py-2 rounded-md border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/40"
                            onClick={onClose}
                        >
                            Cancelar
                        </button>
                        <button
                            className="px-4 py-2 rounded-md bg-indigo-600 text-white disabled:opacity-50 disabled:cursor-not-allowed hover:bg-indigo-500"
                            disabled={!selected || loading || submitting}
                            onClick={handleConfirm}
                        >
                            {submitting ? 'Iniciando…' : 'Usar esta cuenta'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
