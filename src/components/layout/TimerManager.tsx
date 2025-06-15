"use client";

import { useEffect, useRef } from 'react';
import { useStudyStore } from '@/store/useStudyStore';

export function TimerManager() {
  const { activeSession, tick } = useStudyStore(state => ({
    activeSession: state.activeSession,
    tick: state.tick,
  }));
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (activeSession.id && activeSession.startTime) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [activeSession.id, activeSession.startTime, tick]);
  
  // Effect for initial hydration and resuming timer
  useEffect(() => {
    useStudyStore.persist.rehydrate();
    const unsubscribe = useStudyStore.subscribe(
      (state) => state.activeSession,
      (currentActiveSession, previousActiveSession) => {
        if (currentActiveSession.id && currentActiveSession.startTime && (!previousActiveSession.id || !previousActiveSession.startTime)) {
          // Timer started or resumed
          if (intervalRef.current) clearInterval(intervalRef.current);
          intervalRef.current = setInterval(() => {
            tick();
          }, 1000);
        } else if (!currentActiveSession.id && intervalRef.current) {
          // Timer stopped
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
      }
    );
  
    // Initial check on mount, in case hydration happened before this effect
    const initialActiveSession = useStudyStore.getState().activeSession;
    if (initialActiveSession.id && initialActiveSession.startTime) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      intervalRef.current = setInterval(() => {
        tick();
      }, 1000);
    }

    return () => {
      unsubscribe();
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [tick]);


  // beforeunload is handled by zustand persist middleware by default for localStorage.
  // No explicit beforeunload handler needed here as state is continuously saved.

  return null;
}
