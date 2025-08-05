/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo } from 'react';
import LocalStorageService from '../services/localstorage';

interface UseCurrentCollaboratorProps {
  collaborators: any[];
}

const useCurrentCollaborator = ({ collaborators }: UseCurrentCollaboratorProps) => {
  const currentCollaborator = useMemo(() => {
    if (!collaborators || collaborators.length === 0) {
      return null;
    }

    // Obtener el usuario actual del localStorage
    const currentUser = LocalStorageService.getItem("user");
    const currentUserId = currentUser?.id;
    const currentUserEmail = currentUser?.email;

    if (!currentUserId && !currentUserEmail) {
      return null;
    }

    // Buscar el colaborador que coincida con el usuario actual
    const collaborator = collaborators.find(collab => 
      collab._id === currentUserId || 
      collab.id === currentUserId ||
      collab.email === currentUserEmail
    );

    if (!collaborator) {
      return null;
    }

    // Calcular porcentaje y monto a pagar
    let percentage = 0;
    let amountToPay = 0;

    // Verificar si tiene splitPayment y obtener el cálculo
    if (collaborator.splitPayment && collaborator.splitPayment.length > 0) {
      const latestPayment = collaborator.splitPayment[0];
      amountToPay = latestPayment.calculation?.amountToPay || 0;
    }

    // Obtener porcentaje desde las condiciones del split
    if (collaborator.split?.conditions && collaborator.split.conditions.length > 0) {
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
      calculatedAmount: amountToPay,
      status: collaborator.splitPayment?.[0]?.status || 'unknown'
    };
  }, [collaborators]);

  // Funciones de utilidad
  const getCurrentUserPercentage = () => {
    return currentCollaborator ? currentCollaborator.percentage : '0.00';
  };

  const getCurrentUserAmount = () => {
    return currentCollaborator ? currentCollaborator.amountToPay : '0.00';
  };

  const getCurrentUserStatus = () => {
    return currentCollaborator ? currentCollaborator.status : 'unknown';
  };

  const isCurrentUserCollaborator = () => {
    return currentCollaborator !== null;
  };

  return {
    currentCollaborator,
    getCurrentUserPercentage,
    getCurrentUserAmount,
    getCurrentUserStatus,
    isCurrentUserCollaborator
  };
};

export default useCurrentCollaborator;