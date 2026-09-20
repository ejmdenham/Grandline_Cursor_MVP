const { describe, it } = require("node:test");
const assert = require("node:assert/strict");
const {
  GetCommand,
  QueryCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
const { createHandler, resolveRoute, parseJsonBody } = require("./handler");

const RACES = "races-dev";
const RESULTS = "results-dev";

function condFail() {
  const err = new Error("The conditional request failed");
  err.name = "ConditionalCheckFailedException";
  return err;
}

class MemoryDoc {
  constructor() {
    this.races = new Map();
    this.results = new Map();
  }

  seedRace(race) {
    this.races.set(race.id, race);
  }

  resultKey(raceId, userId) {
    return `${raceId}#${userId}`;
  }

  async send(command) {
    const name = command.constructor.name;
    const input = command.input;
    if (command instanceof GetCommand || name === "GetCommand") {
      if (input.TableName === RACES) {
        return { Item: this.races.get(input.Key.id) };
      }
      return { Item: this.results.get(this.resultKey(input.Key.race_id, input.Key.user_id)) };
    }
    if (command instanceof QueryCommand || name === "QueryCommand") {
      if (input.IndexName === "by-invite-code") {
        const code = input.ExpressionAttributeValues[":code"];
        const found = [...this.races.values()].filter((row) => row.invite_code === code);
        return { Items: found.slice(0, input.Limit || found.length) };
      }
      const raceId = input.ExpressionAttributeValues[":id"];
      return {
        Items: [...this.results.values()].filter((row) => row.race_id === raceId),
      };
    }
    if (command instanceof UpdateCommand || name === "UpdateCommand") {
      const key = this.resultKey(input.Key.race_id, input.Key.user_id);
      const existing = this.results.get(key);
      const cond = input.ConditionExpression || "";
      if (cond.includes("#status <> :finished") && existing && existing.status === "finished") {
        throw condFail();
      }
      const values = input.ExpressionAttributeValues;
      const next = existing
        ? { ...existing }
        : { race_id: input.Key.race_id, user_id: input.Key.user_id };
      next.name = values[":name"] ?? next.name;
      next.updated_at = values[":now"];
      if (values[":status"]) next.status = values[":status"];
      if (values[":finished"] && values[":ms"] != null) next.status = values[":finished"];
      if (values[":ms"] != null && next.finish_time_ms == null) next.finish_time_ms = values[":ms"];
      if (values[":ms"] != null && next.finished_at == null) next.finished_at = values[":now"];
      if (next.started_at == null) next.started_at = values[":now"];
      this.results.set(key, next);
      return { Attributes: { ...next } };
    }
    throw new Error(`unhandled command ${name}`);
  }
}

function eventFor({ routeKey, id, inviteCode, body, claims, method, path }) {
  return {
    routeKey,
    rawPath: path,
    pathParameters: id ? { id } : undefined,
    queryStringParameters: inviteCode ? { inviteCode } : undefined,
    body: body == null ? undefined : JSON.stringify(body),
    requestContext: {
      http: { method, path },
      authorizer: claims ? { jwt: { claims } } : undefined,
    },
  };
}

function createTestHandler(doc) {
  return createHandler({
    doc,
    getRacesTable: () => RACES,
    getResultsTable: () => RESULTS,
    nowIso: () => "2026-09-20T13:00:00.000Z",
  });
}

const SAMPLE_RACE = {
  id: "race-1",
  name: "Spring 5K",
  invite_code: "ABC123",
  checkpoints: [{ order: 1, lat: 1, lng: 2 }],
  amot: ["run"],
  start_window: "2026-09-20T12:00:00Z",
  paid: false,
};

describe("resolveRoute", () => {
  it("keeps invite and id lookups distinct from leaderboard", () => {
    assert.equal(
      resolveRoute(eventFor({ routeKey: "GET /races", method: "GET", inviteCode: "ABC123", path: "/races" })).type,
      "byInvite"
    );
    assert.equal(
      resolveRoute(eventFor({ routeKey: "GET /races/{id}", method: "GET", id: "race-1", path: "/races/race-1" })).type,
      "byId"
    );
    assert.equal(
      resolveRoute(
        eventFor({
          routeKey: "GET /races/{id}/leaderboard",
          method: "GET",
          id: "race-1",
          path: "/races/race-1/leaderboard",
        })
      ).type,
      "leaderboard"
    );
    assert.equal(
      resolveRoute(
        eventFor({
          routeKey: "PUT /races/{id}/participation",
          method: "PUT",
          id: "race-1",
          path: "/races/race-1/participation",
        })
      ).type,
      "participation"
    );
  });
});

describe("parseJsonBody", () => {
  it("parses JSON and rejects invalid payloads", () => {
    assert.deepEqual(parseJsonBody({ body: '{"status":"in_progress"}' }), { status: "in_progress" });
    assert.equal(parseJsonBody({ body: "{nope" }), null);
    assert.deepEqual(parseJsonBody({}), {});
  });
});

describe("races handler", () => {
  it("returns a race by invite code without touching results", async () => {
    const doc = new MemoryDoc();
    doc.seedRace(SAMPLE_RACE);
    const handler = createTestHandler(doc);
    const res = await handler(
      eventFor({ routeKey: "GET /races", method: "GET", inviteCode: "ABC123", path: "/races" })
    );
    assert.equal(res.statusCode, 200);
    assert.deepEqual(JSON.parse(res.body), SAMPLE_RACE);
  });

  it("returns a race by id", async () => {
    const doc = new MemoryDoc();
    doc.seedRace(SAMPLE_RACE);
    const handler = createTestHandler(doc);
    const res = await handler(
      eventFor({ routeKey: "GET /races/{id}", method: "GET", id: "race-1", path: "/races/race-1" })
    );
    assert.equal(res.statusCode, 200);
    assert.equal(JSON.parse(res.body).name, "Spring 5K");
  });

  it("does not treat leaderboard as get-by-id", async () => {
    const doc = new MemoryDoc();
    doc.seedRace(SAMPLE_RACE);
    const handler = createTestHandler(doc);
    const res = await handler(
      eventFor({
        routeKey: "GET /races/{id}/leaderboard",
        method: "GET",
        id: "race-1",
        path: "/races/race-1/leaderboard",
      })
    );
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.race_id, "race-1");
    assert.equal(body.race_name, "Spring 5K");
    assert.deepEqual(body.entries, []);
    assert.equal(body.checkpoints, undefined);
  });

  it("returns 404 for a missing race on leaderboard and get-by-id", async () => {
    const handler = createTestHandler(new MemoryDoc());
    const missingBoard = await handler(
      eventFor({
        routeKey: "GET /races/{id}/leaderboard",
        method: "GET",
        id: "missing",
        path: "/races/missing/leaderboard",
      })
    );
    const missingRace = await handler(
      eventFor({ routeKey: "GET /races/{id}", method: "GET", id: "missing", path: "/races/missing" })
    );
    assert.equal(missingBoard.statusCode, 404);
    assert.equal(missingRace.statusCode, 404);
  });

  it("writes in_progress then finished and computes placement", async () => {
    const doc = new MemoryDoc();
    doc.seedRace(SAMPLE_RACE);
    const handler = createTestHandler(doc);

    const start = await handler(
      eventFor({
        routeKey: "PUT /races/{id}/participation",
        method: "PUT",
        id: "race-1",
        path: "/races/race-1/participation",
        body: { status: "in_progress" },
        claims: { sub: "user-a", preferred_username: "Alex" },
      })
    );
    assert.equal(start.statusCode, 200);
    assert.equal(JSON.parse(start.body).status, "in_progress");

    await handler(
      eventFor({
        routeKey: "PUT /races/{id}/participation",
        method: "PUT",
        id: "race-1",
        path: "/races/race-1/participation",
        body: { status: "finished", finish_time_ms: 400000 },
        claims: { sub: "user-b", preferred_username: "Bea" },
      })
    );

    const finish = await handler(
      eventFor({
        routeKey: "PUT /races/{id}/participation",
        method: "PUT",
        id: "race-1",
        path: "/races/race-1/participation",
        body: { status: "finished", finish_time_ms: 324000 },
        claims: { sub: "user-a", preferred_username: "Alex" },
      })
    );
    assert.equal(finish.statusCode, 200);
    assert.deepEqual(JSON.parse(finish.body), {
      race_id: "race-1",
      user_id: "user-a",
      status: "finished",
      finish_time_ms: 324000,
      placement: 1,
    });

    const board = await handler(
      eventFor({
        routeKey: "GET /races/{id}/leaderboard",
        method: "GET",
        id: "race-1",
        path: "/races/race-1/leaderboard",
      })
    );
    const entries = JSON.parse(board.body).entries;
    assert.equal(entries[0].name, "Alex");
    assert.equal(entries[0].user_id, "user-a");
    assert.equal(entries[0].placement, 1);
    assert.equal(entries[1].name, "Bea");
    assert.equal(entries[1].placement, 2);
  });

  it("rejects finished -> in_progress and keeps the original finish time", async () => {
    const doc = new MemoryDoc();
    doc.seedRace(SAMPLE_RACE);
    const handler = createTestHandler(doc);
    const claims = { sub: "user-a", email: "a@x.co" };

    await handler(
      eventFor({
        routeKey: "PUT /races/{id}/participation",
        method: "PUT",
        id: "race-1",
        path: "/races/race-1/participation",
        body: { status: "finished", finish_time_ms: 1000 },
        claims,
      })
    );
    const downgrade = await handler(
      eventFor({
        routeKey: "PUT /races/{id}/participation",
        method: "PUT",
        id: "race-1",
        path: "/races/race-1/participation",
        body: { status: "in_progress" },
        claims,
      })
    );
    assert.equal(downgrade.statusCode, 409);

    const again = await handler(
      eventFor({
        routeKey: "PUT /races/{id}/participation",
        method: "PUT",
        id: "race-1",
        path: "/races/race-1/participation",
        body: { status: "finished", finish_time_ms: 9999 },
        claims,
      })
    );
    assert.equal(JSON.parse(again.body).finish_time_ms, 1000);
  });

  it("rejects invalid finish_time_ms and missing subject", async () => {
    const doc = new MemoryDoc();
    doc.seedRace(SAMPLE_RACE);
    const handler = createTestHandler(doc);
    const badTime = await handler(
      eventFor({
        routeKey: "PUT /races/{id}/participation",
        method: "PUT",
        id: "race-1",
        path: "/races/race-1/participation",
        body: { status: "finished", finish_time_ms: 0 },
        claims: { sub: "user-a" },
      })
    );
    const noSub = await handler(
      eventFor({
        routeKey: "PUT /races/{id}/participation",
        method: "PUT",
        id: "race-1",
        path: "/races/race-1/participation",
        body: { status: "in_progress" },
        claims: {},
      })
    );
    assert.equal(badTime.statusCode, 400);
    assert.equal(noSub.statusCode, 401);
  });
});
