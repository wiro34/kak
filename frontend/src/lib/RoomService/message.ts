/** @format */

import { Stroke } from "../Stroke";

export type RawUserData = {
  id: string;
  nickname: string;
  role: Role;
  strokeList: string[];
  visible: boolean;
  eyeClosed: boolean;
  connected: boolean;
};

/*
 * メッセージ
 */
export type RoomCreatedPayload = { id: UserID; users: RawUserData[] };
export type RoomAlreadyUsedPayload = {};
export type RoomJoinedPayload = { id: string; users: RawUserData[] };
export type NicknameAlreadyUsedPayload = {};
export type RoomNotFoundPayload = {};
export type UserJoinedPayload = { user: RawUserData };
export type UserDisconnectedPayload = { id: string };
export type BroadcastPayload =
  | { type: "draw"; roomId: RoomId; data: { id: UserID; strokeCommand: string } }
  | { type: "clear"; roomId: RoomId; data: { id: UserID } }
  | { type: "changeVisibility"; roomId: RoomId; data: { id: UserID; visible: boolean } }
  | { type: "changeEyeClosed"; roomId: RoomId; data: { id: UserID; eyeClosed: boolean } };
export type Message =
  | { message: "roomCreated"; payload: RoomCreatedPayload }
  | { message: "roomAlreadyUsed"; payload: RoomAlreadyUsedPayload }
  | { message: "roomJoined"; payload: RoomJoinedPayload }
  | { message: "nicknameAlreadyUsed"; payload: NicknameAlreadyUsedPayload }
  | { message: "roomNotFound"; payload: RoomNotFoundPayload }
  | { message: "userDisconnected"; payload: UserDisconnectedPayload }
  | { message: "userJoined"; payload: UserJoinedPayload }
  | { message: "broadcast"; payload: BroadcastPayload };

/**
 * サーバとやり取りするコマンド種別
 */
export type CommandType = "createRoom" | "joinRoom" | "broadcast";

/**
 * ユーザID
 */
export type UserID = string;

/**
 * ルームID
 */
export type RoomId = string;

/**
 * ロール
 */
export type Role = "owner" | "dealer" | "user";

/**
 * ユーザ情報
 */
export type UserData = {
  id: UserID;
  nickname: string;
  role: Role;
  strokeList: Stroke[];
  visible: boolean;
  eyeClosed: boolean;
  connected: boolean;
};
