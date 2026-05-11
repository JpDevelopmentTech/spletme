import { useState, useEffect, useCallback } from "react";
import {
  Camera, User, Mail, Copy, Check, Lock, AtSign, Pencil, Hash,
  MapPin, Earth, AudioWaveform, ChevronDown, Eye, EyeOff,
  UserPlus, UserMinus, Loader2, AlertCircle, CheckCircle2,
  RefreshCcw, Globe, Briefcase, X,
} from "lucide-react";
import LocalStorageService from "../../../services/localstorage";
import { AuthService, RegisterSubuserSchema } from "@/services/auth";
import useConvertCountry from "@/hooks/useConvertCountry";

// ── Data ─────────────────────────────────────────────────────────────────────

const COUNTRIES = [
  { code: "CO", name: "🇨🇴 Colombia" },
  { code: "US", name: "🇺🇸 Estados Unidos" },
  { code: "MX", name: "🇲🇽 México" },
  { code: "AR", name: "🇦🇷 Argentina" },
  { code: "ES", name: "🇪🇸 España" },
  { code: "PE", name: "🇵🇪 Perú" },
  { code: "CL", name: "🇨🇱 Chile" },
  { code: "EC", name: "🇪🇨 Ecuador" },
  { code: "VE", name: "🇻🇪 Venezuela" },
  { code: "BO", name: "🇧🇴 Bolivia" },
];

const PROFESSIONS = [
  { id: "artista", name: "Artista", description: "Cantante, músico o intérprete" },
  { id: "productor", name: "Productor", description: "Productor musical o de audio" },
  { id: "compositor", name: "Compositor", description: "Compositor o escritor de canciones" },
  { id: "otro", name: "Otro", description: "Otra profesión musical" },
];

const OTHER_PROFESSIONS = [
  "Ingeniero de sonido", "Diseñador de sonido", "Diseñador de audio",
  "Ingeniero de mezcla", "Ingeniero de masterización", "Ingeniero de grabación",
  "Manager musical", "Promotor de eventos", "DJ", "Locutor", "Podcaster",
];

// ── Types ─────────────────────────────────────────────────────────────────────

interface SubprofileItem {
  id: string;
  name: string;
  lastName: string;
  username: string;
  email: string;
}

type ActiveSection = "edit-profile" | "create-subprofile" | "change-password" | null;

// ── Helpers ───────────────────────────────────────────────────────────────────

const getInitials = (name: string, lastName: string) =>
  (name?.charAt(0) || "U").toUpperCase() + (lastName?.charAt(0) || "").toUpperCase();

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

