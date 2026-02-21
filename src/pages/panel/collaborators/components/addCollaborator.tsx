import { useState } from "react";
import { X, Plus, UserPlus, Mail, Hash, UserCog } from "lucide-react";
import SongService from "../../../../services/songs";
import { useParams } from "react-router-dom";

export default function AddCollaborator({ compact = false }: { compact?: boolean }) {
  const { id } = useParams();
  const [showCollaboratorsModal, setShowCollaboratorsModal] = useState(false);
  const [method, setMethod] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [role, setRole] = useState("");

  const addNewCollaborator = async () => {
    // Prepare the request payload based on the method
    const requestPayload = {
      songId: id || "",
      ...(method === "email" 
        ? { collaboratorEmail: email } 
        : { collaboratorId: code }
      )
    };

    const response = await SongService.addCollaborator(requestPayload);
    
    if (response !== null) {
      // Reset form and close modal
      resetForm();
    }else{
      alert("Error al agregar el colaborador");
    }
  };

  const resetForm = () => {
    setShowCollaboratorsModal(false);
    setEmail("");
    setCode("");
    setRole("");
  };

  return (
    <>
      {/* Modal */}
      {showCollaboratorsModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setShowCollaboratorsModal(false)}
        >
          <div
            className="bg-white rounded-xl border border-gray-200 max-w-md w-full mx-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-orange-50">
                  <UserPlus className="w-4 h-4 text-[#F97316]" />
                </div>
                <h3 className="text-base font-bold text-gray-900">
                  Añadir colaborador
                </h3>
              </div>
              <button
                className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => setShowCollaboratorsModal(false)}
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-5">
              <p className="text-sm text-gray-500">
                Elige cómo quieres agregar al colaborador al proyecto.
              </p>

              {/* Method toggle */}
              <div className="flex gap-3">
                <button
                  className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                    method === "email"
                      ? "bg-orange-50 border-orange-200 text-[#F97316]"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setMethod("email")}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Mail className="w-4 h-4" />
                    Por correo
                  </div>
                </button>
                <button
                  className={`flex-1 py-2 px-4 rounded-lg border text-sm font-medium transition-colors ${
                    method === "code"
                      ? "bg-orange-50 border-orange-200 text-[#F97316]"
                      : "border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                  onClick={() => setMethod("code")}
                >
                  <div className="flex items-center justify-center gap-2">
                    <Hash className="w-4 h-4" />
                    Por código
                  </div>
                </button>
              </div>

              {/* Inputs */}
              <div className="space-y-3">
                {method === "email" ? (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Mail className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      type="email"
                      placeholder="Correo electrónico"
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                    />
                  </div>
                ) : (
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Hash className="w-4 h-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Código de usuario"
                      className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all"
                    />
                  </div>
                )}
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserCog className="w-4 h-4 text-gray-400" />
                  </div>
                  <select
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-lg border border-gray-200 text-sm focus:border-orange-400 focus:ring-2 focus:ring-orange-100 outline-none transition-all appearance-none bg-white text-gray-700"
                  >
                    <option value="" disabled>
                      Seleccionar rol
                    </option>
                    <option value="singer">Cantante</option>
                    <option value="composer">Compositor</option>
                    <option value="musician">Músico</option>
                    <option value="producer">Productor</option>
                    <option value="arranger">Arreglista</option>
                    <option value="lyricist">Letrista</option>
                    <option value="mixer">Mezclador</option>
                    <option value="mastering">Mastering</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                onClick={() => setShowCollaboratorsModal(false)}
              >
                Cancelar
              </button>
              <button
                className="px-4 py-2 text-sm font-semibold text-white bg-[#F97316] hover:bg-orange-600 rounded-lg transition-colors flex items-center gap-2"
                onClick={() => addNewCollaborator()}
              >
                <UserPlus className="w-4 h-4" />
                Añadir colaborador
              </button>
            </div>
          </div>
        </div>
      )}

      {compact ? (
        <button
          onClick={() => setShowCollaboratorsModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[#F97316] hover:bg-orange-600 text-white text-xs font-semibold rounded-lg transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Agregar colaborador
        </button>
      ) : (
        <button
          className="border border-gray-200 rounded-xl p-5 flex items-center justify-center gap-4 bg-white hover:bg-gray-50 transition-colors w-full col-span-3 row-span-1"
          onClick={() => setShowCollaboratorsModal(true)}
        >
          <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-orange-50">
            <Plus className="w-6 h-6 text-[#F97316]" />
          </div>
          <div className="flex flex-col items-start">
            <span className="font-semibold text-gray-900 text-lg">Agregar</span>
            <span className="text-sm text-gray-500">Nuevo colaborador</span>
          </div>
        </button>
      )}
    </>
  );
}
