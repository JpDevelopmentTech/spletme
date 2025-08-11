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
        console.log("Owner ID:", ownerId?.splitPayment);
        return ownerId;
    };
    const getOwnerSplitPayment = () => {
    const ownerData = getOwnerId();
    
    if (!ownerData || !ownerData.splitPayment) {
        console.log("❌ No hay splitPayment para el owner");
        return null;
    }

    return ownerData.splitPayment;
};

    const getOwnerInfo = () => {
        const ownerData = getOwnerId();
        
        if (!ownerData) {
            return null;
        }

        let percentage = 0;
        let amountToPay = 0;

        // Verificar si tiene splitPayment y obtener el cálculo
        if (ownerData.splitPayment && ownerData.splitPayment.length > 0) {
            const latestPayment = ownerData.splitPayment[0]; // Tomar el más reciente
            amountToPay = latestPayment.calculation?.amountToPay || 0;
        }

        // Obtener porcentaje desde las condiciones del split
        if (ownerData.split?.conditions && ownerData.split.conditions.length > 0) {
            // Buscar la condición que tenga porcentaje
            const percentageCondition = ownerData.split.conditions.find(
                (condition: any) => condition.type === 'percentage' || condition.percentage !== undefined
            );
            
            if (percentageCondition) {
                percentage = percentageCondition.percentage || percentageCondition.value || 0;
            }
        }

        return {
            id: ownerData._id || ownerData.id,
            mongoId: ownerData._id,
            shortId: ownerData.id,
            username: ownerData.username,
            percentage: percentage.toFixed(2),
            amountToPay: amountToPay.toFixed(2),
            calculatedAmount: amountToPay,
            splitPayment: ownerData.splitPayment,
            splitConditions: ownerData.split?.conditions,
            rawData: ownerData // Objeto completo sin procesar
        };
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

    const getOwnerTotalOwed = () => {
    const splitPayments = getOwnerSplitPayment();
    
    if (!splitPayments || splitPayments.length === 0) {
        return 0;
    }

    const latestSplitPayment = splitPayments[0];
    const totalOwed = latestSplitPayment?.calculation?.totalOwed || 0;

    return totalOwed;
};
    const getOwnerPercentage = () => {
        const owner = getOwnerId();
        if(owner && owner.split && owner.split.conditions) {
            const percentageCondition = owner.split.conditions.find(
                (condition: any) => condition.type === 'percentage' || condition.percentage !== undefined
            );
            return percentageCondition?.percentage || 0;
        }
        return 0;
    };

    return {
        song,
        getSong,
        getOwnerId,
        getOwnerPercentage,
        getOwnerInfo,
        getOwnerTotalOwed,
        getOwnerSplitPayment,
        loading,
        getCollaboratorsWithPercentages,
        getCollaboratorsInfo
    }
}

export default UseSong;