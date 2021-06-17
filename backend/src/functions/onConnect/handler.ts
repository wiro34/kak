/** @format */

import { ValidatedAPIGatewayProxyHandler } from "@libs/apiGateway";
import { putRecord } from "@libs/dynamodb";
import { middyfy } from "@libs/lambda";
import { APIGatewayProxyResult } from "aws-lambda";
import "source-map-support/register";
import Schema from "./schema";

/**
 * 接続時の処理
 */
const onConnect: ValidatedAPIGatewayProxyHandler<Schema> = async (event): Promise<APIGatewayProxyResult> => {
  const connectionId = event.requestContext.connectionId;

  // connection レコードを登録
  await putRecord({ key: `connection:${connectionId}`, id: connectionId });

  return { statusCode: 200, body: "connected" };
};

export const main = middyfy(onConnect);
