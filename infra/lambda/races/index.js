const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const {
  DynamoDBDocumentClient,
  GetCommand,
  QueryCommand,
} = require("@aws-sdk/lib-dynamodb");

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

exports.handler = async (event) => {
  if (!TABLE_NAME) {
    return jsonResponse(500, { error: "RACES_TABLE_NAME not set" });
  }

  const requestContext = event.requestContext || {};
  const http = requestContext.http || {};
  const method = http.method;
  const queryParams = event.queryStringParameters || {};
  const pathParams = event.pathParameters || {};

  if (method !== "GET") {
    return jsonResponse(405, { error: "Method not allowed" });
  }

  try {
    let race = null;

    if (queryParams.inviteCode) {
      const { Items } = await doc.send(
        new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: "by-invite-code",
          KeyConditionExpression: "invite_code = :code",
          ExpressionAttributeValues: { ":code": queryParams.inviteCode },
          Limit: 1,
        })
      );
      race = Items && Items[0] ? Items[0] : null;
    } else if (pathParams.id) {
      const { Item } = await doc.send(
        new GetCommand({
          TableName: TABLE_NAME,
          Key: { id: pathParams.id },
        })
      );
      race = Item || null;
    } else {
      return jsonResponse(400, {
        error: "Provide either query inviteCode or path parameter id",
      });
    }

    if (!race) {
      return jsonResponse(404, { error: "Race not found" });
    }

    return jsonResponse(200, race);
  } catch (err) {
    console.error(err);
    return jsonResponse(500, { error: "Internal server error" });
  }
};
