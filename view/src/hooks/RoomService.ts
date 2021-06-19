/** @format */

import { useCallback, useEffect, useRef, useState } from "react";
import { createCtx } from "./createCtx";
// import Sockette from "sockette";
import {
  parseStrokeCommand,
  stringifyStrokeCommand,
  Stroke,
  StrokeCommand,
} from "../lib/Stroke";

// const WS_API_URL = "wss://cli1k523zd.execute-api.us-east-2.amazonaws.com/dev";
// const WS_TIMEOUT = 5e3;
// const WS_MAX_ATTEMPTS = 3;

type UserName = string;

type Message =
  | {
      type: "connect";
      payload: {
        name: UserName;
      };
    }
  | {
      type: "disconnect";
      payload: {
        name: UserName;
      };
    }
  | {
      type: "recvDraw";
      payload: {
        name: UserName;
        strokeCommand: string;
      };
    }
  | {
      type: "changeVisibility";
      payload: {
        name: UserName;
        visible: boolean;
      };
    };

type UserData = {
  name: UserName;
  strokeList: Stroke[];
  visible: boolean;
};

type RoomContextValue = {
  users: UserData[];
  sendStroke: (strokeCommand: StrokeCommand) => void;
  changeVisibility: (visible: boolean) => void;
};

export const [useRoomContext, RoomContextProvider] =
  createCtx<RoomContextValue>();

const useRoomService = (roomId: string): RoomContextValue => {
  const [users, setUsers] = useState<UserData[]>([]);
  const conn = useRef<AppConnection>();

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
      console.log("recvChangeVisibility", name, users);
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
          setUsers([
            ...users,
            { name: message.payload.name, strokeList: [], visible: true },
          ]);
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

  console.log(users);
  const changeVisibility = (visible: boolean) => {
    //useCallback(
    console.log("changeVisibility", users);
    // for debug
    onReceiveMessage({
      type: "changeVisibility",
      payload: { name: "foobar", visible },
    });
  };
  //   },
  //   [users, setUsers, recvStroke, recvChangeVisibility]
  // );
  console.log(changeVisibility);

  useEffect(() => {
    conn.current = new AppConnection(roomId);
    console.log("RoomService initialized");

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

  return { users, sendStroke, changeVisibility };
};

export default useRoomService;

export class AppConnection {
  // private sockette: Sockette;

  constructor(roomId: string) {
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

// // export function newConnection(
// //   roomId: string,
// //   onReceivedMessage: (e: any) => void
// // ): Sockette {
// //   return new Sockette(`?roomId=${roomId}`, {
// //     timeout: WS_TIMEOUT,
// //     maxAttempts: WS_MAX_ATTEMPTS,
// //     onmessage: (e: any) => onReceivedMessage(e),
// //     onopen: (e) => console.log("Connected!", e),
// //     onclose: (e: any) => console.log(e),
// //     onerror: (e: any) => console.error(e),
// //   });
// // }
