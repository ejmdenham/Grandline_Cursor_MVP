import React, { createContext, useCallback, useContext, useState } from 'react';
import type { Race, RaceState } from '../types/race';

interface RaceContextValue {
  currentRace: Race | null;
  raceState: RaceState;
  raceStartTime: number | null;
  raceFinishTimeMs: number | null;
  completedCheckpointCount: number;
  setCurrentRace: (race: Race | null) => void;
  setRaceState: (state: RaceState) => void;
  setRaceFinishTimeMs: (ms: number | null) => void;
  setCompletedCheckpointCount: (count: number) => void;
  joinRace: (race: Race) => void;
  startRace: () => void;
  clearRace: () => void;
}

const RaceContext = createContext<RaceContextValue | null>(null);

export function RaceProvider({ children }: { children: React.ReactNode }) {
  const [currentRace, setCurrentRaceState] = useState<Race | null>(null);
  const [raceState, setRaceStateState] = useState<RaceState>('idle');
  const [raceStartTime, setRaceStartTimeState] = useState<number | null>(null);
  const [raceFinishTimeMs, setRaceFinishTimeMsState] = useState<number | null>(null);
  const [completedCheckpointCount, setCompletedCheckpointCountState] = useState(0);

  const setCurrentRace = useCallback((race: Race | null) => {
    setCurrentRaceState(race);
  }, []);

  const setRaceState = useCallback((state: RaceState) => {
    setRaceStateState(state);
  }, []);

  const setRaceFinishTimeMs = useCallback((ms: number | null) => {
    setRaceFinishTimeMsState(ms);
  }, []);

  const setCompletedCheckpointCount = useCallback((count: number) => {
    setCompletedCheckpointCountState(count);
  }, []);

  const joinRace = useCallback((race: Race) => {
    setCurrentRaceState(race);
    setRaceStateState('pre-race');
  }, []);

  const startRace = useCallback(() => {
    setRaceStateState('in-race');
    setRaceStartTimeState(Date.now());
    setRaceFinishTimeMsState(null);
    setCompletedCheckpointCountState(0);
  }, []);

  const clearRace = useCallback(() => {
    setCurrentRaceState(null);
    setRaceStateState('idle');
    setRaceStartTimeState(null);
    setRaceFinishTimeMsState(null);
    setCompletedCheckpointCountState(0);
  }, []);

  const value: RaceContextValue = {
    currentRace,
    raceState,
    raceStartTime,
    raceFinishTimeMs,
    completedCheckpointCount,
    setCurrentRace,
    setRaceState,
    setRaceFinishTimeMs,
    setCompletedCheckpointCount,
    joinRace,
    startRace,
    clearRace,
  };

  return <RaceContext.Provider value={value}>{children}</RaceContext.Provider>;
}

export function useRace(): RaceContextValue {
  const ctx = useContext(RaceContext);
  if (!ctx) throw new Error('useRace must be used within RaceProvider');
  return ctx;
}
