/** @format */

import { ValidatedAPIGatewayProxyHandler } from "@libs/apiGateway";
import { broadcastMessage } from "@libs/broadcast";
import { deleteRecord, getRecord, queryRecord, updateRecord } from "@libs/dynamodb";
import makeIdentity from "@libs/identity";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import Schema from "./schema";

function userDisconnected(id: string) {
  return {
    message: "userDisconnected",
    payload: { id },
  };
}

/**
 * 切断時の処理
 */
const onDisconnect: ValidatedAPIGatewayProxyHandler<Schema> = async (event): Promise<APIGatewayProxyResult> => {
  const connectionId = event.requestContext.connectionId;
  try {
    const record = await getRecord(`connection:${connectionId}`, connectionId);
    const id = makeIdentity(record.nickname, event.requestContext.identity.sourceIp);
    await deleteRecord(`connection:${connectionId}`, connectionId);
    if (record.roomId) {
      await updateRecord(`room:${record.roomId}`, id, { connected: false });
    }

    const records = await queryRecord({
      KeyConditionExpression: "#key = :key",
      ExpressionAttributeNames: { "#key": "key" },
      ExpressionAttributeValues: { ":key": `room:${record.roomId}` },
    });
    if (records) {
      await broadcastMessage(records, userDisconnected(id), event.requestContext);
    }
    return { statusCode: 200, body: "disconnected" };
  } catch (e) {
    console.error(e);
  }
};

export const main = middyfy(onDisconnect);
