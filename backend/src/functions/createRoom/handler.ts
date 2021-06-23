/** @format */

import { BadRequestResult, responseMessage, SuccessResult, ValidatedAPIGatewayProxyHandler } from "@libs/apiGateway";
import { putRecord, queryRecord } from "@libs/dynamodb";
import { middyfy } from "@libs/lambda";
import { convertRecordToUserData, extract, Record, UserData } from "@libs/models";
import makeIdentity from "@libs/identity";
import { APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import Schema from "./schema";
import { broadcastMessage } from "@libs/broadcast";
import { userJoined } from "@functions/joinRoom/handler";

function roomCreated(id: string, users: UserData[]) {
  return {
    message: "roomCreated",
    payload: { id, users },
  };
}

function roomAlreadyUsed() {
  return {
    message: "roomAlreadyUsed",
    payload: {},
  };
}

/**
 * ルームの作成
 */
const createRoom: ValidatedAPIGatewayProxyHandler<Schema> = async (event): Promise<APIGatewayProxyResult> => {
  if (typeof event.body === "string") {
    console.log("WARN: event.body is string.");
    event.body = JSON.parse(event.body as any) as Schema;
  }
  const {
    payload: { roomId, nickname },
  } = event.body;
  if (!nickname) {
    return { statusCode: 400, body: "Nickname is empty" };
  }
  const connectionId = event.requestContext.connectionId;
  const id = makeIdentity(nickname, event.requestContext.identity.sourceIp);

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

  let myData: Record | undefined;
  let others: Record[] = [];
  if (records) {
    [myData, others] = extract(records, (r) => r.id === id);
  }

  // 既に部屋が存在していて、自分以外が作成していた場合はエラー
  if (myData && !myData.owner) {
    await responseMessage(roomAlreadyUsed(), event.requestContext);
    return new BadRequestResult("roomAlreadyUsed");
  }

  if (myData) {
    // 既に部屋が存在していて、自分が管理者の場合は connectionId を更新
    myData = { ...myData, id, nickname, connectionId, connected: true };
  } else {
    // 新しくルームを作成
    myData = {
      key: `room:${roomId}`,
      id,
      roomId: roomId,
      connectionId,
      nickname,
      role: "dealer",
      visible: true,
      eyeClosed: false,
      owner: true,
      strokeList: [],
      connected: true,
    };
  }
  await putRecord(myData);

  // connection レコードにルームID等を設定
  await putRecord({ key: `connection:${connectionId}`, id: connectionId, nickname, roomId });

  await responseMessage(roomCreated(id, [myData, ...others].map(convertRecordToUserData)), event.requestContext);

  // 既にルームが存在している場合、他のユーザに通知する
  if (others) {
    await broadcastMessage(others, userJoined(id, convertRecordToUserData(myData)), event.requestContext);
  }

  return new SuccessResult("success");
};

export const main = middyfy(createRoom);
