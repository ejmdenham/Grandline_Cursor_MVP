/**
 * Normalize player API snake_case (and camelCase) result payloads.
 */

import type { LeaderboardResult, LeaderboardEntry, LeaderboardEntryStatus } from '../types/leaderboard';

export type ParticipationStatus = 'in_progress' | 'finished';

export interface ParticipationResult {
  raceId: string;
  userId: string;
  status: ParticipationStatus;
  finishTimeMs?: number;
  placement?: number;
}

export interface ApiLeaderboardEntry {
  name: string;
  status: LeaderboardEntryStatus;
  finish_time_ms?: number;
  finishTimeMs?: number;
  placement?: number;
  user_id?: string;
  userId?: string;
}

export interface ApiLeaderboardResponse {
  race_id?: string;
  raceId?: string;
  race_name?: string;
  raceName?: string;
  entries?: ApiLeaderboardEntry[];
}

export interface ApiParticipation {
  race_id?: string;
  raceId?: string;
  user_id?: string;
  userId?: string;
  status: ParticipationStatus;
  finish_time_ms?: number;
  finishTimeMs?: number;
  placement?: number;
}

export function mapLeaderboardEntry(entry: ApiLeaderboardEntry): LeaderboardEntry {
  return {
    name: entry.name,
    status: entry.status,
    finishTimeMs: entry.finish_time_ms ?? entry.finishTimeMs,
    placement: entry.placement,
    userId: entry.user_id ?? entry.userId,
  };
}

export function mapLeaderboardResponse(
  data: ApiLeaderboardResponse,
  fallbackRaceId: string
): LeaderboardResult {
  return {
    raceId: data.race_id ?? data.raceId ?? fallbackRaceId,
    raceName: data.race_name ?? data.raceName ?? 'Race',
    entries: (data.entries ?? []).map(mapLeaderboardEntry),
  };
}

export function mapParticipationResponse(
  data: ApiParticipation,
  fallbackRaceId: string
): ParticipationResult {
  return {
    raceId: data.race_id ?? data.raceId ?? fallbackRaceId,
    userId: data.user_id ?? data.userId ?? '',
    status: data.status,
    finishTimeMs: data.finish_time_ms ?? data.finishTimeMs,
    placement: data.placement,
  };
}
