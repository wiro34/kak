/** @format */

import Sockette from "sockette";
import { WS_API_URL, WS_MAX_ATTEMPTS, WS_TIMEOUT } from "../../config";
import { Message } from "./message";

/**
 * WebSocket コネクションを作成して返します
 */
export function newConnection(
  roomId: string,
  onReceiveMessage: (e: Message) => void,
  onOpen: (e: any) => void,
  onClose: (e: any) => void,
  onError: (e: any) => void
): Sockette {
  return new Sockette(`${WS_API_URL}?roomId=${roomId}`, {
    timeout: WS_TIMEOUT,
    maxAttempts: WS_MAX_ATTEMPTS,
    onmessage: (e: any) => {
      onReceiveMessage(JSON.parse(e.data));
    },
    onopen: (e) => onOpen(e),
    onclose: (e: any) => onClose(e),
    onerror: (e: any) => onError(e),
  });
}
