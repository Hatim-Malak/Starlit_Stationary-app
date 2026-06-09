import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook for smart loading state that enforces minimum display time.
 * @param {Object} options - Options object.
 * @param {number} options.delay - The delay before showing the loader in milliseconds.
 * @param {number} options.minDisplay - The minimum time to display the loader in milliseconds.
 * @returns {Object} Smart loader state.
 */
export function useSmartLoader({ delay = 300, minDisplay = 500 } = {}) {
  const [showLoader, setShowLoader] = useState(false);
  const [isActuallyLoading, setIsActuallyLoading] = useState(false);
  const loadingStartTime = useRef(null);
  const delayTimer = useRef(null);
  const minDisplayTimer = useRef(null);

  useEffect(() => {
    return () => {
      clearTimeout(delayTimer.current);
      clearTimeout(minDisplayTimer.current);
    };
  }, []);

  const handleLoadingChange = (isLoading) => {
    setIsActuallyLoading(isLoading);

    if (isLoading) {
      clearTimeout(minDisplayTimer.current);
      delayTimer.current = setTimeout(() => {
        setShowLoader(true);
        loadingStartTime.current = Date.now();
      }, delay);
    } else {
      clearTimeout(delayTimer.current);
      if (showLoader && loadingStartTime.current) {
        const elapsedTime = Date.now() - loadingStartTime.current;
        const remainingTime = Math.max(0, minDisplay - elapsedTime);
        
        if (remainingTime > 0) {
          minDisplayTimer.current = setTimeout(() => {
            setShowLoader(false);
            loadingStartTime.current = null;
          }, remainingTime);
        } else {
          setShowLoader(false);
          loadingStartTime.current = null;
        }
      } else {
        setShowLoader(false);
      }
    }
  };

  return {
    showLoader,
    isLoading: isActuallyLoading,
    handleLoadingChange,
  };
}
