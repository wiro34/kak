/** @format */

import Sockette from "sockette";
import { WS_API_URL, WS_MAX_ATTEMPTS, WS_TIMEOUT } from "../../config";

function onReceiveMessage(e: any, onMessage: (e: any) => void) {
  console.log(e);
}

export function newConnection(
  onMessage: (e: any) => void,
  onOpen: (e: any) => void,
  onClose: (e: any) => void,
  onError: (e: any) => void
): Sockette {
  return new Sockette(WS_API_URL, {
    timeout: WS_TIMEOUT,
    maxAttempts: WS_MAX_ATTEMPTS,
    onmessage: (e: any) => onReceiveMessage(e, onMessage),
    onopen: (e) => onOpen(e),
    onclose: (e: any) => onClose(e),
    onerror: (e: any) => onError(e),
  });
}
