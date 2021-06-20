/** @format */

import "source-map-support/register";

import {
  ConflictResult,
  InternalServerErrorResult,
  responseMessage,
  ValidatedAPIGatewayProxyHandler,
} from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import Schema from "./schema";
import { APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { dynamodb } from "@libs/dynamodb";
import { RoomData } from "@libs/models";

export function roomCreated(roomId, nickname) {
  return {
    message: "roomCreated",
    payload: { roomId, myname: nickname },
  };
}

/**
 * ルームの作成
 */
const createRoom: ValidatedAPIGatewayProxyHandler<Schema> = async (event): Promise<APIGatewayProxyResult> => {
  const { TABLE_NAME } = process.env;

  // TODO:
  if (typeof event.body === "string") {
    console.log("WARN: event.body is string.");
    event.body = JSON.parse(event.body as any) as Schema;
  }
  console.log(event.body);
  const {
    payload: { name, roomId },
  } = event.body;
  if (!name || !roomId) {
    return { statusCode: 400, body: "Name or room id is empty" };
  }
  const connectionId = event.requestContext.connectionId;

  // 既に存在するかチェック
  const queryParams: DynamoDB.DocumentClient.QueryInput = {
    TableName: TABLE_NAME,
    KeyConditionExpression: "#roomId = :roomId",
    ExpressionAttributeNames: {
      "#roomId": "roomId",
    },
    ExpressionAttributeValues: {
      ":roomId": roomId,
    },
  };
  const res = await dynamodb.query(queryParams).promise();
  if (res.Count && res.Count > 0) {
    console.error(`Room id is already used: roomId=${roomId}`);
    return new ConflictResult(`Room id is already used: roomId=${roomId}`);
  }

  // ルーム作成
  try {
    const roomData: RoomData = {
      roomId,
      connectionId,
      nickname: name,
      ip: event.requestContext.identity.sourceIp,
      role: "owner",
      visible: true,
      strokeList: [],
    };
    const putParams = {
      TableName: TABLE_NAME,
      Item: roomData,
    };
    await dynamodb.put(putParams).promise();
    await responseMessage(event.requestContext, roomCreated(roomId, name));
  } catch (err) {
    console.error(err);
    return new InternalServerErrorResult("Failed to connect: " + JSON.stringify(err));
  }
  return { statusCode: 200, body: "Data sent." };
};

export const main = middyfy(createRoom);
