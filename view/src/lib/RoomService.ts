/** @format */

import { useCallback, useEffect, useRef, useState } from "react";
// import Sockette from "sockette";
import {
  parseStrokeCommand,
  stringifyStrokeCommand,
  Stroke,
  StrokeCommand,
} from "./Stroke";

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
    };

type UserData = {
  name: UserName;
  strokeList: Stroke[];
};

const useRoomService = (roomId: string) => {
  const [users, setUsers] = useState<UserData[]>([]);
  const conn = useRef<AppConnection>();

  console.log(users);

  const recvStroke = useCallback(
    (name: UserName, stroke: string) => {
      const user = users.find((u) => u.name === name);
      if (user) {
        console.log("received", user.strokeList);
        const rest = users.filter((u) => u.name !== name);
        const strokeCommand = parseStrokeCommand(stroke);
        if (strokeCommand.command === "draw") {
          user.strokeList.push(strokeCommand.stroke);
        } else {
          user.strokeList.pop();
        }
        setUsers([...rest, { name, strokeList: user.strokeList }]);
      }
    },
    [users, setUsers]
  );

  const onReceiveMessage = useCallback(
    (message: Message) => {
      switch (message.type) {
        case "connect":
          console.log("connected!!");
          setUsers([...users, { name: message.payload.name, strokeList: [] }]);
          break;
        case "disconnect":
          setUsers(users.filter((u) => u.name !== message.payload.name));
          break;
        case "recvDraw":
          recvStroke(message.payload.name, message.payload.strokeCommand);
          break;
      }
    },
    [users, setUsers, recvStroke]
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

  useEffect(() => {
    conn.current = new AppConnection(roomId);

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

  return { users, sendStroke };
};

export default useRoomService;

export class AppConnection {
  // private sockette: Sockette;

  constructor(roomId: string) {
    console.log("Connect:", roomId);
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
