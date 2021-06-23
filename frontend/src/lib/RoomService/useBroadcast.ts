/** @format */

import { useMutableCallback } from "../../hooks/useMutableCallback";
import { parseStrokeCommand, stringifyStrokeCommand, StrokeCommand } from "../Stroke";
import { BroadcastPayload, RoomId, UserID } from "./message";
import { AppConn, RoomStateDispatcher } from "./RoomService";

export const useBroadcast = (conn: AppConn, roomId: RoomId, { roomState, setRoomState }: RoomStateDispatcher) => {
  /**
   * ワンストロークを送信します
   */
  const sendStroke = (strokeCommand: StrokeCommand) => {
    // TODO: バッファリング必要？
    const data: BroadcastPayload = {
      type: "draw",
      roomId,
      data: {
        id: roomState.id,
        strokeCommand: stringifyStrokeCommand(strokeCommand),
      },
    };
    conn.sendCommand("broadcast", data);
  };

  /**
   * キャンバスクリアを送信します
   */
  const sendClear = () => {
    const data: BroadcastPayload = {
      type: "clear",
      roomId,
      data: {
        id: roomState.id,
      },
    };
    conn.sendCommand("broadcast", data);
  };

  /**
   * キャンバスの表示状態変更を送信します
   */
  const sendChangeVisibility = (visible: boolean) => {
    const data: BroadcastPayload = {
      type: "changeVisibility",
      roomId,
      data: {
        id: roomState.id,
        visible,
      },
    };
    conn.sendCommand("broadcast", data);
  };

  /**
   * ほかユーザのボード表示状態変更を送信します
   */
  const sendChangeEyeClosed = (eyeClosed: boolean) => {
    const data: BroadcastPayload = {
      type: "changeEyeClosed",
      roomId,
      data: {
        id: roomState.id,
        eyeClosed,
      },
    };
    conn.sendCommand("broadcast", data);

    // 自分の状態を更新
    const user = roomState.users.find((u) => u.id === roomState.id);
    if (user) {
      const rest = roomState.users.filter((u) => u.id !== roomState.id);
      setRoomState({ ...roomState, users: [...rest, { ...user, eyeClosed }] });
    }
  };

  /**
   * ワンストロークを受信したときのコールバック
   */
  const recvDraw = useMutableCallback((id: UserID, stroke: string) => {
    const user = roomState.users.find((u) => u.id === id);
    if (user) {
      const rest = roomState.users.filter((u) => u.id !== id);
      const strokeCommand = parseStrokeCommand(stroke);
      if (strokeCommand.command === "draw") {
        user.strokeList.push(strokeCommand.stroke);
      } else {
        user.strokeList.pop();
      }
      setRoomState({ ...roomState, users: [...rest, { ...user, strokeList: user.strokeList }] });
    }
  });

  /**
   * キャンバスクリアを受信したときのコールバック
   */
  const recvClear = useMutableCallback((id: UserID) => {
    const user = roomState.users.find((u) => u.id === id);
    if (user) {
      const rest = roomState.users.filter((u) => u.id !== id);
      setRoomState({ ...roomState, users: [...rest, { ...user, strokeList: [] }] });
    }
  });

  /**
   * キャンバスの表示状態変更を受信したときのコールバック
   */
  const recvChangeVisibility = useMutableCallback((id: UserID, visible: boolean) => {
    const user = roomState.users.find((u) => u.id === id);
    if (user) {
      const rest = roomState.users.filter((u) => u.id !== id);
      setRoomState({ ...roomState, users: [...rest, { ...user, visible }] });
    }
  });

  /**
   * ほかユーザのボード表示状態変更を受信したときのコールバック
   */
  const recvChangeEyeClosed = useMutableCallback((id: UserID, eyeClosed: boolean) => {
    const user = roomState.users.find((u) => u.id === id);
    if (user) {
      const rest = roomState.users.filter((u) => u.id !== id);
      setRoomState({ ...roomState, users: [...rest, { ...user, eyeClosed }] });
    }
  });

  /**
   * ブロードキャストメッセージを受信したときのコールバック
   */
  const recvBroadcastMessage = (payload: BroadcastPayload) => {
    switch (payload.type) {
      case "draw":
        recvDraw(payload.data.id, payload.data.strokeCommand);
        break;
      case "clear":
        recvClear(payload.data.id);
        break;
      case "changeVisibility":
        recvChangeVisibility(payload.data.id, payload.data.visible);
        break;
      case "changeEyeClosed":
        recvChangeEyeClosed(payload.data.id, payload.data.eyeClosed);
        break;
    }
  };

  return {
    sendStroke,
    sendClear,
    sendChangeVisibility,
    sendChangeEyeClosed,
    recvBroadcastMessage,
  };
};
