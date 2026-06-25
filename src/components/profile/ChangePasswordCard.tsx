import {
  Lock,
  ChevronDown,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Loader2,
  Check,
} from "lucide-react";
import { inputCls } from "@/utils/profile.utils";

interface PwdForm {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface PwdShow {
  current: boolean;
  next: boolean;
  confirm: boolean;
}

interface ChangePasswordCardProps {
  isOpen: boolean;
  pwdForm: PwdForm;
  pwdShow: PwdShow;
  pwdError: string;
  pwdSuccess: string;
  pwdLoading: boolean;
  onToggle: () => void;
  onFormChange: (field: keyof PwdForm, value: string) => void;
  onToggleShow: (field: keyof PwdShow) => void;
  onSubmit: (e: React.FormEvent) => void;
}

interface PasswordFieldProps {
  label: string;
  value: string;
  show: boolean;
  placeholder: string;
  disabled: boolean;
  onChange: (v: string) => void;
  onToggleShow: () => void;
}

function PasswordField({
  label,
  value,
  show,
  placeholder,
  disabled,
  onChange,
  onToggleShow,
}: PasswordFieldProps) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold text-[#6B7280]">
        {label} *
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={inputCls() + " pr-10"}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={onToggleShow}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-[#9CA3AF] hover:text-[#6B7280]"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

/**
 * Sección colapsable de cambio de contraseña con validación y feedback.
 */
export function ChangePasswordCard({
  isOpen,
  pwdForm,
  pwdShow,
  pwdError,
  pwdSuccess,
  pwdLoading,
  onToggle,
  onFormChange,
  onToggleShow,
  onSubmit,
}: ChangePasswordCardProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white">
      <button
        onClick={onToggle}
        className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors hover:bg-[#FAFAFA]"
      >
        <div
          className="flex flex-shrink-0 items-center justify-center"
          style={{
            width: 38,
            height: 38,
            borderRadius: 10,
            backgroundColor: "#F3F4F6",
          }}
        >
          <Lock size={17} color="#6B7280" />
        </div>
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <span className="text-[15px] font-semibold text-[#111827]">
            Cambiar contraseña
          </span>
          <span className="text-xs text-[#6B7280]">
            Actualiza tu contraseña de acceso
          </span>
        </div>
        <ChevronDown
          size={18}
          color="#9CA3AF"
          className="flex-shrink-0 transition-transform duration-200"
          style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }}
        />
      </button>

      {isOpen && (
        <form
          onSubmit={onSubmit}
          className="border-t border-[#E5E7EB] px-5 pb-5 pt-4"
        >
          <div className="flex flex-col gap-3">
            <PasswordField
              label="Contraseña actual"
              value={pwdForm.currentPassword}
              show={pwdShow.current}
              placeholder="••••••••"
              disabled={pwdLoading}
              onChange={(v) => onFormChange("currentPassword", v)}
              onToggleShow={() => onToggleShow("current")}
            />
            <PasswordField
              label="Nueva contraseña"
              value={pwdForm.newPassword}
              show={pwdShow.next}
              placeholder="Mínimo 8 caracteres"
              disabled={pwdLoading}
              onChange={(v) => onFormChange("newPassword", v)}
              onToggleShow={() => onToggleShow("next")}
            />
            <PasswordField
              label="Confirmar nueva contraseña"
              value={pwdForm.confirmPassword}
              show={pwdShow.confirm}
              placeholder="Repite la nueva contraseña"
              disabled={pwdLoading}
              onChange={(v) => onFormChange("confirmPassword", v)}
              onToggleShow={() => onToggleShow("confirm")}
            />

            {pwdError && (
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-red-600"
                style={{
                  backgroundColor: "rgba(239,68,68,0.06)",
                  border: "1px solid rgba(239,68,68,0.2)",
                }}
              >
                <AlertCircle size={14} className="flex-shrink-0" /> {pwdError}
              </div>
            )}
            {pwdSuccess && (
              <div
                className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm text-green-700"
                style={{
                  backgroundColor: "rgba(34,197,94,0.06)",
                  border: "1px solid rgba(34,197,94,0.2)",
                }}
              >
                <CheckCircle2 size={14} className="flex-shrink-0" />{" "}
                {pwdSuccess}
              </div>
            )}

            <button
              type="submit"
              disabled={pwdLoading || !!pwdSuccess}
              className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold text-white transition-opacity disabled:opacity-60"
              style={{ backgroundColor: "#111827" }}
            >
              {pwdLoading ? (
                <>
                  <Loader2 size={15} className="animate-spin" /> Guardando...
                </>
              ) : pwdSuccess ? (
                <>
                  <Check size={15} /> Contraseña actualizada
                </>
              ) : (
                <>
                  <Lock size={15} /> Cambiar contraseña
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
