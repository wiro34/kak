/** @format */

import { Stroke } from "../Stroke";

/**
 * サーバとやり取りするコマンド種別
 */
export type CommandType = "createRoom" | "sendMessage";

/**
 * 各ユーザにブロードキャストするメッセージの型
 */
export type Message =
  | { type: "connect"; payload: { name: UserName } }
  | { type: "disconnect"; payload: { name: UserName } }
  | { type: "createRoom"; payload: { name: UserName; roomId: string } }
  | { type: "recvDraw"; payload: { name: UserName; strokeCommand: string } }
  | { type: "changeVisibility"; payload: { name: UserName; visible: boolean } };

/**
 * ユーザニックネーム
 */
export type UserName = string;

/**
 * ユーザ情報
 */
export type UserData = {
  name: UserName;
  strokeList: Stroke[];
  visible: boolean;
};
