import { useState, useEffect } from 'react';

interface UseDashboardTourReturn {
  isFirstTime: boolean;
  hasCompletedTour: boolean;
  startTour: () => void;
  completeTour: () => void;
  resetTour: () => void;
}

const TOUR_STORAGE_KEY = 'dashboard-tour-completed';

export const useDashboardTour = (): UseDashboardTourReturn => {
  const [hasCompletedTour, setHasCompletedTour] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(true);

  useEffect(() => {
    // Check if user has completed the tour before
    const tourCompleted = localStorage.getItem(TOUR_STORAGE_KEY);
    
    if (tourCompleted) {
      setHasCompletedTour(true);
      setIsFirstTime(false);
    } else {
      setHasCompletedTour(false);
      setIsFirstTime(true);
    }
  }, []);

  const startTour = () => {
    setHasCompletedTour(false);
    setIsFirstTime(false);
    localStorage.removeItem(TOUR_STORAGE_KEY);
  };

  const completeTour = () => {
    setHasCompletedTour(true);
    setIsFirstTime(false);
    localStorage.setItem(TOUR_STORAGE_KEY, 'true');
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
