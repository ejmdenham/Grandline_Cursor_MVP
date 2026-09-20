const {
  GetCommand,
  QueryCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
const {
  rankEntries,
  placementForUser,
  toLeaderboardEntry,
  displayNameFromClaims,
  validateFinishTimeMs,
} = require("./rank");

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "Content-Type,Authorization",
  "access-control-allow-methods": "GET,PUT,OPTIONS",
};

function jsonResponse(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: { "content-type": "application/json", ...corsHeaders, ...headers },
    body: JSON.stringify(body),
  };
}

function resolveRoute(event) {
  const requestContext = event.requestContext || {};
  const http = requestContext.http || {};
  const routeKey = event.routeKey || "";
  let method = http.method;
  if (!method && routeKey) {
    const match = String(routeKey).match(/^(GET|POST|PUT|DELETE|PATCH)\s/);
    if (match) method = match[1];
  }
  const path = http.path || event.rawPath || "";
  const id = event.pathParameters && event.pathParameters.id;
  const inviteCode = event.queryStringParameters && event.queryStringParameters.inviteCode;

  if (
    method === "GET" &&
    (routeKey === "GET /races/{id}/leaderboard" ||
      /\/races\/[^/]+\/leaderboard\/?$/.test(path))
  ) {
    return { type: "leaderboard", method, id };
  }
  if (
    method === "PUT" &&
    (routeKey === "PUT /races/{id}/participation" ||
      /\/races\/[^/]+\/participation\/?$/.test(path))
  ) {
    return { type: "participation", method, id };
  }
  if (method === "GET" && (routeKey === "GET /races" || (!id && inviteCode))) {
    return { type: "byInvite", method, inviteCode };
  }
  if (method === "GET" && (routeKey === "GET /races/{id}" || (id && !String(path).includes("/leaderboard")))) {
    return { type: "byId", method, id };
  }
  if (method === "GET" && !id && !inviteCode) {
    return { type: "badRequest", method };
  }
  return { type: "methodNotAllowed", method };
}

