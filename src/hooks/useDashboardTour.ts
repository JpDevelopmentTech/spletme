import { useEffect, useState } from "react";
import { AuthService } from "@/services/auth";

interface UseDashboardTourReturn {
  isFirstTime: boolean;
  hasCompletedTour: boolean;
  startTour: () => void;
  completeTour: () => void;
  resetTour: () => void;
}

const TOUR_STORAGE_KEY = "dashboard-tour-completed";

const readTourCompletionFromUser = (): boolean | null => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) {
    return null;
  }

  try {
    const user = JSON.parse(storedUser) as {
      dashboardTourCompleted?: boolean;
      platformTourCompleted?: boolean;
      tourCompleted?: boolean;
    };

    if (typeof user.dashboardTourCompleted === "boolean") {
      return user.dashboardTourCompleted;
    }

    if (typeof user.platformTourCompleted === "boolean") {
      return user.platformTourCompleted;
    }

    if (typeof user.tourCompleted === "boolean") {
      return user.tourCompleted;
    }

    return null;
  } catch {
    return null;
  }
};

export const useDashboardTour = (): UseDashboardTourReturn => {
  const [hasCompletedTour, setHasCompletedTour] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    const userTourCompleted = readTourCompletionFromUser();
    const storageTourCompleted = localStorage.getItem(TOUR_STORAGE_KEY) === "true";
    const tourCompleted = userTourCompleted ?? storageTourCompleted;

    setHasCompletedTour(Boolean(tourCompleted));
    setIsFirstTime(!tourCompleted);
  }, []);

  const startTour = () => {
    setHasCompletedTour(false);
    setIsFirstTime(false);
    localStorage.removeItem(TOUR_STORAGE_KEY);
  };

  const completeTour = () => {
    setHasCompletedTour(true);
    setIsFirstTime(false);
    localStorage.setItem(TOUR_STORAGE_KEY, "true");

    void AuthService.completeDashboardTour(true).catch((error) => {
      console.error("Error updating dashboard tour status:", error);
    });
  };

  const resetTour = () => {
    setHasCompletedTour(false);
    setIsFirstTime(true);
    localStorage.removeItem(TOUR_STORAGE_KEY);
  };

  return {
    isFirstTime,
    hasCompletedTour,
    startTour,
    completeTour,
    resetTour,
  };
};
