import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Check,
  CircleAlert,
  CircleCheck,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  RefreshCw,
  Search,
  TriangleAlert,
  Users,
  X,
} from "lucide-react";
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

/** A partir de este número de subcuentas la lista se vuelve incómoda de recorrer. */
const SEARCH_THRESHOLD = 6;

const AVATAR_COLORS = ["#FF5C00", "#1C1D22", "#2FB37E"];

/** Usuario de la sesión actual guardado en localStorage, si se puede leer. */
function readCurrentUser(): { name?: string; email?: string } | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function initialOf(name?: string): string {
  return name?.trim()?.slice(0, 1)?.toUpperCase() || "S";
}

/**
 * Modal para cambiar de cuenta.
 *
 * El orden de la interacción es: ver con qué cuenta estás, elegir la subcuenta y
 * confirmar con su contraseña. El campo de contraseña solo aparece cuando hay una
 * subcuenta elegida, para no pedir un dato sin decir de quién es.
 */
export default function SelectUser({ onClose, onSelected }: SelectUserProps) {
  const { subUsers, loading, error, refetch } = useSubUserByUser();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rememberSelection, setRememberSelection] = useState<boolean>(true);
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const navigate = useNavigate();
  const passwordRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  const currentUser = useMemo(readCurrentUser, []);

  const accounts: SubUser[] = useMemo(() => subUsers || [], [subUsers]);

  const visibleAccounts = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return accounts;
    return accounts.filter((s) =>
      [s.name, s.email, s.username].some((v) => v?.toLowerCase().includes(term)),
    );
  }, [accounts, query]);

  const selected = useMemo(
    () => accounts.find((s) => s.id === selectedId) || null,
    [accounts, selectedId],
  );

  const showSearch = accounts.length >= SEARCH_THRESHOLD;
  const canConfirm = Boolean(selected) && password.length > 0 && !submitting && !loading;

  // Preselecciona la subcuenta que se recordó la última vez.
  useEffect(() => {
    const saved = localStorage.getItem("activeSubUser");
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved) as SubUser;
      setSelectedId(parsed.id);
    } catch {
      // El valor guardado no es válido: se ignora y no se preselecciona nada.
    }
  }, []);

  // `onClose` suele llegar como función inline: se guarda en un ref para que el
  // efecto de montaje no se repita en cada render del componente padre.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Cerrar con Escape, bloquear el scroll del fondo y devolver el foco al salir.
  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";
    closeRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCloseRef.current?.();
    };
    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = overflow;
      previouslyFocused?.focus?.();
    };
  }, []);

  // Al cambiar de subcuenta la contraseña anterior deja de tener sentido.
  const handleSelect = (id: string) => {
    setSelectedId(id);
    setPassword("");
    setLoginError(null);
  };

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

      localStorage.removeItem("token");
      localStorage.removeItem("user");

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));

      if (rememberSelection) {
        localStorage.setItem("activeSubUser", JSON.stringify(selected));
      } else {
        localStorage.removeItem("activeSubUser");
      }

      if (onSelected) onSelected(selected);
      if (onClose) onClose();
    } catch (err) {
      // Sin `response` el servidor no contestó: no es un problema de contraseña.
      const status = (err as { response?: { status?: number } })?.response?.status;
      setLoginError(
        status === undefined
          ? "No pudimos conectar con el servidor. Inténtalo otra vez."
          : `Esa contraseña no coincide con ${selected.name}.`,
      );
      setPassword("");
      passwordRef.current?.focus();
    } finally {
      setSubmitting(false);
    }
  };

  const goToCollaborators = () => {
    onClose?.();
    navigate("/panel/collaborators");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#101114]/65 p-4"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose?.();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="select-user-title"
        className="flex max-h-[92vh] w-full max-w-[520px] flex-col overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_-16px_rgba(16,17,20,0.35)]"
      >
        {/* Cabecera */}
        <div className="flex items-start justify-between gap-4 px-6 pb-[18px] pt-[22px]">
          <div className="flex flex-col gap-1.5">
            <span className="font-mono text-[9.5px] font-medium tracking-[1.4px] text-[#A6AAB2]">
              CAMBIAR DE CUENTA
            </span>
            <h2
              id="select-user-title"
              className="font-display text-xl font-semibold text-[#1C1D22]"
            >
              ¿Con qué cuenta quieres trabajar?
            </h2>
          </div>
          <button
            ref={closeRef}
            aria-label="Cerrar"
            onClick={onClose}
            className="flex h-[34px] w-[34px] flex-shrink-0 items-center justify-center rounded-xl bg-[#F4F5F7] text-[#71757E] transition-colors hover:bg-[#E8E8EC] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5C00]"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="h-px bg-[#E8E8EC]" />

        {/* Cuerpo */}
        <div className="flex flex-1 flex-col gap-[18px] overflow-y-auto px-6 pb-5 pt-[18px]">
          {/* Sesión actual */}
          <div className="flex flex-col gap-2.5">
            <span className="font-mono text-[9.5px] font-medium tracking-[1.4px] text-[#A6AAB2]">
              SESIÓN ACTUAL
            </span>
            <div className="flex items-center gap-3 rounded-[18px] bg-[#F4F5F7] px-3.5 py-3">
              <div className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-[13px] bg-[#1C1D22] text-sm font-semibold text-white">
                {initialOf(currentUser?.name)}
              </div>
              <div className="flex min-w-0 flex-1 flex-col">
                <span className="truncate text-[13.5px] font-semibold text-[#1C1D22]">
                  {currentUser?.name || "Tu cuenta"}
                </span>
                <span className="truncate text-[11.5px] text-[#A6AAB2]">
                  {currentUser?.email || "Sesión iniciada"}
                </span>
              </div>
              <span className="inline-flex flex-shrink-0 items-center gap-1.5 rounded-full bg-[#E4F5EC] px-2.5 py-1 text-[10.5px] font-semibold text-[#2FB37E]">
                <CircleCheck className="h-3 w-3" />
                Activa
              </span>
            </div>
          </div>

          {/* Subcuentas */}
          <div className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between gap-3">
              <span className="font-mono text-[9.5px] font-medium tracking-[1.4px] text-[#A6AAB2]">
                {loading || error ? "SUBCUENTAS" : `SUBCUENTAS · ${accounts.length}`}
              </span>
              {!loading && !error && showSearch && (
                <label className="flex w-[170px] items-center gap-2 rounded-[14px] bg-[#F4F5F7] px-3 py-1.5">
                  <Search className="h-3.5 w-3.5 flex-shrink-0 text-[#A6AAB2]" />
                  <input
                    type="search"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar subcuenta"
                    aria-label="Buscar subcuenta"
                    className="w-full border-0 bg-transparent p-0 text-[11.5px] text-[#1C1D22] placeholder:text-[#A6AAB2] focus:border-0 focus:outline-none focus:ring-0"
                  />
                </label>
              )}
            </div>

            {loading && <AccountsSkeleton />}

            {!loading && error && (
              <EmptyState
                icon={<TriangleAlert className="h-5 w-5 text-[#E5484D]" />}
                iconClassName="bg-[#FDECEC]"
                title="No pudimos cargar tus subcuentas"
                body="La petición no llegó al servidor. Revisa tu conexión e inténtalo otra vez."
                actionLabel="Reintentar"
                actionIcon={<RefreshCw className="h-3.5 w-3.5" />}
                onAction={refetch}
              />
            )}

            {!loading && !error && accounts.length === 0 && (
              <EmptyState
                icon={<Users className="h-5 w-5 text-[#71757E]" />}
                iconClassName="bg-white"
                title="Aún no tienes subcuentas"
                body="Las subcuentas de tu equipo aparecerán aquí en cuanto las crees en Colaboradores."
                actionLabel="Ir a Colaboradores"
                actionIcon={<ArrowRight className="h-3.5 w-3.5" />}
                onAction={goToCollaborators}
              />
            )}

            {!loading && !error && accounts.length > 0 && (
              <div role="radiogroup" aria-label="Subcuentas" className="flex flex-col gap-2">
                {visibleAccounts.map((subUser, index) => (
                  <AccountRow
                    key={subUser.id}
                    subUser={subUser}
                    color={AVATAR_COLORS[index % AVATAR_COLORS.length]}
                    selected={selectedId === subUser.id}
                    disabled={submitting}
                    onSelect={() => handleSelect(subUser.id)}
                  />
                ))}
                {visibleAccounts.length === 0 && (
                  <p className="py-6 text-center text-xs text-[#A6AAB2]">
                    Ninguna subcuenta coincide con «{query}».
                  </p>
                )}
              </div>
            )}

            {/* Confirmación: solo tiene sentido con una subcuenta elegida */}
            {selected && (
              <div className="flex flex-col gap-2 pt-2.5">
                <label
                  htmlFor="subaccount-password"
                  className="text-[12.5px] font-semibold text-[#1C1D22]"
                >
                  Contraseña de {selected.name}
                </label>
                <div
                  className={`flex h-[46px] items-center gap-2.5 rounded-2xl border px-3.5 transition-colors ${
                    submitting
                      ? "border-[#E8E8EC] bg-[#F4F5F7]"
                      : loginError
                        ? "border-[#E5484D] bg-white ring-[3px] ring-[#E5484D]/15"
                        : "border-[#E8E8EC] bg-white focus-within:border-[#FF5C00] focus-within:ring-[3px] focus-within:ring-[#FF5C00]/15"
                  }`}
                >
                  <Lock
                    className={`h-4 w-4 flex-shrink-0 ${submitting ? "text-[#A6AAB2]" : "text-[#71757E]"}`}
                  />
                  <input
                    ref={passwordRef}
                    id="subaccount-password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    value={password}
                    disabled={submitting}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (loginError) setLoginError(null);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && canConfirm) handleConfirm();
                    }}
                    aria-invalid={Boolean(loginError)}
                    aria-describedby={loginError ? "subaccount-password-error" : undefined}
                    className="w-full border-0 bg-transparent p-0 text-[15px] font-semibold text-[#1C1D22] placeholder:font-normal placeholder:text-[#A6AAB2] focus:border-0 focus:outline-none focus:ring-0 disabled:text-[#A6AAB2]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    disabled={submitting}
                    aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                    className="flex-shrink-0 text-[#71757E] transition-colors hover:text-[#1C1D22] disabled:text-[#A6AAB2]"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>

                {loginError ? (
                  <p
                    id="subaccount-password-error"
                    role="alert"
                    className="flex items-center gap-2 rounded-[14px] bg-[#FDECEC] px-3 py-2 text-[11.5px] leading-snug text-[#E5484D]"
                  >
                    <CircleAlert className="h-3.5 w-3.5 flex-shrink-0" />
                    {loginError}
                  </p>
                ) : (
                  <p className="text-[11px] leading-relaxed text-[#A6AAB2]">
                    Confirmamos que eres tú antes de abrir la subcuenta.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>

        <div className="h-px bg-[#E8E8EC]" />

        {/* Pie */}
        <div className="flex flex-col gap-3.5 px-6 pb-5 pt-4">
          <label className="flex cursor-pointer items-start gap-2.5">
            <input
              type="checkbox"
              checked={rememberSelection}
              disabled={!selected}
              onChange={(e) => setRememberSelection(e.target.checked)}
              className="peer sr-only"
            />
            <span
              className={`mt-0.5 flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-md border-[1.5px] transition-colors peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-[#FF5C00] ${
                rememberSelection && selected
                  ? "border-[#FF5C00] bg-[#FF5C00]"
                  : "border-[#A6AAB2] bg-white"
              }`}
            >
              {rememberSelection && selected && <Check className="h-3 w-3 text-white" />}
            </span>
            <span className="flex flex-col">
              <span
                className={`text-[12.5px] font-semibold ${selected ? "text-[#1C1D22]" : "text-[#A6AAB2]"}`}
              >
                Recordar selección
              </span>
              <span className="text-[11px] text-[#A6AAB2]">
                La próxima vez abriremos esta subcuenta directamente.
              </span>
            </span>
          </label>

          <div className="flex justify-end gap-2.5">
            <button
              onClick={onClose}
              disabled={submitting}
              className="rounded-2xl border border-[#E8E8EC] bg-white px-[18px] py-3 text-[13px] font-semibold text-[#1C1D22] transition-colors hover:bg-[#F4F5F7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5C00] disabled:text-[#A6AAB2]"
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              disabled={!canConfirm}
              className={`flex items-center gap-2 rounded-2xl px-[18px] py-3 text-[13px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5C00] ${
                canConfirm
                  ? "bg-[#FF5C00] text-white shadow-[0_6px_16px_-4px_rgba(255,92,0,0.35)] hover:bg-[#EA580C]"
                  : submitting
                    ? "bg-[#FF5C00]/75 text-white"
                    : "cursor-not-allowed bg-[#F4F5F7] text-[#A6AAB2]"
              }`}
            >
              <span className="max-w-[220px] truncate">
                {submitting
                  ? "Entrando…"
                  : selected
                    ? `Entrar como ${selected.name}`
                    : "Entrar en la subcuenta"}
              </span>
              {submitting ? (
                <Loader2 className="h-[15px] w-[15px] flex-shrink-0 animate-spin" />
              ) : (
                <ArrowRight className="h-[15px] w-[15px] flex-shrink-0" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

interface AccountRowProps {
  subUser: SubUser;
  color: string;
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}

/** Fila de subcuenta: avatar, identidad y marca de selección. */
function AccountRow({ subUser, color, selected, disabled, onSelect }: AccountRowProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      disabled={disabled}
      onClick={onSelect}
      className={`flex w-full items-center gap-3 rounded-[18px] border px-3.5 py-3 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5C00] ${
        selected
          ? "border-[1.5px] border-[#FF5C00] bg-[#FFEADD]"
          : "border-[#E8E8EC] bg-white hover:border-[#A6AAB2]"
      }`}
    >
      <span
        className="flex h-[38px] w-[38px] flex-shrink-0 items-center justify-center rounded-[13px] text-sm font-semibold text-white"
        style={{ backgroundColor: color }}
      >
        {initialOf(subUser.name)}
      </span>
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-[13.5px] font-semibold text-[#1C1D22]">{subUser.name}</span>
        <span className="truncate text-[11.5px] text-[#A6AAB2]">
          {subUser.email || subUser.username || "Subcuenta"}
        </span>
      </span>
      <span
        className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full border-[1.5px] ${
          selected ? "border-[#FF5C00] bg-[#FF5C00]" : "border-[#A6AAB2]"
        }`}
      >
        {selected && <span className="h-2 w-2 rounded-full bg-white" />}
      </span>
    </button>
  );
}

/** Tres filas fantasma que reservan la altura de la lista mientras carga. */
function AccountsSkeleton() {
  const widths = ["w-[150px]", "w-[184px]", "w-[132px]"];
  return (
    <div className="flex flex-col gap-2">
      {widths.map((width, i) => (
        <div
          key={width}
          className="flex items-center gap-3 rounded-[18px] border border-[#E8E8EC] px-3.5 py-3"
        >
          <div className="h-[38px] w-[38px] flex-shrink-0 animate-pulse rounded-[13px] bg-[#F4F5F7]" />
          <div className="flex flex-1 flex-col gap-[7px]">
            <div className={`h-2.5 animate-pulse rounded-full bg-[#F4F5F7] ${width}`} />
            <div
              className={`h-2 animate-pulse rounded-full bg-[#F4F5F7]/60 ${i === 1 ? "w-[126px]" : "w-[104px]"}`}
            />
          </div>
          <div className="h-5 w-5 flex-shrink-0 animate-pulse rounded-full bg-[#F4F5F7]" />
        </div>
      ))}
    </div>
  );
}

interface EmptyStateProps {
  icon: React.ReactNode;
  iconClassName: string;
  title: string;
  body: string;
  actionLabel: string;
  actionIcon: React.ReactNode;
  onAction: () => void;
}

/** Bloque para lista vacía y error de carga: explica qué pasó y ofrece la salida. */
function EmptyState({
  icon,
  iconClassName,
  title,
  body,
  actionLabel,
  actionIcon,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 rounded-[20px] bg-[#F4F5F7] px-6 py-[30px]">
      <div
        className={`flex h-[46px] w-[46px] items-center justify-center rounded-2xl ${iconClassName}`}
      >
        {icon}
      </div>
      <h3 className="text-sm font-semibold text-[#1C1D22]">{title}</h3>
      <p className="text-center text-[11.5px] leading-relaxed text-[#A6AAB2]">{body}</p>
      <button
        onClick={onAction}
        className="flex items-center gap-2 rounded-[15px] border border-[#E8E8EC] bg-white px-4 py-2.5 text-[12.5px] font-semibold text-[#1C1D22] transition-colors hover:bg-[#F4F5F7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF5C00]"
      >
        {actionIcon}
        {actionLabel}
      </button>
    </div>
  );
}
