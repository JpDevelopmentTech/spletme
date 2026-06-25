import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  Users,
  RefreshCw,
} from "lucide-react";
import { AuthService } from "@/services/auth";
import { setAuth } from "@/store/states/authSlice";
import LocalStorageService from "@/services/localstorage";

interface Subuser {
  id: string;
  username: string;
  name: string;
  lastName: string;
  email: string;
}

interface SwitchSubuserModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserId: string;
}

const getInitials = (name: string, lastName: string) =>
  (name?.charAt(0) || "U").toUpperCase() +
  (lastName?.charAt(0) || "").toUpperCase();

const SwitchSubuserModal = ({
  isOpen,
  onClose,
  currentUserId,
}: SwitchSubuserModalProps) => {
  const dispatch = useDispatch();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [subusers, setSubusers] = useState<Subuser[]>([]);
  const [loading, setLoading] = useState(false);
  const [switchingId, setSwitchingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  const currentUser = LocalStorageService.getItem("user");
  const currentName = currentUser?.name || "";
  const currentLastName = currentUser?.lastName || "";
  const currentUsername = currentUser?.username || "";
  const currentEmail = currentUser?.email || "";

  useEffect(() => {
    if (isOpen) {
      fetchSubusers();
      setError("");
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose]);

  const fetchSubusers = async () => {
    setLoading(true);
    try {
      const response = await AuthService.getlistOfSubusers();
      setSubusers(response?.data ?? []);
    } catch {
      setError("No se pudieron cargar las cuentas");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitch = async (subuser: Subuser) => {
    if (subuser.id === currentUserId) return;
    setSwitchingId(subuser.id);
    setError("");
    try {
      const response = await AuthService.switchAccount(subuser.id);
      if (!response.success) {
        setError(response.message || "No se pudo cambiar de cuenta");
        return;
      }

      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      const responseUser =
        (response.data?.user as Record<string, unknown> | undefined) ||
        (response.data as Record<string, unknown> | undefined) ||
        {};

      const nextUser = {
        ...stored,
        ...responseUser,
        id: (responseUser.id || responseUser.userId || subuser.id) as string,
        username:
          (responseUser.username as string | undefined) ?? subuser.username,
        name: (responseUser.name as string | undefined) ?? subuser.name,
        lastName:
          (responseUser.lastName as string | undefined) ?? subuser.lastName,
        email: (responseUser.email as string | undefined) ?? subuser.email,
      };

      const nextToken =
        (response.data?.token as string | undefined) ||
        (responseUser.token as string | undefined) ||
        localStorage.getItem("token") ||
        "";

      localStorage.setItem("user", JSON.stringify(nextUser));
      localStorage.setItem("isAuth", "true");
      if (nextToken.trim()) localStorage.setItem("token", nextToken);

      dispatch(setAuth({ isAuth: "true", user: nextUser }));
      onClose();
      window.location.reload();
    } catch {
      setError("Error al cambiar de cuenta");
    } finally {
      setSwitchingId(null);
    }
  };

  const otherAccounts = subusers.filter((s) => s.id !== currentUserId);

  return (
    <div
      className={`fixed z-50 transition-all duration-200 ${
        isOpen
          ? "pointer-events-auto translate-y-0 opacity-100"
          : "pointer-events-none translate-y-2 opacity-0"
      }`}
      style={{ bottom: 80, left: 12, width: 296 }}
    >
      <div
        ref={dropdownRef}
        className="overflow-hidden rounded-2xl"
        style={{
          backgroundColor: "#0F172A",
          border: "1px solid #1E293B",
          boxShadow: "0 20px 40px rgba(0,0,0,0.5)",
        }}
      >
        {/* Current account */}
        <div
          className="px-4 pb-3 pt-4"
          style={{ borderBottom: "1px solid #1E293B" }}
        >
          <p
            className="mb-2.5 text-[10px] font-semibold uppercase tracking-widest"
            style={{ color: "#475569" }}
          >
            Cuenta activa
          </p>
          <div className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-bold"
              style={{ backgroundColor: "#F97316", color: "#FFFFFF" }}
            >
              {getInitials(currentName, currentLastName)}
            </div>
            <div className="min-w-0 flex-1">
              <p
                className="truncate text-sm font-semibold"
                style={{ color: "#F1F5F9" }}
              >
                {currentName} {currentLastName}
              </p>
              <p className="truncate text-xs" style={{ color: "#64748B" }}>
                @{currentUsername}
              </p>
            </div>
            <CheckCircle2
              className="h-4 w-4 flex-shrink-0"
              style={{ color: "#22C55E" }}
            />
          </div>
        </div>

        {/* Subaccounts */}
        <div>
          <div className="flex items-center justify-between px-4 pb-2 pt-3">
            <p
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "#475569" }}
            >
              Subperfiles
            </p>
            {!loading && (
              <button
                onClick={fetchSubusers}
                className="rounded-md p-1 transition-colors hover:bg-white/5"
                title="Recargar"
              >
                <RefreshCw className="h-3 w-3" style={{ color: "#475569" }} />
              </button>
            )}
          </div>

          {error && (
            <div
              className="mx-4 mb-3 flex items-start gap-2 rounded-xl px-3 py-2.5"
              style={{
                backgroundColor: "rgba(239,68,68,0.08)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <AlertCircle
                className="mt-0.5 h-3.5 w-3.5 flex-shrink-0"
                style={{ color: "#EF4444" }}
              />
              <p className="text-xs" style={{ color: "#F87171" }}>
                {error}
              </p>
            </div>
          )}

          <div className="pb-2" style={{ maxHeight: 240, overflowY: "auto" }}>
            {loading ? (
              <div className="flex flex-col items-center justify-center gap-2 py-8">
                <Loader2
                  className="h-5 w-5 animate-spin"
                  style={{ color: "#F97316" }}
                />
                <p className="text-xs" style={{ color: "#475569" }}>
                  Cargando cuentas...
                </p>
              </div>
            ) : otherAccounts.length === 0 ? (
              <div className="flex flex-col items-center justify-center gap-2 px-4 py-8">
                <div
                  className="mb-1 flex h-10 w-10 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#1E293B" }}
                >
                  <Users className="h-5 w-5" style={{ color: "#334155" }} />
                </div>
                <p
                  className="text-center text-sm font-medium"
                  style={{ color: "#94A3B8" }}
                >
                  Sin subperfiles
                </p>
                <p className="text-center text-xs" style={{ color: "#475569" }}>
                  Crea subperfiles desde Ajustes → Mi Perfil
                </p>
              </div>
            ) : (
              otherAccounts.map((subuser) => {
                const isSwitching = switchingId === subuser.id;
                const isDisabled = switchingId !== null;
                return (
                  <button
                    key={subuser.id}
                    onClick={() => handleSwitch(subuser)}
                    disabled={isDisabled}
                    className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors disabled:cursor-not-allowed disabled:opacity-40"
                    style={{ backgroundColor: "transparent" }}
                    onMouseEnter={(e) => {
                      if (!isDisabled)
                        (
                          e.currentTarget as HTMLButtonElement
                        ).style.backgroundColor = "rgba(255,255,255,0.04)";
                    }}
                    onMouseLeave={(e) => {
                      (
                        e.currentTarget as HTMLButtonElement
                      ).style.backgroundColor = "transparent";
                    }}
                  >
                    <div
                      className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold"
                      style={{
                        backgroundColor: "#1E293B",
                        color: "#F97316",
                        border: "1.5px solid #334155",
                      }}
                    >
                      {isSwitching ? (
                        <Loader2
                          className="h-4 w-4 animate-spin"
                          style={{ color: "#F97316" }}
                        />
                      ) : (
                        getInitials(subuser.name, subuser.lastName)
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p
                        className="truncate text-sm font-medium"
                        style={{ color: "#E2E8F0" }}
                      >
                        {subuser.name} {subuser.lastName}
                      </p>
                      <p
                        className="truncate text-xs"
                        style={{ color: "#475569" }}
                      >
                        @{subuser.username}
                      </p>
                    </div>
                    {isSwitching && (
                      <span
                        className="text-[10px] font-medium"
                        style={{ color: "#F97316" }}
                      >
                        Cambiando...
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div
          className="flex items-center justify-between px-4 py-3"
          style={{
            borderTop: "1px solid #1E293B",
            backgroundColor: "rgba(255,255,255,0.02)",
          }}
        >
          <p className="text-xs" style={{ color: "#334155" }}>
            {currentEmail}
          </p>
          <button
            onClick={onClose}
            className="rounded-lg px-2.5 py-1 text-xs font-medium transition-colors"
            style={{ color: "#64748B" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "rgba(255,255,255,0.05)";
              (e.currentTarget as HTMLButtonElement).style.color = "#94A3B8";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                "transparent";
              (e.currentTarget as HTMLButtonElement).style.color = "#64748B";
            }}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SwitchSubuserModal;
