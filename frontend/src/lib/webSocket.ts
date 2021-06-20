/** @format */

import Sockette from "sockette";
// import {
//   Coordinate,
//   Stroke,
//   StrokeStyle,
//   UsableBrushes,
//   UsableColors,
// } from "./Stroke";

const WS_API_URL = "wss://cli1k523zd.execute-api.us-east-2.amazonaws.com/dev";
const WS_TIMEOUT = 5e3;
const WS_MAX_ATTEMPTS = 3;

// type UserName = string;

// type Message =
//   | {
//       type: "connect";
//       payload: {
//         name: UserName;
//       };
//     }
//   | {
//       type: "disconnect";
//       payload: {
//         name: UserName;
//       };
//     }
//   | {
//       type: "recvDraw";
//       payload: {
//         name: UserName;
//         stroke: string;
//       };
//     };

// type UserData = {
//   name: UserName;
//   board: Stroke[];
// };

// export default class AppConnection {
//   // private sockette: Sockette;

//   // stub
//   users: UserData[];

//   constructor(roomId: string) {
//     this.users = [];
//     // this.sockette = new Sockette(`?roomId=${roomId}`, {
//     //   timeout: WS_TIMEOUT,
//     //   maxAttempts: WS_MAX_ATTEMPTS,
//     //   onmessage: (e: any) => this.onReceiveMessage(e),
//     //   onopen: (e) => console.log("Connected!", e),
//     //   onclose: (e: any) => console.log(e),
//     //   onerror: (e: any) => console.error(e),
//     // });
//   }

//   private onReceiveMessage(message: Message) {
//     switch (message.type) {
//       case "connect":
//         this.users.push({ name: message.payload.name, board: [] });
//         break;
//       case "disconnect":
//         this.users = this.users.filter((u) => u.name !== message.payload.name);
//         break;
//       case "recvDraw":
//         this.recvStroke(message.payload.name, message.payload.stroke);
//         break;
//     }
//   }

//   // for debug
//   connected(name: UserName) {
//     this.onReceiveMessage({ type: "connect", payload: { name } });
//   }

//   recvStroke(name: UserName, stroke: string) {
//     console.log("received");
//     const user = this.users.find((u) => u.name === name);
//     if (user) {
//       user.board.push(this.parseStroke(stroke));
//     }
//   }

//   sendStroke(stroke: Stroke) {
//     // TODO: バッファリング
//     this.onReceiveMessage({
//       type: "recvDraw",
//       payload: {
//         name: this.users[0].name,
//         stroke: this.stringifyStroke(stroke),
//       },
//     });
//   }

//   /**
//    * Stroke を文字列表記にエンコードします
//    */
//   private stringifyStroke(stroke: Stroke): string {
//     return [
//       stroke.strokeStyle.brush.name,
//       stroke.strokeStyle.color.name,
//       stroke.path.map((p) => `${p.x}^${p.y}`).join(","),
//     ].join(",");
//   }

//   /**
//    * stroke の文字列表記をデコードします
//    */
//   private parseStroke(stroke: string): Stroke {
//     const data = stroke.split(",");
//     const brush = UsableBrushes.find((b) => b.name === data[0]);
//     const color = UsableColors.find((c) => c.name === data[1]);
//     if (!brush || !color) {
//       throw new Error("");
//     }
//     return {
//       strokeStyle: {
//         brush,
//         color,
//       },
//       path: data.splice(2).map((p) => {
//         const coords = p.split("^");
//         return {
//           x: parseInt(coords[0], 10),
//           y: parseInt(coords[1], 10),
//         };
//       }),
//     };
//   }
// }

export function newaConnection(roomId: string, onReceivedMessage: (e: any) => void): Sockette {
  return new Sockette(`${WS_API_URL}?roomId=${roomId}`, {
    timeout: WS_TIMEOUT,
    maxAttempts: WS_MAX_ATTEMPTS,
    onmessage: (e: any) => onReceivedMessage(e),
    onopen: (e) => console.log("Connected!", e),
    onclose: (e: any) => console.log(e),
    onerror: (e: any) => console.error(e),
  });
}
