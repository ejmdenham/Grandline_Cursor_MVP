import { env } from "@/config/env";

const baseUrl = env.adminApiUrl.replace(/\/$/, "");

export async function adminFetch(
  path: string,
  options: RequestInit & { token: string }
): Promise<Response> {
  const { token, ...rest } = options;
  const headers: HeadersInit = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
    ...options.headers,
  };
  return fetch(`${baseUrl}${path}`, { ...rest, headers });
}

export async function fetchRaces(token: string): Promise<{ races: Race[] }> {
  const res = await adminFetch("/admin/races", { token });
  if (res.status === 403) throw new AdminRequiredError();
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function fetchRace(id: string, token: string): Promise<Race> {
  const res = await adminFetch(`/admin/races/${id}`, { token });
  if (res.status === 403) throw new AdminRequiredError();
  if (res.status === 404) throw new NotFoundError();
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createRace(race: Omit<Race, "id" | "created_at">, token: string): Promise<Race> {
  const res = await adminFetch("/admin/races", {
    method: "POST",
    body: JSON.stringify(race),
    token,
  });
  if (res.status === 403) throw new AdminRequiredError();
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function updateRace(id: string, updates: Partial<Race>, token: string): Promise<Race> {
  const res = await adminFetch(`/admin/races/${id}`, {
    method: "PUT",
    body: JSON.stringify(updates),
    token,
  });
  if (res.status === 403) throw new AdminRequiredError();
  if (res.status === 404) throw new NotFoundError();
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function deleteRace(id: string, token: string): Promise<void> {
  const res = await adminFetch(`/admin/races/${id}`, { method: "DELETE", token });
  if (res.status === 403) throw new AdminRequiredError();
  if (res.status === 404) throw new NotFoundError();
  if (res.status !== 204 && !res.ok) throw new Error(await res.text());
}

export async function fetchUsers(token: string): Promise<{ users: UserSummary[] }> {
  const res = await adminFetch("/admin/users", { token });
  if (res.status === 403) throw new AdminRequiredError();
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function createUser(
  username: string,
  token: string,
  temporaryPassword?: string
): Promise<UserSummary> {
  const res = await adminFetch("/admin/users", {
    method: "POST",
    body: JSON.stringify({ username, temporaryPassword }),
    token,
  });
  if (res.status === 403) throw new AdminRequiredError();
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function disableUser(username: string, token: string): Promise<void> {
  const res = await adminFetch(`/admin/users/${encodeURIComponent(username)}/disable`, {
    method: "POST",
    token,
  });
  if (res.status === 403) throw new AdminRequiredError();
  if (!res.ok) throw new Error(await res.text());
}

export async function deleteUser(username: string, token: string): Promise<void> {
  const res = await adminFetch(`/admin/users/${encodeURIComponent(username)}`, {
    method: "DELETE",
    token,
  });
  if (res.status === 403) throw new AdminRequiredError();
  if (res.status !== 204 && !res.ok) throw new Error(await res.text());
}

export class AdminRequiredError extends Error {
  constructor() {
    super("Admin required");
    this.name = "AdminRequiredError";
  }
}

export class NotFoundError extends Error {
  constructor() {
    super("Not found");
    this.name = "NotFoundError";
  }
}

export type Race = {
  id: string;
  name: string;
  checkpoints: { order: number; lat: number; lng: number }[];
  amot: string[];
  start_window: string;
  invite_code: string;
  paid: boolean;
  created_at: string;
  organizer_id?: string | null;
};

export type UserSummary = {
  username: string;
  email?: string;
  enabled?: boolean;
  userStatus?: string;
  created?: string;
};
