/** @format */

import Sockette from "sockette";
import { WS_API_URL, WS_MAX_ATTEMPTS, WS_TIMEOUT } from "../../config";
import { Role, BroadcastPayload } from "./message";

export type RawUserData = {
  nickname: string;
  role: Role;
  strokeList: string[];
  visible: boolean;
};

export type Message =
  | { message: "roomCreated"; payload: { roomId: string; myname: string } }
  | { message: "roomJoined"; payload: { roomId: string; myname: string; users: RawUserData[] } }
  | { message: "roomNotFound"; payload: { roomId: string } }
  | { message: "userJoined"; payload: { roomId: string; user: RawUserData } }
  | { message: "broadcast"; payload: BroadcastPayload };

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
