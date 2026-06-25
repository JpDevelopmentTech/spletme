import { useState } from "react";
import {
  Globe, MapPin, Phone, Building2,
  Navigation, Briefcase, ChevronDown, AlertCircle,
  CheckCircle2, Loader2, Check, Mic, SlidersHorizontal,
  Music, User,
} from "lucide-react";
import { PROFILE_COUNTRIES, PROFILE_PROFESSIONS, OTHER_PROFESSIONS, PHONE_CODES } from "@/constants/profile.constants";
import { inputCls } from "@/utils/profile.utils";
import type { ProfileUserData, EditProfileForm } from "@/types/profile.types";

interface ProfileDetailsCardProps {
  userData:            ProfileUserData;
  editForm:            EditProfileForm;
  editErrors:          Partial<EditProfileForm>;
  editLoading:         boolean;
  editError:           string;
  editSuccess:         boolean;
  departments:         string[];
  deptLoading:         boolean;
  cities:              string[];
  cityLoading:         boolean;
  parseProfessions:    (val: string) => string[];
  onToggleEdit:        () => void;
  onCountryChange:     (code: string) => void;
  onDepartmentChange:  (dept: string) => void;
  onEditFormChange:    (field: keyof EditProfileForm, value: string) => void;
  onToggleProfession:  (id: string) => void;
  onToggleOther:       (prof: string) => void;
  onSaveProfile:       () => void;
}

const PROF_ICONS: Record<string, React.ElementType> = {
  artista:    Mic,
  productor:  SlidersHorizontal,
  compositor: Music,
  otro:       User,
};

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF]">{children}</span>
      <div className="flex-1 h-px bg-[#F3F4F6]" />
    </div>
  );
}

