import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { Loader2, AlertCircle, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { AuthService } from "@/services/auth";
import { setAuth } from "@/store/states/authSlice";

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

const SwitchSubuserModal = ({
  isOpen,
  onClose,
  currentUserId,
}: SwitchSubuserModalProps) => {
  const dispatch = useDispatch();
  const [subusers, setSubusers] = useState<Subuser[]>([]);
  const [loading, setLoading] = useState(false);
  const [switching, setSwitching] = useState(false);
  const [switchingUserId, setSwitchingUserId] = useState("");
  const [error, setError] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      fetchSubusers();
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [isOpen, onClose]);

  const fetchSubusers = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await AuthService.getlistOfSubusers();
      if (response?.data) {
        setSubusers(response.data);
      } else {
        setError("No se pudieron cargar los sub-usuarios");
      }
    } catch (err) {
      setError("Error al cargar los sub-usuarios");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchUser = async (subuser: Subuser) => {
    setSwitching(true);
    setSwitchingUserId(subuser.id);
    setError("");
    try {
      const response = await AuthService.switchAccount(subuser.id);

      if (!response.success) {
        setError(response.message);
        return;
      }

      const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
      const responseUser =
        (response.data?.user as Record<string, unknown> | undefined) ||
        (response.data as Record<string, unknown> | undefined) ||
        {};
      const nextUser = {
        ...currentUser,
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
      if (nextToken.trim()) {
        localStorage.setItem("token", nextToken);
      }

      dispatch(setAuth({ isAuth: "true", user: nextUser }));
      onClose();
      window.location.reload();
    } catch (err) {
      setError("Error al cambiar de usuario");
      console.error(err);
    } finally {
      setSwitching(false);
      setSwitchingUserId("");
    }
  };

  const getInitials = (name: string, lastName: string) => {
    return (
      (name?.charAt(0) || "U").toUpperCase() +
      (lastName?.charAt(0) || "").toUpperCase()
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-40 bottom-20"
            onClick={onClose}
          />

          {/* Dropdown Menu */}
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 w-80 rounded-xl shadow-2xl overflow-hidden border"
            style={{
              backgroundColor: "#0F172A",
              borderColor: "#1E293B",
              bottom: 160,
              left: 12,
            }}
          >
            {/* Header */}
            <div
              className="px-4 py-3 border-b"
              style={{
                borderColor: "#1E293B",
                backgroundColor: "rgba(249, 115, 22, 0.08)",
              }}
            >
              <h3
                className="text-sm font-semibold"
                style={{ color: "#F97316" }}
              >
                Cambiar de cuenta
              </h3>
              <p className="text-xs mt-1" style={{ color: "#64748B" }}>
                Selecciona un sub-usuario
              </p>
            </div>

            {/* Content */}
            <div className="max-h-80 overflow-y-auto">
              {error && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="px-4 py-3 flex gap-2 border-b"
                  style={{
                    backgroundColor: "rgba(239, 68, 68, 0.08)",
                    borderColor: "#1E293B",
                  }}
                >
                  <AlertCircle
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: "#EF4444" }}
                  />
                  <p className="text-xs" style={{ color: "#EF4444" }}>
                    {error}
                  </p>
                </motion.div>
              )}

              {loading ? (
                <div className="flex flex-col items-center justify-center py-6 px-4">
                  <Loader2
                    className="w-5 h-5 animate-spin mb-2"
                    style={{ color: "#F97316" }}
                  />
                  <p style={{ color: "#94A3B8" }} className="text-xs">
                    Cargando...
                  </p>
                </div>
              ) : subusers.length === 0 ? (
                <div className="text-center py-6 px-4">
                  <p style={{ color: "#94A3B8" }} className="text-sm">
                    No tienes sub-usuarios disponibles
                  </p>
                </div>
              ) : (
                <div className="divide-y" style={{ borderColor: "#1E293B" }}>
                  {subusers.map((subuser) => {
                    const isActive = subuser.id === currentUserId;
                    const initials = getInitials(subuser.name, subuser.lastName);

                    return (
                      <motion.button
                        key={subuser.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        onClick={() => handleSwitchUser(subuser)}
                        disabled={switching || isActive}
                        className="w-full px-4 py-3 transition-all flex items-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed text-left hover:bg-opacity-50"
                        style={{
                          backgroundColor: isActive
                            ? "rgba(249, 115, 22, 0.12)"
                            : "transparent",
                        }}
                        onMouseEnter={(e) => {
                          if (!isActive && !switching) {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                              "rgba(255, 255, 255, 0.05)";
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isActive && !switching) {
                            (e.currentTarget as HTMLButtonElement).style.backgroundColor =
                              isActive
                                ? "rgba(249, 115, 22, 0.12)"
                                : "transparent";
                          }
                        }}
                      >
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 font-semibold text-sm"
                          style={{
                            backgroundColor: isActive ? "#F97316" : "#1E293B",
                            color: isActive ? "#FFFFFF" : "#F97316",
                            border: isActive
                              ? "none"
                              : "2px solid #F97316",
                          }}
                        >
                          {initials}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className="text-sm font-medium truncate"
                              style={{ color: "#F1F5F9" }}
                            >
                              {subuser.name} {subuser.lastName}
                            </p>
                            {isActive && (
                              <Check
                                className="w-4 h-4 flex-shrink-0"
                                style={{ color: "#F97316" }}
                              />
                            )}
                          </div>
                          <p
                            className="text-xs truncate"
                            style={{ color: "#64748B" }}
                          >
                            {subuser.email}
                          </p>
                        </div>

                        {switching && switchingUserId === subuser.id && (
                          <Loader2
                            className="w-4 h-4 animate-spin flex-shrink-0"
                            style={{ color: "#F97316" }}
                          />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            {subusers.length > 0 && !loading && (
              <div
                className="px-4 py-3 border-t text-center"
                style={{
                  borderColor: "#1E293B",
                  backgroundColor: "rgba(255, 255, 255, 0.02)",
                }}
              >
                <button
                  onClick={onClose}
                  className="text-xs font-medium transition-colors hover:text-opacity-100"
                  style={{ color: "#94A3B8" }}
                >
                  Cerrar
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default SwitchSubuserModal;
