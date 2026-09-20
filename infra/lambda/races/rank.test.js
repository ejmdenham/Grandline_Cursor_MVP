const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  rankEntries,
  placementForUser,
  toLeaderboardEntry,
  displayNameFromClaims,
  validateFinishTimeMs,
} = require("./rank");

describe("rankEntries", () => {
  it("orders finished by time, then in_progress, then dnf, and places only finishers", () => {
    const ranked = rankEntries([
      { user_id: "d", name: "Dana", status: "dnf" },
      { user_id: "c", name: "Cam", status: "in_progress", started_at: "2026-09-20T12:02:00Z" },
      { user_id: "b", name: "Bea", status: "finished", finish_time_ms: 330000 },
      { user_id: "a", name: "Alex", status: "finished", finish_time_ms: 324000 },
      { user_id: "e", name: "Eve", status: "in_progress", started_at: "2026-09-20T12:00:00Z" },
    ]);
    assert.deepEqual(
      ranked.map((row) => ({ user_id: row.user_id, placement: row.placement, status: row.status })),
      [
        { user_id: "a", placement: 1, status: "finished" },
        { user_id: "b", placement: 2, status: "finished" },
        { user_id: "e", placement: undefined, status: "in_progress" },
        { user_id: "c", placement: undefined, status: "in_progress" },
        { user_id: "d", placement: undefined, status: "dnf" },
      ]
    );
  });

  it("breaks finished ties by user_id", () => {
    const ranked = rankEntries([
      { user_id: "z", status: "finished", finish_time_ms: 100 },
      { user_id: "a", status: "finished", finish_time_ms: 100 },
    ]);
    assert.equal(ranked[0].user_id, "a");
    assert.equal(ranked[0].placement, 1);
    assert.equal(ranked[1].placement, 2);
  });
});

describe("placementForUser", () => {
  it("returns the finished rank for the caller", () => {
    const items = [
      { user_id: "a", status: "finished", finish_time_ms: 200 },
      { user_id: "b", status: "finished", finish_time_ms: 100 },
      { user_id: "c", status: "in_progress" },
    ];
    assert.equal(placementForUser(items, "b"), 1);
    assert.equal(placementForUser(items, "a"), 2);
    assert.equal(placementForUser(items, "c"), undefined);
  });
});

describe("toLeaderboardEntry", () => {
  it("omits finish fields unless finished", () => {
    assert.deepEqual(
      toLeaderboardEntry({
        user_id: "a",
        name: "Alex",
        status: "in_progress",
        finish_time_ms: 1,
        placement: 9,
        started_at: "now",
      }),
      { user_id: "a", name: "Alex", status: "in_progress" }
    );
    assert.deepEqual(
      toLeaderboardEntry({
        user_id: "a",
        name: "Alex",
        status: "finished",
        finish_time_ms: 324000,
        placement: 1,
      }),
      {
        user_id: "a",
        name: "Alex",
        status: "finished",
        finish_time_ms: 324000,
        placement: 1,
      }
    );
  });
});

describe("displayNameFromClaims", () => {
  it("prefers preferred_username, then email, then truncated sub", () => {
    assert.equal(displayNameFromClaims({ preferred_username: "Alex", email: "a@x" }), "Alex");
    assert.equal(displayNameFromClaims({ email: "a@x.co" }), "a@x.co");
    assert.equal(displayNameFromClaims({ sub: "abcdefghij" }), "abcdefgh");
    assert.equal(displayNameFromClaims({}), "Racer");
  });
});

describe("validateFinishTimeMs", () => {
  it("requires a positive integer under 24h", () => {
    assert.equal(validateFinishTimeMs(1), true);
    assert.equal(validateFinishTimeMs(324000), true);
    assert.equal(validateFinishTimeMs(0), false);
    assert.equal(validateFinishTimeMs(86_400_000), false);
    assert.equal(validateFinishTimeMs(12.5), false);
    assert.equal(validateFinishTimeMs("100"), false);
  });
});