export function ProfileDetailsCard({
  userData: _userData,
  editForm, editErrors, editLoading, editError, editSuccess,
  departments, deptLoading, cities, cityLoading,
  parseProfessions,
  onToggleEdit, onCountryChange, onDepartmentChange, onEditFormChange,
  onToggleProfession, onToggleOther, onSaveProfile,
}: ProfileDetailsCardProps) {
  const selectedProfs  = parseProfessions(editForm.profession);
  const selectedOthers = parseProfessions(editForm.otherProfession);
  const showOtherBlock = selectedProfs.includes("otro");

  const [showAllOthers, setShowAllOthers] = useState(false);
  const visibleOthers = showAllOthers ? OTHER_PROFESSIONS : OTHER_PROFESSIONS.slice(0, 6);

  return (
    <div className="flex flex-col">
      <div className="px-2 py-2 flex flex-col gap-5">

          {/* Ubicación */}
          <div>
            <SectionTitle>Ubicación</SectionTitle>
            <div className="grid grid-cols-1 gap-3">
              {/* País */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] mb-1.5">
                  <Globe size={12} /> País
                </label>
                <div className="relative">
                  <select
                    value={editForm.country}
                    onChange={(e) => onCountryChange(e.target.value)}
                    className={inputCls(!!editErrors.country) + " pr-10 appearance-none"}
                  >
                    <option value="">Selecciona tu país</option>
                    {PROFILE_COUNTRIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.label}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                </div>
              </div>

              {/* Departamento + Ciudad */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] mb-1.5">
                    <Building2 size={12} /> Departamento / Estado
                    {deptLoading && <Loader2 size={11} className="animate-spin ml-1" />}
                  </label>
                  {departments.length > 0 ? (
                    <div className="relative">
                      <select
                        value={editForm.department}
                        onChange={(e) => onDepartmentChange(e.target.value)}
                        className={inputCls(false) + " pr-10 appearance-none"}
                      >
                        <option value="">Selecciona</option>
                        {departments.map((d) => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="Escribe el departamento"
                      value={editForm.department}
                      onChange={(e) => onEditFormChange("department", e.target.value)}
                      className={inputCls(false)}
                      disabled={deptLoading}
                    />
                  )}
                </div>

                <div>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] mb-1.5">
                    <Navigation size={12} /> Ciudad
                    {cityLoading && <Loader2 size={11} className="animate-spin ml-1" />}
                  </label>
                  {cities.length > 0 ? (
                    <div className="relative">
                      <select
                        value={editForm.city}
                        onChange={(e) => onEditFormChange("city", e.target.value)}
                        className={inputCls(false) + " pr-10 appearance-none"}
                      >
                        <option value="">Selecciona</option>
                        {cities.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                      <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#9CA3AF]" />
                    </div>
                  ) : (
                    <input
                      type="text"
                      placeholder="Escribe la ciudad"
                      value={editForm.city}
                      onChange={(e) => onEditFormChange("city", e.target.value)}
                      className={inputCls(false)}
                      disabled={cityLoading}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div>
            <SectionTitle>Contacto</SectionTitle>
            <div className="flex flex-col gap-3">
              {/* Teléfono */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] mb-1.5">
                  <Phone size={12} /> Teléfono
                </label>
                <div className="flex gap-2">
                  <div className="relative w-36 flex-shrink-0">
                    <select
                      value={editForm.phoneCountryCode}
                      onChange={(e) => onEditFormChange("phoneCountryCode", e.target.value)}
                      className={inputCls(false) + " pr-7 appearance-none text-[13px]"}
                    >
                      {PHONE_CODES.map((pc) => (
                        <option key={pc.dial} value={pc.dial}>{pc.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#9CA3AF]" />
                  </div>
                  <input
                    type="tel"
                    placeholder="Número de teléfono"
                    value={editForm.phone}
                    onChange={(e) => onEditFormChange("phone", e.target.value)}
                    className={inputCls(false) + " flex-1"}
                  />
                </div>
              </div>

              {/* Dirección */}
              <div>
                <label className="flex items-center gap-1.5 text-xs font-semibold text-[#6B7280] mb-1.5">
                  <MapPin size={12} /> Dirección
                </label>
                <input
                  type="text"
                  placeholder="Escribe tu dirección"
                  value={editForm.address}
                  onChange={(e) => onEditFormChange("address", e.target.value)}
                  className={inputCls(false)}
                />
              </div>
            </div>
          </div>

          {/* Profesiones */}
          <div>
            <SectionTitle>Profesiones</SectionTitle>
            <p className="text-xs text-[#9CA3AF] mb-3">Puedes seleccionar una o varias</p>

            <div className="grid grid-cols-2 gap-2.5">
              {PROFILE_PROFESSIONS.map(({ id, name, description }) => {
                const isSelected = selectedProfs.includes(id);
                const Icon = PROF_ICONS[id] ?? Briefcase;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => onToggleProfession(id)}
                    className="relative flex items-start gap-3 p-3 rounded-xl text-left transition-all"
                    style={{
                      backgroundColor: isSelected ? "#FFF7ED" : "#FAFAFA",
                      border: isSelected ? "2px solid #F97316" : "1px solid #E5E7EB",
                    }}
                  >
                    {isSelected && (
                      <span className="absolute top-2 right-2 w-4 h-4 flex items-center justify-center rounded-full bg-orange-500">
                        <Check size={9} color="#fff" strokeWidth={3} />
                      </span>
                    )}
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isSelected ? "bg-orange-100" : "bg-gray-100"}`}>
                      <Icon className={`w-4 h-4 ${isSelected ? "text-orange-500" : "text-gray-400"}`} />
                    </div>
                    <div>
                      <p className={`text-[13px] font-semibold ${isSelected ? "text-orange-700" : "text-gray-800"}`}>{name}</p>
                      <p className="text-[11px] text-gray-400 mt-0.5">{description}</p>
                    </div>
                  </button>
                );
              })}
            </div>

            {editErrors.profession && (
              <p className="mt-2 text-xs text-red-500">{editErrors.profession}</p>
            )}

            {/* Selected pills */}
            {selectedProfs.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {selectedProfs.map((id) => {
                  const p = PROFILE_PROFESSIONS.find((pr) => pr.id === id);
                  return (
                    <span key={id} className="flex items-center gap-1 text-[11px] font-medium px-2.5 py-1 rounded-full"
                      style={{ backgroundColor: "#FFF7ED", color: "#C2410C", border: "1px solid #FED7AA" }}>
                      {p?.name}
                      <button onClick={() => onToggleProfession(id)} className="ml-0.5 hover:opacity-70">✕</button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Other professions block */}
          {showOtherBlock && (
            <div>
              <SectionTitle>Profesión específica</SectionTitle>
              <div className="grid grid-cols-2 gap-2">
                {visibleOthers.map((prof) => {
                  const isSelected = selectedOthers.includes(prof);
                  return (
                    <button
                      key={prof}
                      type="button"
                      onClick={() => onToggleOther(prof)}
                      className="flex items-center justify-between px-3 py-2 text-[12px] rounded-lg text-left transition-colors"
                      style={{
                        backgroundColor: isSelected ? "#FFF7ED" : "#FAFAFA",
                        border: isSelected ? "2px solid #F97316" : "1px solid #E5E7EB",
                        color: isSelected ? "#C2410C" : "#374151",
                      }}
                    >
                      <span>{prof}</span>
                      {isSelected && <Check size={12} color="#F97316" strokeWidth={2.5} />}
                    </button>
                  );
                })}
              </div>
              {OTHER_PROFESSIONS.length > 6 && (
                <button
                  type="button"
                  onClick={() => setShowAllOthers((v) => !v)}
                  className="mt-2 text-[11px] font-medium text-orange-500 hover:text-orange-600"
                >
                  {showAllOthers ? "Ver menos" : `Ver ${OTHER_PROFESSIONS.length - 6} más...`}
                </button>
              )}
            </div>
          )}

          {/* Feedback */}
          {editError && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-red-600"
              style={{ backgroundColor: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.2)" }}>
              <AlertCircle size={15} className="flex-shrink-0" /> {editError}
            </div>
          )}
          {editSuccess && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl text-sm text-green-700"
              style={{ backgroundColor: "rgba(34,197,94,0.06)", border: "1px solid rgba(34,197,94,0.2)" }}>
              <CheckCircle2 size={15} className="flex-shrink-0" /> Información actualizada correctamente.
            </div>
          )}

          <button
            onClick={onSaveProfile}
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
  );
}
