import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LabelsService from '../../services/labels';
import { Layers, Tag, Music2, Check, X, AlertTriangle, Loader2, Users, Sparkles } from 'lucide-react';

// Interfaces para tipado TypeScript - Estructura real del JWT
interface JWTPayload {
    type?: 'label_collaboration';
    labelType?: 'artistic' | 'custom';
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
    labelType: 'artistic' | 'custom';
    ownerName: string;
    totalSongs: number;
    collaboratorName: string;
}

const AcceptLabelCollaboration = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
    const [error, setError] = useState('');
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
            const parts = token.split('.');
            if (parts.length !== 3) {
                throw new Error('Token JWT inválido');
            }
            
            // Decodificar la parte del payload (segunda parte)
            const payload = parts[1];
            
            // Añadir padding si es necesario para base64
            const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
            
            // Decodificar de base64
            const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
            
            // Parsear JSON
            return JSON.parse(decodedPayload) as JWTPayload;
        } catch (error) {
            console.error('Error decodificando JWT:', error);
            throw new Error('Token inválido o corrupto');
        }
    };
    
    // Extract token from URL query parameters
    React.useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const tokenFromUrl = queryParams.get('token');
        if (tokenFromUrl) {
            setToken(tokenFromUrl);
            console.log('Token extracted from URL:', tokenFromUrl);
            
            try {
                // Decodificar el JWT y extraer los datos de la invitación
                const decodedData = decodeJWT(tokenFromUrl);
                console.log('Datos decodificados del JWT:', decodedData);
                
                // Verificar si es un token de colaboración de label válido
                if (decodedData.type !== 'label_collaboration') {
                    setError('Token de colaboración de label inválido');
                    return;
                }
                
                // Verificar si el token ha expirado
                if (decodedData.exp && Date.now() >= decodedData.exp * 1000) {
                    setError('La invitación ha expirado');
                    return;
                }
                
                // Configurar los datos de la invitación desde el JWT
                const newInvitationData: InvitationData = {
                    labelName: decodedData.labelName || 'Label',
                    labelType: decodedData.labelType || 'artistic',
                    ownerName: 'El propietario', // No viene en el token, se mostrará genérico
                    totalSongs: decodedData.totalSongs || 0,
                    collaboratorName: decodedData.collaboratorName || 'Colaborador',
                };
                
                setInvitationData(newInvitationData);
                
            } catch (error) {
                console.error('Error procesando token:', error);
                setError('Token de invitación inválido');
            }
        } else {
            console.log('No token found in URL');
            setError('No se encontró token de invitación en la URL');
        }
    }, []);

    const handleAccept = async () => {
        setLoading(true);
        setError('');
        try {
            const response = await LabelsService.acceptLabelInvitation(token);
            
            if (response.error) {
                setError(response.message || 'Error al aceptar la invitación');
            } else if (response.data) {
                setSuccess(true);
                setResult({
                    labelName: response.data.labelName,
                    songsAdded: response.data.results.summary.added,
                    alreadyCollaborator: response.data.results.summary.alreadyExists,
                });
            }
        } catch (error) {
            console.error('Error al aceptar invitación:', error);
            setError('Error al aceptar la invitación. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        setLoading(true);
        try {
            const response = await LabelsService.rejectLabelInvitation(token);
            
            if (response.error) {
                setError(response.message || 'Error al rechazar la invitación');
            } else {
                navigate('/panel/home');
            }
        } catch (error) {
            console.error('Error al rechazar invitación:', error);
            setError('Error al rechazar la invitación. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const isCustomLabel = invitationData?.labelType === 'custom';

    // Mostrar pantalla de éxito
    if (success && result) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 ${
                isCustomLabel 
                    ? 'bg-gradient-to-br from-amber-50 via-orange-50 to-red-50'
                    : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'
            }`}>
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                    <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${
                        isCustomLabel
                            ? 'bg-gradient-to-br from-amber-400 to-orange-500'
                            : 'bg-gradient-to-br from-green-400 to-emerald-500'
                    }`}>
                        <Check className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">¡Invitación Aceptada!</h1>
                    <p className="text-gray-600 mb-6">
                        Ahora eres colaborador del label <strong>{result.labelName}</strong>
                    </p>
                    
                    <div className="bg-gray-50 rounded-xl p-4 mb-6">
                        <div className="flex items-center justify-center gap-3 mb-3">
                            <Music2 className={`w-5 h-5 ${isCustomLabel ? 'text-amber-500' : 'text-indigo-500'}`} />
                            <span className="text-gray-700 font-medium">Canciones agregadas</span>
                        </div>
                        <p className="text-3xl font-bold text-gray-900">{result.songsAdded}</p>
                        {result.alreadyCollaborator > 0 && (
                            <p className="text-sm text-gray-500 mt-2">
                                ({result.alreadyCollaborator} canciones ya estaban en tu cuenta)
                            </p>
                        )}
                    </div>
                    
                    <button
                        onClick={() => navigate('/panel/home')}
                        className={`w-full py-3 px-6 rounded-xl font-semibold text-white transition-all ${
                            isCustomLabel
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600'
                                : 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600'
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
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <AlertTriangle className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Error en la Invitación</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/panel/home')}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                    >
                        Volver al Panel
                    </button>
                </div>
            </div>
        );
    }

    // Mostrar loading mientras se procesa el token
    if (!invitationData) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                    <Loader2 className="w-12 h-12 text-indigo-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-600">Cargando invitación...</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen flex items-center justify-center p-4 ${
            isCustomLabel 
                ? 'bg-gradient-to-br from-amber-50 via-orange-50 to-red-50'
                : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'
        }`}>
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="relative inline-block">
                        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg ${
                            isCustomLabel
                                ? 'bg-gradient-to-br from-amber-500 via-orange-500 to-red-500'
                                : 'bg-gradient-to-br from-indigo-500 to-purple-600'
                        }`}>
                            {isCustomLabel ? (
                                <Layers className="w-10 h-10 text-white" />
                            ) : (
                                <Tag className="w-10 h-10 text-white" />
                            )}
                        </div>
                        {isCustomLabel && (
                            <div className="absolute -top-1 -right-1 w-6 h-6 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center shadow-md">
                                <Sparkles className="w-3.5 h-3.5 text-white" />
                            </div>
                        )}
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Invitación de Colaboración
                    </h1>
                    <p className="text-gray-600">
                        Te han invitado a colaborar en un {isCustomLabel ? 'label personalizado' : 'label artístico'}
                    </p>
                    {token && (
                        <div className={`mt-3 text-xs rounded-lg p-2 inline-block ${
                            isCustomLabel 
                                ? 'text-amber-600 bg-amber-50' 
                                : 'text-green-600 bg-green-50'
                        }`}>
                            ✓ Token de invitación verificado
                        </div>
                    )}
                </div>

                {/* Invitation Details */}
                <div className={`rounded-xl p-6 mb-8 border ${
                    isCustomLabel
                        ? 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
                        : 'bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200'
                }`}>
                    <div className="space-y-4">
                        {/* Label Name */}
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                                isCustomLabel ? 'bg-amber-100' : 'bg-indigo-100'
                            }`}>
                                {isCustomLabel ? (
                                    <Layers className={`w-5 h-5 text-amber-600`} />
                                ) : (
                                    <Tag className={`w-5 h-5 text-indigo-600`} />
                                )}
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Label</p>
                                <h3 className="text-xl font-bold text-gray-900">
                                    {invitationData.labelName}
                                </h3>
                            </div>
                        </div>

                        {/* Songs Count */}
                        <div className="flex items-center gap-3">
                            <div className={`p-2 rounded-lg ${
                                isCustomLabel ? 'bg-amber-100' : 'bg-indigo-100'
                            }`}>
                                <Music2 className={`w-5 h-5 ${
                                    isCustomLabel ? 'text-amber-600' : 'text-indigo-600'
                                }`} />
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Canciones incluidas</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {invitationData.totalSongs}
                                </p>
                            </div>
                        </div>

                        {/* Info Message */}
                        <div className={`p-4 rounded-lg border ${
                            isCustomLabel
                                ? 'bg-white border-amber-200'
                                : 'bg-white border-indigo-200'
                        }`}>
                            <div className="flex items-start gap-3">
                                <Users className={`w-5 h-5 mt-0.5 ${
                                    isCustomLabel ? 'text-amber-500' : 'text-indigo-500'
                                }`} />
                                <div>
                                    <p className="text-gray-700">
                                        Al aceptar esta invitación, serás agregado como colaborador a las{' '}
                                        <strong>{invitationData.totalSongs} canciones</strong> de este label.
                                    </p>
                                    <p className="text-sm text-gray-500 mt-2">
                                        Podrás ver las métricas, estadísticas y datos de todas las canciones.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleAccept}
                        disabled={loading}
                        className={`flex-1 font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-white ${
                            isCustomLabel
                                ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 disabled:from-gray-400 disabled:to-gray-500'
                                : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 disabled:from-gray-400 disabled:to-gray-500'
                        }`}
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Procesando...</span>
                            </>
                        ) : (
                            <>
                                <Check className="w-5 h-5" />
                                <span>Aceptar Invitación</span>
                            </>
                        )}
                    </button>

                    <button
                        onClick={handleReject}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                <span>Procesando...</span>
                            </>
                        ) : (
                            <>
                                <X className="w-5 h-5" />
                                <span>Rechazar Invitación</span>
                            </>
                        )}
                    </button>
                </div>

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

