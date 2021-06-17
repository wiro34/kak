/** @format */

import { useRef } from "react";
import { useMutableCallback } from "../../hooks/useMutableCallback";
import { RoomId, RoomJoinedPayload, RoomNotFoundPayload, UserDisconnectedPayload, UserJoinedPayload } from "./message";
import { AppConn, convertRawUserDataToUserData, RoomStateDispatcher } from "./RoomService";

export const useJoinRoom = (conn: AppConn, roomId: RoomId, { roomState, setRoomState }: RoomStateDispatcher) => {
  const promiseRef = useRef<any>();

  /**
   * 指定したニックネームでルームに入室する
   */
  const joinRoom = (nickname: string): Promise<RoomId> => {
    conn.sendCommand("joinRoom", { roomId, nickname });
    return new Promise((resolve, reject) => {
      promiseRef.current = { resolve, reject };
    });
  };

  /**
   * ルームに入室成功したときのコールバック
   */
  const recvRoomJoined = ({ id, users }: RoomJoinedPayload) => {
    if (promiseRef.current) {
      const { resolve, reject } = promiseRef.current;
      const user = users.find((user: any) => user.id === id);
      if (user) {
        setRoomState({
          id: user.id,
          roomJoined: true,
          role: user.role,
          users: convertRawUserDataToUserData(users),
        });
        resolve(roomId);
      } else {
        // TODO: エラーハンドリング
        reject("ERROR: roomJoined");
      }
    }
  };

  /**
   * 名前が被っていたときのコールバック
   */
  const recvNicknameAlreadyUsed = (payload: RoomNotFoundPayload) => {
    if (promiseRef.current) {
      const { reject } = promiseRef.current;
      reject("nicknameAlreadyUsed");
    }
  };

  /**
   * ルームが見つからなかったときのコールバック
   */
  const recvRoomNotFound = (payload: RoomNotFoundPayload) => {
    if (promiseRef.current) {
      const { reject } = promiseRef.current;
      reject("roomNotFound");
    }
  };

  /**
   * 他のユーザがルームに参加したときのコールバック
   */
  const recvUserJoined = useMutableCallback(({ user }: UserJoinedPayload) => {
    const rest = roomState.users.filter((u) => u.id !== user.id);
    const userData = convertRawUserDataToUserData([user])[0];
    setRoomState({ ...roomState, users: [...rest, { ...userData, connected: true }] });
  });

  /**
   * 他のユーザがルームを退室したときのコールバック
   */
  const recvUserDisconnected = useMutableCallback(({ id }: UserDisconnectedPayload) => {
    const user = roomState.users.find((u) => u.id === id);
    if (user) {
      const rest = roomState.users.filter((u) => u.id !== id);
      setRoomState({ ...roomState, users: [...rest, { ...user, connected: false }] });
    }
  });

  return { joinRoom, recvRoomJoined, recvNicknameAlreadyUsed, recvRoomNotFound, recvUserJoined, recvUserDisconnected };
};
