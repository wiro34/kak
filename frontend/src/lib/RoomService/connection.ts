/** @format */

import Sockette from "sockette";
import { WS_API_URL, WS_MAX_ATTEMPTS, WS_TIMEOUT } from "../../config";
import { Role, SendMessagePayload } from "./message";

export type RawUserData = {
  nickname: string;
  role: Role;
  strokeList: string[];
  visible: boolean;
};

export type Message =
  | { message: "roomCreated"; payload: { roomId: string } }
  | { message: "roomJoined"; payload: { roomId: string; you: string; users: RawUserData[] } }
  | { message: "roomNotFound"; payload: { roomId: string } }
  | { message: "broadcast"; payload: SendMessagePayload };

export function newConnection(
  onReceiveMessage: (e: Message) => void,
  onOpen: (e: any) => void,
  onClose: (e: any) => void,
  onError: (e: any) => void
): Sockette {
  return new Sockette(WS_API_URL, {
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
