const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { createHandler } = require("./handler");

const client = new DynamoDBClient({});
const doc = DynamoDBDocumentClient.from(client);

exports.handler = createHandler({ doc });
