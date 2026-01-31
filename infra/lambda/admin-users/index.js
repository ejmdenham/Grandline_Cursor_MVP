const {
  CognitoIdentityProviderClient,
  ListUsersCommand,
  AdminCreateUserCommand,
  AdminGetUserCommand,
  AdminDisableUserCommand,
  AdminDeleteUserCommand,
} = require("@aws-sdk/client-cognito-identity-provider");

const client = new CognitoIdentityProviderClient({});
const USER_POOL_ID = process.env.COGNITO_USER_POOL_ID;

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
  if (!groups) return false;
  const list = Array.isArray(groups) ? groups : (typeof groups === "string" ? groups.split(",") : []);
  return list.includes("admin");
}

function toUserSummary(u) {
  return {
    username: u.Username,
    email: u.Attributes?.find((a) => a.Name === "email")?.Value,
    enabled: u.Enabled,
    userStatus: u.UserStatus,
    created: u.UserCreateDate,
  };
}

exports.handler = async (event) => {
  if (!USER_POOL_ID) {
    return jsonResponse(500, { error: "COGNITO_USER_POOL_ID not set" });
  }

  if (!isAdmin(event)) {
    return jsonResponse(403, { error: "Admin required" });
  }

  const requestContext = event.requestContext || {};
  const http = requestContext.http || {};
  const method = http.method;
  const pathParams = event.pathParameters || {};
  const body = event.body ? JSON.parse(event.body) : {};

  try {
    if (method === "GET" && !pathParams.username) {
      const limit = Math.min(parseInt(event.queryStringParameters?.limit || "60", 10) || 60, 60);
      const { Users } = await client.send(
        new ListUsersCommand({
          UserPoolId: USER_POOL_ID,
          Limit: limit,
        })
      );
      const users = (Users || []).map(toUserSummary);
      return jsonResponse(200, { users });
    }

    if (method === "POST" && !pathParams.username) {
      const { username, temporaryPassword, messageAction } = body;
      if (!username) {
        return jsonResponse(400, { error: "username required" });
      }
      await client.send(
        new AdminCreateUserCommand({
          UserPoolId: USER_POOL_ID,
          Username: username,
          TemporaryPassword: temporaryPassword || undefined,
          MessageAction: messageAction || "SUPPRESS",
          UserAttributes: [
            { Name: "email", Value: username },
            { Name: "email_verified", Value: "true" },
            { Name: "preferred_username", Value: username },
          ],
        })
      );
      const { User } = await client.send(
        new AdminGetUserCommand({
          UserPoolId: USER_POOL_ID,
          Username: username,
        })
      );
      const summary = {
        username: User.Username,
        email: User.UserAttributes?.find((a) => a.Name === "email")?.Value,
        enabled: User.Enabled,
        userStatus: User.UserStatus,
      };
      return jsonResponse(201, summary);
    }

    if (method === "POST" && pathParams.username && event.rawPath?.endsWith("/disable")) {
      const username = pathParams.username;
      await client.send(
        new AdminDisableUserCommand({
          UserPoolId: USER_POOL_ID,
          Username: username,
        })
      );
      return jsonResponse(200, { disabled: true, username });
    }

    if (method === "DELETE" && pathParams.username) {
      const username = pathParams.username;
      await client.send(
        new AdminDeleteUserCommand({
          UserPoolId: USER_POOL_ID,
          Username: username,
        })
      );
      return { statusCode: 204, headers: corsHeaders, body: "" };
    }

    return jsonResponse(405, { error: "Method not allowed" });
  } catch (err) {
    console.error(err);
    const code = err.name === "UsernameExistsException" ? 409 : err.name === "UserNotFoundException" ? 404 : 500;
    return jsonResponse(code, { error: err.message || "Internal server error" });
  }
};
