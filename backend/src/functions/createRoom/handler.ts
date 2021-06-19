/** @format */

import "source-map-support/register";

import {
  APIGatewayProxyEventWithWebSocket,
  ConflictResult,
  InternalServerErrorResult,
  sendMessage,
} from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";

import Schema from "./schema";

import { DynamoDB } from "aws-sdk";
import { APIGatewayProxyHandler, APIGatewayProxyResult } from "aws-lambda";

const db = new DynamoDB.DocumentClient({ apiVersion: "2012-08-10" });

export function roomCreated(roomId) {
  return {
    message: "roomCreated",
    payload: { roomId },
  };
}

/**
 * ルームの作成
 */
const createRoom: APIGatewayProxyHandler = async (
  event: APIGatewayProxyEventWithWebSocket
): Promise<APIGatewayProxyResult> => {
  const { TABLE_NAME } = process.env;

  const { name, roomId } = JSON.parse(event.body) as Schema;
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
    const res = await db.get(getParams).promise();
    console.log(res);
  } catch (err) {
    return new ConflictResult("Room id is already used: " + JSON.stringify(err));
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
    await db.put(putParams).promise();
    await sendMessage(event.requestContext, roomCreated(roomId));
  } catch (err) {
    return new InternalServerErrorResult("Failed to connect: " + JSON.stringify(err));
  }
  return { statusCode: 200, body: "Data sent." };
};

export const main = middyfy(createRoom);
