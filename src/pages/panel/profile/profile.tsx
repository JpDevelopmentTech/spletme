import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import LocalStorageService from "@/services/localstorage";
import { useProfileEdit } from "@/hooks/useProfileEdit";
import { useSubprofiles } from "@/hooks/useSubprofiles";
import { useChangePassword } from "@/hooks/useChangePassword";
import { ProfileHeroCard } from "@/components/profile/ProfileHeroCard";
import { ProfileInfoCard } from "@/components/profile/ProfileInfoCard";
import { ProfileDetailsCard } from "@/components/profile/ProfileDetailsCard";
import { SubprofilesCard } from "@/components/profile/SubprofilesCard";
import { ChangePasswordCard } from "@/components/profile/ChangePasswordCard";
import { ProfileSuccessPopup } from "@/components/modal/ProfileSuccessPopup";
import type { ActiveSection, ProfileUserData, EditProfileForm } from "@/types/profile.types";
import type { RegisterSubuserSchema } from "@/types";

const ProfilePage = () => {
  const [profileImage, setProfileImage]     = useState<string | null>(null);
  const [copied, setCopied]                 = useState(false);
  const [activeSection, setActiveSection]   = useState<ActiveSection>(null);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [userData, setUserData] = useState<ProfileUserData>(() => {
    const u = LocalStorageService.getItem("user");
    return {
      username:  u.username ?? "",
      name:      u.name     ?? "",
      lastName:  u.lastName ?? "",
      email:     u.email    ?? "",
      userId:    u.id       ?? u._id ?? "",
      onboardingData: {
        country:          u.onboardingData?.country                                          ?? null,
        department:       u.onboardingData?.department ?? u.onboardingData?.state           ?? null,
        city:             u.onboardingData?.city                                            ?? null,
        phoneCountryCode: u.onboardingData?.phoneCountryCode ?? u.onboardingData?.phoneCode ?? null,
        phone:            u.onboardingData?.phone                                           ?? null,
        address:          u.onboardingData?.address                                         ?? null,
        profession:       u.onboardingData?.profession                                      ?? null,
        otherProfession:  u.onboardingData?.otherProfession                                 ?? null,
      },
    };
  });

  const profileEdit = useProfileEdit(userData, (patch) => {
    setUserData((prev) => ({ ...prev, onboardingData: { ...prev.onboardingData, ...patch } }));
    setShowSuccessPopup(true);
    setTimeout(() => {
      setShowSuccessPopup(false);
      setActiveSection(null);
    }, 2500);
  });

  const subprofiles    = useSubprofiles(userData.userId);
  const changePassword = useChangePassword(() => setActiveSection(null));

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(userData.userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
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

  const isEditingDetails = activeSection === "edit-details";

  return (
    <div className="min-h-screen bg-[#F7F8FA] px-10 py-8 relative">
      <ProfileSuccessPopup isOpen={showSuccessPopup} />

      {/* ── Main column — width never changes ─────────────────────────────────── */}
      <div style={{ maxWidth: 680 }}>
        <div className="mb-6 flex flex-col gap-1.5">
          <h1 className="text-2xl font-bold text-[#111827]">Mi Perfil</h1>
          <div className="h-0.5 w-10 rounded-full bg-[#F97316]" />
        </div>

        <div className="flex flex-col gap-4">
          <ProfileHeroCard
            userData={userData}
            profileImage={profileImage}
            isEditing={isEditingDetails}
            onImageChange={handleImageChange}
            onToggleEdit={() => toggleSection("edit-details")}
          />

          <ProfileInfoCard userData={userData} copied={copied} onCopyId={handleCopyId} />

          <SubprofilesCard
            subprofiles={subprofiles.subprofiles}
            subLoading={subprofiles.subLoading}
            subError={subprofiles.subError}
            unlinkingId={subprofiles.unlinkingId}
            confirmingId={subprofiles.confirmingId}
            unlinkSuccess={subprofiles.unlinkSuccess}
            isCreating={activeSection === "create-subprofile"}
            createForm={subprofiles.createForm}
            createErrors={subprofiles.createErrors}
            createLoading={subprofiles.createLoading}
            createError={subprofiles.createError}
            createSuccess={subprofiles.createSuccess}
            onReload={() => void subprofiles.loadSubprofiles()}
            onToggleCreate={() => toggleSection("create-subprofile")}
            onCreateFormChange={(field: keyof RegisterSubuserSchema, value: string) =>
              subprofiles.setCreateForm((prev) => ({ ...prev, [field]: value }))
            }
            onCreateSubmit={(e) =>
              void subprofiles.handleCreateSubprofile(e, () => setActiveSection(null))
            }
            onConfirmUnlink={subprofiles.setConfirmingId}
            onCancelUnlink={() => subprofiles.setConfirmingId(null)}
            onUnlink={(id) => void subprofiles.handleUnlink(id)}
          />

          <ChangePasswordCard
            isOpen={activeSection === "change-password"}
            pwdForm={changePassword.pwdForm}
            pwdShow={changePassword.pwdShow}
            pwdError={changePassword.pwdError}
            pwdSuccess={changePassword.pwdSuccess}
            pwdLoading={changePassword.pwdLoading}
            onToggle={() => toggleSection("change-password")}
            onFormChange={(field, value) =>
              changePassword.setPwdForm((prev) => ({ ...prev, [field]: value }))
            }
            onToggleShow={(field) =>
              changePassword.setPwdShow((prev) => ({
                ...prev,
                [field]: !prev[field],
              }))
            }
            onSubmit={changePassword.handleChangePassword}
          />
        </div>
      </div>

      {/* ── Edit drawer — slides in from the right, layout principal intacto ─── */}
      <AnimatePresence>
        {isEditingDetails && (
          <>
            {/* Backdrop semitransparente */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/20"
              onClick={() => setActiveSection(null)}
            />

            {/* Panel lateral */}
            <motion.div
              initial={{ x: "100%", opacity: 0 }}
              animate={{ x: 0,      opacity: 1 }}
              exit={{   x: "100%", opacity: 0 }}
              transition={{ duration: 0.28, ease: [0.4, 0, 0.2, 1] }}
              className="fixed top-0 right-0 bottom-0 z-50 flex flex-col bg-[#F7F8FA] shadow-2xl overflow-y-auto"
              style={{ width: 480 }}
            >
              {/* Panel header */}
              <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-[#E5E7EB] flex-shrink-0">
                <div>
                  <p className="text-[15px] font-bold text-[#111827]">Editar información</p>
                  <p className="text-xs text-[#9CA3AF]">Ubicación, contacto y profesión</p>
                </div>
                <button
                  onClick={() => setActiveSection(null)}
                  className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors text-[#9CA3AF] hover:text-[#111827]"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Panel content */}
              <div className="flex-1 p-4">
                <ProfileDetailsCard
                  userData={userData}
                  editForm={profileEdit.editForm}
                  editErrors={profileEdit.editErrors}
                  editLoading={profileEdit.editLoading}
                  editError={profileEdit.editError}
                  editSuccess={profileEdit.editSuccess}
                  departments={profileEdit.departments}
                  deptLoading={profileEdit.deptLoading}
                  cities={profileEdit.cities}
                  cityLoading={profileEdit.cityLoading}
                  parseProfessions={profileEdit.parseProfessions}
                  onToggleEdit={() => setActiveSection(null)}
                  onCountryChange={profileEdit.handleCountryChange}
                  onDepartmentChange={profileEdit.handleDepartmentChange}
                  onEditFormChange={(field: keyof EditProfileForm, value: string) =>
                    profileEdit.setEditForm((prev) => ({ ...prev, [field]: value }))
                  }
                  onToggleProfession={profileEdit.toggleProfession}
                  onToggleOther={profileEdit.toggleOtherProfession}
                  onSaveProfile={profileEdit.handleSaveProfile}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfilePage;
