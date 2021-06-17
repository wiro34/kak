/** @format */

import { NotFoundResult, responseMessage, SuccessResult, ValidatedAPIGatewayProxyHandler } from "@libs/apiGateway";
import { broadcastMessage } from "@libs/broadcast";
import { putRecord, queryRecord } from "@libs/dynamodb";
import makeIdentity from "@libs/identity";
import { middyfy } from "@libs/lambda";
import { convertRecordToUserData, extract, UserData } from "@libs/models";
import { APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import Schema from "./schema";

function roomNotFound() {
  return {
    message: "roomNotFound",
  };
}

function roomJoined(id: string, users: UserData[]) {
  return {
    message: "roomJoined",
    payload: { id, users },
  };
}

export function userJoined(id: string, user: UserData) {
  return {
    message: "userJoined",
    payload: { id, user },
  };
}

/**
 * ルームに参加
 */
const joinRoom: ValidatedAPIGatewayProxyHandler<Schema> = async (event): Promise<APIGatewayProxyResult> => {
  if (typeof event.body === "string") {
    console.log("WARN: event.body is string.");
    event.body = JSON.parse(event.body as any) as Schema;
  }
  const {
    payload: { roomId, nickname },
  } = event.body;
  if (!roomId || !nickname) {
    throw new Error("Nickname or room id is empty");
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
  if (!records || records.length === 0) {
    await responseMessage(roomNotFound(), event.requestContext);
    return new NotFoundResult("Room not found");
  }

  // ルームに同名のユーザが存在するかチェック
  const sameNameUser = records.find((r) => r.nickname === nickname && r.id != id);
  if (sameNameUser) {
    throw new Error();
  }

  let [myData, others] = extract(records, (r) => r.id === id);
  if (myData) {
    // 既に参加している場合はレコードの connectionId を更新
    myData = { ...myData, connectionId, connected: true };
  } else {
    // 新しく参加している場合はレコードを作成
    myData = {
      key: `room:${roomId}`,
      id,
      roomId,
      connectionId,
      nickname,
      role: "user",
      visible: true,
      strokeList: [],
      owner: false,
      connected: true,
    };
  }
  await putRecord(myData);

  // connection レコードにルームID等を設定
  await putRecord({ key: `connection:${connectionId}`, id: connectionId, nickname, roomId });

  // ルームに参加している全ユーザの情報を返す
  const users = [myData, ...others].map(convertRecordToUserData);
  await responseMessage(roomJoined(id, users), event.requestContext);

  // 他のユーザに参加者を通知する
  await broadcastMessage(others, userJoined(id, convertRecordToUserData(myData)), event.requestContext);

  return new SuccessResult("success");
};

export const main = middyfy(joinRoom);
