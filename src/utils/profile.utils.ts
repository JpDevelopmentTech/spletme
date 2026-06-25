import type { SubprofileItem } from "@/types/profile.types";

/** Genera las iniciales del nombre y apellido para avatares */
export const getInitials = (name: string, lastName: string): string =>
  (name?.charAt(0) ?? "U").toUpperCase() + (lastName?.charAt(0) ?? "").toUpperCase();

const isRecord = (v: unknown): v is Record<string, unknown> => typeof v === "object" && v !== null;

const getString = (src: Record<string, unknown>, keys: string[]): string | undefined => {
  for (const k of keys) {
    const v = src[k];
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return undefined;
};

/** Normaliza cualquier forma de respuesta de la API de subperfiles a un array tipado */
export const extractSubprofiles = (payload: unknown): SubprofileItem[] => {
  const arr: unknown[] = Array.isArray(payload)
    ? payload
    : isRecord(payload)
      ? Array.isArray(payload.data)
        ? payload.data
        : Array.isArray(payload.subusers)
          ? payload.subusers
          : isRecord(payload.data) &&
              Array.isArray((payload.data as Record<string, unknown>).subusers)
            ? ((payload.data as Record<string, unknown>).subusers as unknown[])
            : []
      : [];

  return arr.filter(isRecord).map((item, i) => ({
    id: getString(item, ["id", "_id", "userId"]) ?? `sub-${i}`,
    name: getString(item, ["name", "firstName"]) ?? "Subperfil",
    lastName: getString(item, ["lastName", "surname"]) ?? "",
    username: getString(item, ["username"]) ?? "sin-usuario",
    email: getString(item, ["email"]) ?? "",
  }));
};

/** Clases Tailwind para inputs del formulario de perfil */
export const inputCls = (hasError?: boolean): string =>
  `w-full px-4 py-2.5 rounded-xl text-sm border outline-none transition-colors
   bg-[#F9FAFB] text-[#111827] placeholder:text-[#9CA3AF]
   ${hasError ? "border-red-300 focus:border-red-400" : "border-[#E5E7EB] focus:border-[#F97316]"}`;
