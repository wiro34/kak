/** @format */

import React, { useCallback, useEffect, useRef, useState } from "react";
// import Sockette from "sockette";
import { parseStrokeCommand, stringifyStrokeCommand, StrokeCommand } from "../Stroke";
import { CommandType, Message, UserData, UserName } from "./message";
import { RoomContextProvider } from "./context";
import { newConnection } from "./connection";
import Sockette from "sockette";

export type RoomServiceResponse = {
  connected: boolean;
  users: UserData[];
  createRoom: (name: UserName) => void;
  sendStroke: (strokeCommand: StrokeCommand) => void;
  changeVisibility: (visible: boolean) => void;
};

const useRoomService = (): RoomServiceResponse => {
  const [connected, setConnected] = useState(false);
  const [users, setUsers] = useState<UserData[]>([]);
  const conn = useRef<Sockette>();

  const sendCommand = useCallback(
    (commandType: CommandType, data: any) => {
      if (conn.current) {
        conn.current.json({ message: commandType, data });
      }
    },
    [conn]
  );

  const createRoom = useCallback(
    (name: UserName) => {
      const roomId = "aiueo";
      sendCommand("createRoom", { name, roomId });
    },
    [sendCommand]
  );

  const recvStroke = useCallback(
    (name: UserName, stroke: string) => {
      const user = users.find((u) => u.name === name);
      if (user) {
        const rest = users.filter((u) => u.name !== name);
        const strokeCommand = parseStrokeCommand(stroke);
        if (strokeCommand.command === "draw") {
          user.strokeList.push(strokeCommand.stroke);
        } else {
          user.strokeList.pop();
        }
        setUsers([...rest, { ...user, strokeList: user.strokeList }]);
      }
    },
    [users, setUsers]
  );

  const recvChangeVisibility = useCallback(
    (name: UserName, visible: boolean) => {
      const user = users.find((u) => u.name === name);
      if (user) {
        const rest = users.filter((u) => u.name !== name);
        setUsers([...rest, { ...user, visible }]);
      }
    },
    [users, setUsers]
  );

  const onReceiveMessage = useCallback(
    (message: Message) => {
      switch (message.type) {
        case "connect":
          setUsers([...users, { name: message.payload.name, strokeList: [], visible: true }]);
          break;
        case "disconnect":
          setUsers(users.filter((u) => u.name !== message.payload.name));
          break;
        case "recvDraw":
          recvStroke(message.payload.name, message.payload.strokeCommand);
          break;
        case "changeVisibility":
          recvChangeVisibility(message.payload.name, message.payload.visible);
          break;
      }
    },
    [users, setUsers, recvStroke, recvChangeVisibility]
  );

  const sendStroke = useCallback(
    (strokeCommand: StrokeCommand) => {
      // TODO: バッファリング
      if (users[0]) {
        if (strokeCommand.command === "draw") {
          onReceiveMessage({
            type: "recvDraw",
            payload: {
              name: users[0].name,
              strokeCommand: stringifyStrokeCommand(strokeCommand),
            },
          });
        } else {
          onReceiveMessage({
            type: "recvDraw",
            payload: {
              name: users[0].name,
              strokeCommand: "undo",
            },
          });
        }
      }
    },
    [users, onReceiveMessage]
  );

  const changeVisibility = useCallback(
    (visible: boolean) => {
      // for debug
      onReceiveMessage({
        type: "changeVisibility",
        payload: { name: "foobar", visible },
      });
    },
    [users, setUsers, recvStroke, recvChangeVisibility]
  );

  useEffect(() => {
    const f = (e: any) => {
      console.log(e);
    };
    conn.current = newConnection(
      f,
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

    // for debug
    onReceiveMessage({ type: "connect", payload: { name: "foobar" } });

    return () => {
      if (conn.current) {
        conn.current.close();
        conn.current = undefined;
      }
      setUsers([]);
    };

    // eslint-disable-next-line
  }, []);

  return { connected, users, createRoom, sendStroke, changeVisibility };
};

export default useRoomService;

export const Provider = ({ children }: { children: React.ReactNode }) => {
  const roomService = useRoomService();
  return <RoomContextProvider value={roomService}>{children}</RoomContextProvider>;
};

export class AppConnection {
  // private sockette: Sockette;

  constructor() {
    // this.sockette = new Sockette(`?roomId=${roomId}`, {
    //   timeout: WS_TIMEOUT,
    //   maxAttempts: WS_MAX_ATTEMPTS,
    //   onmessage: (e: any) => this.onReceiveMessage(e),
    //   onopen: (e) => console.log("Connected!", e),
    //   onclose: (e: any) => console.log(e),
    //   onerror: (e: any) => console.error(e),
    // });
  }

  close() {}
}
