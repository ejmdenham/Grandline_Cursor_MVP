/**
 * Participation API client — start (in_progress) and finish writes.
 * Uses player API base URL and Cognito JWT.
 * Backend returns snake_case; we normalize to camelCase.
 */

import { getSession } from './auth';
import { env } from '../config/env';
import { mapParticipationResponse, type ApiParticipation } from './resultMap';
import type { ParticipationResult, ParticipationStatus } from './resultMap';

export type { ParticipationResult, ParticipationStatus };

export interface PutParticipationInput {
  status: ParticipationStatus;
  finish_time_ms?: number;
}

async function fetchWithAuth(url: string, init: RequestInit = {}): Promise<Response> {
  const session = await getSession();
  if (!session) {
    throw new Error('Not signed in');
  }
  return fetch(url, {
    ...init,
    headers: {
      Authorization: `Bearer ${session.idToken}`,
      'Content-Type': 'application/json',
      ...(init.headers ?? {}),
    },
  });
}

/**
 * Upsert the current user's participation for a race.
 * Start: { status: 'in_progress' }
 * Finish: { status: 'finished', finish_time_ms }
 */
export async function putParticipation(
  raceId: string,
  body: PutParticipationInput
): Promise<ParticipationResult> {
  if (!raceId) {
    throw new Error('Race id is required');
  }
  if (!env.apiBaseUrl) {
    throw new Error('API base URL not configured. Run ./scripts/gen-env.sh from project root.');
  }
  const url = `${env.apiBaseUrl}/races/${encodeURIComponent(raceId)}/participation`;
  const res = await fetchWithAuth(url, {
    method: 'PUT',
    body: JSON.stringify(body),
  });
  if (res.status === 404) {
    throw new Error('Race not found');
  }
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed (${res.status})`);
  }
  const data = (await res.json()) as ApiParticipation;
  return mapParticipationResponse(data, raceId);
}
