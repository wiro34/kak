/** @format */

import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import Sockette from "sockette";
import { parseStrokeCommand, StrokeCommand, strokeCommandToStrokeList } from "../Stroke";
import { newConnection } from "./connection";
import { CommandType, Message, RawUserData, Role, RoomId, UserData, UserID } from "./message";
import { useBroadcast } from "./useBroadcast";
import { useCreateRoom } from "./useCreateRoom";
import { useJoinRoom } from "./useJoinRoom";

export type RoomServiceResponse = {
  connected: boolean;
  error: string | undefined;
  roomState: RoomState;
  createRoom: (nickname: string) => Promise<RoomId>;
  joinRoom: (nickname: string) => Promise<RoomId>;
  sendStroke: (strokeCommand: StrokeCommand) => void;
  sendClear: () => void;
  sendChangeVisibility: (visible: boolean) => void;
};

export type RoomState = {
  id: UserID;
  roomJoined: boolean;
  role: Role;
  users: UserData[];
};

export type RoomStateDispatcher = {
  roomState: RoomState;
  setRoomState: React.Dispatch<React.SetStateAction<RoomState>>;
};

export class AppConn {
  constructor(private readonly socketteRef: MutableRefObject<Sockette | undefined>) {}

  public sendCommand(commandType: CommandType, payload: any): void {
    if (this.socketteRef.current) {
      this.socketteRef.current.json({ message: commandType, payload });
    }
  }
}

export const useRoomService = (roomId: RoomId, nickname: string): RoomServiceResponse => {
  const [roomState, setRoomState] = useState<RoomState>({
    id: "",
    roomJoined: false,
    role: "user",
    users: [],
  });
  const conn = useRef<Sockette>();
  const appConn = new AppConn(conn);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState<string>();

  const deps = { roomState, setRoomState };
  const { createRoom, recvRoomCreated, recvRoomAlreadyUsed } = useCreateRoom(appConn, roomId, deps);
  const { joinRoom, recvRoomJoined, recvNicknameAlreadyUsed, recvRoomNotFound, recvUserJoined, recvUserDisconnected } =
    useJoinRoom(appConn, roomId, deps);
  const { sendStroke, sendClear, sendChangeVisibility, recvBroadcastMessage } = useBroadcast(appConn, roomId, deps);

  // console.log("DEBUG: Update useRoomService");

  const onReceiveMessage = (message: Message) => {
    switch (message.message) {
      case "roomCreated":
        recvRoomCreated(message.payload);
        break;
      case "roomAlreadyUsed":
        recvRoomAlreadyUsed(message.payload);
        break;
      case "roomJoined":
        recvRoomJoined(message.payload);
        break;
      case "nicknameAlreadyUsed":
        recvNicknameAlreadyUsed(message.payload);
        break;
      case "roomNotFound":
        recvRoomNotFound(message.payload);
        break;
      case "userJoined":
        recvUserJoined(message.payload);
        break;
      case "userDisconnected":
        recvUserDisconnected(message.payload);
        break;
      case "broadcast":
        recvBroadcastMessage(message.payload);
        break;
    }
  };

  useEffect(() => {
    const sockette = newConnection(
      roomId,
      onReceiveMessage,
      (e) => {
        setConnected(true);
        conn.current = sockette;
      },
      (e) => {
        setConnected(false);
        conn.current = undefined;
      },
      (e) => {
        setConnected(false);
        setError(e);
        console.error(e);
      }
    );

    // console.log("RoomService initialized!!!");

    return () => {
      if (conn.current) {
        conn.current.close();
        conn.current = undefined;
      }
      setRoomState({
        roomJoined: false,
        id: "",
        role: "user",
        users: [],
      });
    };

    // eslint-disable-next-line
  }, []);

  return { connected, error, roomState, createRoom, joinRoom, sendStroke, sendClear, sendChangeVisibility };
};

/**
 * サーバから送られてきた DB データを UserData に変換する
 */
export function convertRawUserDataToUserData(rawUserData: RawUserData[]): UserData[] {
  return rawUserData.map((data) => {
    return {
      id: data.id,
      nickname: data.nickname,
      role: data.role,
      strokeList: strokeCommandToStrokeList(data.strokeList.map((stroke) => parseStrokeCommand(stroke))),
      visible: data.visible,
      connected: data.connected,
    };
  });
}
