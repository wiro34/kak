/** @format */

import React, { useCallback, useEffect, useRef, useState } from "react";
// import Sockette from "sockette";
import { parseStrokeCommand, stringifyStrokeCommand, StrokeCommand, strokeCommandToStrokeList } from "../Stroke";
import { CommandType, Role, RoomId, SendMessagePayload, UserData, UserName } from "./message";
import { RoomContextProvider } from "./context";
import { Message, newConnection, RawUserData } from "./connection";
import Sockette from "sockette";
import { useMutableCallback } from "../../hooks/useMutableCallback";

export type RoomServiceResponse = {
  connected: boolean;
  roomState: RoomState;
  createRoom: (name: UserName) => Promise<RoomId>;
  joinRoom: (name: UserName, roomId: RoomId) => Promise<RoomId>;
  sendStroke: (strokeCommand: StrokeCommand) => void;
  sendClear: () => void;
  sendChangeVisibility: (visible: boolean) => void;
};

type RoomState = {
  name: UserName;
  roomId: RoomId;
  role: Role;
  users: UserData[];
};

const useRoomService = (): RoomServiceResponse => {
  const [connected, setConnected] = useState(false);
  const [roomState, setRoomState] = useState<RoomState>({
    name: "",
    roomId: "",
    role: "user",
    users: [],
  });
  const createRoomPromiseFn = useRef<any>();
  const joinRoomPromiseFn = useRef<any>();
  const conn = useRef<Sockette>();

  console.log("DEBUG: Update useRoomService");

  const sendCommand = useCallback(
    (commandType: CommandType, payload: any) => {
      if (conn.current) {
        conn.current.json({ message: commandType, payload });
      }
    },
    [conn]
  );

  const createRoom = (name: UserName): Promise<RoomId> => {
    // とりあえず適当なものを作成 UUID ほどユニークさは求めない
    const roomId = Math.random().toString(32).substring(2);
    sendCommand("createRoom", { name, roomId });
    setRoomState({ ...roomState, name });
    return new Promise((resolve, reject) => {
      createRoomPromiseFn.current = { resolve, reject };
    });
  };

  const joinRoom = (nickname: UserName, roomId: RoomId): Promise<RoomId> => {
    sendCommand("joinRoom", { nickname, roomId });
    return new Promise((resolve, reject) => {
      joinRoomPromiseFn.current = { resolve, reject };
    });
  };

  const recvDraw = useMutableCallback((nickname: UserName, stroke: string) => {
    const user = roomState.users.find((u) => u.name === nickname);
    if (user) {
      const rest = roomState.users.filter((u) => u.name !== nickname);
      const strokeCommand = parseStrokeCommand(stroke);
      if (strokeCommand.command === "draw") {
        user.strokeList.push(strokeCommand.stroke);
      } else {
        user.strokeList.pop();
      }
      setRoomState({ ...roomState, users: [...rest, { ...user, strokeList: user.strokeList }] });
    }
  });

  const recvClear = useMutableCallback((nickname: UserName) => {
    const user = roomState.users.find((u) => u.name === nickname);
    if (user) {
      const rest = roomState.users.filter((u) => u.name !== nickname);
      setRoomState({ ...roomState, users: [...rest, { ...user, strokeList: [] }] });
    }
  });

  const recvChangeVisibility = useMutableCallback((nickname: UserName, visible: boolean) => {
    const user = roomState.users.find((u) => u.name === nickname);
    if (user) {
      const rest = roomState.users.filter((u) => u.name !== nickname);
      setRoomState({ ...roomState, users: [...rest, { ...user, visible }] });
    }
  });

  const onReceiveSendMessage = (payload: SendMessagePayload) => {
    switch (payload.type) {
      // case "connect":
      //   setUsers([...users, { name: payload.data.nickname, strokeList: [], visible: true }]);
      //   break;
      // case "disconnect":
      //   setUsers(users.filter((u) => u.name !== payload.data.nickname));
      //   break;
      case "draw":
        recvDraw(payload.data.nickname, payload.data.strokeCommand);
        break;
      case "clear":
        recvClear(payload.data.nickname);
        break;
      case "changeVisibility":
        recvChangeVisibility(payload.data.nickname, payload.data.visible);
        break;
    }
  };

  const onReceiveMessage = (message: Message) => {
    switch (message.message) {
      case "roomCreated":
        setRoomState({ ...roomState, roomId: message.payload.roomId, role: "owner", users: [] });
        if (createRoomPromiseFn.current) {
          const { resolve } = createRoomPromiseFn.current;
          resolve(message.payload.roomId);
        }
        break;
      case "roomJoined":
        if (joinRoomPromiseFn.current) {
          const { resolve, reject } = joinRoomPromiseFn.current;
          const users = message.payload.users;
          const you = users.find((user) => user.nickname === message.payload.you);
          if (you) {
            setRoomState({
              roomId: message.payload.roomId,
              name: you.nickname,
              role: you.role,
              users: convertRawUserDataToUserData(users),
            });
            resolve(message.payload);
          } else {
            // TODO: エラーハンドリング
            reject("ERROR: roomJoined");
          }
        }
        break;
      case "roomNotFound":
        if (joinRoomPromiseFn.current) {
          const { reject } = joinRoomPromiseFn.current;
          reject("roomNotFound");
        }
        break;
      case "broadcast":
        onReceiveSendMessage(message.payload);
        break;
    }
  };

  const sendStroke = (strokeCommand: StrokeCommand) => {
    // TODO: バッファリング必要？
    const data: SendMessagePayload = {
      roomId: roomState.roomId,
      type: "draw",
      data: {
        nickname: roomState.name,
        strokeCommand: stringifyStrokeCommand(strokeCommand),
      },
    };
    sendCommand("broadcast", data);
  };

  const sendClear = () => {
    const data: SendMessagePayload = {
      roomId: roomState.roomId,
      type: "clear",
      data: {
        nickname: roomState.name,
      },
    };
    sendCommand("broadcast", data);
  };

  const sendChangeVisibility = (visible: boolean) => {
    const data: SendMessagePayload = {
      roomId: roomState.roomId,
      type: "changeVisibility",
      data: {
        nickname: roomState.name,
        visible,
      },
    };
    sendCommand("broadcast", data);
  };

  useEffect(() => {
    conn.current = newConnection(
      onReceiveMessage,
      (e) => {
        setConnected(true);
      },
      (e) => {
        setConnected(false);
      },
      (e) => {
        setConnected(false);
        console.error(e);
      }
    );
    console.log("RoomService initialized!!!");

    return () => {
      if (conn.current) {
        conn.current.close();
        conn.current = undefined;
      }
      setRoomState({
        name: "",
        roomId: "",
        role: "user",
        users: [],
      });
    };

    // eslint-disable-next-line
  }, []);

  return { connected, roomState, createRoom, joinRoom, sendStroke, sendClear, sendChangeVisibility };
};

// export default useRoomService;

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const roomService = useRoomService();
  return <RoomContextProvider value={roomService}>{children}</RoomContextProvider>;
};

/**
 * サーバから送られてきた DB データを UserData に変換する
 */
function convertRawUserDataToUserData(rawUserData: RawUserData[]): UserData[] {
  return rawUserData.map((data) => {
    return {
      name: data.nickname,
      strokeList: strokeCommandToStrokeList(data.strokeList.map((stroke) => parseStrokeCommand(stroke))),
      visible: data.visible,
    };
  });
}
