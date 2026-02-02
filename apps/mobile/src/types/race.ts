/**
 * Race and checkpoint types for app state and API.
 * Matches docs/api/races.md and docs/data-model.md (API returns snake_case from DynamoDB).
 */

export interface Checkpoint {
  order: number;
  lat: number;
  lng: number;
}

export interface Race {
  id: string;
  name: string;
  checkpoints: Checkpoint[];
  amot: string[];
  start_window: string;
  invite_code: string;
  paid: boolean;
  created_at?: string;
  organizer_id?: string;
}

/** Race state for UI: idle (no race), pre-race (joined, not started), in-race, post-race. */
export type RaceState = 'idle' | 'pre-race' | 'in-race' | 'post-race';
