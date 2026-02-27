import { useEffect, useRef } from 'react';
import { useDriverStore } from '../store';

/**
 * Hook to simulate real-time driver movement every `intervalMs` milliseconds
 */
export const useDriverSimulation = (intervalMs: number = 3000) => {
  const simulateMovement = useDriverStore((s) => s.simulateMovement);
  const drivers = useDriverStore((s) => s.drivers);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (drivers.length === 0) return;

    intervalRef.current = setInterval(() => {
      simulateMovement();
    }, intervalMs);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [drivers.length, intervalMs, simulateMovement]);
};
