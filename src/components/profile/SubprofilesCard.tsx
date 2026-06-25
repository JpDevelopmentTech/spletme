import {
  UserPlus,
  UserMinus,
  RefreshCcw,
  X,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Check,
} from "lucide-react";
import { getInitials, inputCls } from "@/utils/profile.utils";
import type { SubprofileItem } from "@/types/profile.types";
import type { RegisterSubuserSchema } from "@/types";

interface SubprofilesCardProps {
  subprofiles: SubprofileItem[];
  subLoading: boolean;
  subError: string;
  unlinkingId: string | null;
  confirmingId: string | null;
  unlinkSuccess: string;
  isCreating: boolean;
  createForm: RegisterSubuserSchema;
  createErrors: Partial<RegisterSubuserSchema>;
  createLoading: boolean;
  createError: string;
  createSuccess: boolean;
  onReload: () => void;
  onToggleCreate: () => void;
  onCreateFormChange: (
    field: keyof RegisterSubuserSchema,
    value: string,
  ) => void;
  onCreateSubmit: (e: React.FormEvent) => void;
  onConfirmUnlink: (id: string) => void;
  onCancelUnlink: () => void;
  onUnlink: (id: string) => void;
}

/**
 * Sección de gestión de subperfiles: lista, creación y desvinculación.
 */