const getString = (src: Record<string, unknown>, keys: string[]) => {
  for (const k of keys) {
    const v = src[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
};

const extractSubprofiles = (payload: unknown): SubprofileItem[] => {
  const arr: unknown[] = Array.isArray(payload)
    ? payload
    : isRecord(payload)
      ? Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload.subusers)
          ? payload.subusers
          : isRecord(payload.data) && Array.isArray((payload.data as Record<string, unknown>).subusers)
            ? ((payload.data as Record<string, unknown>).subusers as unknown[])
            : []
      : [];

  return arr
    .filter(isRecord)
    .map((item, i) => ({
      id: getString(item, ["id", "_id", "userId"]) || `sub-${i}`,
      name: getString(item, ["name", "firstName"]) || "Subperfil",
      lastName: getString(item, ["lastName", "surname"]) || "",
      username: getString(item, ["username"]) || "sin-usuario",
      email: getString(item, ["email"]) || "",
    }));
};

// ── Shared input style ────────────────────────────────────────────────────────

const inputCls = (hasError?: boolean) =>
  `w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors
   bg-[#F9FAFB] text-[#111827] placeholder:text-[#9CA3AF]
   ${hasError
    ? "border-red-300 focus:border-red-400"
    : "border-[#E5E7EB] focus:border-[#F97316]"}`;

// ── Main component ────────────────────────────────────────────────────────────

const ProfilePage = () => {
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [activeSection, setActiveSection] = useState<ActiveSection>(null);

  // ── User data ──────────────────────────────────────────────────────────────
  const [userData, setUserData] = useState(() => {
    const u = LocalStorageService.getItem("user");
    return {
      username: u.username || "",
      name: u.name || "",
      lastName: u.lastName || "",
      email: u.email || "",
      userId: u.id || u._id || "",
      onboardingData: {
        country: u.onboardingData?.country || null,
        address: u.onboardingData?.address || null,
        profession: u.onboardingData?.profession || null,
        otherProfession: u.onboardingData?.otherProfession || null,
      },
    };
  });

  const convertCountry = useConvertCountry(userData.onboardingData?.country || null);

  // ── Edit profile ───────────────────────────────────────────────────────────
  const [editForm, setEditForm] = useState({
    country: userData.onboardingData.country || "",
    profession: userData.onboardingData.profession || "",
    otherProfession: userData.onboardingData.otherProfession || "",
    address: userData.onboardingData.address || "",
  });
  const [editErrors, setEditErrors] = useState<Partial<typeof editForm>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState("");
  const [editSuccess, setEditSuccess] = useState(false);

  const validateEdit = () => {
    const errs: Partial<typeof editForm> = {};
    if (!editForm.country.trim()) errs.country = "Requerido";
    if (!editForm.profession.trim()) errs.profession = "Requerido";
    if (editForm.profession === "otro" && !editForm.otherProfession.trim())
      errs.otherProfession = "Selecciona tu profesión específica";
    if (!editForm.address.trim()) errs.address = "Requerido";
    setEditErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateEdit()) return;
    setEditLoading(true);
    setEditError("");
    setEditSuccess(false);
    try {
      const finalProfession =
        editForm.profession === "otro" ? editForm.otherProfession : editForm.profession;
      const payload = {
        country: editForm.country || null,
        profession: finalProfession || null,
        address: editForm.address || null,
      };
      const response = await AuthService.updateProfileInfo(payload);
      if (!response) throw new Error("Sin respuesta del servidor");

      setUserData((prev) => ({
        ...prev,
        onboardingData: { ...prev.onboardingData, ...payload },
      }));
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        localStorage.setItem("user", JSON.stringify({
          ...u,
          onboardingData: { ...(u.onboardingData || {}), ...payload },
        }));
      }
      setEditSuccess(true);
      setTimeout(() => {
        setEditSuccess(false);
        setActiveSection(null);
      }, 1500);
    } catch {
      setEditError("No se pudo guardar. Verifica tu conexión e intenta de nuevo.");
    } finally {
      setEditLoading(false);
    }
  };

  // ── Subprofiles ────────────────────────────────────────────────────────────
  const [subprofiles, setSubprofiles] = useState<SubprofileItem[]>([]);
  const [subLoading, setSubLoading] = useState(false);
  const [subError, setSubError] = useState("");
  const [unlinkingId, setUnlinkingId] = useState<string | null>(null);
  const [confirmingId, setConfirmingId] = useState<string | null>(null);
  const [unlinkSuccess, setUnlinkSuccess] = useState("");

  const loadSubprofiles = useCallback(async () => {
    setSubLoading(true);
    setSubError("");
    try {
      const response = await AuthService.getSubUsersByUser();
      if (!response) { setSubError("No se pudieron cargar los subperfiles."); return; }
      const currentUser = LocalStorageService.getItem("user");
      const currentId = currentUser?.id || currentUser?._id || "";
      const currentEmail = (currentUser?.email || "").toLowerCase();
      const all = extractSubprofiles(response);
      setSubprofiles(all.filter(
        (s) => s.id !== currentId && s.email.toLowerCase() !== currentEmail
      ));
    } catch {
      setSubError("Error al cargar los subperfiles.");
    } finally {
      setSubLoading(false);
    }
  }, []);

  useEffect(() => { void loadSubprofiles(); }, [loadSubprofiles]);

  const handleUnlink = async (id: string) => {
    setUnlinkingId(id);
    setSubError("");
    setUnlinkSuccess("");
    try {
      const result = await AuthService.unlinkSubuser(id);
      if (!result.success) { setSubError(result.message); return; }
      setSubprofiles((prev) => prev.filter((s) => s.id !== id));
      setConfirmingId(null);
      setUnlinkSuccess("Subperfil desvinculado correctamente.");
      setTimeout(() => setUnlinkSuccess(""), 3000);
    } catch {
      setSubError("Error al desvincular.");
    } finally {
      setUnlinkingId(null);
    }
  };

  // ── Create subprofile ──────────────────────────────────────────────────────
  const [createForm, setCreateForm] = useState<RegisterSubuserSchema>({
    parentUserId: userData.userId,
    username: "", email: "", name: "", lastName: "",
  });
  const [createErrors, setCreateErrors] = useState<Partial<RegisterSubuserSchema>>({});
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState("");
  const [createSuccess, setCreateSuccess] = useState(false);

  const validateCreate = () => {
    const errs: Partial<RegisterSubuserSchema> = {};
    if (!createForm.username.trim()) errs.username = "Requerido";
    if (!createForm.name.trim()) errs.name = "Requerido";
    if (!createForm.lastName.trim()) errs.lastName = "Requerido";
    if (!createForm.email.trim()) errs.email = "Requerido";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.email))
      errs.email = "Correo inválido";
    setCreateErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleCreateSubprofile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateCreate()) return;
    setCreateLoading(true);
    setCreateError("");
    setCreateSuccess(false);
    try {
      const response = await AuthService.registerSubuser(createForm);
      if (!response) throw new Error();
      setCreateSuccess(true);
      setCreateForm({ parentUserId: userData.userId, username: "", email: "", name: "", lastName: "" });
      setTimeout(() => {
        setCreateSuccess(false);
        setActiveSection(null);
        void loadSubprofiles();
      }, 1500);
    } catch (err: unknown) {
      const msg = (err as { response?: { data?: { message?: string } } })?.response?.data?.message;
      setCreateError(msg || "Error al crear el subperfil.");
    } finally {
      setCreateLoading(false);
    }
  };

  // ── Change password ────────────────────────────────────────────────────────
  const authToken = (localStorage.getItem("token") || "").trim();
  const [pwdForm, setPwdForm] = useState({
    currentPassword: "", newPassword: "", confirmPassword: "",
  });
  const [pwdShow, setPwdShow] = useState({ current: false, next: false, confirm: false });
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");
    if (!pwdForm.currentPassword.trim()) { setPwdError("Ingresa tu contraseña actual"); return; }
    if (pwdForm.newPassword.length < 8) { setPwdError("La nueva contraseña debe tener al menos 8 caracteres"); return; }
    if (pwdForm.newPassword !== pwdForm.confirmPassword) { setPwdError("Las contraseñas nuevas no coinciden"); return; }
    if (!authToken) { setPwdError("No se encontró token de autenticación"); return; }
    setPwdLoading(true);
    try {
      const response = await AuthService.changePassword(
        pwdForm.newPassword, pwdForm.confirmPassword, pwdForm.currentPassword, authToken,
      );
      if (!response.success) { setPwdError(response.message || "Error al cambiar la contraseña"); return; }
      setPwdSuccess(response.message || "Contraseña actualizada correctamente.");
      setPwdForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      setTimeout(() => { setPwdSuccess(""); setActiveSection(null); }, 2000);
    } catch {
      setPwdError("Error al cambiar la contraseña.");
    } finally {
      setPwdLoading(false);
    }
  };

  // ── Misc ───────────────────────────────────────────────────────────────────
  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(userData.userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* clipboard not available */ }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setProfileImage(reader.result as string);
    reader.readAsDataURL(file);
  };

  const toggleSection = (section: ActiveSection) =>
    setActiveSection((prev) => (prev === section ? null : section));

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-[#F7F8FA] px-10 py-8">
      <div style={{ maxWidth: 680 }}>

        {/* Page title */}
        <div className="flex flex-col gap-1.5 mb-6">
          <h1 className="text-2xl font-bold text-[#111827]">Mi Perfil</h1>
          <div className="w-10 h-0.5 rounded-full bg-[#F97316]" />
        </div>

        <div className="flex flex-col gap-4">

          {/* ── Hero card ── */}
          <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
            <div className="flex items-center gap-4 px-6 py-5" style={{ backgroundColor: "#0F172A" }}>
              {/* Avatar */}
              <div className="relative group flex-shrink-0">
                <div
                  className="flex items-center justify-center overflow-hidden"
                  style={{ width: 80, height: 80, borderRadius: "50%", backgroundColor: "#1E293B", border: "1px solid #334155" }}
                >
                  {profileImage
                    ? <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                    : <User size={36} color="#64748B" />}
                </div>
                <label
                  htmlFor="profile-image"
                  className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                  <Camera size={20} color="#FFFFFF" />
                </label>
                <input id="profile-image" type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
              </div>

              {/* Name + meta */}
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white truncate">{userData.name} {userData.lastName}</h2>
                <p className="text-sm truncate" style={{ color: "#94A3B8" }}>@{userData.username}</p>
                <div className="flex gap-3 mt-1 flex-wrap">
                  {userData.onboardingData.profession && (
                    <p className="text-sm flex items-center gap-1" style={{ color: "#94A3B8" }}>
                      <AudioWaveform size={14} color="#94A3B8" />
                      {userData.onboardingData.profession}
                    </p>
                  )}
                  {userData.onboardingData.country && (
                    <p className="text-sm flex items-center gap-1" style={{ color: "#94A3B8" }}>
                      <Earth size={14} color="#94A3B8" />
                      {convertCountry}
                    </p>
                  )}
                  {userData.onboardingData.address && (
                    <p className="text-sm flex items-center gap-1" style={{ color: "#94A3B8" }}>
                      <MapPin size={14} color="#94A3B8" />
                      {userData.onboardingData.address}
                    </p>
                  )}
                </div>
              </div>

              {/* Edit button */}
              <button
                onClick={() => toggleSection("edit-profile")}
                className="flex items-center gap-1.5 text-sm font-semibold flex-shrink-0 transition-colors"
                style={{
                  padding: "8px 16px", borderRadius: 8,
                  backgroundColor: activeSection === "edit-profile" ? "#EA6C10" : "#F97316",
                  color: "#FFFFFF",
                }}
              >
                {activeSection === "edit-profile" ? <X size={14} /> : <Pencil size={14} />}
                {activeSection === "edit-profile" ? "Cancelar" : "Editar perfil"}
              </button>
            </div>

            {/* ── Inline edit form ── */}
            {activeSection === "edit-profile" && (
              <div className="px-6 py-5 border-t border-[#E5E7EB]">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-4">
                  Editar información
                </p>
                <div className="flex flex-col gap-4">
                  {/* País */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] mb-1.5">
                      <Globe size={13} /> País
                    </label>
                    <div className="relative">
                      <select
                        value={editForm.country}
                        onChange={(e) => {
                          setEditForm((p) => ({ ...p, country: e.target.value }));
                          setEditErrors((p) => ({ ...p, country: undefined }));
                        }}
                        className={inputCls(!!editErrors.country) + " pr-10 appearance-none"}
                      >
                        <option value="">Selecciona tu país</option>
                        {COUNTRIES.map((c) => (
                          <option key={c.code} value={c.code}>{c.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    </div>
                    {editErrors.country && <p className="mt-1 text-xs text-red-500">{editErrors.country}</p>}
                  </div>

                  {/* Profesión */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] mb-1.5">
                      <Briefcase size={13} /> Profesión
                    </label>
                    <div className="relative">
                      <select
                        value={editForm.profession}
                        onChange={(e) => {
                          const v = e.target.value;
                          setEditForm((p) => ({ ...p, profession: v, otherProfession: v === "otro" ? p.otherProfession : "" }));
                          setEditErrors((p) => ({ ...p, profession: undefined }));
                        }}
                        className={inputCls(!!editErrors.profession) + " pr-10 appearance-none"}
                      >
                        <option value="">Selecciona tu profesión</option>
                        {PROFESSIONS.map((p) => (
                          <option key={p.id} value={p.id}>{p.name}</option>
                        ))}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    </div>
                    {editErrors.profession && <p className="mt-1 text-xs text-red-500">{editErrors.profession}</p>}
                  </div>

                  {/* Profesión específica (otro) */}
                  {editForm.profession === "otro" && (
                    <div>
                      <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Profesión específica</label>
                      <div className="relative">
                        <select
                          value={editForm.otherProfession}
                          onChange={(e) => {
                            setEditForm((p) => ({ ...p, otherProfession: e.target.value }));
                            setEditErrors((p) => ({ ...p, otherProfession: undefined }));
                          }}
                          className={inputCls(!!editErrors.otherProfession) + " pr-10 appearance-none"}
                        >
                          <option value="">Selecciona</option>
                          {OTHER_PROFESSIONS.map((p) => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                      </div>
                      {editErrors.otherProfession && <p className="mt-1 text-xs text-red-500">{editErrors.otherProfession}</p>}
                    </div>
                  )}

                  {/* Dirección */}
                  <div>
                    <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] mb-1.5">
                      <MapPin size={13} /> Dirección
                    </label>
                    <input
                      type="text"
                      value={editForm.address}
                      onChange={(e) => {
                        setEditForm((p) => ({ ...p, address: e.target.value }));
                        setEditErrors((p) => ({ ...p, address: undefined }));
                      }}
                      placeholder="Escribe tu dirección"
                      className={inputCls(!!editErrors.address)}
                    />
                    {editErrors.address && <p className="mt-1 text-xs text-red-500">{editErrors.address}</p>}
                  </div>

                  {/* Feedback */}
                  {editError && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-600"
                      style={{ backgroundColor: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
                      <AlertCircle size={15} className="flex-shrink-0" />
                      {editError}
                    </div>
                  )}
                  {editSuccess && (
                    <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-green-700"
                      style={{ backgroundColor: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
                      <CheckCircle2 size={15} className="flex-shrink-0" />
                      Perfil actualizado correctamente.
                    </div>
                  )}

                  {/* Save */}
                  <button
                    onClick={handleSaveProfile}
                    disabled={editLoading || editSuccess}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                    style={{ backgroundColor: "#F97316" }}
                  >
                    {editLoading
                      ? <><Loader2 size={15} className="animate-spin" /> Guardando...</>
                      : editSuccess
                        ? <><Check size={15} /> Guardado</>
                        : "Guardar cambios"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Info card ── */}
          <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
            {/* User ID */}
            <div className="flex items-center gap-3 px-5" style={{ height: 60, backgroundColor: "#FFF7ED", borderBottom: "1px solid #E5E7EB" }}>
              <div className="flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: "#FDBA74" }}>
                <Hash size={16} color="#FFFFFF" />
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-[11px] font-medium" style={{ color: "#9CA3AF" }}>ID de Usuario</span>
                <span className="text-sm font-bold truncate" style={{ color: "#92400E" }}>{userData.userId}</span>
              </div>
              <button
                onClick={handleCopyId}
                className="flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-80"
                style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: "#F97316" }}
              >
                {copied ? <Check size={14} color="#FFFFFF" /> : <Copy size={14} color="#FFFFFF" />}
              </button>
            </div>

            {/* Nombre */}
            <div className="flex items-center gap-3 px-5" style={{ height: 60, borderBottom: "1px solid #E5E7EB" }}>
              <div className="flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: "#F3F4F6" }}>
                <User size={16} color="#9CA3AF" />
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-[11px] font-medium" style={{ color: "#9CA3AF" }}>Nombre completo</span>
                <span className="text-sm font-medium text-[#111827] truncate">{userData.name} {userData.lastName}</span>
              </div>
            </div>

            {/* Email */}
            <div className="flex items-center gap-3 px-5" style={{ height: 60, borderBottom: "1px solid #E5E7EB" }}>
              <div className="flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: "#F3F4F6" }}>
                <Mail size={16} color="#9CA3AF" />
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-[11px] font-medium" style={{ color: "#9CA3AF" }}>Correo electrónico</span>
                <span className="text-sm font-medium text-[#111827] truncate">{userData.email}</span>
              </div>
            </div>

            {/* Username */}
            <div className="flex items-center gap-3 px-5" style={{ height: 60 }}>
              <div className="flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: "#F3F4F6" }}>
                <AtSign size={16} color="#9CA3AF" />
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-[11px] font-medium" style={{ color: "#9CA3AF" }}>Nombre de usuario</span>
                <span className="text-sm font-medium text-[#111827] truncate">@{userData.username}</span>
              </div>
            </div>
          </div>

          {/* ── Subperfiles ── */}
          <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
            {/* Header */}
            <div className="flex items-center gap-4 px-5 py-4" style={{ borderBottom: subprofiles.length > 0 || activeSection === "create-subprofile" ? "1px solid #E5E7EB" : undefined }}>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-[15px] font-semibold text-[#111827]">Subperfiles</span>
                <span className="text-xs text-[#6B7280]">
                  {subLoading ? "Cargando..." : `${subprofiles.length} subperfil${subprofiles.length !== 1 ? "es" : ""} vinculado${subprofiles.length !== 1 ? "s" : ""}`}
                </span>
              </div>
              <button
                onClick={() => void loadSubprofiles()}
                className="p-2 rounded-lg transition-colors hover:bg-[#F3F4F6] flex-shrink-0"
                title="Recargar"
              >
                <RefreshCcw size={14} color="#9CA3AF" className={subLoading ? "animate-spin" : ""} />
              </button>
              <button
                onClick={() => toggleSection("create-subprofile")}
                className="flex items-center gap-1.5 text-sm font-semibold flex-shrink-0 transition-colors text-white"
                style={{
                  padding: "8px 14px", borderRadius: 8,
                  backgroundColor: activeSection === "create-subprofile" ? "#EA6C10" : "#F97316",
                }}
              >
                {activeSection === "create-subprofile" ? <X size={14} /> : <UserPlus size={14} />}
                {activeSection === "create-subprofile" ? "Cancelar" : "Crear subperfil"}
              </button>
            </div>

            {/* Feedback messages */}
            {(subError || unlinkSuccess) && (
              <div className="px-5 pt-3">
                {subError && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-600 mb-2"
                    style={{ backgroundColor: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <AlertCircle size={14} className="flex-shrink-0" /> {subError}
                  </div>
                )}
                {unlinkSuccess && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-green-700 mb-2"
                    style={{ backgroundColor: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
                    <CheckCircle2 size={14} className="flex-shrink-0" /> {unlinkSuccess}
                  </div>
                )}
              </div>
            )}

            {/* Create form */}
            {activeSection === "create-subprofile" && (
              <form onSubmit={handleCreateSubprofile} className="px-5 py-4 border-b border-[#E5E7EB]">
                <p className="text-[11px] font-semibold uppercase tracking-widest text-[#9CA3AF] mb-4">
                  Nuevo subperfil
                </p>
                {createError && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-600 mb-3"
                    style={{ backgroundColor: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
                    <AlertCircle size={14} className="flex-shrink-0" /> {createError}
                  </div>
                )}
                {createSuccess && (
                  <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-green-700 mb-3"
                    style={{ backgroundColor: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
                    <CheckCircle2 size={14} className="flex-shrink-0" /> Subperfil creado. Se envió un código de verificación al correo.
                  </div>
                )}
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Nombre *</label>
                    <input type="text" value={createForm.name}
                      onChange={(e) => { setCreateForm((p) => ({ ...p, name: e.target.value })); setCreateErrors((p) => ({ ...p, name: undefined })); }}
                      placeholder="Juan" className={inputCls(!!createErrors.name)} disabled={createLoading || createSuccess} />
                    {createErrors.name && <p className="mt-1 text-xs text-red-500">{createErrors.name}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Apellido *</label>
                    <input type="text" value={createForm.lastName}
                      onChange={(e) => { setCreateForm((p) => ({ ...p, lastName: e.target.value })); setCreateErrors((p) => ({ ...p, lastName: undefined })); }}
                      placeholder="Pérez" className={inputCls(!!createErrors.lastName)} disabled={createLoading || createSuccess} />
                    {createErrors.lastName && <p className="mt-1 text-xs text-red-500">{createErrors.lastName}</p>}
                  </div>
                </div>
                <div className="mb-3">
                  <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Usuario *</label>
                  <input type="text" value={createForm.username}
                    onChange={(e) => { setCreateForm((p) => ({ ...p, username: e.target.value })); setCreateErrors((p) => ({ ...p, username: undefined })); }}
                    placeholder="juanperez" className={inputCls(!!createErrors.username)} disabled={createLoading || createSuccess} />
                  {createErrors.username && <p className="mt-1 text-xs text-red-500">{createErrors.username}</p>}
                </div>
                <div className="mb-4">
                  <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Correo electrónico *</label>
                  <input type="email" value={createForm.email}
                    onChange={(e) => { setCreateForm((p) => ({ ...p, email: e.target.value })); setCreateErrors((p) => ({ ...p, email: undefined })); }}
                    placeholder="juan@ejemplo.com" className={inputCls(!!createErrors.email)} disabled={createLoading || createSuccess} />
                  {createErrors.email && <p className="mt-1 text-xs text-red-500">{createErrors.email}</p>}
                </div>
                <button
                  type="submit"
                  disabled={createLoading || createSuccess}
                  className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                  style={{ backgroundColor: "#F97316" }}
                >
                  {createLoading
                    ? <><Loader2 size={15} className="animate-spin" /> Creando...</>
                    : createSuccess
                      ? <><Check size={15} /> Creado</>
                      : <><UserPlus size={15} /> Crear subperfil</>}
                </button>
              </form>
            )}

            {/* Subprofiles list */}
            {subLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-[#9CA3AF] text-sm">
                <Loader2 size={16} className="animate-spin" /> Cargando subperfiles...
              </div>
            ) : subprofiles.length === 0 && activeSection !== "create-subprofile" ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <p className="text-sm font-medium text-[#6B7280]">Sin subperfiles vinculados</p>
                <p className="text-xs text-[#9CA3AF]">Usa el botón "Crear subperfil" para agregar uno.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#E5E7EB]">
                {subprofiles.map((s) => {
                  const isConfirming = confirmingId === s.id;
                  const isUnlinking = unlinkingId === s.id;
                  return (
                    <div key={s.id} className="flex items-center gap-3 px-5 py-3.5">
                      <div
                        className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold"
                        style={{ backgroundColor: "#F3F4F6", color: "#6B7280" }}
                      >
                        {getInitials(s.name, s.lastName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-[#111827] truncate">{s.name} {s.lastName}</p>
                        <p className="text-xs text-[#9CA3AF] truncate">@{s.username} · {s.email}</p>
                      </div>
                      {isConfirming ? (
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => void handleUnlink(s.id)}
                            disabled={isUnlinking}
                            className="flex items-center gap-1 text-xs font-semibold text-white px-3 py-1.5 rounded-lg disabled:opacity-60"
                            style={{ backgroundColor: "#EF4444" }}
                          >
                            {isUnlinking ? <Loader2 size={12} className="animate-spin" /> : null}
                            Confirmar
                          </button>
                          <button
                            onClick={() => setConfirmingId(null)}
                            disabled={isUnlinking}
                            className="text-xs font-medium text-[#6B7280] px-3 py-1.5 rounded-lg transition-colors hover:bg-[#F3F4F6]"
                          >
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setConfirmingId(s.id)}
                          className="flex items-center gap-1.5 text-xs font-medium text-red-500 px-3 py-1.5 rounded-lg transition-colors flex-shrink-0"
                          style={{ border: "1px solid rgba(239,68,68,0.2)" }}
                          onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "rgba(239,68,68,0.05)"; }}
                          onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
                        >
                          <UserMinus size={13} /> Desvincular
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* ── Cambiar contraseña ── */}
          <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
            <button
              onClick={() => toggleSection("change-password")}
              className="w-full flex items-center gap-4 px-5 py-4 transition-colors text-left"
              onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "#FAFAFA"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = "transparent"; }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: 38, height: 38, borderRadius: 10, backgroundColor: "#F3F4F6" }}
              >
                <Lock size={17} color="#6B7280" />
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-[15px] font-semibold text-[#111827]">Cambiar contraseña</span>
                <span className="text-xs text-[#6B7280]">Actualiza tu contraseña de acceso</span>
              </div>
              <ChevronDown
                size={18}
                color="#9CA3AF"
                className="flex-shrink-0 transition-transform duration-200"
                style={{ transform: activeSection === "change-password" ? "rotate(180deg)" : "rotate(0deg)" }}
              />
            </button>

            {/* Password form */}
            {activeSection === "change-password" && (
              <form onSubmit={handleChangePassword} className="px-5 pb-5 border-t border-[#E5E7EB] pt-4">
                <div className="flex flex-col gap-3">
                  {/* Current password */}
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Contraseña actual *</label>
                    <div className="relative">
                      <input
                        type={pwdShow.current ? "text" : "password"}
                        value={pwdForm.currentPassword}
                        onChange={(e) => { setPwdForm((p) => ({ ...p, currentPassword: e.target.value })); setPwdError(""); }}
                        placeholder="••••••••"
                        className={inputCls() + " pr-10"}
                        disabled={pwdLoading}
                      />
                      <button type="button" onClick={() => setPwdShow((p) => ({ ...p, current: !p.current }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]">
                        {pwdShow.current ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* New password */}
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Nueva contraseña *</label>
                    <div className="relative">
                      <input
                        type={pwdShow.next ? "text" : "password"}
                        value={pwdForm.newPassword}
                        onChange={(e) => { setPwdForm((p) => ({ ...p, newPassword: e.target.value })); setPwdError(""); }}
                        placeholder="Mínimo 8 caracteres"
                        className={inputCls() + " pr-10"}
                        disabled={pwdLoading}
                      />
                      <button type="button" onClick={() => setPwdShow((p) => ({ ...p, next: !p.next }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]">
                        {pwdShow.next ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Confirm password */}
                  <div>
                    <label className="block text-xs font-semibold text-[#6B7280] mb-1.5">Confirmar nueva contraseña *</label>
                    <div className="relative">
                      <input
                        type={pwdShow.confirm ? "text" : "password"}
                        value={pwdForm.confirmPassword}
                        onChange={(e) => { setPwdForm((p) => ({ ...p, confirmPassword: e.target.value })); setPwdError(""); }}
                        placeholder="Repite la nueva contraseña"
                        className={inputCls() + " pr-10"}
                        disabled={pwdLoading}
                      />
                      <button type="button" onClick={() => setPwdShow((p) => ({ ...p, confirm: !p.confirm }))}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]">
                        {pwdShow.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {/* Feedback */}
                  {pwdError && (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-red-600"
                      style={{ backgroundColor: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
                      <AlertCircle size={14} className="flex-shrink-0" /> {pwdError}
                    </div>
                  )}
                  {pwdSuccess && (
                    <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm text-green-700"
                      style={{ backgroundColor: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
                      <CheckCircle2 size={14} className="flex-shrink-0" /> {pwdSuccess}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={pwdLoading || !!pwdSuccess}
                    className="flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold text-white transition-opacity disabled:opacity-60"
                    style={{ backgroundColor: "#111827" }}
                  >
                    {pwdLoading
                      ? <><Loader2 size={15} className="animate-spin" /> Guardando...</>
                      : pwdSuccess
                        ? <><Check size={15} /> Contraseña actualizada</>
                        : <><Lock size={15} /> Cambiar contraseña</>}
                  </button>
                </div>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
