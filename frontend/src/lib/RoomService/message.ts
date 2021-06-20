/** @format */

import { Stroke } from "../Stroke";

/**
 * サーバとやり取りするコマンド種別
 */
export type CommandType = "createRoom" | "joinRoom" | "broadcast";

/**
 * 各ユーザにブロードキャストするメッセージの型
 */
export type SendMessagePayload =
  | { roomId: string; type: "draw"; data: { nickname: UserName; strokeCommand: string } }
  | { roomId: string; type: "clear"; data: { nickname: UserName } }
  | { roomId: string; type: "changeVisibility"; data: { nickname: UserName; visible: boolean } };

/**
 * ユーザニックネーム
 */
export type UserName = string;

export type RoomId = string;

export type Role = "owner" | "dealer" | "user";

/**
 * ユーザ情報
 */
export type UserData = {
  name: UserName;
  strokeList: Stroke[];
  visible: boolean;
};