export function SubprofilesCard({
  subprofiles,
  subLoading,
  subError,
  unlinkingId,
  confirmingId,
  unlinkSuccess,
  isCreating,
  createForm,
  createErrors,
  createLoading,
  createError,
  createSuccess,
  onReload,
  onToggleCreate,
  onCreateFormChange,
  onCreateSubmit,
  onConfirmUnlink,
  onCancelUnlink,
  onUnlink,
}: SubprofilesCardProps) {
  const hasBorder = subprofiles.length > 0 || isCreating;

  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
      {/* Header */}
      <div
        className="flex items-center gap-4 px-5 py-4"
        style={{ borderBottom: hasBorder ? "1px solid #E5E7EB" : undefined }}
      >
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[15px] font-semibold text-[#111827]">
            Subperfiles
          </span>
          <span className="text-xs text-[#6B7280]">
            {subLoading
              ? "Cargando..."
              : `${subprofiles.length} subperfil${subprofiles.length !== 1 ? "es" : ""} vinculado${subprofiles.length !== 1 ? "s" : ""}`}
          </span>
        </div>
        <button
          onClick={onReload}
          className="flex-shrink-0 rounded-lg p-2 transition-colors hover:bg-[#F3F4F6]"
          title="Recargar"
        >
          <RefreshCcw
            size={14}
            color="#9CA3AF"
            className={subLoading ? "animate-spin" : ""}
          />
        </button>
        <button
          onClick={onToggleCreate}
          className="flex flex-shrink-0 items-center gap-1.5 text-sm font-semibold text-white transition-colors"
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            backgroundColor: isCreating ? "#EA6C10" : "#F97316",
          }}
        >
          {isCreating ? <X size={14} /> : <UserPlus size={14} />}
          {isCreating ? "Cancelar" : "Crear subperfil"}
        </button>
      </div>

      {/* Feedback messages */}
      {(subError || unlinkSuccess) && (
        <div className="px-5 pt-3">
          {subError && (
            <div
              className="mb-2 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-red-600"
              style={{
                backgroundColor: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <AlertCircle size={14} className="flex-shrink-0" /> {subError}
            </div>
          )}
          {unlinkSuccess && (
            <div
              className="mb-2 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-green-700"
              style={{
                backgroundColor: "rgba(34,197,94,0.06)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <CheckCircle2 size={14} className="flex-shrink-0" />{" "}
              {unlinkSuccess}
            </div>
          )}
        </div>
      )}

      {/* Create form */}
      {isCreating && (
        <form
          onSubmit={onCreateSubmit}
          className="border-b border-[#E5E7EB] px-5 py-4"
        >
          <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-[#9CA3AF]">
            Nuevo subperfil
          </p>
          {createError && (
            <div
              className="mb-3 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-red-600"
              style={{
                backgroundColor: "rgba(239,68,68,0.06)",
                border: "1px solid rgba(239,68,68,0.2)",
              }}
            >
              <AlertCircle size={14} className="flex-shrink-0" /> {createError}
            </div>
          )}
          {createSuccess && (
            <div
              className="mb-3 flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-green-700"
              style={{
                backgroundColor: "rgba(34,197,94,0.06)",
                border: "1px solid rgba(34,197,94,0.2)",
              }}
            >
              <CheckCircle2 size={14} className="flex-shrink-0" /> Subperfil
              creado. Se envió un código de verificación al correo.
            </div>
          )}
          <div className="mb-3 grid grid-cols-2 gap-3">
            {(["name", "lastName"] as const).map((field) => (
              <div key={field}>
                <label className="mb-1.5 block text-xs font-semibold text-[#6B7280]">
                  {field === "name" ? "Nombre" : "Apellido"} *
                </label>
                <input
                  type="text"
                  value={createForm[field]}
                  onChange={(e) => onCreateFormChange(field, e.target.value)}
                  placeholder={field === "name" ? "Juan" : "Pérez"}
                  className={inputCls(!!createErrors[field])}
                  disabled={createLoading || createSuccess}
                />
                {createErrors[field] && (
                  <p className="mt-1 text-xs text-red-500">
                    {createErrors[field]}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="mb-3">
            <label className="mb-1.5 block text-xs font-semibold text-[#6B7280]">
              Usuario *
            </label>
            <input
              type="text"
              value={createForm.username}
              onChange={(e) => onCreateFormChange("username", e.target.value)}
              placeholder="juanperez"
              className={inputCls(!!createErrors.username)}
              disabled={createLoading || createSuccess}
            />
            {createErrors.username && (
              <p className="mt-1 text-xs text-red-500">
                {createErrors.username}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label className="mb-1.5 block text-xs font-semibold text-[#6B7280]">
              Correo electrónico *
            </label>
            <input
              type="email"
              value={createForm.email}
              onChange={(e) => onCreateFormChange("email", e.target.value)}
              placeholder="juan@ejemplo.com"
              className={inputCls(!!createErrors.email)}
              disabled={createLoading || createSuccess}
            />
            {createErrors.email && (
              <p className="mt-1 text-xs text-red-500">{createErrors.email}</p>
            )}
          </div>
          <button
            type="submit"
            disabled={createLoading || createSuccess}
            className="flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
            style={{ backgroundColor: "#F97316" }}
          >
            {createLoading ? (
              <>
                <Loader2 size={15} className="animate-spin" /> Creando...
              </>
            ) : createSuccess ? (
              <>
                <Check size={15} /> Creado
              </>
            ) : (
              <>
                <UserPlus size={15} /> Crear subperfil
              </>
            )}
          </button>
        </form>
      )}

      {/* List */}
      {subLoading ? (
        <div className="flex items-center justify-center gap-2 py-8 text-sm text-[#9CA3AF]">
          <Loader2 size={16} className="animate-spin" /> Cargando subperfiles...
        </div>
      ) : subprofiles.length === 0 && !isCreating ? (
        <div className="flex flex-col items-center justify-center gap-2 py-10">
          <p className="text-sm font-medium text-[#6B7280]">
            Sin subperfiles vinculados
          </p>
          <p className="text-xs text-[#9CA3AF]">
            Usa el botón "Crear subperfil" para agregar uno.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#E5E7EB]">
          {subprofiles.map((s) => {
            const isConfirming = confirmingId === s.id;
            const isUnlinking = unlinkingId === s.id;
            return (
              <div key={s.id} className="flex items-center gap-3 px-5 py-3.5">
                <div
                  className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold"
                  style={{ backgroundColor: "#F3F4F6", color: "#6B7280" }}
                >
                  {getInitials(s.name, s.lastName)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-[#111827]">
                    {s.name} {s.lastName}
                  </p>
                  <p className="truncate text-xs text-[#9CA3AF]">
                    @{s.username} · {s.email}
                  </p>
                </div>
                {isConfirming ? (
                  <div className="flex flex-shrink-0 items-center gap-2">
                    <button
                      onClick={() => onUnlink(s.id)}
                      disabled={isUnlinking}
                      className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-60"
                      style={{ backgroundColor: "#EF4444" }}
                    >
                      {isUnlinking && (
                        <Loader2 size={12} className="animate-spin" />
                      )}
                      Confirmar
                    </button>
                    <button
                      onClick={onCancelUnlink}
                      disabled={isUnlinking}
                      className="rounded-lg px-3 py-1.5 text-xs font-medium text-[#6B7280] transition-colors hover:bg-[#F3F4F6]"
                    >
                      Cancelar
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => onConfirmUnlink(s.id)}
                    className="flex flex-shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-red-500 transition-colors"
                    style={{ border: "1px solid rgba(239,68,68,0.2)" }}
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
  );
}
