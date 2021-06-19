/** @format */

const AWS = require("aws-sdk");
const sendMessage = require("../lib/apigw");
const roomCreated = require("../lib/message");
const db = new AWS.DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });
const { TABLE_NAME } = process.env;

/**
 * ルームの作成
 */
exports.handler = async (event, context) => {
  const { name, roomId } = JSON.parse(event.body);
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
