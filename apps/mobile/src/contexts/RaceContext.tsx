import React, { createContext, useCallback, useContext, useState } from 'react';
import type { Race, RaceState } from '../types/race';

interface RaceContextValue {
  currentRace: Race | null;
  raceState: RaceState;
  setCurrentRace: (race: Race | null) => void;
  setRaceState: (state: RaceState) => void;
  joinRace: (race: Race) => void;
  clearRace: () => void;
}

const RaceContext = createContext<RaceContextValue | null>(null);

export function RaceProvider({ children }: { children: React.ReactNode }) {
  const [currentRace, setCurrentRaceState] = useState<Race | null>(null);
  const [raceState, setRaceStateState] = useState<RaceState>('idle');

  const setCurrentRace = useCallback((race: Race | null) => {
    setCurrentRaceState(race);
  }, []);

  const setRaceState = useCallback((state: RaceState) => {
    setRaceStateState(state);
  }, []);

  const joinRace = useCallback((race: Race) => {
    setCurrentRaceState(race);
    setRaceStateState('pre-race');
  }, []);

  const clearRace = useCallback(() => {
    setCurrentRaceState(null);
    setRaceStateState('idle');
  }, []);

  const value: RaceContextValue = {
    currentRace,
    raceState,
    setCurrentRace,
    setRaceState,
    joinRace,
    clearRace,
  };

  return <RaceContext.Provider value={value}>{children}</RaceContext.Provider>;
}

export function useRace(): RaceContextValue {
  const ctx = useContext(RaceContext);
  if (!ctx) throw new Error('useRace must be used within RaceProvider');
  return ctx;
}
