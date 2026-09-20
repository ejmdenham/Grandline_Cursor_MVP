import React, { createContext, useCallback, useContext, useRef, useState } from 'react';
import type { Race, RaceState } from '../types/race';
import { putParticipation } from '../services/participation';

interface RaceContextValue {
  currentRace: Race | null;
  raceState: RaceState;
  raceStartTime: number | null;
  raceFinishTimeMs: number | null;
  racePlacement: number | null;
  completedCheckpointCount: number;
  setCurrentRace: (race: Race | null) => void;
  setRaceState: (state: RaceState) => void;
  setRaceFinishTimeMs: (ms: number | null) => void;
  setRacePlacement: (placement: number | null) => void;
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
  const [racePlacement, setRacePlacementState] = useState<number | null>(null);
  const [completedCheckpointCount, setCompletedCheckpointCountState] = useState(0);
  const currentRaceRef = useRef<Race | null>(null);
  currentRaceRef.current = currentRace;

  const setCurrentRace = useCallback((race: Race | null) => {
    setCurrentRaceState(race);
  }, []);

  const setRaceState = useCallback((state: RaceState) => {
    setRaceStateState(state);
  }, []);

  const setRaceFinishTimeMs = useCallback((ms: number | null) => {
    setRaceFinishTimeMsState(ms);
  }, []);

  const setRacePlacement = useCallback((placement: number | null) => {
    setRacePlacementState(placement);
  }, []);

  const setCompletedCheckpointCount = useCallback((count: number) => {
    setCompletedCheckpointCountState(count);
  }, []);

  const joinRace = useCallback((race: Race) => {
    setCurrentRaceState(race);
    setRaceStateState('pre-race');
  }, []);

  const startRace = useCallback(() => {
    const raceId = currentRaceRef.current?.id;
    setRaceStateState('in-race');
    setRaceStartTimeState(Date.now());
    setRaceFinishTimeMsState(null);
    setRacePlacementState(null);
    setCompletedCheckpointCountState(0);
    if (raceId) {
      void putParticipation(raceId, { status: 'in_progress' }).catch((err) => {
        console.warn('[Race] persist start failed', err);
      });
    }
  }, []);

  const clearRace = useCallback(() => {
    setCurrentRaceState(null);
    setRaceStateState('idle');
    setRaceStartTimeState(null);
    setRaceFinishTimeMsState(null);
    setRacePlacementState(null);
    setCompletedCheckpointCountState(0);
  }, []);

  const value: RaceContextValue = {
    currentRace,
    raceState,
    raceStartTime,
    raceFinishTimeMs,
    racePlacement,
    completedCheckpointCount,
    setCurrentRace,
    setRaceState,
    setRaceFinishTimeMs,
    setRacePlacement,
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
