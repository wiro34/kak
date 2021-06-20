/** @format */

import "source-map-support/register";

import {
  ConflictResult,
  InternalServerErrorResult,
  sendMessage,
  ValidatedAPIGatewayProxyHandler,
} from "@libs/apiGateway";
import { middyfy } from "@libs/lambda";
import Schema from "./schema";
import { APIGatewayProxyResult } from "aws-lambda";
import { dynamodb } from "@libs/dynamodb";

export function roomCreated(roomId) {
  return {
    message: "roomCreated",
    payload: { roomId },
  };
}

/**
 * 接続時の処理
 */
const onConnect: ValidatedAPIGatewayProxyHandler<Schema> = async (event): Promise<APIGatewayProxyResult> => {
  const { TABLE_NAME } = process.env;

  // // TODO:
  // if (typeof event.body === "string") {
  //   console.log("WARN: event.body is string.");
  //   event.body = JSON.parse(event.body as any) as Schema;
  // }
  // console.log(event.body);

  // // const {
  // //   payload: { name, roomId },
  // // } = event.body;
  // // if (!name || !roomId) {
  // //   return { statusCode: 400, body: "Name or room id is empty" };
  // // }
  const connectionId = event.requestContext.connectionId;

  // console.log(TABLE_NAME);
  console.log("$disconnect", connectionId);

  // // 既に存在するかチェック
  // const getParams = {
  //   TableName: TABLE_NAME,
  //   Key: { key: `${connectionId}:roomId:${roomId}` },
  // };
  // const res = await dynamodb.get(getParams).promise();
  // if (res.Item && res.Item.key) {
  //   console.error(`Room id is already used: roomId=${roomId}`);
  //   return new ConflictResult(`Room id is already used: roomId=${roomId}`);
  // }

  // // ルーム作成
  // try {
  //   const putParams = {
  //     TableName: TABLE_NAME,
  //     Item: {
  //       key: `${connectionId}:roomId:${roomId}`,
  //       name: name,
  //       role: "owner",
  //     },
  //   };
  //   await dynamodb.put(putParams).promise();
  //   await sendMessage(event.requestContext, roomCreated(roomId));
  // } catch (err) {
  //   console.error(err);
  //   return new InternalServerErrorResult("Failed to connect: " + JSON.stringify(err));
  // }
  return { statusCode: 200, body: "Data sent." };
};

export const main = middyfy(onConnect);
