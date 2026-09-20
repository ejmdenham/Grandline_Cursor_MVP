const STATUS_ORDER = {
  finished: 0,
  in_progress: 1,
  dnf: 2,
};

const MAX_FINISH_TIME_MS = 86_400_000;

function compareEntries(a, b) {
  const statusA = STATUS_ORDER[a.status] ?? 9;
  const statusB = STATUS_ORDER[b.status] ?? 9;
  if (statusA !== statusB) return statusA - statusB;
  if (a.status === "finished") {
    const timeA = a.finish_time_ms ?? Number.POSITIVE_INFINITY;
    const timeB = b.finish_time_ms ?? Number.POSITIVE_INFINITY;
    if (timeA !== timeB) return timeA - timeB;
  }
  if (a.status === "in_progress") {
    const startedA = a.started_at || "";
    const startedB = b.started_at || "";
    if (startedA !== startedB) return startedA < startedB ? -1 : 1;
  }
  return String(a.user_id || "").localeCompare(String(b.user_id || ""));
}

function rankEntries(items) {
  return [...items].sort(compareEntries).map((item, index, list) => {
    if (item.status !== "finished") {
      const copy = { ...item };
      delete copy.placement;
      return copy;
    }
    const placement = list
      .slice(0, index + 1)
      .filter((entry) => entry.status === "finished").length;
    return { ...item, placement };
  });
}

function placementForUser(items, userId) {
  const ranked = rankEntries(items);
  const mine = ranked.find((entry) => entry.user_id === userId);
  return mine && mine.status === "finished" ? mine.placement : undefined;
}

function toLeaderboardEntry(item) {
  const entry = {
    user_id: item.user_id,
    name: item.name,
    status: item.status,
  };
  if (item.status === "finished") {
    if (item.finish_time_ms != null) entry.finish_time_ms = item.finish_time_ms;
    if (item.placement != null) entry.placement = item.placement;
  }
  return entry;
}

function displayNameFromClaims(claims = {}) {
  const preferred = String(claims.preferred_username || "").trim();
  if (preferred) return preferred;
  const email = String(claims.email || "").trim();
  if (email) return email;
  const username = String(claims["cognito:username"] || "").trim();
  if (username) return username;
  const sub = String(claims.sub || "").trim();
  if (sub) return sub.slice(0, 8);
  return "Racer";
}

function validateFinishTimeMs(value) {
  return Number.isInteger(value) && value > 0 && value < MAX_FINISH_TIME_MS;
}

module.exports = {
  MAX_FINISH_TIME_MS,
  compareEntries,
  rankEntries,
  placementForUser,
  toLeaderboardEntry,
  displayNameFromClaims,
  validateFinishTimeMs,
};
