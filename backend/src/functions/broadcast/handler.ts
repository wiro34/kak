/** @format */

import { ValidatedAPIGatewayProxyHandler } from "@libs/apiGateway";
import { broadcastMessage } from "@libs/broadcast";
import { putRecord, queryRecord } from "@libs/dynamodb";
import { middyfy } from "@libs/lambda";
import { extractByConnectionId, Record } from "@libs/models";
import { APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import Schema from "./schema";

/**
 * ブロードキャストするメッセージ送信
 */
const broadcast: ValidatedAPIGatewayProxyHandler<Schema> = async (event): Promise<APIGatewayProxyResult> => {
  if (typeof event.body === "string") {
    console.log("WARN: event.body is string.");
    event.body = JSON.parse(event.body as any) as Schema;
  }
  const {
    payload: { roomId, type, data },
  } = event.body;
  if (!roomId) {
    return { statusCode: 400, body: "Room id is empty" };
  }

  // ルーム情報取得
  const records = await queryRecord({
    KeyConditionExpression: "#key = :key",
    ExpressionAttributeNames: {
      "#key": "key",
    },
    ExpressionAttributeValues: {
      ":key": `room:${roomId}`,
    },
  });
  if (!records) {
    throw new Error("Room data are not found");
  }

  // 自分の情報更新
  const [myData, others] = extractByConnectionId(records, event.requestContext.connectionId);
  let params: Record;
  if (type === "draw") {
    // ストロークを DB に追加
    params = { ...myData, strokeList: [...myData.strokeList, (data as any).strokeCommand] };
  } else if (type === "clear") {
    // DB をクリア
    params = { ...myData, strokeList: [] };
  } else if (type === "changeVisibility") {
    // 表示状態変更
    params = { ...myData, visible: (data as any).visible };
  } else if (type === "changeEyeClosed") {
    // 目の状態変更
    params = { ...myData, eyeClosed: (data as any).eyeClosed };
  } else {
    throw new Error(`Unkown command type: ${type}`);
  }
  await putRecord(params);

  // ブロードキャスト
  await broadcastMessage(others, event.body, event.requestContext);

  return { statusCode: 200, body: "success" };
};

export const main = middyfy(broadcast);
