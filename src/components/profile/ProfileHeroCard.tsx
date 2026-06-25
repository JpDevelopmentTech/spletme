import { useState } from "react";
import { Camera, User, Pencil, X, Earth, MapPin } from "lucide-react";
import { PROFILE_COUNTRIES, PROFILE_PROFESSIONS } from "@/constants/profile.constants";
import type { ProfileUserData } from "@/types/profile.types";

interface ProfileHeroCardProps {
  userData:      ProfileUserData;
  profileImage:  string | null;
  isEditing:     boolean;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onToggleEdit:  () => void;
}

const MAX_VISIBLE_PROFS = 3;

export function ProfileHeroCard({
  userData, profileImage, isEditing, onImageChange, onToggleEdit,
}: ProfileHeroCardProps) {
  const od = userData.onboardingData;

  const countryLabel = PROFILE_COUNTRIES.find((c) => c.code === od.country)?.label ?? od.country ?? "";

  // Build profession display names — known IDs get translated, free-text names stay as-is
  const profList: string[] = od.profession
    ? od.profession.split(",").map((raw) => {
        const trimmed = raw.trim();
        return PROFILE_PROFESSIONS.find((p) => p.id === trimmed)?.name ?? trimmed;
      }).filter(Boolean)
    : [];

  const [expanded, setExpanded] = useState(false);
  const visibleProfs = expanded ? profList : profList.slice(0, MAX_VISIBLE_PROFS);
  const hiddenCount  = profList.length - MAX_VISIBLE_PROFS;

  const locationLine = [countryLabel, od.department, od.city].filter(Boolean).join(" · ");

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
      <div className="flex items-start gap-4 px-6 py-5" style={{ backgroundColor: "#0F172A" }}>
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
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <h2 className="text-xl font-bold text-white truncate">{userData.name} {userData.lastName}</h2>
          <p className="text-sm" style={{ color: "#64748B" }}>@{userData.username}</p>

          {/* Profession pills */}
          {visibleProfs.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-0.5">
              {visibleProfs.map((name) => (
                <span
                  key={name}
                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full"
                  style={{ backgroundColor: "rgba(249,115,22,0.18)", color: "#FB923C", border: "1px solid rgba(249,115,22,0.3)" }}
                >
                  {name}
                </span>
              ))}
              {!expanded && hiddenCount > 0 && (
                <button
                  onClick={() => setExpanded(true)}
                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full transition-opacity hover:opacity-75"
                  style={{ backgroundColor: "rgba(148,163,184,0.15)", color: "#94A3B8", border: "1px solid rgba(148,163,184,0.25)" }}
                >
                  +{hiddenCount} más
                </button>
              )}
              {expanded && profList.length > MAX_VISIBLE_PROFS && (
                <button
                  onClick={() => setExpanded(false)}
                  className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full transition-opacity hover:opacity-75"
                  style={{ backgroundColor: "rgba(148,163,184,0.15)", color: "#94A3B8", border: "1px solid rgba(148,163,184,0.25)" }}
                >
                  Ver menos
                </button>
              )}
            </div>
          )}

          {/* Location */}
          {locationLine && (
            <p className="text-[12px] flex items-center gap-1.5 mt-0.5" style={{ color: "#94A3B8" }}>
              <Earth size={12} color="#94A3B8" className="flex-shrink-0" />
              <span className="truncate">{locationLine}</span>
            </p>
          )}

          {/* Address */}
          {od.address && (
            <p className="text-[12px] flex items-center gap-1.5" style={{ color: "#94A3B8" }}>
              <MapPin size={12} color="#94A3B8" className="flex-shrink-0" />
              <span className="truncate">{od.address}</span>
            </p>
          )}
        </div>

        {/* Edit toggle */}
        <button
          onClick={onToggleEdit}
          className="flex items-center gap-1.5 text-sm font-semibold flex-shrink-0 transition-colors mt-0.5"
          style={{ padding: "8px 16px", borderRadius: 8, backgroundColor: isEditing ? "#EA6C10" : "#F97316", color: "#FFFFFF" }}
        >
          {isEditing ? <X size={14} /> : <Pencil size={14} />}
          {isEditing ? "Cancelar" : "Editar perfil"}
        </button>
      </div>
    </div>
  );
}
