import {
  Camera,
  User,
  Pencil,
  X,
  Globe,
  Briefcase,
  MapPin,
  Earth,
  AudioWaveform,
  ChevronDown,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Check,
} from "lucide-react";
import { inputCls } from "@/utils/profile.utils";
import {
  PROFILE_COUNTRIES,
  PROFILE_PROFESSIONS,
  OTHER_PROFESSIONS,
} from "@/constants/profile.constants";
import type { ProfileUserData, EditProfileForm } from "@/types/profile.types";

interface ProfileHeroCardProps {
  userData: ProfileUserData;
  convertCountry: string;
  profileImage: string | null;
  isEditing: boolean;
  editForm: EditProfileForm;
  editErrors: Partial<EditProfileForm>;
  editLoading: boolean;
  editError: string;
  editSuccess: boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleEdit: () => void;
  onEditFormChange: (field: keyof EditProfileForm, value: string) => void;
  onSaveProfile: () => void;
}

/**
 * Tarjeta hero del perfil: avatar, nombre, metadata y formulario de edición colapsable.
 */
export function ProfileHeroCard({
  userData,
  convertCountry,
  profileImage,
  isEditing,
  editForm,
  editErrors,
  editLoading,
  editError,
  editSuccess,
  onImageChange,
  onToggleEdit,
  onEditFormChange,
  onSaveProfile,
}: ProfileHeroCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
      <div className="flex items-center gap-4 px-6 py-5" style={{ backgroundColor: "#0F172A" }}>
        {/* Avatar */}
        <div className="group relative flex-shrink-0">
          <div
            className="flex items-center justify-center overflow-hidden"
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              backgroundColor: "#1E293B",
              border: "1px solid #334155",
            }}
          >
            {profileImage ? (
              <img src={profileImage} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User size={36} color="#64748B" />
            )}
          </div>
          <label
            htmlFor="profile-image"
            className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full opacity-0 transition-opacity group-hover:opacity-100"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <Camera size={20} color="#FFFFFF" />
          </label>
          <input
            id="profile-image"
            type="file"
            accept="image/*"
            onChange={onImageChange}
            className="hidden"
          />
        </div>

        {/* Name + meta */}
        <div className="flex min-w-0 flex-1 flex-col gap-1">
          <h2 className="truncate text-xl font-bold text-white">
            {userData.name} {userData.lastName}
          </h2>
          <p className="truncate text-sm" style={{ color: "#94A3B8" }}>
            @{userData.username}
          </p>
          <div className="mt-1 flex flex-wrap gap-3">
            {userData.onboardingData.profession && (
              <p className="flex items-center gap-1 text-sm" style={{ color: "#94A3B8" }}>
                <AudioWaveform size={14} color="#94A3B8" /> {userData.onboardingData.profession}
              </p>
            )}
            {userData.onboardingData.country && (
              <p className="flex items-center gap-1 text-sm" style={{ color: "#94A3B8" }}>
                <Earth size={14} color="#94A3B8" /> {convertCountry}
              </p>
            )}
            {userData.onboardingData.address && (
              <p className="flex items-center gap-1 text-sm" style={{ color: "#94A3B8" }}>
                <MapPin size={14} color="#94A3B8" /> {userData.onboardingData.address}
              </p>
            )}
          </div>
        </div>

        {/* Edit button */}
        <button
          onClick={onToggleEdit}
          className="flex flex-shrink-0 items-center gap-1.5 text-sm font-semibold transition-colors"
          style={{
            padding: "8px 16px",
            borderRadius: 8,
            backgroundColor: isEditing ? "#EA6C10" : "#F97316",
            color: "#FFFFFF",
          }}
        >
          {isEditing ? <X size={14} /> : <Pencil size={14} />}
          {isEditing ? "Cancelar" : "Editar perfil"}
        </button>
      </div>

      {/* Edit form */}
      {isEditing && (
        <div className="border-t border-[#E5E7EB] px-6 py-5">
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
            Editar información
          </p>
          <div className="flex flex-col gap-4">
            {/* País */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#6B7280]">
                <Globe size={13} /> País
              </label>
              <div className="relative">
                <select
                  value={editForm.country}
                  onChange={(e) => onEditFormChange("country", e.target.value)}
                  className={inputCls(!!editErrors.country) + " appearance-none pr-10"}
                >
                  <option value="">Selecciona tu país</option>
                  {PROFILE_COUNTRIES.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
              </div>
              {editErrors.country && (
                <p className="mt-1 text-xs text-red-500">{editErrors.country}</p>
              )}
            </div>

            {/* Profesión */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#6B7280]">
                <Briefcase size={13} /> Profesión
              </label>
              <div className="relative">
                <select
                  value={editForm.profession}
                  onChange={(e) => onEditFormChange("profession", e.target.value)}
                  className={inputCls(!!editErrors.profession) + " appearance-none pr-10"}
                >
                  <option value="">Selecciona tu profesión</option>
                  {PROFILE_PROFESSIONS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
              </div>
              {editErrors.profession && (
                <p className="mt-1 text-xs text-red-500">{editErrors.profession}</p>
              )}
            </div>

            {/* Profesión específica */}
            {editForm.profession === "otro" && (
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[#6B7280]">
                  Profesión específica
                </label>
                <div className="relative">
                  <select
                    value={editForm.otherProfession}
                    onChange={(e) => onEditFormChange("otherProfession", e.target.value)}
                    className={inputCls(!!editErrors.otherProfession) + " appearance-none pr-10"}
                  >
                    <option value="">Selecciona</option>
                    {OTHER_PROFESSIONS.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
                </div>
                {editErrors.otherProfession && (
                  <p className="mt-1 text-xs text-red-500">{editErrors.otherProfession}</p>
                )}
              </div>
            )}

            {/* Dirección */}
            <div>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[#6B7280]">
                <MapPin size={13} /> Dirección
              </label>
              <input
                type="text"
                value={editForm.address}
                onChange={(e) => onEditFormChange("address", e.target.value)}
                placeholder="Escribe tu dirección"
                className={inputCls(!!editErrors.address)}
              />
              {editErrors.address && (
                <p className="mt-1 text-xs text-red-500">{editErrors.address}</p>
              )}
            </div>

            {editError && (
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-red-600"
                style={{
                  backgroundColor: "rgba(239,68,68,0.06)",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                <AlertCircle size={15} className="flex-shrink-0" /> {editError}
              </div>
            )}
            {editSuccess && (
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-3 text-sm text-green-700"
                style={{
                  backgroundColor: "rgba(34,197,94,0.06)",
                  border: "1px solid rgba(34,197,94,0.2)",
                }}
              >
                <CheckCircle2 size={15} className="flex-shrink-0" /> Perfil actualizado
                correctamente.
              </div>
            )}

            <button
              onClick={onSaveProfile}
              disabled={editLoading || editSuccess}
              className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
              style={{ backgroundColor: "#F97316" }}
            >
              {editLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Guardando...
                </>
              ) : editSuccess ? (
                <>
                  <Check size={15} /> Guardado
                </>
              ) : (
                "Guardar cambios"
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
