/** @format */

import { useRef } from "react";
import { RoomAlreadyUsedPayload, RoomCreatedPayload, RoomId } from "./message";
import { AppConn, convertRawUserDataToUserData, RoomStateDispatcher } from "./RoomService";

export const useCreateRoom = (conn: AppConn, roomId: RoomId, { roomState, setRoomState }: RoomStateDispatcher) => {
  const promiseRef = useRef<any>();

  /**
   * ルームを新しく作成して参加します
   */
  const createRoom = (nickname: string): Promise<RoomId> => {
    conn.sendCommand("createRoom", { roomId, nickname });
    return new Promise((resolve, reject) => {
      promiseRef.current = { resolve, reject };
    });
  };

  /**
   * ルーム作成が成功したときのコールバック
   */
  const recvRoomCreated = ({ id, users }: RoomCreatedPayload) => {
    setRoomState({
      ...roomState,
      id,
      role: "owner",
      users: convertRawUserDataToUserData(users),
      roomJoined: true,
    });
    if (promiseRef.current) {
      const { resolve } = promiseRef.current;
      resolve(roomId);
    }
  };

  /**
   * ルーム作成が失敗したときのコールバック
   */
  const recvRoomAlreadyUsed = (payload: RoomAlreadyUsedPayload) => {
    if (promiseRef.current) {
      const { reject } = promiseRef.current;
      reject("roomAlreadyUsed");
    }
  };

  return { createRoom, recvRoomCreated, recvRoomAlreadyUsed };
};
