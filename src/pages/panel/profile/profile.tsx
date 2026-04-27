import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Camera,
  User,
  Mail,
  ArrowLeft,
  Copy,
  Check,
  Lock,
  Eye,
  EyeOff,
  UserPlus,
  Earth,
  MapPinHouseIcon,
  Pencil,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import RegisterSubuserModal from "../../../components/modal/RegisterSubuserModal";
import LocalStorageService from "../../../services/localstorage";
import useConvertCountry from "../../../hooks/useConvertCountry";
import UpdateModal from "@/components/modal/updateUserInfoModal";
import { AuthService } from "@/services/auth";

interface UpdateUserPayload {
  username?: string;
  name?: string;
  lastName?: string;
}

interface ProfileUserData {
  username: string;
  name: string;
  lastName: string;
  email: string;
  userId: string;
  onboardingData: {
    country: string;
    address: string;
  };
}

const ProfilePage = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [passwordError, setPasswordError] = useState("");
  const [showSubuserModal, setShowSubuserModal] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // Get user data from localStorage
  const [userData, setUserData] = useState<ProfileUserData>(() => {
    const userFromStorage = LocalStorageService.getItem("user");
    return {
      username: userFromStorage.username || "jesuspineda18",
      name: userFromStorage.name || "jesus",
      lastName: userFromStorage.lastName || "pineda gambin",
      email: userFromStorage.email || "jesuspineda18@outlook.es",
      userId: userFromStorage.id || "AB12CD",
      onboardingData: {
        country: userFromStorage.onboardingData?.country || "Colombia",
        address:
          userFromStorage.onboardingData?.address || "Calle 123 #45-67, Bogotá",
      },
    };
  });
  const countryName = useConvertCountry(userData.onboardingData.country);

  const handleSave = async (updatedData: UpdateUserPayload) => {
    await AuthService.updateUser({
      userId: userData.userId,
      email: userData.email,
      username: updatedData.username ?? userData.username,
      name: updatedData.name ?? userData.name,
      lastName: updatedData.lastName ?? userData.lastName,
    });

    setUserData((prev) => ({
      ...prev,
      ...updatedData,
    }));
  };

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(userData.userId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text: ", err);
    }
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setPasswordError("");
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Las contraseñas nuevas no coinciden");
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError("La nueva contraseña debe tener al menos 8 caracteres");
      return;
    }

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
      setShowPasswordForm(false);
    } catch (error) {
      setPasswordError("Error al cambiar la contraseña");
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white mb-8"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Volver</span>
          </button>

          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
            <div className="flex flex-col items-center mb-8">
              <div className="relative group">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-16 h-16 text-gray-400" />
                    </div>
                  )}
                </div>
                <label
                  htmlFor="profile-image"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity duration-200"
                >
                  <Camera className="w-8 h-8 text-white" />
                </label>
                <input
                  id="profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
              </div>
              <h1 className="mt-4 text-2xl font-bold text-gray-900 dark:text-white">
                {userData.name} {userData.lastName}
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                @{userData.username}
              </p>
            </div>
            <div className="flex gap-2">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 2, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center items-center w-fit rounded-2xl py-3 px-5 m-2 gap-2"
              >
                <Earth className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p>Pais</p>
                  <p className="text-sm">{countryName}</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 2, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex justify-center items-center w-fit rounded-2xl py-3 px-5 m-2 gap-2"
              >
                <MapPinHouseIcon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                <div>
                  <p>Dirección</p>
                  <p className="text-sm">{userData.onboardingData.address}</p>
                </div>
              </motion.div>
            </div>
            <div className="space-y-6">
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-xl text-white">
                <div className="p-3 bg-white/20 rounded-lg backdrop-blur-sm">
                  <User className="w-5 h-5" />
                </div>
                <div className="flex-grow">
                  <p className="text-sm text-white/80">ID de Usuario</p>
                  <div className="flex items-center gap-3">
                    <p className="font-mono text-lg font-bold tracking-wider">
                      {userData.userId}
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCopyId}
                      className="p-2 rounded-lg bg-white/20 hover:bg-white/30 transition-colors duration-200"
                    >
                      <AnimatePresence mode="wait">
                        {copied ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Check className="w-4 h-4" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="copy"
                            initial={{ scale: 0, rotate: 180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: -180 }}
                            transition={{ duration: 0.2 }}
                          >
                            <Copy className="w-4 h-4" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nombre completo
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {userData.name} {userData.lastName}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <Mail className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Correo electrónico
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {userData.email}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                  <User className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                </div>
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Nombre de usuario
                  </p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {userData.username}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowModal(true)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 active:scale-95 transition-all"
              >
                <Pencil className="w-4 h-4" />
                Editar perfil
              </button>

              {/* Modal — fuera del div principal, antes del último </> */}
              <AnimatePresence>
                {showModal && (
                  <UpdateModal
                    user={userData}
                    onClose={() => setShowModal(false)}
                    onSave={handleSave}
                  />
                )}
              </AnimatePresence>

              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Administración de Usuarios
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowSubuserModal(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors duration-200"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Crear Subusuario</span>
                  </motion.button>
                </div>
              </div>

              <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Cambiar Contraseña
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="flex items-center gap-2 px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors duration-200"
                  >
                    <Lock className="w-4 h-4" />
                    <span>
                      {showPasswordForm ? "Cancelar" : "Cambiar Contraseña"}
                    </span>
                  </motion.button>
                </div>

                <AnimatePresence>
                  {showPasswordForm && (
                    <motion.form
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      onSubmit={handlePasswordSubmit}
                      className="space-y-4 overflow-hidden"
                    >
                      <div className="relative">
                        <input
                          type={showCurrentPassword ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          placeholder="Contraseña actual"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowCurrentPassword(!showCurrentPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {showCurrentPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          name="newPassword"
                          value={passwordData.newPassword}
                          onChange={handlePasswordChange}
                          placeholder="Nueva contraseña"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {showNewPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={passwordData.confirmPassword}
                          onChange={handlePasswordChange}
                          placeholder="Confirmar nueva contraseña"
                          className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-5 h-5" />
                          ) : (
                            <Eye className="w-5 h-5" />
                          )}
                        </button>
                      </div>

                      {passwordError && (
                        <motion.p
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-red-500 text-sm"
                        >
                          {passwordError}
                        </motion.p>
                      )}

                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        className="w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200 font-medium"
                      >
                        Cambiar Contraseña
                      </motion.button>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>

        <RegisterSubuserModal
          isOpen={showSubuserModal}
          onClose={() => setShowSubuserModal(false)}
          parentUserId={userData.userId}
          onSubuserCreated={() => {
            console.log("Subuser created successfully");
            // You can add a refresh logic here if needed
          }}
        />
      </div>
    </>
  );
};

export default ProfilePage;
