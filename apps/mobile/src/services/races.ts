/**
 * Races API client — fetch by invite code or id.
 * Uses player API base URL and Cognito JWT (Bearer token).
 * See docs/api/races.md.
 */

import { getSession } from './auth';
import { env } from '../config/env';
import type { Race } from '../types/race';

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

/**
 * Get a race by invite code (used in join flow).
 * Returns the race or throws on 404 / network / auth error.
 */
export async function getRaceByInviteCode(inviteCode: string): Promise<Race> {
  const code = inviteCode.trim();
  if (!code) {
    throw new Error('Invite code is required');
  }
  if (!env.apiBaseUrl) {
    throw new Error('API base URL not configured. Run ./scripts/gen-env.sh from project root.');
  }
  const url = `${env.apiBaseUrl}/races?inviteCode=${encodeURIComponent(code)}`;
  const res = await fetchWithAuth(url);
  if (res.status === 404) {
    throw new Error('No race found with that invite code');
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Request failed (${res.status})`);
  }
  const data = (await res.json()) as Race;
  return data;
}

/**
 * Get a race by id.
 */
export async function getRaceById(id: string): Promise<Race> {
  if (!id) {
    throw new Error('Race id is required');
  }
  if (!env.apiBaseUrl) {
    throw new Error('API base URL not configured. Run ./scripts/gen-env.sh from project root.');
  }
  const url = `${env.apiBaseUrl}/races/${encodeURIComponent(id)}`;
  const res = await fetchWithAuth(url);
  if (res.status === 404) {
    throw new Error('Race not found');
  }
  if (!res.ok) {
    const body = await res.text();
    throw new Error(body || `Request failed (${res.status})`);
  }
  const data = (await res.json()) as Race;
  return data;
}
