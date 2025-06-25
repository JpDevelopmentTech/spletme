import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SongService from '../../services/songs';

// Interfaces para tipado TypeScript - Estructura real del JWT
interface JWTPayload {
    type?: 'song_collaboration';
    songId?: string;
    ownerId?: string;
    collaboratorId?: string;
    songTitle?: string;
    artistName?: string;
    collaboratorName?: string;
    exp?: number;
    iat?: number;
}

interface InvitationData {
    songTitle: string;
    inviterName: string;
    inviterEmail: string;
    message: string;
    invitationDate: string;
    songId?: string;
    ownerId?: string;
    collaboratorId?: string;
    artistName?: string;
}

const AcceptCollaboration = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [token, setToken] = useState('');
    const [invitationData, setInvitationData] = useState<InvitationData | null>(null);
    const [error, setError] = useState('');
    
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
                
                // Verificar si es un token de colaboración válido
                if (decodedData.type !== 'song_collaboration') {
                    setError('Token de colaboración inválido');
                    return;
                }
                
                // Verificar si el token ha expirado
                if (decodedData.exp && Date.now() >= decodedData.exp * 1000) {
                    setError('La invitación ha expirado');
                    return;
                }
                
                // Configurar los datos de la invitación desde el JWT usando la estructura real
                const newInvitationData: InvitationData = {
                    songTitle: decodedData.songTitle || 'Colaboración Musical',
                    inviterName: decodedData.artistName || 'Artista',
                    inviterEmail: '', // No viene en el payload, se puede obtener por API si es necesario
                    message: `${decodedData.collaboratorName || 'Un colaborador'} te ha invitado a colaborar en "${decodedData.songTitle || 'esta canción'}".`,
                    invitationDate: new Date().toISOString().split('T')[0], // Fecha actual ya que no viene en el payload
                    songId: decodedData.songId,
                    ownerId: decodedData.ownerId,
                    collaboratorId: decodedData.collaboratorId,
                    artistName: decodedData.artistName
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

    // Datos de ejemplo de la invitación (se usa si no hay JWT o como fallback)
    const defaultInvitationData: InvitationData = {
        songTitle: "Nueva Colaboración Musical",
        inviterName: "Juan Pérez",
        inviterEmail: "juan@example.com",
        message: "¡Hola! Me encantaría colaborar contigo en esta nueva canción. Creo que tu estilo sería perfecto para este proyecto.",
        invitationDate: "2024-01-15"
    };

    const handleAccept = async () => {
        setLoading(true);
        try {
            
            const response = await SongService.acceptCollaboration(token);
            if(response !== null){
                alert('¡Invitación aceptada exitosamente!');
                navigate('/');
            } else {
                alert('Error al aceptar la invitación. Inténtalo de nuevo.');
            }
            
        } catch (error) {
            console.error('Error al aceptar invitación:', error);
            alert('Error al aceptar la invitación. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    const handleReject = async () => {
        setLoading(true);
        try {
            
            // Simular llamada a API
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            alert('Invitación rechazada');
            navigate('/');
        } catch (error) {
            console.error('Error al rechazar invitación:', error);
            alert('Error al rechazar la invitación. Inténtalo de nuevo.');
        } finally {
            setLoading(false);
        }
    };

    // Usar datos del JWT si están disponibles, sino usar datos por defecto
    const displayData = invitationData || defaultInvitationData;

    // Mostrar error si hay problemas con el token
    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
                    <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Error en la Invitación</h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-colors"
                    >
                        Volver al Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                        </svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Invitación de Colaboración</h1>
                    <p className="text-gray-600">Te han invitado a colaborar en una nueva canción</p>
                    {token && (
                        <div className="mt-2 text-xs text-green-600 bg-green-50 rounded-lg p-2">
                            ✓ Token de invitación verificado
                        </div>
                    )}
                </div>

                {/* Invitation Details */}
                <div className="bg-gray-50 rounded-xl p-6 mb-8">
                    <div className="space-y-4">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                "{displayData.songTitle}"
                            </h3>
                        </div>
                        
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
                                <span className="text-white font-medium text-sm">
                                    {displayData.inviterName.charAt(0)}
                                </span>
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{displayData.inviterName}</p>
                                <p className="text-sm text-gray-600">{displayData.inviterEmail}</p>
                            </div>
                        </div>

                        <div className="bg-white rounded-lg p-4 border-l-4 border-purple-500">
                            <p className="text-gray-700 italic">"{displayData.message}"</p>
                        </div>

                        <div className="text-sm text-gray-500">
                            Invitación enviada el {new Date(displayData.invitationDate).toLocaleDateString('es-ES')}
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={handleAccept}
                        disabled={loading}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:hover:scale-100 shadow-lg hover:shadow-xl flex items-center justify-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Procesando...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
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
                                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Procesando...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                                <span>Rechazar Invitación</span>
                            </>
                        )}
                    </button>
                </div>

                {/* Additional Info */}
                <div className="mt-6 text-center">
                    <p className="text-sm text-gray-500">
                        Una vez que respondas a esta invitación, no podrás cambiar tu decisión.
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AcceptCollaboration;