function parseJsonBody(event) {
  let raw = event.body;
  if (raw == null || raw === "") return {};
  if (event.isBase64Encoded && typeof raw === "string") {
    raw = Buffer.from(raw, "base64").toString("utf8");
  }
  if (typeof raw !== "string") return raw;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

function claimsFromEvent(event) {
  return event.requestContext?.authorizer?.jwt?.claims ?? {};
}

async function getRaceById(doc, tableName, id) {
  const { Item } = await doc.send(
    new GetCommand({
      TableName: tableName,
      Key: { id },
    })
  );
  return Item || null;
}

async function getRaceByInvite(doc, tableName, inviteCode) {
  const { Items } = await doc.send(
    new QueryCommand({
      TableName: tableName,
      IndexName: "by-invite-code",
      KeyConditionExpression: "invite_code = :code",
      ExpressionAttributeValues: { ":code": inviteCode },
      Limit: 1,
    })
  );
  return Items && Items[0] ? Items[0] : null;
}

async function queryAllResults(doc, tableName, raceId) {
  const items = [];
  let ExclusiveStartKey;
  do {
    const res = await doc.send(
      new QueryCommand({
        TableName: tableName,
        KeyConditionExpression: "race_id = :id",
        ExpressionAttributeValues: { ":id": raceId },
        ExclusiveStartKey,
      })
    );
    items.push(...(res.Items || []));
    ExclusiveStartKey = res.LastEvaluatedKey;
  } while (ExclusiveStartKey);
  return items;
}

function createHandler({
  doc,
  getRacesTable = () => process.env.RACES_TABLE_NAME,
  getResultsTable = () => process.env.RESULTS_TABLE_NAME,
  nowIso = () => new Date().toISOString(),
} = {}) {
  return async function handler(event) {
    const racesTable = getRacesTable();
    if (!racesTable) {
      return jsonResponse(500, { error: "RACES_TABLE_NAME not set" });
    }

    const route = resolveRoute(event || {});

    try {
      if (route.type === "byInvite") {
        const inviteCode = route.inviteCode || (event.queryStringParameters || {}).inviteCode;
        if (!inviteCode) {
          return jsonResponse(400, {
            error: "Provide either query inviteCode or path parameter id",
          });
        }
        const race = await getRaceByInvite(doc, racesTable, inviteCode);
        if (!race) return jsonResponse(404, { error: "Race not found" });
        return jsonResponse(200, race);
      }

      if (route.type === "byId") {
        if (!route.id) {
          return jsonResponse(400, {
            error: "Provide either query inviteCode or path parameter id",
          });
        }
        const race = await getRaceById(doc, racesTable, route.id);
        if (!race) return jsonResponse(404, { error: "Race not found" });
        return jsonResponse(200, race);
      }

      if (route.type === "leaderboard") {
        const resultsTable = getResultsTable();
        if (!resultsTable) {
          return jsonResponse(500, { error: "RESULTS_TABLE_NAME not set" });
        }
        if (!route.id) {
          return jsonResponse(400, { error: "Race id is required" });
        }
        const race = await getRaceById(doc, racesTable, route.id);
        if (!race) return jsonResponse(404, { error: "Race not found" });
        const items = await queryAllResults(doc, resultsTable, route.id);
        const entries = rankEntries(items).map(toLeaderboardEntry);
        return jsonResponse(200, {
          race_id: race.id,
          race_name: race.name,
          entries,
        });
      }

      if (route.type === "participation") {
        const resultsTable = getResultsTable();
        if (!resultsTable) {
          return jsonResponse(500, { error: "RESULTS_TABLE_NAME not set" });
        }
        const claims = claimsFromEvent(event);
        const userId = claims.sub;
        if (!userId) {
          return jsonResponse(401, { error: "Missing subject" });
        }
        if (!route.id) {
          return jsonResponse(400, { error: "Race id is required" });
        }
        const body = parseJsonBody(event);
        if (body == null) {
          return jsonResponse(400, { error: "Invalid JSON body" });
        }
        const status = body.status;
        if (status !== "in_progress" && status !== "finished") {
          return jsonResponse(400, {
            error: "status must be in_progress or finished",
          });
        }
        if (status === "finished" && !validateFinishTimeMs(body.finish_time_ms)) {
          return jsonResponse(400, {
            error: "finish_time_ms must be an integer between 1 and 86399999",
          });
        }
        const race = await getRaceById(doc, racesTable, route.id);
        if (!race) return jsonResponse(404, { error: "Race not found" });

        const now = nowIso();
        const name = displayNameFromClaims(claims);
        const update =
          status === "in_progress"
            ? {
                TableName: resultsTable,
                Key: { race_id: route.id, user_id: userId },
                UpdateExpression:
                  "SET #name = :name, #status = :status, started_at = if_not_exists(started_at, :now), updated_at = :now",
                ConditionExpression: "attribute_not_exists(#status) OR #status <> :finished",
                ExpressionAttributeNames: { "#name": "name", "#status": "status" },
                ExpressionAttributeValues: {
                  ":name": name,
                  ":status": "in_progress",
                  ":finished": "finished",
                  ":now": now,
                },
                ReturnValues: "ALL_NEW",
              }
            : {
                TableName: resultsTable,
                Key: { race_id: route.id, user_id: userId },
                UpdateExpression:
                  "SET #name = :name, #status = :finished, finish_time_ms = if_not_exists(finish_time_ms, :ms), finished_at = if_not_exists(finished_at, :now), updated_at = :now, started_at = if_not_exists(started_at, :now)",
                ExpressionAttributeNames: { "#name": "name", "#status": "status" },
                ExpressionAttributeValues: {
                  ":name": name,
                  ":finished": "finished",
                  ":ms": body.finish_time_ms,
                  ":now": now,
                },
                ReturnValues: "ALL_NEW",
              };

        let saved;
        try {
          const res = await doc.send(new UpdateCommand(update));
          saved = res.Attributes || {};
        } catch (err) {
          if (err && err.name === "ConditionalCheckFailedException") {
            return jsonResponse(409, {
              error: "Finished participation cannot return to in_progress",
            });
          }
          throw err;
        }

        const items = await queryAllResults(doc, resultsTable, route.id);
        const placement = placementForUser(items, userId);
        const response = {
          race_id: route.id,
          user_id: userId,
          status: saved.status,
        };
        if (saved.finish_time_ms != null) response.finish_time_ms = saved.finish_time_ms;
        if (placement != null) response.placement = placement;
        return jsonResponse(200, response);
      }

      if (route.type === "badRequest") {
        return jsonResponse(400, {
          error: "Provide either query inviteCode or path parameter id",
        });
      }

      return jsonResponse(405, { error: "Method not allowed" });
    } catch (err) {
      console.error(err);
      return jsonResponse(500, { error: "Internal server error" });
    }
  };
}

module.exports = {
  corsHeaders,
  jsonResponse,
  resolveRoute,
  parseJsonBody,
  createHandler,
};
