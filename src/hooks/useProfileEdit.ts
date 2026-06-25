import { useState, useEffect, useCallback } from "react";
import { AuthService } from "@/services/auth";
import { PROFILE_COUNTRIES } from "@/constants/profile.constants";
import type { ProfileUserData, EditProfileForm } from "@/types/profile.types";

export function useProfileEdit(
  userData: ProfileUserData,
  onSuccess: (patch: Partial<ProfileUserData["onboardingData"]>) => void,
) {
  const [editForm, setEditForm] = useState<EditProfileForm>({
    country:          userData.onboardingData.country          ?? "",
    department:       userData.onboardingData.department       ?? "",
    city:             userData.onboardingData.city             ?? "",
    phoneCountryCode: userData.onboardingData.phoneCountryCode ?? "+57",
    phone:            userData.onboardingData.phone            ?? "",
    address:          userData.onboardingData.address          ?? "",
    profession:       userData.onboardingData.profession       ?? "",
    otherProfession:  userData.onboardingData.otherProfession  ?? "",
  });

  const [departments, setDepartments] = useState<string[]>([]);
  const [cities, setCities]           = useState<string[]>([]);
  const [deptLoading, setDeptLoading] = useState(false);
  const [cityLoading, setCityLoading] = useState(false);

  const [editErrors,  setEditErrors]  = useState<Partial<EditProfileForm>>({});
  const [editLoading, setEditLoading] = useState(false);
  const [editError,   setEditError]   = useState("");
  const [editSuccess, setEditSuccess] = useState(false);

  // ── Fetch departments when country changes ──────────────────────────────────
  const fetchDepartments = useCallback(async (countryCode: string) => {
    if (!countryCode) { setDepartments([]); setCities([]); return; }
    const country = PROFILE_COUNTRIES.find((c) => c.code === countryCode);
    if (!country) { setDepartments([]); setCities([]); return; }
    setDeptLoading(true);
    setDepartments([]);
    setCities([]);
    try {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/states", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: country.name }),
      });
      const json = await res.json();
      if (!json.error && json.data?.states) {
        setDepartments(json.data.states.map((s: { name: string }) => s.name));
      }
    } catch { /* silent */ } finally {
      setDeptLoading(false);
    }
  }, []);

  // ── Fetch cities when department changes ────────────────────────────────────
  const fetchCities = useCallback(async (countryCode: string, department: string) => {
    if (!countryCode || !department) { setCities([]); return; }
    const country = PROFILE_COUNTRIES.find((c) => c.code === countryCode);
    if (!country) return;
    setCityLoading(true);
    setCities([]);
    try {
      const res = await fetch("https://countriesnow.space/api/v0.1/countries/state/cities", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country: country.name, state: department }),
      });
      const json = await res.json();
      if (!json.error && Array.isArray(json.data)) {
        setCities(json.data as string[]);
      }
    } catch { /* silent */ } finally {
      setCityLoading(false);
    }
  }, []);

  // Load departments on mount if country is set
  useEffect(() => {
    if (editForm.country) fetchDepartments(editForm.country);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Load cities on mount if department is set
  useEffect(() => {
    if (editForm.country && editForm.department) fetchCities(editForm.country, editForm.department);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCountryChange = (code: string) => {
    setEditForm((p) => ({ ...p, country: code, department: "", city: "" }));
    fetchDepartments(code);
  };

  const handleDepartmentChange = (dept: string) => {
    setEditForm((p) => ({ ...p, department: dept, city: "" }));
    fetchCities(editForm.country, dept);
  };

  // ── Multi-select professions ────────────────────────────────────────────────
  const parseProfessions = (val: string): string[] =>
    val ? val.split(",").map((s) => s.trim()).filter(Boolean) : [];

  const toggleProfession = (id: string) => {
    const current = parseProfessions(editForm.profession);
    const next = current.includes(id)
      ? current.filter((p) => p !== id)
      : [...current, id];
    setEditForm((p) => ({ ...p, profession: next.join(",") }));
  };

  const toggleOtherProfession = (prof: string) => {
    const current = parseProfessions(editForm.otherProfession);
    const next = current.includes(prof)
      ? current.filter((p) => p !== prof)
      : [...current, prof];
    setEditForm((p) => ({ ...p, otherProfession: next.join(",") }));
  };

  // ── Save ────────────────────────────────────────────────────────────────────
  const handleSaveProfile = async () => {
    const profList = parseProfessions(editForm.profession);
    if (profList.length === 0) {
      setEditErrors({ profession: "Selecciona al menos una profesión" });
      return;
    }
    setEditErrors({});
    setEditLoading(true);
    setEditError("");
    setEditSuccess(false);

    try {
      // Replace "otro" with the specific professions selected inside it
      const otherList    = parseProfessions(editForm.otherProfession);
      const finalProfs   = [
        ...profList.filter((p) => p !== "otro"),
        ...otherList,
      ];
      // Store "otro" IDs are replaced by actual names; persist as comma-separated
      const professionStr = finalProfs.join(",");

      const payload = {
        country:          editForm.country          || null,
        department:       editForm.department       || null,
        city:             editForm.city             || null,
        phoneCountryCode: editForm.phoneCountryCode || null,
        phone:            editForm.phone            || null,
        address:          editForm.address          || null,
        professions:      finalProfs.length > 0 ? finalProfs : null,
        otherProfession:  editForm.otherProfession  || null,
      };

      const response = await AuthService.updateProfileInfo(payload);
      if (!response) throw new Error("Sin respuesta del servidor");

      // Update localStorage
      const stored = localStorage.getItem("user");
      if (stored) {
        const u = JSON.parse(stored);
        localStorage.setItem("user", JSON.stringify({
          ...u,
          onboardingData: {
            ...(u.onboardingData ?? {}),
            ...payload,
            profession: professionStr,
          },
        }));
      }

      onSuccess({
        country:          editForm.country          || null,
        department:       editForm.department       || null,
        city:             editForm.city             || null,
        phoneCountryCode: editForm.phoneCountryCode || null,
        phone:            editForm.phone            || null,
        address:          editForm.address          || null,
        profession:       professionStr             || null,
        otherProfession:  editForm.otherProfession  || null,
      });
      setEditSuccess(true);
      setTimeout(() => setEditSuccess(false), 2000);
    } catch {
      setEditError("No se pudo guardar. Verifica tu conexión e intenta de nuevo.");
    } finally {
      setEditLoading(false);
    }
  };

  return {
    editForm,
    setEditForm,
    editErrors,
    setEditErrors,
    editLoading,
    editError,
    editSuccess,
    departments, deptLoading,
    cities, cityLoading,
    handleCountryChange,
    handleDepartmentChange,
    parseProfessions,
    toggleProfession,
    toggleOtherProfession,
    handleSaveProfile,
  };
}
