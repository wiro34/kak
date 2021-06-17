/** @format */

import { APIGatewayEventRequestContext, APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda";
import { ApiGatewayManagementApi } from "aws-sdk";
// import type { FromSchema } from "json-schema-to-ts";

export interface APIGatewayProxyEventWithWebSocket extends APIGatewayProxyEvent {
  requestContext: APIGatewayEventRequestContextWithWebSocket;
}

export interface APIGatewayEventRequestContextWithWebSocket extends APIGatewayEventRequestContext {
  domainName: string;
  connectionId: string;
}

// type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, "body"> & { body: FromSchema<S> };
type ValidatedAPIGatewayProxyEvent<Schema> = Omit<APIGatewayProxyEventWithWebSocket, "body"> & { body: Schema };

export type ValidatedAPIGatewayProxyHandler<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>;

export class SuccessResult implements APIGatewayProxyResult {
  public constructor(public body: string, public statusCode: number = 200) {}
}

export class BadRequestResult implements APIGatewayProxyResult {
  public constructor(public body: string, public statusCode: number = 400) {}
}

export class NotFoundResult implements APIGatewayProxyResult {
  public constructor(public body: string, public statusCode: number = 404) {}
}

export class ConflictResult implements APIGatewayProxyResult {
  public constructor(public body: string, public statusCode: number = 409) {}
}

export class InternalServerErrorResult implements APIGatewayProxyResult {
  public constructor(public body: string, public statusCode: number = 500) {}
}

/**
 * 指定したクライアントにメッセージを送信します
 */
export function sendMessage(
  connectionId: string,
  message: any,
  requestContext: APIGatewayEventRequestContextWithWebSocket
): Promise<{}> {
  const api = new ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: process.env.IS_OFFLINE ? "http://localhost:3001" : requestContext.domainName + "/" + requestContext.stage,
  });

  return api
    .postToConnection({
      ConnectionId: connectionId,
      Data: JSON.stringify(message),
    })
    .promise();
}

/**
 * リクエストしてきたクライアントにメッセージを返信します
 */
export function responseMessage(message: any, requestContext: APIGatewayEventRequestContextWithWebSocket): Promise<{}> {
  return sendMessage(requestContext.connectionId, message, requestContext);
}
