/**
 * Leaderboard / race result types.
 * Participant status: Finished (with time), In progress, DNF.
 * Names only per Context (no avatars).
 */

export type LeaderboardEntryStatus = 'finished' | 'in_progress' | 'dnf';

export interface LeaderboardEntry {
  /** Display name */
  name: string;
  status: LeaderboardEntryStatus;
  /** Finish time in milliseconds; only set when status === 'finished' */
  finishTimeMs?: number;
  /** 1-based placement when finished; optional until API supports it */
  placement?: number;
  /** User/subject id for highlighting current user */
  userId?: string;
}

export interface LeaderboardResult {
  raceId: string;
  raceName: string;
  entries: LeaderboardEntry[];
}
