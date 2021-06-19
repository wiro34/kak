/** @format */

import { APIGatewayEventRequestContext, APIGatewayProxyEvent, APIGatewayProxyResult, Handler } from "aws-lambda";
import { ApiGatewayManagementApi } from "aws-sdk";
import { FromSchema } from "";

export interface APIGatewayProxyEventWithWebSocket extends APIGatewayProxyEvent {
  requestContext: APIGatewayEventRequestContextWithWebSocket;
}

export interface APIGatewayEventRequestContextWithWebSocket extends APIGatewayEventRequestContext {
  domainName: string;
  connectionId: string;
}

type ValidatedAPIGatewayProxyEvent<S> = Omit<APIGatewayProxyEvent, "body"> & { body: FromSchema<S> };

export type ValidatedEventAPIGatewayProxyEvent<S> = Handler<ValidatedAPIGatewayProxyEvent<S>, APIGatewayProxyResult>;

export class SuccessResult implements APIGatewayProxyResult {
  public constructor(public body: string, public statusCode: number = 200) {}
}

export class BadRequestResult implements APIGatewayProxyResult {
  public constructor(public body: string, public statusCode: number = 400) {}
}

export class ConflictResult implements APIGatewayProxyResult {
  public constructor(public body: string, public statusCode: number = 409) {}
}

export class InternalServerErrorResult implements APIGatewayProxyResult {
  public constructor(public body: string, public statusCode: number = 500) {}
}

/**
 * WebSocket 経由でクライアントにメッセージを送信します
 *
 * @param {*} message
 * @returns
 */
export function sendMessage(requestContext: APIGatewayEventRequestContextWithWebSocket, message) {
  const api = new ApiGatewayManagementApi({
    apiVersion: "2018-11-29",
    endpoint: requestContext.domainName + "/" + requestContext.stage,
  });

  return api
    .postToConnection({
      ConnectionId: requestContext.connectionId,
      Data: JSON.stringify(message),
    })
    .promise();
}

// export const formatJSONResponse = (response: Record<string, unknown>) => {
//   return {
//     statusCode: 200,
//     body: JSON.stringify(response),
//   };
// };
