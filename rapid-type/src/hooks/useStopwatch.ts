/**
 * useStopwatch - High precision timer hook
 */

import { useState, useRef, useCallback } from "react";
import type { UseStopwatchReturn } from "../types";
import { TIMER_INTERVAL } from "../constants";

export function useStopwatch(): UseStopwatchReturn {
  const [timeMs, setTimeMs] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  const startTimeRef = useRef<number>(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = useCallback(() => {
    if (isRunning) return;

    startTimeRef.current = Date.now() - timeMs;
    setIsRunning(true);

    intervalRef.current = setInterval(() => {
      setTimeMs(Date.now() - startTimeRef.current);
    }, TIMER_INTERVAL);
  }, [isRunning, timeMs]);

  const stop = useCallback(() => {
    if (!isRunning) return;

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setTimeMs(Date.now() - startTimeRef.current);
    setIsRunning(false);
  }, [isRunning]);

  const reset = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    setTimeMs(0);
    setIsRunning(false);
    startTimeRef.current = 0;
  }, []);

  const lap = useCallback((): number => {
    return Date.now() - startTimeRef.current;
  }, []);

  return {
    timeMs,
    isRunning,
    start,
    stop,
    reset,
    lap,
  };
}
