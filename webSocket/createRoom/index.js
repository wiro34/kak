/** @format */

const AWS = require("aws-sdk");
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const { TABLE_NAME } = process.env;

function roomCreated(roomId) {
  return {
    message: "roomCreated",
    payload: { roomId },
  };
}

function sendMessage(event, connectionId, message) {
  const api = new AWS.ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: event.requestContext.domainName + "/" + event.requestContext.stage,
  });

  return api
    .postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify(message),
    })
    .promise();
}

/**
 * ルームの作成
 */
exports.handler = async (event, context) => {
  const {
    data: { name, roomId },
  } = JSON.parse(event.body);
  if (!name || !roomId) {
    return { statusCode: 400, body: "Name or room id is empty" };
  }
  const connectionId = event.requestContext.connectionId;

  // 既に存在するかチェック
  try {
    const getParams = {
      TableName: TABLE_NAME,
      Key: {
        key: { S: `${connectionId}:roomId:${roomId}` },
      },
    };
    const res = await db.getItem(getParams).promise();
    console.log(res);
  } catch (err) {
    return {
      status: 409,
      body: "Room id is already used: " + JSON.stringify(err),
    };
  }

  // ルーム作成
  try {
    const putParams = {
      TableName: TABLE_NAME,
      Item: {
        key: { S: `${connectionId}:roomId:${roomId}` },
        name: { S: name },
        role: { S: "owner" },
      },
    };
    await db.putItem(putParams).promise();
    await sendMessage(event, connectionId, roomCreated(roomId));
  } catch (err) {
    return {
      statusCode: 500,
      body: "Failed to connect: " + JSON.stringify(err),
    };
  }
  return { statusCode: 200, body: "Data sent." };
};
