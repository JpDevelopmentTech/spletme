import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LabelsService from "../../services/labels";
import { InviteAuthGate } from "@/components/invitations/InviteAuthGate";
import { clearPendingInvite, readInviteEmail } from "@/utils/pendingInvite";
import { isSignedIn } from "@/utils/session";
import {
  Layers,
  Tag,
  Music2,
  Check,
  X,
  AlertTriangle,
  Loader2,
  Users,
  Sparkles,
} from "lucide-react";

// Interfaces para tipado TypeScript - Estructura real del JWT
interface JWTPayload {
  type?: "label_collaboration";
  labelType?: "artistic" | "custom";
  labelIdentifier?: string;
  labelName?: string;
  ownerId?: string;
  collaboratorId?: string;
  collaboratorName?: string;
  totalSongs?: number;
  exp?: number;
  iat?: number;
}

interface InvitationData {
  labelName: string;
  labelType: "artistic" | "custom";
  ownerName: string;
  totalSongs: number;
  collaboratorName: string;
}

const AcceptLabelCollaboration = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState("");
  const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [result, setResult] = useState<{
    labelName: string;
    songsAdded: number;
    alreadyCollaborator: number;
  } | null>(null);

  // Función para decodificar JWT manualmente (sin librería externa)
  const decodeJWT = (token: string): JWTPayload => {
    try {
      // Un JWT tiene 3 partes separadas por puntos: header.payload.signature
      const parts = token.split(".");
      if (parts.length !== 3) {
        throw new Error("Token JWT inválido");
      }

      // Decodificar la parte del payload (segunda parte)
      const payload = parts[1];

      // Añadir padding si es necesario para base64
      const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);

      // Decodificar de base64
      const decodedPayload = atob(paddedPayload.replace(/-/g, "+").replace(/_/g, "/"));

      // Parsear JSON
      return JSON.parse(decodedPayload) as JWTPayload;
    } catch (error) {
      console.error("Error decodificando JWT:", error);
      throw new Error("Token inválido o corrupto");
    }
  };

  // Extract token from URL query parameters
  React.useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const tokenFromUrl = queryParams.get("token");
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      console.log("Token extracted from URL:", tokenFromUrl);

      try {
        // Decodificar el JWT y extraer los datos de la invitación
        const decodedData = decodeJWT(tokenFromUrl);
        console.log("Datos decodificados del JWT:", decodedData);

        // Verificar si es un token de colaboración de label válido
        if (decodedData.type !== "label_collaboration") {
          setError("Token de colaboración de label inválido");
          return;
        }

        // Verificar si el token ha expirado
        if (decodedData.exp && Date.now() >= decodedData.exp * 1000) {
          setError("La invitación ha expirado");
          return;
        }

        // Configurar los datos de la invitación desde el JWT
        const newInvitationData: InvitationData = {
          labelName: decodedData.labelName || "Label",
          labelType: decodedData.labelType || "artistic",
          ownerName: "El propietario", // No viene en el token, se mostrará genérico
          totalSongs: decodedData.totalSongs || 0,
          collaboratorName: decodedData.collaboratorName || "Colaborador",
        };

        setInvitationData(newInvitationData);
        // Se llegó a la aceptación: el desvío por el alta ya cumplió.
        clearPendingInvite();
      } catch (error) {
        console.error("Error procesando token:", error);
        setError(
          "Debes tener la sesión iniciada en Splitme para poder aceptar esta invitación. Por favor, inicia sesión e intenta nuevamente.",
        );
      }
    } else {
      console.log("No token found in URL");
      setError("No se encontró token de invitación en la URL");
    }
  }, []);

  const handleAccept = async () => {
    setError("");
    try {
      const response = await LabelsService.acceptLabelInvitation(token);

      if (response.error) {
        setError(response.message || "Error al aceptar la invitación");
      } else if (response.data) {
        setSuccess(true);
        setResult({
          labelName: response.data.labelName,
          songsAdded: response.data.results.summary.added,
          alreadyCollaborator: response.data.results.summary.alreadyExists,
        });
        navigate("/auth/email-login", { replace: true });
      }
    } catch (error) {
      console.error("Error al aceptar invitación:", error);
      setError("Error al aceptar la invitación. Inténtalo de nuevo.");
    }
  };

  const handleReject = async () => {
    try {
      const response = await LabelsService.rejectLabelInvitation(token);

      if (response.error) {
        setError(response.message || "Error al rechazar la invitación");
      } else {
        navigate("/panel/home");
      }
    } catch (error) {
      console.error("Error al rechazar invitación:", error);
      setError("Error al rechazar la invitación. Inténtalo de nuevo.");
    }
  };

  const isCustomLabel = invitationData?.labelType === "custom";

  // Mostrar pantalla de éxito
  if (success && result) {
    return (
      <div
        className={`flex min-h-screen items-center justify-center p-4 ${
          isCustomLabel
            ? "bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"
            : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
        }`}
      >
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <div
            className={`mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full ${
              isCustomLabel
                ? "bg-gradient-to-br from-amber-400 to-orange-500"
                : "bg-gradient-to-br from-green-400 to-emerald-500"
            }`}
          >
            <Check className="h-10 w-10 text-white" />
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">¡Invitación Aceptada!</h1>
          <p className="mb-6 text-gray-600">
            Ahora eres colaborador del label <strong>{result.labelName}</strong>
          </p>

          <div className="mb-6 rounded-xl bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-center gap-3">
              <Music2
                className={`h-5 w-5 ${isCustomLabel ? "text-amber-500" : "text-indigo-500"}`}
              />
              <span className="font-medium text-gray-700">Canciones agregadas</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{result.songsAdded}</p>
            {result.alreadyCollaborator > 0 && (
              <p className="mt-2 text-sm text-gray-500">
                ({result.alreadyCollaborator} canciones ya estaban en tu cuenta)
              </p>
            )}
          </div>

          <button
            onClick={() => navigate("/panel/home")}
            className={`w-full rounded-xl px-6 py-3 font-semibold text-white transition-all ${
              isCustomLabel
                ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                : "bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600"
            }`}
          >
            Ir al Panel
          </button>
        </div>
      </div>
    );
  }

  // Mostrar error si hay problemas con el token
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-red-50 to-pink-50 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-500">
            <AlertTriangle className="h-8 w-8 text-white" />
          </div>
          <h1 className="mb-4 text-2xl font-bold text-gray-900">Error en la Invitación</h1>
          <p className="mb-6 text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="rounded-xl bg-red-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-red-600"
          >
            Volver a la invitacion
          </button>
        </div>
      </div>
    );
  }

  // Mostrar loading mientras se procesa el token
  if (!invitationData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
        <div className="w-full max-w-md rounded-2xl bg-white p-8 text-center shadow-xl">
          <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-indigo-500" />
          <p className="text-gray-600">Cargando invitación...</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex min-h-screen items-center justify-center p-4 ${
        isCustomLabel
          ? "bg-gradient-to-br from-amber-50 via-orange-50 to-red-50"
          : "bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50"
      }`}
    >
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="relative inline-block">
            <div
              className={`mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-2xl shadow-lg ${
                isCustomLabel
                  ? "bg-gradient-to-br from-amber-500 via-orange-500 to-red-500"
                  : "bg-gradient-to-br from-indigo-500 to-purple-600"
              }`}
            >
              {isCustomLabel ? (
                <Layers className="h-10 w-10 text-white" />
              ) : (
                <Tag className="h-10 w-10 text-white" />
              )}
            </div>
            {isCustomLabel && (
              <div className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 shadow-md">
                <Sparkles className="h-3.5 w-3.5 text-white" />
              </div>
            )}
          </div>
          <h1 className="mb-2 text-3xl font-bold text-gray-900">Invitación de Colaboración</h1>
          <p className="text-gray-600">
            Te han invitado a colaborar en un{" "}
            {isCustomLabel ? "label personalizado" : "label artístico"}
          </p>
          {token && (
            <div
              className={`mt-3 inline-block rounded-lg p-2 text-xs ${
                isCustomLabel ? "bg-amber-50 text-amber-600" : "bg-green-50 text-green-600"
              }`}
            >
              ✓ Token de invitación verificado
            </div>
          )}
        </div>

        {/* Invitation Details */}
        <div
          className={`mb-8 rounded-xl border p-6 ${
            isCustomLabel
              ? "border-amber-200 bg-gradient-to-br from-amber-50 to-orange-50"
              : "border-indigo-200 bg-gradient-to-br from-indigo-50 to-purple-50"
          }`}
        >
          <div className="space-y-4">
            {/* Label Name */}
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${isCustomLabel ? "bg-amber-100" : "bg-indigo-100"}`}>
                {isCustomLabel ? (
                  <Layers className={`h-5 w-5 text-amber-600`} />
                ) : (
                  <Tag className={`h-5 w-5 text-indigo-600`} />
                )}
              </div>
              <div>
                <p className="text-sm text-gray-500">Label</p>
                <h3 className="text-xl font-bold text-gray-900">{invitationData.labelName}</h3>
              </div>
            </div>

            {/* Songs Count */}
            <div className="flex items-center gap-3">
              <div className={`rounded-lg p-2 ${isCustomLabel ? "bg-amber-100" : "bg-indigo-100"}`}>
                <Music2
                  className={`h-5 w-5 ${isCustomLabel ? "text-amber-600" : "text-indigo-600"}`}
                />
              </div>
              <div>
                <p className="text-sm text-gray-500">Canciones incluidas</p>
                <p className="text-2xl font-bold text-gray-900">{invitationData.totalSongs}</p>
              </div>
            </div>

            {/* Info Message */}
            <div
              className={`rounded-lg border p-4 ${
                isCustomLabel ? "border-amber-200 bg-white" : "border-indigo-200 bg-white"
              }`}
            >
              <div className="flex items-start gap-3">
                <Users
                  className={`mt-0.5 h-5 w-5 ${
                    isCustomLabel ? "text-amber-500" : "text-indigo-500"
                  }`}
                />
                <div>
                  <p className="text-gray-700">
                    Al aceptar esta invitación, serás agregado como colaborador a las{" "}
                    <strong>{invitationData.totalSongs} canciones</strong> de este label.
                  </p>
                  <p className="mt-2 text-sm text-gray-500">
                    Podrás ver las métricas, estadísticas y datos de todas las canciones.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sin sesión no hay a quién añadir: primero la cuenta. */}
        {!isSignedIn() ? (
          <InviteAuthGate email={readInviteEmail(token)} what="este sello" />
        ) : (
        <div className="flex flex-col gap-4 sm:flex-row">
          <button
            onClick={handleAccept}
            className={`flex flex-1 transform items-center justify-center space-x-2 rounded-xl px-6 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl ${
              isCustomLabel
                ? "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
                : "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            }`}
          >
            <Check className="h-5 w-5" />
            <span>Aceptar Invitación</span>
          </button>

          <button
            onClick={handleReject}
            className="flex flex-1 transform items-center justify-center space-x-2 rounded-xl bg-gradient-to-r from-red-500 to-red-600 px-6 py-4 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:from-red-600 hover:to-red-700 hover:shadow-xl"
          >
            <X className="h-5 w-5" />
            <span>Rechazar Invitación</span>
          </button>
        </div>
        )}

        {/* Additional Info */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            Esta invitación expira en 7 días. Una vez que respondas, no podrás cambiar tu decisión.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AcceptLabelCollaboration;
