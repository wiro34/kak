/** @format */

import { APIGatewayEventRequestContextWithWebSocket, sendMessage } from "./apiGateway";
import { Record } from "./models";

/**
 * 指定したユーザにブロードキャストします
 */
export function broadcastMessage(
  users: Record[],
  message: any,
  requestContext: APIGatewayEventRequestContextWithWebSocket
): Promise<any> {
  // 他のユーザに参加者を通知する
  const promiseList = users
    .filter((user) => user.connectionId)
    .map(async (user) => {
      try {
        await sendMessage(user.connectionId, message, requestContext);
      } catch (e) {
        if (e.statusCode === 410) {
          console.log(`Connection was staled: ${user.connectionId}`);
        } else {
          throw e;
        }
      }
    });
  return Promise.all(promiseList);
}
