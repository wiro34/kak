/** @format */

import "source-map-support/register";

import { NotFoundResult, responseMessage, sendMessage, ValidatedAPIGatewayProxyHandler } from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import Schema from "./schema";
import { APIGatewayProxyResult } from "aws-lambda";
import { DynamoDB } from "aws-sdk";
import { dynamodb } from "@libs/dynamodb";
import { RoomData } from "@libs/models";

export type UserData = {
  nickname: string;
  strokeList: string[];
  visible: boolean;
};

export function roomNotFound(roomId: string) {
  return {
    message: "roomNotFound",
    payload: { roomId },
  };
}
export function roomJoined(roomId: string, nickname: string, users: UserData[]) {
  return {
    message: "roomJoined",
    payload: { roomId, you: nickname, users },
  };
}

/**
 * ルームに参加
 */
const joinRoom: ValidatedAPIGatewayProxyHandler<Schema> = async (event): Promise<APIGatewayProxyResult> => {
  const { TABLE_NAME } = process.env;

  // TODO:
  if (typeof event.body === "string") {
    console.log("WARN: event.body is string.");
    event.body = JSON.parse(event.body as any) as Schema;
  }
  const {
    payload: { nickname, roomId },
  } = event.body;
  if (!nickname || !roomId) {
    return { statusCode: 400, body: "Nickname or room id is empty" };
  }
  const connectionId = event.requestContext.connectionId;

  // ルーム情報取得
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
  if (!res.Count || res.Count === 0 || !res.Items) {
    await responseMessage(event.requestContext, roomNotFound(roomId));
    return new NotFoundResult(`Room id is already used: roomId=${roomId}`);
  }

  // TODO: ルームに同名のユーザが存在するかチェック

  // 自分の情報登録
  const my = res.Items.find((item) => item.nickname === nickname) as RoomData | undefined;
  let roomData: RoomData;
  if (my) {
    roomData = {
      ...my,
      connectionId,
      ip: event.requestContext.identity.sourceIp,
    };
  } else {
    roomData = {
      roomId,
      nickname,
      connectionId,
      ip: event.requestContext.identity.sourceIp,
      role: "user",
      visible: true,
      strokeList: [],
    };
    res.Items.push(roomData);
  }
  const putParams: DynamoDB.DocumentClient.PutItemInput = {
    TableName: TABLE_NAME,
    Item: roomData,
  };
  await dynamodb.put(putParams).promise();

  // 全ユーザの情報を返す
  const users = res.Items.map((item: RoomData) => ({
    nickname: item.nickname,
    role: item.role,
    strokeList: item.strokeList,
    visible: item.visible,
  }));
  await responseMessage(event.requestContext, roomJoined(roomId, nickname, users));

  // 他のユーザに参加者を通知する
  res.Items.filter((item) => item.roomId !== roomId).forEach((item) => {
    // await sendMessage(item.connectionId, roomJoined(roomId, users));
  });

  return { statusCode: 200, body: "Data sent." };
};

export const main = middyfy(joinRoom);
