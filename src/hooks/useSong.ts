/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import songs from '../services/songs';

const UseSong = ({id}: {id: string}) => {
    const [song, setSong] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const getSong = async (id: string) => {
        setLoading(true);
        const response = await songs.getSong(id)
        setSong(response.data);
        setLoading(false);
    }

        const getOwnerId = () => {
        const ownerId = song?.ownerId || null;
        console.log("Owner ID:", ownerId);
        return ownerId;
    };
    // Función para obtener colaboradores con sus porcentajes
    const getCollaboratorsWithPercentages = () => {
        if (!song?.collaborators || song.collaborators.length === 0) {
            return [];
        }

        return song.collaborators.map((collaborator: any) => {
            let percentage = 0;
            let amountToPay = 0;

            // Verificar si tiene splitPayment y obtener el cálculo
            if (collaborator.splitPayment && collaborator.splitPayment.length > 0) {
                const latestPayment = collaborator.splitPayment[0]; // Tomar el más reciente
                amountToPay = latestPayment.calculation?.amountToPay || 0;
            }

            // Obtener porcentaje desde las condiciones del split
            if (collaborator.split?.conditions && collaborator.split.conditions.length > 0) {
                // Buscar la condición que tenga porcentaje
                const percentageCondition = collaborator.split.conditions.find(
                    (condition: any) => condition.type === 'percentage' || condition.percentage !== undefined
                );
                
                if (percentageCondition) {
                    percentage = percentageCondition.percentage || percentageCondition.value || 0;
                }
            }

            return {
                ...collaborator,
                percentage: percentage.toFixed(2),
                amountToPay: amountToPay.toFixed(2),
                calculatedAmount: amountToPay
            };
        });
    };


    // Función para obtener información de colaboradores
    const getCollaboratorsInfo = () => {
        const collaboratorsWithPercentages = getCollaboratorsWithPercentages();

        return collaboratorsWithPercentages;
    };

    useEffect(() => {
        getSong(id);
    }, [id]);

    return {
        song,
        getSong,
        getOwnerId,
        loading,
        getCollaboratorsWithPercentages,
        getCollaboratorsInfo
    }
}

export default UseSong;