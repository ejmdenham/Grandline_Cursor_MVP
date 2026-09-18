/**
 * Leaderboard API client — fetch results by race.
 * Uses player API base URL and Cognito JWT.
 * Backend may return snake_case; we normalize to camelCase for app types.
 */

import { getSession } from './auth';
import { env } from '../config/env';
import type { LeaderboardResult, LeaderboardEntry, LeaderboardEntryStatus } from '../types/leaderboard';

async function fetchWithAuth(url: string): Promise<Response> {
  const session = await getSession();
  if (!session) {
    throw new Error('Not signed in');
  }
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${session.idToken}`,
    },
  });
}

/** API may return snake_case */
interface ApiEntry {
  name: string;
  status: LeaderboardEntryStatus;
  finish_time_ms?: number;
  placement?: number;
  user_id?: string;
}

function mapEntry(entry: ApiEntry): LeaderboardEntry {
  return {
    name: entry.name,
    status: entry.status,
    finishTimeMs: entry.finish_time_ms ?? entry.finishTimeMs,
    placement: entry.placement,
    userId: entry.user_id ?? entry.userId,
  };
}

/**
 * Fetch leaderboard/results for a race.
 * Returns ordered list: Finished (with time), In progress, DNF.
 * Throws on network/auth error.
 */
export async function getLeaderboard(raceId: string): Promise<LeaderboardResult> {
  if (!raceId) {
    throw new Error('Race id is required');
  }
  if (!env.apiBaseUrl) {
    throw new Error('API base URL not configured. Run ./scripts/gen-env.sh from project root.');
  }
  const url = `${env.apiBaseUrl}/races/${encodeURIComponent(raceId)}/leaderboard`;
  const res = await fetchWithAuth(url);
  if (res.status === 404) {
    throw new Error('Race or leaderboard not found');
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Request failed (${res.status})`);
  }
  const data = (await res.json()) as {
    race_id?: string;
    raceId?: string;
    race_name?: string;
    raceName?: string;
    entries: ApiEntry[];
  };
  const raceIdFromApi = data.race_id ?? data.raceId ?? raceId;
  const raceName = data.race_name ?? data.raceName ?? 'Race';
  const entries = (data.entries ?? []).map(mapEntry);
  return {
    raceId: raceIdFromApi,
    raceName,
    entries,
  };
}
