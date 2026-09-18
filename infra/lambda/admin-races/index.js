const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  ScanCommand,
  GetCommand,
  PutCommand,
  UpdateCommand,
  DeleteCommand,
} = require("@aws-sdk/lib-dynamodb");
const { v4: uuidv4 } = require("uuid");

const client = new DynamoDBClient({});
const doc = DynamoDBDocumentClient.from(client);

const TABLE_NAME = process.env.RACES_TABLE_NAME;

const corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-headers": "Content-Type,Authorization",
};

function jsonResponse(statusCode, body, headers = {}) {
  return {
    statusCode,
    headers: { "content-type": "application/json", ...corsHeaders, ...headers },
    body: JSON.stringify(body),
  };
}

function isAdmin(event) {
  const claims = event.requestContext?.authorizer?.jwt?.claims ?? {};
  const groups = claims["cognito:groups"];
  if (!groups) {
    console.warn("isAdmin: no cognito:groups in JWT claims. Claim keys:", Object.keys(claims).join(","));
    return false;
  }
  // API Gateway HTTP API v2 passes JWT claims as strings; cognito:groups may be "[admin]" or "[admin, users]"
  let list;
  if (Array.isArray(groups)) {
    list = groups;
  } else if (typeof groups === "string") {
    // Handle JSON-encoded array string like "[admin]" or "[admin, users]"
    const trimmed = groups.trim();
    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        list = JSON.parse(trimmed);
      } catch {
        // Fallback: parse as comma-separated inside brackets
        list = trimmed.slice(1, -1).split(",").map(s => s.trim()).filter(Boolean);
      }
    } else {
      list = trimmed.split(",").map(s => s.trim()).filter(Boolean);
    }
  } else {
    list = [];
  }
  const ok = list.includes("admin");
  if (!ok) console.warn("isAdmin: cognito:groups present but no admin. Groups:", JSON.stringify(list));
  return ok;
}

exports.handler = async (event) => {
  if (!TABLE_NAME) {
    return jsonResponse(500, { error: "RACES_TABLE_NAME not set" });
  }

  if (!isAdmin(event)) {
    return jsonResponse(403, { error: "Admin required" });
  }

  const requestContext = event.requestContext || {};
  const http = requestContext.http || {};
  let method = http.method;
  if (!method && event.routeKey) {
    const m = String(event.routeKey).match(/^(GET|POST|PUT|DELETE|PATCH)\s/);
    if (m) method = m[1];
  }
  const pathParams = event.pathParameters || {};
  let body = {};
  if (event.body && typeof event.body === "string") {
    try {
      body = event.body.trim() ? JSON.parse(event.body) : {};
    } catch (e) {
      console.error("JSON.parse(body) failed:", e.message);
      return jsonResponse(400, { error: "Invalid JSON body" });
    }
  }

  try {
    if (method === "GET" && !pathParams.id) {
      const { Items } = await doc.send(new ScanCommand({ TableName: TABLE_NAME }));
      return jsonResponse(200, { races: Items || [] });
    }

    if (method === "GET" && pathParams.id) {
      const { Item } = await doc.send(
        new GetCommand({
          TableName: TABLE_NAME,
          Key: { id: pathParams.id },
        })
      );
      if (!Item) return jsonResponse(404, { error: "Race not found" });
      return jsonResponse(200, Item);
    }

    if (method === "POST" && !pathParams.id) {
      const id = uuidv4();
      const created_at = new Date().toISOString();
      const race = {
        id,
        name: body.name ?? "",
        checkpoints: Array.isArray(body.checkpoints) ? body.checkpoints : [],
        amot: Array.isArray(body.amot) ? body.amot : [],
        start_window: String(body.start_window ?? ""),
        invite_code: String(body.invite_code ?? ""),
        paid: Boolean(body.paid ?? false),
        created_at,
      };
      if (body.organizer_id != null) race.organizer_id = body.organizer_id;
      await doc.send(
        new PutCommand({
          TableName: TABLE_NAME,
          Item: race,
        })
      );
      return jsonResponse(201, race);
    }

    if (method === "PUT" && pathParams.id) {
      const id = pathParams.id;
      const updates = [];
      const names = {};
      const values = {};
      const allowed = ["name", "checkpoints", "amot", "start_window", "invite_code", "paid", "organizer_id"];
      for (const key of allowed) {
        if (body[key] !== undefined) {
          const alias = `#${key}`;
          names[alias] = key;
          values[`:${key}`] = body[key];
          updates.push(`${alias} = :${key}`);
        }
      }
      if (updates.length === 0) {
        return jsonResponse(400, { error: "No fields to update" });
      }
      const result = await doc.send(
        new UpdateCommand({
          TableName: TABLE_NAME,
          Key: { id },
          UpdateExpression: "SET " + updates.join(", "),
          ExpressionAttributeNames: names,
          ExpressionAttributeValues: values,
          ReturnValues: "ALL_NEW",
        })
      );
      return jsonResponse(200, result.Attributes);
    }

    if (method === "DELETE" && pathParams.id) {
      await doc.send(
        new DeleteCommand({
          TableName: TABLE_NAME,
          Key: { id: pathParams.id },
        })
      );
      return { statusCode: 204, headers: corsHeaders, body: "" };
    }

    return jsonResponse(405, { error: "Method not allowed" });
  } catch (err) {
    console.error("admin-races Lambda error:", err?.name, err?.message, err?.stack);
    return jsonResponse(500, {
      error: "Internal server error",
      message: err?.message ?? String(err),
      name: err?.name ?? "Error",
    });
  }
};
