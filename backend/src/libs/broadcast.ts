/** @format */

import { APIGatewayEventRequestContextWithWebSocket, sendMessage } from "./apiGateway";
import { dynamodb } from "./dynamodb";
import { RoomData } from "./models";

const { TABLE_NAME } = process.env;

/**
 * 自分以外のユーザにブロードキャストします
 */
export function broadcastMessage(
  requestContext: APIGatewayEventRequestContextWithWebSocket,
  message: any,
  roomId: string,
  myname: string,
  items: RoomData[]
): Promise<any> {
  // 他のユーザに参加者を通知する
  const promiseList = items.map(async (item) => {
    if (item.nickname !== myname) {
      try {
        await sendMessage(requestContext, item.connectionId, message);
      } catch (e) {
        if (e.statusCode === 410) {
          console.log(`Connection was staled, deleting ${item.connectionId}`);
          await dynamodb.delete({ TableName: TABLE_NAME, Key: { roomId, nickname: item.nickname } }).promise();
        } else {
          throw e;
        }
      }
    }
  });
  return Promise.all(promiseList);
}
