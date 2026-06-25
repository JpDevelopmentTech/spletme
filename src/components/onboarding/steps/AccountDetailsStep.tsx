import { useState, useEffect } from "react";
import { OnboardingData } from "../../../services/onboarding";

interface AccountDetailsStepProps {
  nextStep: (data?: Partial<OnboardingData>) => void;
  prevStep: () => void;
  initialData?: OnboardingData;
}

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

const inputStyle = (hasError: boolean): React.CSSProperties => ({
  width: "100%",
  height: 46,
  borderRadius: 10,
  border: `1px solid ${hasError ? "#FCA5A5" : "#E5E7EB"}`,
  backgroundColor: hasError ? "#FEF2F2" : "#FFFFFF",
  padding: "0 14px",
  fontSize: 14,
  color: "#111827",
  outline: "none",
});

const AccountDetailsStep = ({
  nextStep,
  prevStep,
  initialData,
}: AccountDetailsStepProps) => {
  const [formData, setFormData] = useState({
    country: "",
    phone: "",
    address: "",
    identification: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData) {
      setFormData({
        country: initialData.country || "",
        phone: initialData.phone || "",
        address: initialData.address || "",
        identification: initialData.identification || "",
      });
    }
  }, [initialData]);

  const set = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.country) e.country = "Selecciona tu país";
    if (!formData.phone) e.phone = "El teléfono es requerido";
    else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phone))
      e.phone = "Ingresa un teléfono válido";
    if (!formData.address) e.address = "La dirección es requerida";
    else if (formData.address.length < 10)
      e.address = "Ingresa una dirección más específica";
    if (!formData.identification)
      e.identification = "La identificación es requerida";
    else if (!/^\d{6,}$/.test(formData.identification))
      e.identification = "Ingresa un número válido";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) {
      nextStep({
        country: formData.country,
        phone: formData.phone,
        address: formData.address,
        identification: formData.identification,
      });
    }
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col gap-1">
        <h2 className="text-[22px] font-bold text-[#111827]">
          Tus datos personales
        </h2>
        <p className="text-sm text-[#6B7280]">
          Completa tu información para configurar tu cuenta
        </p>
      </div>

      {/* Fields */}
      <div className="flex flex-col gap-4">
        {/* Country */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#374151]">
            País de residencia <span className="text-red-500">*</span>
          </label>
          <select
            value={formData.country}
            onChange={(e) => set("country", e.target.value)}
            style={inputStyle(!!errors.country)}
          >
            <option value="">Selecciona tu país</option>
            {COUNTRIES.map((c) => (
              <option key={c.code} value={c.code}>
                {c.name}
              </option>
            ))}
          </select>
          {errors.country && (
            <p className="text-xs text-red-500">{errors.country}</p>
          )}
        </div>

        {/* Phone */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#374151]">
            Número de teléfono <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="+57 300 123 4567"
            style={inputStyle(!!errors.phone)}
          />
          {errors.phone && (
            <p className="text-xs text-red-500">{errors.phone}</p>
          )}
        </div>

        {/* Address */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#374151]">
            Dirección de residencia <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => set("address", e.target.value)}
            placeholder="Calle 123 #45-67, Bogotá"
            style={inputStyle(!!errors.address)}
          />
          {errors.address && (
            <p className="text-xs text-red-500">{errors.address}</p>
          )}
        </div>

        {/* Identification */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-[#374151]">
            Número de identificación <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.identification}
            onChange={(e) => set("identification", e.target.value)}
            placeholder="1234567890"
            style={inputStyle(!!errors.identification)}
          />
          {errors.identification && (
            <p className="text-xs text-red-500">{errors.identification}</p>
          )}
        </div>
      </div>

      {/* Security note */}
      <div
        className="flex items-start gap-3"
        style={{
          backgroundColor: "#F9FAFB",
          borderRadius: 10,
          border: "1px solid #E5E7EB",
          padding: 14,
        }}
      >
        <span className="text-lg">🔒</span>
        <div>
          <p className="text-sm font-semibold text-[#111827]">
            Tu información está segura
          </p>
          <p className="mt-0.5 text-xs text-[#6B7280]">
            Utilizamos encriptación de nivel bancario para proteger tus datos.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3">
        <button
          onClick={prevStep}
          className="flex-1 font-semibold text-[#374151] transition-colors hover:bg-[#E5E7EB]"
          style={{ height: 46, borderRadius: 10, backgroundColor: "#F4F4F5" }}
        >
          Anterior
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 font-semibold text-white transition-opacity hover:opacity-90"
          style={{ height: 46, borderRadius: 10, backgroundColor: "#F97316" }}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default AccountDetailsStep;
