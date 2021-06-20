/** @format */

import "source-map-support/register";

import { NotFoundResult, sendMessage, ValidatedAPIGatewayProxyHandler } from "@libs/apiGateway";
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
 * ブロードキャストするメッセージ送信
 */
const broadcast: ValidatedAPIGatewayProxyHandler<Schema> = async (event): Promise<APIGatewayProxyResult> => {
  const { TABLE_NAME } = process.env;

  // TODO:
  if (typeof event.body === "string") {
    console.log("WARN: event.body is string.");
    event.body = JSON.parse(event.body as any) as Schema;
  }
  const {
    payload: { roomId, type, data },
  } = event.body;
  console.log(event.body);
  if (!roomId) {
    return { statusCode: 400, body: "Room id is empty" };
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
    throw new Error("Room data are not found");
    // await sendMessage(event.requestContext, roomNotFound(roomId));
    // return new NotFoundResult(`Room id is already used: roomId=${roomId}`);
  }
  console.log(connectionId, res);

  // 描画ならDBに追加
  if (type === "draw") {
    const myData = res.Items.find((item) => item.connectionId === connectionId) as RoomData | undefined;
    if (!myData) {
      throw new Error("My Data not found");
    }
    const roomData: RoomData = { ...myData, strokeList: [...myData.strokeList, (data as any).strokeCommand] };
    const putParams: DynamoDB.DocumentClient.PutItemInput = {
      TableName: TABLE_NAME,
      Item: roomData,
    };
    await dynamodb.put(putParams).promise();
  }

  // ブロードキャスト
  const promiseList = res.Items.map((item) => {
    console.log(item.connectionId, connectionId);
    if (item.connectionId !== connectionId) {
      console.log("SEND!!");
      return sendMessage(event.requestContext, item.connectionId, event.body);
    }
  });
  await Promise.all(promiseList);

  return { statusCode: 200, body: "Data sent." };
};

export const main = middyfy(broadcast);
