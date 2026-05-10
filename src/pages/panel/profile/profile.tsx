import { useState } from "react";
import {
  Camera,
  User,
  Mail,
  Copy,
  Check,
  Lock,
  UserPlus,
  AtSign,
  Pencil,
  Hash,
  MapPin,
  Earth,
  AudioWaveform,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import RegisterSubuserModal from "../../../components/modal/RegisterSubuserModal";
import SubprofileManagementModal from "../../../components/modal/SubprofileManagementModal";
import LocalStorageService from "../../../services/localstorage";
import UpdateModal from "@/components/modal/updateUserInfoModal";
import { AuthService } from "@/services/auth";
import useConvertCountry from "@/hooks/useConvertCountry";

interface EditUserPayload {
  country?: string | null;
  profession?: string | null;
  otherProfession?: string | null;
  address?: string | null;
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showSubuserModal, setShowSubuserModal] = useState(false);
  const [showSubprofileManagementModal, setShowSubprofileManagementModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);

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
  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(userData.userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // clipboard not available
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setProfileImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSaveProfile = async (updatedData: EditUserPayload) => {
    const response = await AuthService.updateProfileInfo(updatedData);

    if (!response) {
      throw new Error("No se pudo actualizar el perfil. Verifica tu conexión e intenta de nuevo.");
    }

    setUserData((prev) => ({
      ...prev,
      onboardingData: {
        ...prev.onboardingData,
        ...updatedData,
      },
    }));

    const stored = localStorage.getItem("user");
    if (stored) {
      const user = JSON.parse(stored);
      localStorage.setItem(
        "user",
        JSON.stringify({
          ...user,
          onboardingData: {
            ...(user.onboardingData || {}),
            ...updatedData,
          },
        })
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] px-10 py-8">
      <div style={{ maxWidth: 680 }}>

        {/* Page title */}
        <div className="flex flex-col gap-1.5 mb-6">
          <h1 className="text-2xl font-bold text-[#111827]">Mi Perfil</h1>
          <div className="w-10 h-0.5 rounded-full bg-[#F97316]" />
        </div>

        <div className="flex flex-col gap-4">

          {/* ── Profile hero card ── */}
          <div
            className="overflow-hidden"
            style={{ borderRadius: 16, border: "1px solid #E5E7EB", backgroundColor: "#FFFFFF" }}
          >
            <div
              className="flex items-center gap-4 px-6 py-5"
              style={{ backgroundColor: "#0F172A" }}
            >
              {/* Avatar */}
              <div className="relative group flex-shrink-0">
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
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User size={36} color="#64748B" />
                  )}
                </div>
                <label
                  htmlFor="profile-image"
                  className="absolute inset-0 flex items-center justify-center rounded-full cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                >
                  <Camera size={20} color="#FFFFFF" />
                </label>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>

              {/* Name + username */}
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white truncate">
                  {userData.name} {userData.lastName}
                </h2>
                <p className="text-sm truncate" style={{ color: "#94A3B8" }}>
                  @{userData.username}
                </p>
                  <div className="flex gap-3 mt-1">
                    {userData.onboardingData?.profession && (
                      <p className="text-sm flex items-center gap-1" style={{ color: "#94A3B8" }}>
                        <AudioWaveform size={14} color="#94A3B8" className="" />
                        {userData.onboardingData.profession}
                      </p>
                    )}
                    {userData.onboardingData?.country && (
                      <p className="text-sm flex items-center gap-1" style={{ color: "#94A3B8" }}>
                        <Earth size={14} color="#94A3B8" className="" />
                        {convertCountry}
                      </p>
                    )}
                    {userData.onboardingData?.country && (
                      <p className="text-sm flex items-center gap-1" style={{ color: "#94A3B8" }}>
                        <MapPin size={14} color="#94A3B8" className="" />
                        {userData.onboardingData.address}
                      </p>
                    )}
                  </div>
              </div>

              {/* Edit button */}
              <button
                onClick={() => setShowEditModal(true)}
                className="flex items-center gap-1.5 text-sm font-semibold text-white flex-shrink-0 transition-opacity hover:opacity-90"
                style={{ padding: "8px 16px", borderRadius: 8, backgroundColor: "#F97316" }}
              >
                <Pencil size={14} />
                Editar perfil
              </button>
            </div>
          </div>

          {/* ── Info card ── */}
          <div
            className="overflow-hidden"
            style={{ borderRadius: 16, border: "1px solid #E5E7EB", backgroundColor: "#FFFFFF" }}
          >
            {/* User ID */}
            <div
              className="flex items-center gap-3 px-5"
              style={{ height: 60, backgroundColor: "#FFF7ED", borderBottom: "1px solid #E5E7EB" }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: "#FDBA74" }}
              >
                <Hash size={16} color="#FFFFFF" />
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-[11px] font-medium" style={{ color: "#9CA3AF" }}>
                  ID de Usuario
                </span>
                <span className="text-sm font-bold truncate" style={{ color: "#92400E" }}>
                  {userData.userId}
                </span>
              </div>
              <button
                onClick={handleCopyId}
                className="flex items-center justify-center flex-shrink-0 transition-opacity hover:opacity-80"
                style={{ width: 32, height: 32, borderRadius: 6, backgroundColor: "#F97316" }}
              >
                {copied ? (
                  <Check size={14} color="#FFFFFF" />
                ) : (
                  <Copy size={14} color="#FFFFFF" />
                )}
              </button>
            </div>

            {/* Full name */}
            <div
              className="flex items-center gap-3 px-5"
              style={{ height: 60, borderBottom: "1px solid #E5E7EB" }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: "#F3F4F6" }}
              >
                <User size={16} color="#9CA3AF" />
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-[11px] font-medium" style={{ color: "#9CA3AF" }}>
                  Nombre completo
                </span>
                <span className="text-sm font-medium text-[#111827] truncate">
                  {userData.name} {userData.lastName}
                </span>
              </div>
            </div>

            {/* Email */}
            <div
              className="flex items-center gap-3 px-5"
              style={{ height: 60, borderBottom: "1px solid #E5E7EB" }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: "#F3F4F6" }}
              >
                <Mail size={16} color="#9CA3AF" />
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-[11px] font-medium" style={{ color: "#9CA3AF" }}>
                  Correo electrónico
                </span>
                <span className="text-sm font-medium text-[#111827] truncate">
                  {userData.email}
                </span>
              </div>
            </div>

            {/* Username */}
            <div
              className="flex items-center gap-3 px-5"
              style={{ height: 60 }}
            >
              <div
                className="flex items-center justify-center flex-shrink-0"
                style={{ width: 36, height: 36, borderRadius: 8, backgroundColor: "#F3F4F6" }}
              >
                <AtSign size={16} color="#9CA3AF" />
              </div>
              <div className="flex flex-col gap-0.5 flex-1 min-w-0">
                <span className="text-[11px] font-medium" style={{ color: "#9CA3AF" }}>
                  Nombre de usuario
                </span>
                <span className="text-sm font-medium text-[#111827] truncate">
                  @{userData.username}
                </span>
              </div>
            </div>
          </div>

          {/* ── Subprofiles ── */}
          <div
            className="flex items-center gap-4 px-5 py-4"
            style={{ borderRadius: 16, border: "1px solid #E5E7EB", backgroundColor: "#FFFFFF" }}
          >
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <span className="text-[15px] font-semibold text-[#111827]">Subperfiles</span>
              <span className="text-xs text-[#6B7280]">
                Gestiona los subperfiles vinculados a tu cuenta
              </span>
            </div>
            <button
              onClick={() => setShowSubprofileManagementModal(true)}
              className="flex items-center gap-1.5 text-sm font-semibold text-white flex-shrink-0 transition-opacity hover:opacity-90"
              style={{ padding: "8px 14px", borderRadius: 8, backgroundColor: "#F97316" }}
            >
              <UserPlus size={14} />
              Gestionar
            </button>
          </div>

          {/* ── Change password ── */}
          <div
            className="flex items-center gap-4 px-5 py-4"
            style={{ borderRadius: 16, border: "1px solid #E5E7EB", backgroundColor: "#FFFFFF" }}
          >
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              <span className="text-[15px] font-semibold text-[#111827]">Cambiar contraseña</span>
              <span className="text-xs text-[#6B7280]">
                Actualiza tu contraseña de acceso
              </span>
            </div>
            <button
              onClick={() => navigate("/panel/change-password")}
              className="flex items-center gap-1.5 text-sm font-semibold text-white flex-shrink-0 transition-opacity hover:opacity-90"
              style={{ padding: "8px 14px", borderRadius: 8, backgroundColor: "#111827" }}
            >
              <Lock size={14} />
              Cambiar contraseña
            </button>
          </div>

        </div>
      </div>

      {/* Modals */}
      <SubprofileManagementModal
        isOpen={showSubprofileManagementModal}
        onClose={() => setShowSubprofileManagementModal(false)}
        onOpenCreateSubprofile={() => setShowSubuserModal(true)}
      />

      {showEditModal && (
        <UpdateModal
          user={userData}
          onClose={() => setShowEditModal(false)}
          onSave={handleSaveProfile}
        />
      )}

      <RegisterSubuserModal
        isOpen={showSubuserModal}
        onClose={() => setShowSubuserModal(false)}
        parentUserId={userData.userId}
        onSubuserCreated={() => {
          console.log("Subuser created successfully");
        }}
      />
    </div>
  );
};

export default ProfilePage;
